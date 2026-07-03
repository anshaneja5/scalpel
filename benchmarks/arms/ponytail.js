// Ponytail arm: vendored ponytail SKILL.md (MIT, DietrichGebert/ponytail) as the system prompt.
const fs = require('fs');
const path = require('path');
const system = fs.readFileSync(path.join(__dirname, '..', 'vendor', 'ponytail', 'SKILL.md'), 'utf8');
module.exports = ({ vars }) => [
  { role: 'system', content: system },
  { role: 'user', content: vars.task },
];
