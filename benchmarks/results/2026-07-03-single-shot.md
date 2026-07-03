# Single-shot benchmark — 2026-07-03

Ponytail's own harness (vendored, MIT): same 5 tasks, same `loc.js` LOC counter, same
`correctness.js` execution gate, same providers and settings. Four arms — no skill,
caveman, ponytail, scalpel — 3 Claude models × 10 repeats per cell (n=50 per arm/model),
`--no-cache`, temperature 1. Medians reported; cost is the sum over all 50 calls.

## Results (results-final-v3.json)

| model | arm | med LOC | med tokens | cost (50 calls) | med latency | correct |
|---|---|--:|--:|--:|--:|--:|
| Haiku 4.5 | baseline | 73.5 | 1250 | $0.311 | 8.3s | 100% |
| Haiku 4.5 | caveman | 23.5 | 1400 | $0.140 | 3.4s | 100% |
| Haiku 4.5 | ponytail | 8.5 | 1937.5 | $0.129 | 2.4s | 96% |
| Haiku 4.5 | **scalpel** | **7.5** | **1491** | **$0.116** | **2.3s** | **100%** |
| Sonnet 4.6 | baseline | 87.5 | 1593.5 | $1.454 | 22.1s | 74% |
| Sonnet 4.6 | caveman | 21 | 1402.5 | $0.497 | 7.1s | 100% |
| Sonnet 4.6 | ponytail | 8 | 1946 | $0.379 | 3.9s | 100% |
| Sonnet 4.6 | **scalpel** | **7** | **1450.5** | **$0.332** | **3.9s** | **100%** |
| Opus 4.8 | baseline | 42 | 1058 | $1.377 | 12.6s | 100% |
| Opus 4.8 | caveman | 9 | 1716 | $0.708 | 5.3s | 100% |
| Opus 4.8 | ponytail | 10 | 2665 | $0.947 | 4.8s | 100% |
| Opus 4.8 | **scalpel** | **7** | **1958** | **$0.759** | **4.2s** | **100%** |

## Scalpel vs ponytail

| model | LOC | tokens | cost | latency | correctness |
|---|--:|--:|--:|--:|--:|
| Haiku 4.5 | −12% | −23% | −10% | −4% | 100% vs 96% |
| Sonnet 4.6 | −13% | −25% | −12% | tie | tie (100%) |
| Opus 4.8 | −30% | −27% | −20% | −13% | tie (100%) |

Scalpel beats or ties ponytail on **every cell** and never loses one. The token/cost
gap comes largely from architecture, not just output: ponytail's 120-line ladder is
re-injected and deliberated per call; scalpel's ruleset is smaller and its plan is
explicitly internal ("the user sees the incision, not the deliberation").

## Failure notes (read the numbers honestly)

- Ponytail's Haiku failures (2/50 this run, 4/50 in v2) are **real broken code**: its
  email answer imports `email_validator`, a package not installed in the gate's
  environment — violating its own "no new dependency" rule. Scalpel's dependency rung
  explicitly bans prescribing packages you don't know are installed.
- In earlier iterations scalpel showed two failure modes we fixed and re-measured:
  printing its plan as prose (bloat) and asking for missing context instead of cutting
  a default (stall). Both are now ruled out in SKILL.md; v3 is post-fix, fresh, n=50/cell.
- The React/FastAPI checks are structural (regex), not executed — inherited from the
  upstream harness. In v2, 2/50 scalpel Sonnet countdowns used a drift-free
  `Date.now()` deadline + `requestAnimationFrame` — working code the regex missed. We
  did not tune the skill to the regex; v3 happened to produce boring `setInterval`
  implementations throughout, consistent with "boring over clever".
- Baseline Sonnet's 74% is mostly gate timeouts/structure on its enormous answers
  (median 87.5 LOC), not a claim that Sonnet is wrong 26% of the time.

## Reproduce

```bash
cd benchmarks
ANTHROPIC_API_KEY=... npx promptfoo@latest eval -c promptfooconfig.yaml --repeat 10 --no-cache -o results.json
node analyze.js results.json
```

## Not yet measured

Ponytail's agentic benchmark (headless Claude Code sessions on
full-stack-fastapi-template, 12 tickets, git-diff scoring) has not been run for
scalpel yet. Single-shot numbers overstate any skill's win vs a conversational
baseline (ponytail's own README says the same); the vs-ponytail deltas above are
same-format comparisons and don't suffer that artifact.
