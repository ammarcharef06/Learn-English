#!/usr/bin/env python3
"""Generate app-ready JSON from the curriculum's Markdown level files."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEVELS_DIR = ROOT / "levels"
RESOURCES_DIR = ROOT / "resources"
OUTPUT_DIR = ROOT / "data"

LEVEL_FILES = [
    ("PRE-A0", "pre-a0.md", "pre-a0"),
    ("A0", "a0-pre-a1.md", "a0"),
    ("A1", "a1.md", "a1"),
    ("A2", "a2.md", "a2"),
    ("B1", "b1.md", "b1"),
    ("B2", "b2.md", "b2"),
    ("C1", "c1.md", "c1"),
    ("C2", "c2.md", "c2"),
    ("POST-C2", "post-c2.md", "post-c2"),
]

HEADING_ID = re.compile(
    r"^(#{2,6})\s+(?:(?:Lessons for )?unit\s+)?(?P<id>(?:PRE-A0|A0|A1|A2|B1|B2|C1|C2|POST-C2)"
    r"\.(?:U|T|W)\d{2}(?:\.L\d{2})?)\s+—\s+(?P<title>.+?)\s*$",
    flags=re.IGNORECASE,
)
QUESTION_ANSWER = re.compile(
    r"(?P<question>[^?\n]{2,180}\?)\s*\*\*Key:\*\*\s*"
    r"(?P<answer>[^.\n]{1,240})"
)
QUESTION_DASH_ANSWER = re.compile(
    r"(?:^|[\n(])\s*(?P<question>[^.!?\n()]{3,100}\?)\s*[—–-]\s*"
    r"(?P<answer>[^.!?\n]{2,120})"
)
LAB_REFERENCE = re.compile(r"`(?P<id>(?:PRE-A0|A0|A1|A2|B1|B2|C1|C2|POST-C2)\.(?:U|T)\d{2}\.L\d{2})`")


def strip_markdown(value: str) -> str:
    value = re.sub(r"<!--.*?-->", " ", value)
    value = re.sub(r"!\[[^\]]*]\([^)]*\)", "", value)
    value = re.sub(r"\[([^\]]+)]\([^)]+\)", r"\1", value)
    value = re.sub(r"`([^`]*)`", r"\1", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"\1", value)
    value = re.sub(r"(?m)^\s*[-*]\s+", "", value)
    value = value.strip().strip("`")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def read_blocks(path: Path) -> list[dict[str, object]]:
    lines = path.read_text(encoding="utf-8").splitlines()
    blocks: list[dict[str, object]] = []
    current: dict[str, object] | None = None

    for line_number, line in enumerate(lines, start=1):
        match = HEADING_ID.match(line)
        if match:
            if current is not None:
                blocks.append(current)
            current = {
                "id": match.group("id"),
                "title": match.group("title").strip(),
                "depth": len(match.group(1)),
                "line": line_number,
                "body": [],
                "source": path.relative_to(ROOT).as_posix(),
            }
        elif current is not None:
            current["body"].append(line)

    if current is not None:
        blocks.append(current)
    return blocks


def lesson_blocks(level_path: Path) -> list[dict[str, object]]:
    blocks = read_blocks(level_path)
    lessons: list[dict[str, object]] = []
    for index, block in enumerate(blocks):
        if not re.search(r"\.L\d{2}$", str(block["id"])):
            continue
        end = len(blocks)
        for later in blocks[index + 1 :]:
            if int(later["depth"]) <= int(block["depth"]):
                end = blocks.index(later)
                break
        body_lines: list[str] = []
        for later in blocks[index:end]:
            body_lines.append(f"{'#' * int(later['depth'])} {later['id']} — {later['title']}")
            body_lines.extend(later["body"])
        block["body"] = body_lines[1:]
        lessons.append(block)
    return lessons


def section_text(body: str, labels: tuple[str, ...]) -> str | None:
    label_pattern = "|".join(re.escape(label) for label in labels)
    pattern = re.compile(
        rf"\*\*(?:{label_pattern}):\*\*\s*(.*?)(?=\s+\*\*[A-Z][^*]*:\*\*|\n|$)",
        flags=re.IGNORECASE,
    )
    match = pattern.search(body)
    if match:
        cleaned = strip_markdown(match.group(1))
        return cleaned or None
    return None


def make_scenario(body: str) -> tuple[str, str]:
    explicit = section_text(body, ("Scenario", "Role-play", "Listening script", "Reading"))
    if explicit:
        label = "scenario"
        match = re.search(
            r"\*\*(Scenario|Role-play|Listening script|Reading):\*\*",
            body,
            flags=re.IGNORECASE,
        )
        if match:
            label = match.group(1).lower().replace(" ", "_")
        return explicit, label

    task = section_text(
        body,
        (
            "Independent task",
            "Independent speaking",
            "Independent pair task",
            "Group task",
            "Interaction",
            "Speaking/interaction",
            "Guided practice",
            "Guided model",
            "Model",
        ),
    )
    if task:
        return task, "source_task"

    outcome = section_text(body, ("Goal", "Outcome", "Specialist outcome", "Unit outcome"))
    return outcome or "", "source_outcome" if outcome else "not_provided"


def make_flashcards(body: str, lesson_title: str, outcome: str | None) -> list[dict[str, str]]:
    cards: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for pattern in (QUESTION_ANSWER, QUESTION_DASH_ANSWER):
        for match in pattern.finditer(body):
            question = strip_markdown(match.group("question"))
            answer = strip_markdown(match.group("answer"))
            if pattern is QUESTION_ANSWER:
                question = re.split(r"(?<=[.!?])\s+|:\s+", question)[-1].strip()
            key = (question.casefold(), answer.casefold())
            if question and answer and key not in seen:
                seen.add(key)
                cards.append({"question": question, "answer": answer, "phonetic": ""})
            if len(cards) >= 5:
                break
        if len(cards) >= 5:
            break

    if not cards and outcome:
        cards.append(
            {
                "question": f"What is the goal of “{lesson_title}”?",
                "answer": outcome,
                "phonetic": "",
            }
        )
    return cards


def make_assessment(body: str) -> list[str]:
    results: list[str] = []
    labels = ("Check", "Success", "Assessment", "Listening check", "Check/key", "Exit check")
    for label in labels:
        value = section_text(body, (label,))
        if value and value not in results:
            results.append(value)
    for question in re.findall(r"(?m)^\s*[-*]\s+([^?\n]+\?)\s*$", body):
        cleaned = strip_markdown(question)
        if cleaned not in results:
            results.append(cleaned)
    return results


def classify_lesson(level_id: str, title: str) -> str:
    if level_id == "PRE-A0":
        return "phonics"

    text = title.casefold()
    if any(
        word in text
        for word in (
            "essay",
            "academic",
            "research",
            "synthesize",
            "synthesise",
            "rhetoric",
            "evidence",
            "discourse analysis",
            "editorial",
            "portfolio",
            "critique",
            "argument",
            "counterargument",
            "paragraph",
            "report",
            "summary",
            "source",
            "claim",
            "analyze",
            "analyse",
            "write",
            "evaluate",
            "audit",
            "interpretive",
            "translation",
        )
    ):
        return "essay_analysis"
    if any(
        word in text
        for word in (
            "role-play",
            "role play",
            "interview",
            "dialogue",
            "conversation",
            "ask and answer",
            "invite",
            "order politely",
            "negotiate",
            "mediate",
            "deliver difficult news",
            "present",
            "speak",
            "discuss",
            "respond and repair",
            "test and repair",
            "request",
            "appointment",
            "recommend a solution",
            "answer adversarial questions",
            "chair disagreement",
            "respond to a claim",
        )
    ):
        return "role_play"
    if any(
        word in text
        for word in (
            "sentence",
            "question forms",
            "grammar",
            "word order",
            "build",
            "complete the",
            "spell",
            "copy letters",
            "describe people",
            "edit agency",
            "read a simple timetable",
        )
    ):
        return "sentence_builder"

    level_defaults = {
        "A0": "sentence_builder",
        "A1": "sentence_builder",
        "A2": "role_play",
        "B1": "role_play",
        "B2": "role_play",
        "C1": "essay_analysis",
        "C2": "essay_analysis",
        "POST-C2": "essay_analysis",
    }
    return level_defaults.get(level_id, "role_play")


def load_units(path: Path) -> dict[str, str]:
    units: dict[str, str] = {}
    for block in read_blocks(path):
        identifier = str(block["id"])
        if ".L" not in identifier:
            units[identifier] = str(block["title"])
    return units


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    lab_path = RESOURCES_DIR / "integrated-skill-labs.md"
    lab_blocks = read_blocks(lab_path)
    labs = {
        str(block["id"]): block
        for block in lab_blocks
        if ".L" in str(block["id"])
    }

    all_levels: list[dict[str, object]] = []
    report: list[dict[str, object]] = []
    for level_id, filename, output_name in LEVEL_FILES:
        source = LEVELS_DIR / filename
        source_text = source.read_text(encoding="utf-8")
        level_title_match = re.search(r"^#\s+(.+?)\s*$", source_text, flags=re.MULTILINE)
        level_title = level_title_match.group(1) if level_title_match else level_id
        units = load_units(source)
        lessons = lesson_blocks(source)
        existing_ids = {str(lesson["id"]) for lesson in lessons}

        # Add linked integrated workshops that are not already represented by a
        # lesson heading. Existing headings stay authoritative when IDs match.
        for lab_id, lab in labs.items():
            if not lab_id.startswith(f"{level_id}.") or lab_id in existing_ids:
                continue
            if ".W" in lab_id:
                continue
            lessons.append(dict(lab))

        unit_order = {unit_id: index for index, unit_id in enumerate(units)}
        lessons.sort(
            key=lambda lesson: (
                unit_order.get(str(lesson["id"]).rsplit(".", 1)[0], 999),
                int(str(lesson["id"]).rsplit("L", 1)[1]),
                int(lesson["line"]),
            )
        )

        lesson_data: list[dict[str, object]] = []
        missing_cards = 0
        missing_phonetics = 0
        for order, lesson in enumerate(lessons, start=1):
            lesson_id = str(lesson["id"])
            unit_id = lesson_id.rsplit(".", 1)[0]
            body = "\n".join(str(line) for line in lesson["body"])
            workshop_source_id = None
            source_match = re.search(r"\*\*Workshop source:\*\*\s*\[`?([A-Z0-9.-]+)`?", body)
            if source_match:
                workshop_source_id = source_match.group(1)
            if lesson_id in labs:
                workshop_source_id = lesson_id
            if workshop_source_id and workshop_source_id in labs:
                source_lines = labs[workshop_source_id].get("body", [])
                body += "\n" + "\n".join(str(line) for line in source_lines)

            scenario, scenario_source = make_scenario(body)
            outcome = section_text(body, ("Goal", "Outcome", "Specialist outcome"))
            flashcards = make_flashcards(body, str(lesson["title"]), outcome)
            for card_index, card in enumerate(flashcards, start=1):
                card["id"] = f"{lesson_id}-FC{card_index:02d}"
            assessment = make_assessment(body)
            missing_cards += int(not flashcards)
            missing_phonetics += sum(not card["phonetic"] for card in flashcards)
            lesson_record: dict[str, object] = {
                "id": lesson_id,
                "title": str(lesson["title"]),
                "lesson_type": classify_lesson(level_id, str(lesson["title"])),
                "scenario": scenario,
                "flashcards": flashcards,
                "assessment": assessment,
                "unit_id": unit_id,
                "order": order,
                "source": str(lesson["source"]),
                "source_line": int(lesson["line"]),
                "scenario_source": scenario_source,
            }
            if workshop_source_id:
                lesson_record["workshop_source_id"] = workshop_source_id
            lesson_data.append(lesson_record)

        unit_records = [
            {"id": unit_id, "title": title, "order": index}
            for index, (unit_id, title) in enumerate(units.items(), start=1)
        ]
        level = {
            "level": level_id,
            "title": level_title,
            "units": unit_records,
            "lessons": lesson_data,
        }
        (OUTPUT_DIR / f"{output_name}.json").write_text(
            json.dumps(level, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        all_levels.append(level)
        report.append(
            {
                "level": level_id,
                "units": len(unit_records),
                "lessons": len(lesson_data),
                "lessons_without_flashcards": missing_cards,
                "flashcards_without_phonetic": missing_phonetics,
            }
        )

    (OUTPUT_DIR / "curriculum.json").write_text(
        json.dumps({"levels": all_levels}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (OUTPUT_DIR / "generation-report.json").write_text(
        json.dumps(
            {
                "generated_from": "levels/*.md and resources/integrated-skill-labs.md",
                "phonetics_note": "The curriculum does not provide phonetic anchors for every prompt; missing values are empty strings, not invented pronunciations.",
                "levels": report,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    total_lessons = sum(int(item["lessons"]) for item in report)
    print(f"Generated {len(all_levels)} level files and curriculum.json with {total_lessons} lessons.")
    for item in report:
        print(
            f"{item['level']}: {item['units']} units, {item['lessons']} lessons, "
            f"{item['lessons_without_flashcards']} without extracted Q/A cards, "
            f"{item['flashcards_without_phonetic']} without source phonetics"
        )


if __name__ == "__main__":
    main()
