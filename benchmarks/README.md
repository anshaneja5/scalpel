# Benchmarks

Harness vendored from [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT):
same tasks, same `loc.js` LOC counter, same `correctness.js` execution gate, so every
number is apples-to-apples on their scoreboard. Arms: baseline (no skill), caveman
(vendored, MIT), ponytail (vendored at `vendor/ponytail/`), scalpel (this repo's SKILL.md).

## Run

```bash
ANTHROPIC_API_KEY=... npx promptfoo@latest eval -c promptfooconfig.yaml --repeat 10 --no-cache -o results.json
node analyze.js results.json          # per-model, per-arm medians
```

`promptfooconfig.iterate.yaml` (Haiku-only) and `promptfooconfig.iterate-sonnet.yaml`
are cheap configs for iterating on the skill. Always pass `--no-cache` when comparing
latency — promptfoo otherwise replays cached responses at 0ms.

Results and writeups live in [results/](results/); the raw promptfoo JSON for the
published run is in `results/raw/`.

Prereqs: Node 18+, Python 3 with pandas (the CSV correctness check uses it).
