import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const stylesRoot = path.join(root, 'src', 'styles');
const assetsRoot = path.join(root, 'assets');
const sourceGroups = ['base', 'components', 'layout', 'sections', 'pages', 'vendors'];

async function walk(directory, extension) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
  const out = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full, extension));
    if (entry.isFile() && entry.name.endsWith(extension)) out.push(full);
  }
  return out;
}

const sourceFiles = [];
for (const group of sourceGroups) sourceFiles.push(...await walk(path.join(stylesRoot, group), '.scss'));
const assetFiles = await walk(assetsRoot, '.css');
const errors = [];
const sourceOutputs = new Map();

for (const file of sourceFiles) {
  const text = await fs.readFile(file, 'utf8');
  const relative = path.relative(root, file);
  const output = `${path.basename(file, '.scss').replace(/^_/, '')}.css`;

  if (!text.startsWith("@use 'abstracts' as a;")) {
    errors.push(`${relative}: missing shared Sass module import.`);
  }

  if (sourceOutputs.has(output)) {
    errors.push(`${relative}: duplicates output ${output} from ${sourceOutputs.get(output)}.`);
  }
  sourceOutputs.set(output, relative);

  const legacyBreakpoints = [
    '@media screen and (min-width: 750px)',
    '@media only screen and (min-width: 750px)',
    '@media screen and (max-width: 749px)',
    '@media screen and (min-width: 990px)',
    '@media screen and (max-width: 989px)',
  ];
  for (const query of legacyBreakpoints) {
    if (text.includes(query)) errors.push(`${relative}: use the shared breakpoint mixins instead of ${query}.`);
  }

  if (/rgb\(var\(--color-[\w-]+\)\)/.test(text)) {
    errors.push(`${relative}: use a.theme-color() for simple theme color expressions.`);
  }
  if (/rgba\(var\(--color-[\w-]+\),\s*(?:0?\.\d+|1(?:\.0+)?)\)/.test(text)) {
    errors.push(`${relative}: use a.theme-color() for numeric-alpha theme color expressions.`);
  }
}

const assetNames = new Set(assetFiles.map((file) => path.basename(file)));
for (const output of sourceOutputs.keys()) {
  if (!assetNames.has(output)) errors.push(`Missing compiled CSS asset: assets/${output}`);
}

if (errors.length) {
  console.error(`SCSS validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SCSS architecture validation passed for ${sourceFiles.length} source files and ${sourceOutputs.size} Shopify CSS outputs.`);
