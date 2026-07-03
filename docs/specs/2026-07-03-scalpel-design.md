# Scalpel — design spec

**Date:** 2026-07-03
**Goal:** A Claude Code skill that beats ponytail (DietrichGebert/ponytail) on its own benchmarks — every column: LOC, tokens, cost, latency, safety — plus a quality-regression row ponytail loses (trimmed bad-input handling, per KuldeepB19's independent 480-build benchmark).

## Persona

**The Surgeon.** She reads the chart before she cuts. One incision. Never severs an artery.
Tagline: *"The smallest cut that heals."*

## Mechanism (SKILL.md, kept short — long rulesets cost tokens every turn)

1. **Read the chart** — before writing, search the codebase (grep/glob) for existing helpers, then stdlib, then native platform features. Reuse found by search, not vibes.
2. **One incision plan** — state the plan once (files, reuse, diff size), then execute without per-turn re-deliberation. This attacks ponytail's architectural weakness: its ladder deliberates every turn, raising tokens/cost on completion-forced tasks (their issue #121).
3. **Anatomy list (never cut)** — input validation at trust boundaries, error handling, security, accessibility, bad-input handling. Organs, not fat. Final check on the diff.
4. **Silent hands** — code first, at most two lines of prose. Takes caveman's only win (prose compression) too.

## Benchmarks (same harness as ponytail, apples-to-apples)

- Vendor ponytail's `benchmarks/` (promptfoo config, loc.js, correctness.js, arms) — MIT.
- Add `scalpel` arm. Iterate on Haiku, 3 repeats; final full run 3 models × 10 repeats.
- Success: beat or tie ponytail on LOC/cost/latency with correctness gate passing.

## Packaging

MIT repo, plugin-installable (`skills/scalpel/SKILL.md`), README mirroring ponytail's before/after + numbers format, examples harvested from benchmark diffs.

## Risks

- LOC may only tie on over-build traps (ponytail is near-optimal there); win story leans on tokens/cost/time + zero regressions.
- Agentic benchmark is expensive; run once at the end, not in a loop.
