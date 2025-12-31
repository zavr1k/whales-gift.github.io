# AGENTS
Repo currently empty; update this file when scaffolding lands.
Build commands: none defined yet; inspect manifests before coding.
If package tooling arrives, run `npm run build` (JS) or `cargo build` (Rust) as appropriate.
Lint commands: none yet; follow ecosystem linters (eslint/ruff/golangci-lint) when configured.
Tests: no runner configured; run the project's default test script once added.
Single-test tip: use runner filters like `npm test -- <pattern>` or `pytest path -k name`.
Add concrete commands above immediately after corresponding scripts exist.
Formatting: use repo formatter when defined; otherwise match spacing and wrap at 100 chars.
Imports: group std/third-party/local, keep alphabetical order, remove unused.
Types: favor explicit interfaces/types; avoid implicit any/dynamic constructs.
Naming: camelCase for vars/functions, PascalCase for components/classes, SNAKE_CASE for constants/env.
Error handling: validate inputs early and log actionable context.
Never swallow errors; either rethrow with context or return typed results.
Use guards for nullable values instead of asserting blindly.
Avoid unnecessary dependencies; justify every new package in PR descriptions.
Document new scripts, env vars, and infra in README and sync this file.
No Cursor or Copilot rule files detected; this document is authoritative.
Before merging, run all available formatters/linters/tests even if untouched.
Prefer small focused commits and mention affected modules in summaries.
Seek maintainer guidance whenever tooling assumptions are unclear.