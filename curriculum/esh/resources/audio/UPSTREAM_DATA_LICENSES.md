# Upstream notices for selected pronunciation data

The small dictionary sample in `audio-catalog.json` includes selected CMUdict and ipa-dict en_US pronunciations. This file preserves the upstream notices associated with those extracts. It does not clear unrelated audio, model, software, or dataset rights. Consult `AUDIO_LICENSES.md` and `PRONUNCIATION_ENGINE.md` before reuse.

## CMU Pronouncing Dictionary — two-condition BSD-style terms

Copyright (C) 1993-2015 Carnegie Mellon University. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
   The contents of this file are deemed to be source code.

2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in
   the documentation and/or other materials provided with the
   distribution.

THIS WORK WAS SUPPORTED IN PART BY FUNDING FROM THE DEFENSE ADVANCED
RESEARCH PROJECTS AGENCY, THE OFFICE OF NAVAL RESEARCH AND THE NATIONAL
SCIENCE FOUNDATION OF THE UNITED STATES OF AMERICA, AND BY MEMBER
COMPANIES OF THE CARNEGIE MELLON SPHINX SPEECH CONSORTIUM. WE ACKNOWLEDGE
THE CONTRIBUTIONS OF MANY VOLUNTEERS TO THE EXPANSION AND IMPROVEMENT OF
THIS DICTIONARY.

THIS SOFTWARE IS PROVIDED BY CARNEGIE MELLON UNIVERSITY ``AS IS'' AND
ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL CARNEGIE MELLON UNIVERSITY
NOR ITS EMPLOYEES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Source: https://raw.githubusercontent.com/cmusphinx/cmudict/master/LICENSE

GitHub API repository metadata returned `NOASSERTION` for the SPDX identifier. ESH therefore describes the observed terms rather than assigning a formal SPDX classification.

## ipa-dict repository — MIT

The MIT License (MIT)

Copyright (c) 2016 dohliam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Source: https://raw.githubusercontent.com/open-dict-data/ipa-dict/master/LICENSE

## cmudict-ipa lineage — MIT

The MIT License (MIT)

Copyright (c) 2016 Lingliang Zhang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Source: https://raw.githubusercontent.com/lingz/cmudict-ipa/master/LICENSE

## Provenance and limits

ipa-dict's README identifies en_US data as based on modified cmudict-ipa and says stress-marker support used syllabify. The syllabify license was not independently verified here; no syllabify code is included. This project has not established that a root repository license overrides third-party provenance, so no broader data extract should be redistributed on the basis of this small sample review alone. en_UK data from ipa-dict is not included because its documented source derives from GPL-3-licensed ipacards.
