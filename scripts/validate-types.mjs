import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/scripts');
const files = fs.readdirSync(root).filter((name) => name.endsWith('.ts'));
const problems = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  if (/\@ts-nocheck/.test(text)) problems.push(`${file}: @ts-nocheck is forbidden`);
  if (/\@ts-ignore/.test(text)) problems.push(`${file}: @ts-ignore is forbidden; use a typed boundary or justified @ts-expect-error`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(`TypeScript source validation passed (${files.length} inherited/root entry files; no blanket suppressions).`);
