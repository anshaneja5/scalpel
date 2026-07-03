#!/usr/bin/env node
// Summarize a promptfoo results JSON into per-arm medians: LOC, tokens, cost, latency, correctness.
// Usage: node analyze.js results.json
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('usage: node analyze.js <results.json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const results = data.results?.results ?? data.results ?? [];

const median = a => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? (s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN;
};

const arms = {};
for (const r of results) {
  const model = (r.provider?.id ?? r.provider ?? '').toString().split(':').pop().replace(/claude-|-\d{8}$/g, '');
  const label = `${model} / ${r.prompt?.label ?? 'unknown'}`;
  const a = (arms[label] ??= { loc: [], tokens: [], cost: [], latency: [], correct: 0, n: 0 });
  a.n++;
  const asserts = r.gradingResult?.componentResults ?? [];
  for (const c of asserts) {
    const metric = c.assertion?.metric;
    if (metric === 'code_loc') a.loc.push(Number(c.score ?? c.reason?.match(/\d+/)?.[0] ?? NaN));
    if (metric === 'correct' && c.pass) a.correct++;
  }
  if (r.response?.tokenUsage?.total) a.tokens.push(r.response.tokenUsage.total);
  if (typeof r.cost === 'number') a.cost.push(r.cost);
  if (typeof r.latencyMs === 'number') a.latency.push(r.latencyMs);
}

console.log('model / arm'.padEnd(36), 'n', 'medLOC', 'medTok', 'sumCost', 'medLat(s)', 'correct%');
for (const [label, a] of Object.entries(arms).sort()) {
  console.log(
    label.padEnd(36),
    String(a.n).padEnd(2),
    String(median(a.loc)).padEnd(6),
    String(median(a.tokens)).padEnd(6),
    a.cost.reduce((x, y) => x + y, 0).toFixed(4).padEnd(7),
    (median(a.latency) / 1000).toFixed(1).padEnd(9),
    ((a.correct / a.n) * 100).toFixed(0) + '%'
  );
}
