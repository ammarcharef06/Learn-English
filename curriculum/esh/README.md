# ESH curriculum source

This directory preserves the ESH curriculum as a namespaced, data-only source
inside Learn-English. It does not replace the existing Learn-English curriculum
or change the application runtime.

## Contents

- `levels/`: nine source Markdown files from PRE-A0 through Post-C2.
- `data/`: per-level JSON plus `curriculum.json`, the aggregated dataset.
- `resources/`: curriculum and learning resources in Markdown.
- `resources/audio/`: licensing and provenance notes only. ESH-generated audio
  and voice-model files are not included because their redistribution rights
  have not been cleared.
- `supabase/`: the ESH schema and seed, retained as source references. They are
  not migrations for Learn-English's existing Supabase database.
- `tools/generate_app_data.py`: ESH's Markdown-to-JSON generator.
- `CURRICULUM_MAP.md`: the ESH curriculum map.

The aggregate JSON contains 9 levels, 52 units, and 171 lessons. ESH lesson IDs
such as `A1.U01.L01` are intentionally preserved. They differ from existing
Learn-English IDs such as `a1u1`; do not merge progress records or overwrite
existing curriculum modules without an explicit ID and schema migration.

The source data remains unchanged. `adapter.js` maps the aggregate dataset into
the Learn-English curriculum shape when the app is opened with
`?curriculum=esh` (for example, `http://localhost:5173/?curriculum=esh`).
That sandbox uses separate `lea.esh.*` local-storage keys, does not queue cloud
progress sync, and uses the app's built-in browser speech synthesis instead of
redistributed recordings. Opening the app without the query parameter keeps
the original Learn-English curriculum and storage keys.
