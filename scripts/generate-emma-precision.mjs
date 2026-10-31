#!/usr/bin/env node
import { spawnSync } from "node:child_process";
const py = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const args = ["scripts/generate-kokoro-precision.py", ...process.argv.slice(2)];
const run = spawnSync(py, args, { encoding: "utf8", stdio: "inherit" });
if (run.error) throw run.error;
process.exitCode = run.status ?? 1;
