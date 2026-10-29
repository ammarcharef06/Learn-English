# Curriculum map and measured status

## Architecture

The intended trace is:

**Level → unit/track → lesson → measurable outcome → instructional content → practice → assessment → criterion**

`COVERAGE_MATRIX.csv` supplies 79 selected outcomes: 10 for PRE-A0, 13 for A0, and 8 for each of the other seven pathways. This includes two separately mapped audio outcomes per pathway: listening discrimination/comprehension and spoken production. The 61 non-audio rows are `Covered with existing content`; the 18 audio rows are `Partially covered` because the existing recordings remain experimental and unapproved after the owner reported robotic/unclear sound. None is verified within an administered learner check. These evidence-link counts are not total curriculum coverage, learner attainment, or a CEFR score.

## Level progression

| Level | Scope and progression | Existing structure | Current evidence and principal gap |
|---|---|---|---|
| Pre-A0 | Letter forms/names, sound awareness, early decoding, functional print, classroom response | 5 units; 18 explicit lesson headings in level file; 1 stable integrated workshop | Sequenced instruction from letters to taught word patterns, copying/spelling, printed and spoken commands, greeting, unit checks, and end-stage assessment. Ready for human final review; recording, pilot, and expert review remain open. |
| A0 / Pre-A1 | Personal details, family/home, time, routine, everyday locations, first sentence patterns | 5 units; 23 explicit lesson headings in level file; 1 stable integrated workshop | Lesson sequences across all five units, keyed unit checks, short reading/listening, partner exchanges, connected writing, mediation/retrieval, and stage-end assessment. Ready for human final review; learner pilot and expert review remain open. |
| A1 | Familiar daily communication | 6 units; 17 explicit lesson headings plus one existing integrated workshop | Sequenced lessons across people, routines, shopping, schedules, services, and invitations; 6 selected matrix outcomes link to lesson evidence. Local diagnostic, six 8-point unit checks, and a 40-point stage-end test. Ready for human final review, not publication validation. |
| A2 | Connected everyday narration, services, plans, and comparisons | 6 units; 17 explicit lesson headings plus one existing integrated workshop | Lessons cover past accounts, travel, health language, work obligations, future forms, present-perfect basics, and comparisons/superlatives; 6 selected outcomes link to evidence. Local diagnostic, six 8-point unit checks, and a 40-point stage-end test. Ready for human final review, not publication validation. |
| B1 | Independent communication with reasons, opinions, paragraph writing, and wider familiar topics | 6 units; 18 explicit lesson headings; 1 integrated workshop | Six unit cycles add original reading/listening input, vocabulary, language practice, interaction, writing, and mediation. Six 10-point checks, a diagnostic, and a 40-point stage-end sample exist. Ready for human review, not validated or complete. |
| B2 | Evidence-based argument, nuanced discussion, and extended audience-aware communication | 6 units; 18 explicit lesson headings; 1 integrated workshop | Six unit cycles add evidence/media/policy/work/science/culture inputs, vocabulary, speaking/writing/mediation, six 10-point checks, a diagnostic, and a 40-point end sample. Ready for human review, not validated or complete. |
| C1 | Synthesis, nuance, academic/professional communication | 6 units; 17 explicit lesson headings plus existing workshop `C1.U05.L02` | Six unit cycles with original reading/listening text, keys, language work, interaction, writing, mediation, and repair; 24 selected contextual vocabulary entries. Diagnostic, six 8-point unit checks, and one 40-point stage-end sample. Developed draft ready for human review; no claim of C1 attainment. |
| C2 | Precision, rhetoric, complex interaction | 6 units; 17 explicit lesson headings plus existing workshop `C2.U04.L02` | Six unit cycles with original reading/listening text, keys, editorial and pragmatic language work, negotiation, writing, mediation, and repair; 24 selected contextual vocabulary entries. Diagnostic, six 8-point unit checks, and one 40-point stage-end sample. Developed draft ready for human review; no claim of C2 attainment. |
| Post-C2 | Optional non-CEFR specializations | 6 tracks; 17 new explicit lesson headings in `levels/post-c2.md` plus preserved workshop `POST-C2.T03.L01`; six track checks and six portfolio projects | Three lessons per track in academic research, professional communication, editing, speaking, translation/mediation, and discourse analysis; original models, fictional case data, practice, keys, success/repair criteria, and capstone rubrics. Six selected matrix outcomes now have evidence-linked prepared checks. Developed draft ready for specialist human review; no learner assessment has been administered. |

## Pronunciation and listening assets

The Amy-only catalog contains 717 WAV assets. The resumable curriculum discovery currently indexes 660 unique transcripts across 672 source links; its pathway-level report counts 662 required instances, all with readable WAVs and zero discovered missing items. Fifty-seven older grouped Amy recordings remain preserved in the catalog but are outside active per-item discovery. All recordings remain `EXPERIMENTAL_NOT_APPROVED`; catalog presence and structural WAV checks do not prove transcript fidelity, pronunciation quality, learner discrimination, or educational validity. No lesson or objective should be described as fully audio-validated. The current item-level inventory and exclusions are in `resources/audio/CURRICULUM_AUDIO_COVERAGE.json`.

The full structural curriculum inventory is in `CURRICULUM_COMPLETENESS_AUDIT.md`, with machine-readable details in `CURRICULUM_COMPLETENESS_AUDIT.json` and the evidence-based register in `CURRICULUM_GAP_REGISTER.csv`. These reports list all 52 unit/track headings and 169 lesson headings, but do not claim independent pedagogical validation or learner attainment.

## Cross-level skill path

- **Reading:** eight level-tagged passages in `resources/reading-bank.md`, nine integrated workshop inputs, A1/A2 materials, twelve B1/B2 unit passages, and twelve C1/C2 unit passages. Stage-end samples add unseen reading inputs.
- **Listening:** six standalone scripts plus nine integrated teacher-read scripts; B1/B2 adds twelve unit scripts and two stage-end scripts; C1/C2 adds twelve unit scripts and two stage-end scripts. The catalog contains 717 experimental Amy WAVs; current discovery links 660 unique transcripts to 672 source locations. The 18 selected matrix outcomes for listening/pronunciation remain partial and none is approved. A playable file does not establish validated speech-speed variants, transcript fidelity, pronunciation accuracy, or learner achievement.
- **Speaking and interaction:** six model dialogues plus sequenced B1–C2 role-play, discussion, presentation, negotiation, challenge-response, and mediation tasks; workshop outputs remain linked.
- **Writing:** B1–C2 unit-specific summaries, synthesis, recommendations, reports, decision records, and audience adaptations with criteria; prompts from A1 onward and workshop outputs for every pathway. Pre-A0 writing remains early copying/spelling rather than extended composition.
- **Mediation:** explicit partner relay/synthesis tasks in each workshop; depth and frequency remain insufficient to claim full-level coverage.
- **Language resources:** selected grammar explanations/practice and 184 contextual vocabulary entries (40 existing entries, 36 A1/A2 entries, 60 B1/B2 entries, and 48 C1/C2 entries), not a comprehensive lexicon or grammar syllabus. Arabic glosses need independent review; see the linked vocabulary resources.

## Assessment design

Pre-A0 and A0 each have a diagnostic, five unit checks, and a local stage-end check in `resources/foundation-assessment.md`. A1 and A2 each have an ungraded diagnostic, six 8-point unit checks, and a 40-point stage-end test in `resources/a1-a2-assessment.md`. B1 and B2 each have an ungraded diagnostic, six 10-point unit checks, and a 40-point stage-end sample in `resources/b1-b2-assessment.md`. C1 and C2 each have an ungraded diagnostic, six 8-point unit checks, and a 40-point stage-end sample in `resources/c1-c2-assessment.md`. Post-C2 has an entry portfolio diagnostic, six specialist checks, and one scored portfolio project per track in `resources/post-c2-assessment.md`. The separate audio checks are prepared, not administered; pronunciation production needs a human listener. All checks are prepared, not administered; thresholds are local, unpiloted, and unnormed. No empirical validation or inter-rater reliability study exists.

## Progression and readiness

The pathway order is a design intention, not a validated placement system. Pre-A0 and A0 are project-specific preparatory stages. A1–C2 use CEFR as a broad reference only; direct descriptor-by-descriptor mapping was not verified in this audit. Post-C2 is specialization, not a CEFR level.

Do not treat lesson completion or the sample workshop threshold as proof of overall level attainment. The matrix and gap report state narrower, observable criteria and outstanding validation needs.
