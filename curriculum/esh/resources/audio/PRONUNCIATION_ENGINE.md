# ESH pronunciation engine — prototype and source review

**Review date:** 28 October 2026  
**Scope:** ESH only. This is a local, evidence-aware prototype, not a deployed web service or a validated pronunciation assessor.

## What exists

The existing `audio-catalog.json` remains the single audio/provenance index. Its new fields hold:

- 11 small, attributed `en_US` pronunciation records: eight early-level words (`map/mop`, `ship/sheep`, `thin/sin`, `cap/cup`) and three contextual homographs (`read`, `record`, `refuse`).
- Separate ARPAbet and IPA readings with their own source ID, dialect, source wording/alternative note, and `human_reviewed: false`.
- Four keyed minimal-pair activities linked to real catalog WAVs, lessons, objectives, and answer keys. The WAVs remain `EXPERIMENTAL_NOT_APPROVED`; no pair is release-approved or learner-tested.
- One listening and one pronunciation mapping for each of the nine ESH pathways, including Post-C2. All assessments are `PREPARED_NOT_ADMINISTERED`.

The words and contexts in ESH are teaching examples, not copied definitions. Source IPA strings are retained as supplied, including notation differences such as `cup` `/ˈkəp/` in ipa-dict-en_US versus CMUdict `K AH1 P`. Do not normalize these readings silently or treat a broad transcription as a phonetic recording.

## Data model and lookup behavior

Each dictionary entry stores a spelling, an accent label (`en_US`), lesson/objective link, target, ambiguity note, and one or more readings. Each reading separately stores:

| Field | Meaning |
|---|---|
| `scheme` | `ARPAbet` or `IPA`; these are distinct notations |
| `value` | The transcription exactly as represented by that source |
| `source_id` | The specific upstream dictionary or model record |
| `variant_context` | Source variant or explicit note that the source does not label sense/POS |
| `evidence_status` | `DICTIONARY_LISTED` or `UNREVIEWED_PREDICTION` |
| `human_reviewed` | False for this prototype |

`python tools\pronunciation_engine.py lookup read` returns both dictionary alternatives and flags that context is needed; it does not guess the intended sense. Lookup checks the small curated dictionary first. An unknown spelling is not assigned a fabricated IPA form. Only an explicitly invoked optional predictor can return provisional ARPAbet, with no IPA conversion and no audio generation.

There is **no ARPAbet-to-IPA converter** in this prototype. The two schemes differ in symbol inventory, stress conventions, dialect assumptions, and source transcription practice; a conversion would require a documented phoneme map, dialect rules, exception handling, and independent tests. `g2p-en` predicts ARPAbet and cannot on its own produce a recording.

## G2P status

The adapter in `tools/pronunciation_engine.py` invokes `g2p-en` only when explicitly selected. It rejects malformed output, labels accepted results as unreviewed prediction, and makes no audio. The package is **not installed** in the project environment (Python 3.14.8; `g2p_en`, NLTK and CMUdict package data are absent), so no actual model predictions were produced or evaluated. The tests exercise dictionary-first behavior, unknown words, an injected test predictor, and the explicit missing-dependency error; the injected string is a test fixture, not a g2p-en result.

The upstream g2p-en description says it uses CMUdict for ordinary entries and a model for out-of-vocabulary words, and handles some heteronyms with POS context. The output API does not expose a per-word provenance label that reliably distinguishes an internal dictionary hit from model inference. Therefore any returned pipeline result must be stored as provisional and reviewed against a trusted dictionary/context before teaching use. The project does not install dependencies or download NLTK data automatically.

## Source comparison and permission status

This is a technical/source review, not legal advice. “Open-source code” does not clear a bundled dictionary, model, voice, or recording.

| Source | Actual role and technical status | Code/data/asset rights and ESH decision |
|---|---|---|
| [CMUdict](https://github.com/cmusphinx/cmudict) | Maintained U.S. English pronunciation dictionary in ARPAbet, with numbered alternatives. Its own README warns that errors, omissions, and inconsistencies remain; GitHub reports the repository last pushed 24 October 2025. | The inspected upstream `LICENSE` has two redistribution conditions in BSD-style terms, but GitHub repository metadata reports `NOASSERTION`; ESH does not assign a formal SPDX classification. Retain the copyright/conditions/disclaimer in source distributions and reproduce them in binary documentation/materials. README says research/commercial use is unrestricted and requests acknowledgement. A tiny attributed sample is in the index; the notice is preserved in `UPSTREAM_DATA_LICENSES.md`. |
| [ipa-dict](https://github.com/open-dict-data/ipa-dict) | Machine-readable broad phonemic dictionaries; lists alternate readings, but source notes that quality/provenance differs by language and variant. GitHub reports its repository last pushed 22 October 2026. | Root repository license is MIT, but that is not a blanket license for every derived language list. Its README says en_US is based on modified cmudict-ipa (MIT) with stress marking informed by syllabify; the latter's license was not independently verified. This prototype uses a few cited en_US records and preserves source notation. en_UK is derived from ipacards (GPL-3.0); no en_UK records are bundled pending a separate compatibility/provenance review. |
| [Phonaria](https://github.com/rigomart/phonaria) | Current pronunciation-learning application with text-to-IPA, phoneme charts, definitions, and contrast exploration; its README identifies distinct app, phonetics-data, and audio-generation packages. | Root package declares MIT, while its embedded CMUdict carries a separate BSD-style notice. Other package data and audio require their own review. Used only as an architecture reference; no code, database, or audio copied. |
| [Grzegorz](https://github.com/teodorpetcu/grzegorz) | CLI for IPA comparison and minimal-pair generation; its README says IPA is fetched from English Wiktionary and notes that its audio-pronunciation feature is not implemented. The supplied `xylous/grzegorz` URL redirects to this repository. | Repository declares GPL-3.0. Wiktionary-derived word data has separate terms/provenance. Not imported or used as an ESH dependency; the four ESH pairs are curated and validated locally. |
| [s5s5/phonics](https://github.com/s5s5/phonics) | Interactive early-reading phonics platform with spelling-pattern examples and audio; scope is foundational decoding, not a complete phonology curriculum through C2. | Repository code declares MIT. The README describes speaker audio, but an independent license for each embedded recording was not established. No code, images, text, or recordings copied; only the early decoding scope informed this comparison. |
| [Kyubyong/g2p (`g2p-en`)](https://github.com/Kyubyong/g2p) | Local English G2P pipeline: dictionary/POS handling and model fallback for OOV spellings; produces ARPAbet. Source documentation is internally inconsistent: it reports removal of TensorFlow but also retains an older TensorFlow model description. | PyPI/setup metadata says Apache-2.0 for the package. Its CMUdict/NLTK data and any model assets have separate provenance/licensing. Not installed or executed; Python 3.14 compatibility, model files, data downloads, and complete notices remain unverified. |
| [SpeechOcean762](https://github.com/jimbozhang/speechocean762) | 5,000 read English sentences with word/phone and sentence-level expert annotations; speakers are Mandarin L1 and include children and adults. Potential research benchmark, not a universal learner norm. | README says free for commercial and non-commercial use, but no repository `LICENSE` file was found in the reviewed paths. The actual data/recording license and child-speaker privacy basis remain unresolved. No data/audio downloaded or used; do not include in product or upload learner speech on this evidence. |
| [Montreal Forced Aligner](https://github.com/MontrealCorpusTools/Montreal-Forced-Aligner) | CLI for aligning a known transcript to speech using acoustic/lexical models. README currently describes MFA 3.x and gives a conda-based install; a model can be licensed separately from software. | Repository software is MIT. Kaldi, dictionaries, and pretrained models have independent licenses. Suitable for word/phone timing experiments only; alignment does not establish phone correctness, intelligibility, stress quality, or learning. Not installed or tested here. |
| [British Council Sounds Right](https://learnenglish.britishcouncil.org/apps/learnenglish-sounds-right) | Proposed learner reference for sound-chart organization. The official page returned HTTP 403 in this review, so current content/functionality could not be inspected. | No reuse license was verified. Reference only; no sounds, chart artwork, or lesson content copied. |
| [University of Iowa Sounds of Speech](https://soundsofspeech.uiowa.edu/) | Official site is reachable as a landing page for articulatory pronunciation resources; the resource-specific usage/asset terms were not verified. | No reuse license was established. Reference only for articulatory teaching approach; no images, animation, or audio copied. |

Piper Amy (`piper-en_US-amy-medium`) is the final user-preferred default identity: the user listened to Amy and liked it. This is a voice-choice decision, not an asset-by-asset quality review. Its curriculum clips remain experimental; no recording has individual human quality approval or rights clearance.

## Provisional production strategy (no voice approved)

- Use attributed dictionary entries as spelling-to-pronunciation references, not as evidence of spoken audio or learner attainment.
- For isolated phonemes and minimal pairs, prefer a phonetician-reviewed human recording with explicit reuse/re-distribution permission. Do not rely on ordinary text-to-speech to produce a phoneme in isolation unless the actual output is confirmed.
- For reusable words, sentences, and dialogues, trial one consistently licensed English voice per accent track. Keep U.S. and U.K. tracks separate; do not mix accent models within a teaching sequence. Select a primary voice only after transcript matching, human listening, rights review, and device playback checks.
- Add diverse human speakers as separately identified listening-comprehension material, not as a canonical pronunciation norm or accent-scoring target.

This is an implementation recommendation, not an asset approval or a quality result. The current Amy catalog has no release-approved audio. Joe and Microsoft David are not active sources and are not fallback voices.

## Minimal-pair and quality rules

The four pair records point to actual files whose catalog transcripts contain both words. Their ARPAbet sequences differ in exactly one phone after removing stress digits; the validator checks the claimed index and phone contrast. They are **prepared listening items backed by unapproved synthetic audio**, not accepted reference recordings. The recorded human-audition and rights gates in `AUDIO_QUALITY_REVIEW.md` continue to apply.

Do not treat IPA-symbol similarity alone as proof that a pair is pedagogically useful. Confirm word meaning, context, target level, source/dialect consistency, actual spoken text, and intended contrast. The examples accept intelligible natural accent variation; they do not train a “correct” identity or score accent similarity.

## Assessment and automated-analysis limits

- SpeechOcean762's scores reflect its own prompt, annotators, population, and scoring definitions. Its README includes an accent-based score descriptor; ESH does not adopt that as a fairness-neutral learner standard. No results or model were imported.
- MFA can align a known transcript and help inspect timing. It cannot alone score phonetic accuracy.
- Speech-to-text transcript match alone cannot demonstrate phoneme contrast, stress, intonation, or intelligibility. No automated learner scoring is implemented.
- No evaluation has been administered to learners. A selected objective, dictionary symbol, or WAV file is not evidence that a learner can perceive or produce that target.

## Commands and reproducibility

From the ESH folder:

```powershell
python tools\pronunciation_engine.py validate
python tools\pronunciation_engine.py lookup read
python -m unittest discover -s tools -p "test_pronunciation_engine.py" -v
```

The structural curriculum audit also validates source IDs, notational separation, word/pair records, lesson/objective links, actual audio paths/text, and all nine pathway mappings. Neither validator performs human listening, verifies external legal rights, or proves phonetic correctness.

## Remaining work

1. Human pronunciation review of the dictionary examples and the actual experimental pair clips.
2. Rights/notice review before any upstream dictionary extract or generated audio is distributed.
3. Decide whether to isolate and test `g2p-en` in a controlled compatible environment; verify package/model/NLTK data provenance and record real known/OOV test results.
4. Add more levels, dialects, and contrast sets only with verified lesson fit and actual reviewed recordings. No wide audio generation is authorized by this prototype.
