# Curriculum audio map

## Purpose

Piper `en_US/amy/medium` (`piper-en_US-amy-medium`) is the sole voice used by the active curriculum audio generator. This is the user's selected voice; it does not mean recordings passed human quality review or rights clearance.

The expanded discovery scans **34 source files** and found **660 unique audio transcripts** across **672 lesson/source links**. Of the **662 pathway-level targets**, **662** have readable WAVs and **0** are missing or invalid. It also logged **504 cue-bearing lines** with exclusion reasons and examples; these are not counted as fixed spoken targets.

Before expansion, the catalog had **151** assets and **151** readable WAVs; **139** items in the expanded scope already had audio. The generator has created **566** files cumulatively for the expanded scope. **57** legacy recordings are preserved but not counted as current per-item coverage. It also removed **57** obsolete grouped-vocabulary links while preserving those WAVs. All assets remain `EXPERIMENTAL_NOT_APPROVED`.

## Coverage by pathway

| Level | Required items | Readable WAVs | Missing/invalid | Unlinked | Excluded cue lines |
|---|---:|---:|---:|---:|---:|
| PRE-A0 | 20 | 20 | 0 | 0 | 70 |
| A0 | 116 | 116 | 0 | 0 | 34 |
| A1 | 170 | 170 | 0 | 0 | 98 |
| A2 | 67 | 67 | 0 | 0 | 17 |
| B1 | 93 | 93 | 0 | 0 | 73 |
| B2 | 78 | 78 | 0 | 0 | 46 |
| C1 | 51 | 51 | 0 | 0 | 79 |
| C2 | 50 | 50 | 0 | 0 | 41 |
| POST-C2 | 17 | 17 | 0 | 0 | 46 |

The JSON report lists every discovered item and lesson/source group, every examined file, indexed-content examples, excluded cue examples and reasons, file-generation errors, and legacy assets not counted toward current discovery. Most selected vocabulary sources provide Arabic glosses rather than standalone English definitions; no definition was invented, and Arabic glosses are not synthesized. Coverage is technical indexing and file presence only; it does not establish text fidelity, pronunciation accuracy, teaching quality, learner discrimination, or learner production.

The resumable command is `python tools\curriculum_audio.py` (also available through `tools\generate_pronunciation_audio.ps1`). It verifies the local Amy model, reuses valid matching WAVs, generates only missing items, inserts idempotent play links, and refreshes the JSON report and this map.

## Pronunciation prototype links — 28 October 2026

The expanded `audio-catalog.json` remains the single index for recordings, pronunciation data, and lesson mappings. Its objective map below still represents the 18 prepared, objective-mapped activities; additional recordings are indexed through source-linked `curriculum_links` without inventing new coverage-matrix objectives. Every WAV remains experimental, every assessment is prepared rather than administered, and none of these links proves learner skill.

| Pathway | Listening asset → lesson/activity | Pronunciation asset → lesson/activity | Additional prototype |
|---|---|---|---|
| PRE-A0 | `PA0-AUD-01` → `PRE-A0.U02.L03` / `PA0-LISTEN-01` | `PA0-AUD-02` → `PRE-A0.U03.L03` / `PA0-LISTEN-02` | `map/mop` pair |
| A0 | `A0-AUD-02` → `A0.U03.L02` / `A0-LISTEN-02` | `A0-AUD-01` → `A0.U02.L01` / `A0-LISTEN-01` | `ship/sheep` pair |
| A1 | `A1-AUD-02` → `A1.U05.L02` / `A1-LISTEN-02` | `A1-AUD-01` → `A1.U03.L02` / `A1-LISTEN-01` | `thin/sin` pair |
| A2 | `A2-AUD-02` → `A2.U02.L02` / `A2-LISTEN-02` | `A2-AUD-01` → `A2.U01.L01` / `A2-LISTEN-01` | `cap/cup` pair; source vowel notation differs |
| B1 | `B1-AUD-02` → `B1.U05.L02` / `B1-LISTEN-02` | `B1-AUD-01` → `B1.U02.L02` / `B1-LISTEN-01` | `read` alternatives; context required |
| B2 | `B2-AUD-01` → `B2.U03.L02` / `B2-LISTEN-01` | `B2-AUD-02` → `B2.U03.L03` / `B2-LISTEN-02` | `record` alternatives; no sense auto-selection |
| C1 | `C1-AUD-01` → `C1.U03.L02` / `C1-LISTEN-01` | `C1-AUD-02` → `C1.U04.L02` / `C1-LISTEN-02` | Existing claim, limitation, and stance listening work |
| C2 | `C2-AUD-01` → `C2.U03.L02` / `C2-LISTEN-01` | `C2-AUD-02` → `C2.U03.L02` / `C2-LISTEN-02` | Existing scope, contrast, and focus listening work |
| Post-C2 | `POST-AUD-01` → `POST-C2.T04.L01` / `POST-LISTEN-01` | `POST-AUD-02` → `POST-C2.T04.L03` / `POST-PRON-01` | `refuse` alternatives; context required |

The structured objective map includes the objective ID for each of the original 18 links. All map entries say `PREPARED_NOT_ADMINISTERED`; all catalog files remain `EXPERIMENTAL_NOT_APPROVED`. The objective matrix remains unchanged: audio objectives are not upgraded on the basis of added metadata, a generated file, or an available player.

The new dictionary sample and pair activities are prototype data, not a complete phoneme inventory or full level-by-level sound syllabus. The four existing clips contain the listed contrast words in their exact catalog transcripts, but have not passed human quality review. No isolated phoneme, human reference, multi-speaker contrast set, or learner recording is added by this phase. See [`PRONUNCIATION_ENGINE.md`](PRONUNCIATION_ENGINE.md) for source provenance, schema, rights limits, and G2P status.
