# Audio source licensing and rights status

## Scope

This document records the rights status of the candidate sources investigated for ESH. It is intentionally conservative: the project does not assume that a voice is reusable just because it is downloadable or open-weight. This file is a working rights log, not legal advice.

## 1) Current default preference: Piper Amy medium

**Selection status:** Final user-preferred default, based on the user's positive listening preference on 28 October 2026. This is separate from rights clearance and per-recording quality approval. The rights review below was checked against source pages and package/repository records on **28 October 2026**.

### Component-by-component evidence

| Component | Exact source/version checked | Published license or terms | What the source text supports | ESH distribution conclusion |
|---|---|---|---|---|
| Piper generation software/runtime | Installed `piper-tts` 1.8.0; PyPI release uploaded 4 September 2026; upstream tag `v1.8.0` points to commit `639388b6317fc4731e91d53da42aea68fd4166ff` in `OHF-Voice/piper1-gpl`. | GPL-3.0-or-later (`COPYING`; PyPI metadata). Piper's v1.8.0 `docs/VOICES.md` additionally says Piper is intended for personal use and TTS research, imposes no extra restrictions on voice models, and warns that some models have restrictive licenses. | GPL permits commercial activity with the covered software subject to GPL conditions when distributing it; it does not grant rights to the Amy weights, source recordings, or synthesized WAVs. The project guidance expressly directs users to the individual model cards. | The runtime license alone does not clear a commercial product, model redistribution, or WAV distribution. Any distribution of the runtime itself needs GPL compliance. The personal/research statement is also retained as an upstream use warning, not treated as an independent output license. |
| Amy model weights and required JSON config | Hugging Face `rhasspy/piper-voices`, pinned repository snapshot `5041a7a49ae5b3a0f30e6837769eb03fdbb231bd` (20 October 2026). Local ONNX SHA-256 `b3a6e47b57b8c7fbe6a0ce2518161a50f59a9cdd8a50835c02cb02bdd6206c18` matches the snapshot's LFS OID; local config Git blob SHA-1 `5a1e0a2d94d3719de29a4771aa0e6c116552445f` matches the snapshot. | Repository README front matter declares MIT. The Amy `MODEL_CARD` itself has no model-license field: it says `License: See URL` under Dataset. | If the repository MIT grant validly covers these artifacts, MIT text permits use, modification, distribution, sublicensing and sale subject to retaining its notice and disclaimer. However the card points to separate training provenance, and no Amy-specific rights-chain statement or explicit output/model grant was found. | Repository metadata is evidence of a declared MIT license, not a resolved rights chain for this model. Public/commercial redistribution of the weights/config is **not cleared** pending confirmation that the grant covers the artifacts and their training lineage. |
| Training data and upstream Lessac model | Amy `MODEL_CARD` at the pinned snapshot says Dataset URL `https://github.com/MycroftAI/mimic3-voices`, `License: See URL`, and “Finetuned from U.S. English lessac voice (medium quality).” The linked Mycroft repo at commit `b239a9084e21fbaa7ac78ea6e31f5de1c31c8f42` has a root CC BY-SA 4.0 license, but its en_US inventory lists other voice/dataset entries and does not identify Amy or Lessac. The Lessac Piper card identifies CSTR's Blizzard 2013 Lessac data and its license; that card says the Lessac model was “Trained from scratch.” | CSTR's Blizzard 2013 page labels Lessac speech data **non-commercial only**. Its research agreement limits use of the listed materials to research/exploration of speech technologies, excludes commercial purposes, grants a non-transferable, non-sublicensable license, and restricts distribution absent written consent. LJSpeech is separately public domain, but no source reviewed ties Amy's Lessac lineage to LJSpeech. | This establishes a documented Amy-to-Lessac model relationship and a restrictive Lessac data license. The Amy card's generic Mycroft pointer does not identify the exact Amy corpus or resolve how the lessac fine-tune relates to that corpus. | Whether the Lessac agreement applies to Amy's derivative weights or outputs, and whether ESH's educational publication qualifies as permitted research, is unresolved. No signed CSTR license or rights-holder permission for ESH was found. Treat use and redistribution as **not cleared**. |
| The 151 generated WAV outputs | 18 pre-existing catalog recordings were retained; 133 additional files were generated locally from ESH catalog text with Piper Amy. Output files are not included in the upstream model repository's license text. | No separate output license or explicit commercial/online redistribution grant was found in the Amy card, Piper runtime license, or checked model-repository metadata. | A software license does not automatically license the synthesized output. The output's relationship to underlying voice/data rights is not answered by the sources checked. | Do not describe the WAVs as commercially reusable, public-domain, MIT-licensed, or otherwise cleared. Internet publication and redistribution remain **unresolved/not cleared**; all 151 remain `EXPERIMENTAL_NOT_APPROVED`. |

### Source excerpts and interpretation

- Amy model card: “License: See URL” and “Finetuned from U.S. English lessac voice (medium quality).” [Pinned Amy card](https://huggingface.co/rhasspy/piper-voices/blob/5041a7a49ae5b3a0f30e6837769eb03fdbb231bd/en/en_US/amy/medium/MODEL_CARD)
- Lessac model card: source is the [Blizzard 2013 Lessac dataset](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/); its linked [license page](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html) states research purposes only and expressly excludes commercial purposes and unauthorized distribution. The page requires an individually registered/accepted agreement; no ESH acceptance is recorded.
- The [Mycroft voice repository license](https://github.com/MycroftAI/mimic3-voices/blob/b239a9084e21fbaa7ac78ea6e31f5de1c31c8f42/LICENSE) is CC BY-SA 4.0. Its [README at the same commit](https://github.com/MycroftAI/mimic3-voices/blob/b239a9084e21fbaa7ac78ea6e31f5de1c31c8f42/README.md) does not identify Amy or Lessac in its U.S. English inventory; the Amy card's generic link is therefore not a sufficient exact corpus identification.
- The [LJ Speech Dataset page](https://keithito.com/LJ-Speech-Dataset/) calls that separate dataset public domain. No inspected Amy source record establishes that Amy was trained on LJSpeech, so that status is not applied to Amy.
- Piper engine: [v1.8.0 release](https://github.com/OHF-Voice/piper1-gpl/releases/tag/v1.8.0), [GPL license text](https://github.com/OHF-Voice/piper1-gpl/blob/v1.8.0/COPYING), [voice guidance](https://github.com/OHF-Voice/piper1-gpl/blob/v1.8.0/docs/VOICES.md), [PyPI 1.8.0 metadata](https://pypi.org/project/piper-tts/1.8.0/).
- Model files: [pinned Amy folder and file history](https://huggingface.co/rhasspy/piper-voices/tree/5041a7a49ae5b3a0f30e6837769eb03fdbb231bd/en/en_US/amy/medium), [repository README declaring MIT](https://huggingface.co/rhasspy/piper-voices/blob/5041a7a49ae5b3a0f30e6837769eb03fdbb231bd/README.md). The voice files were initially present in a Piper voices snapshot by 26 June 2023; the current local model is tied more reliably to the pinned snapshot by its matching file hash.

**Decision:** Amy remains the selected default, but this evidence does **not** establish that the project may commercially use or publicly redistribute the model or WAVs. Before release, obtain written permission that specifically covers the Lessac lineage, Amy model/config redistribution, synthesized output, online educational use, and commercial scope if relevant; have counsel assess any interaction between the source agreement and derivative model/output. This log is a source review, not legal advice.

## 2) Historical Microsoft David assets

The former 18 `Microsoft David Desktop` WAVs were removed from the working audio library and preserved byte-for-byte in `_backup-audio-cleanup-20261028-1939/`. Their output redistribution rights were not verified. They are not a fallback or current catalog source.

## 3) Rights and release policy for ESH

An audio asset remains `EXPERIMENTAL_NOT_APPROVED` until a human quality review and a separate, scoped rights review both pass. Selecting a default voice or successfully generating a WAV is not approval. Keep the Piper runtime, exact model, training data, and generated outputs as separate rights questions.

## 4) Rights and release policy for ESH

The project will only mark a source as approved after all of the following are true:

1. An exact voice model and source are recorded.
2. The output example is actually auditioned by at least two independent listeners.
3. A phonetic or pronunciation reviewer confirms the critical samples.
4. The licensing and contract scope is documented.
5. The release scope is narrow and explicit.

Without that evidence, the project keeps the asset in `experimental` or `candidate-trial` status.

## Current decision

Piper Amy remains the final user-preferred default voice. The user listened to Amy and liked it, but did not thereby review each recording individually. All 151 Amy assets remain `EXPERIMENTAL_NOT_APPROVED`. The Lessac training-data source has research-only/non-commercial terms; how those terms apply to the Amy model and generated WAVs, and whether the model repository's MIT declaration covers those artifacts with sufficient rights, remains unresolved. The model and WAVs are not cleared for ESH online or commercial distribution.

## Pronunciation dictionaries, G2P, and research sources — 28 October 2026

The prototype records source-level rights separately from voice/output rights in `audio-catalog.json` and summarizes the reviewed repositories in [`PRONUNCIATION_ENGINE.md`](PRONUNCIATION_ENGINE.md).

- **CMUdict:** the inspected upstream `LICENSE` has two redistribution conditions in BSD-style terms, but GitHub repository metadata reports `NOASSERTION`; ESH does not assign a formal SPDX classification. Retain the copyright/conditions/disclaimer in source distributions and reproduce them in binary materials. CMUdict README says research/commercial use is unrestricted and requests acknowledgement; it also disclaims accuracy/completeness. The required notice is preserved in `UPSTREAM_DATA_LICENSES.md`.
- **ipa-dict:** root repository declares MIT, but its README records distinct upstream derivation by language/variant. The sample uses a few en_US entries and preserves their exact notation and source ID. The en_US lineage also cites cmudict-ipa (MIT) and syllabify (license not independently verified); relevant MIT notices are preserved in `UPSTREAM_DATA_LICENSES.md`. The en_UK list is derived from GPL-3-licensed ipacards; it is not included. Do not treat the repository-wide MIT badge as blanket clearance for every list.
- **g2p-en:** PyPI/setup metadata says Apache-2.0 for the package. Its CMUdict/NLTK data, model artifacts, downloads, and generated outputs require separate checks. The package is not installed and produced no sample result.
- **Phonaria, Grzegorz, and s5s5/phonics:** their repository licenses apply to code (MIT, GPL-3.0, and MIT respectively); embedded CMUdict data, Wiktionary-derived material, audio, images, and phonetics data may have separate rights. No code or asset was copied into ESH.
- **SpeechOcean762:** README claims free commercial/non-commercial use, but no repository `LICENSE` file was found in the reviewed paths. Because recording/data terms and speaker privacy were not independently cleared, no data/audio was downloaded or reused.
- **Montreal Forced Aligner:** code repository declares MIT. Kaldi, dictionary, and pretrained-model terms are separate; no model was obtained. Alignment is not pronunciation verification.
- **British Council Sounds Right and Iowa Sounds of Speech:** no reusable content/recording license was established in this review. Their resources are references only; no media or course content was copied.

These are source-verification notes, not legal advice. No external dictionary extract, recording, model, or learner speech has been uploaded to a service. See [`PRONUNCIATION_ENGINE.md`](PRONUNCIATION_ENGINE.md) for the source URLs and technical limits. A rights-cleared ESH audio release remains unavailable.
