import fs from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as sass from 'sass';

const root = process.cwd();
const stylesRoot = path.join(root, 'src', 'styles');
const assetsRoot = path.join(root, 'assets');
const sourceGroups = ['base', 'components', 'layout', 'sections', 'pages', 'vendors'];
const isWatch = process.argv.includes('--watch');
const isCheck = process.argv.includes('--check');
const style = process.argv.includes('--compressed') ? 'compressed' : 'expanded';

async function getScssFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await getScssFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith('.scss')) files.push(fullPath);
  }

  return files;
}

async function buildStyles() {
  if (!isCheck) await fs.mkdir(assetsRoot, { recursive: true });
  const sources = [];

  for (const group of sourceGroups) {
    sources.push(...await getScssFiles(path.join(stylesRoot, group)));
  }

  const outputNames = new Set();

  for (const source of sources.sort()) {
    const basename = path.basename(source, '.scss').replace(/^_/, '');
    const outputName = `${basename}.css`;

    if (outputNames.has(outputName)) {
      throw new Error(`Duplicate Shopify CSS output name: ${outputName}`);
    }
    outputNames.add(outputName);

    const result = sass.compile(source, {
      style,
      sourceMap: false,
      loadPaths: [stylesRoot],
      quietDeps: true,
    });

    if (!isCheck) {
      const css = result.css.endsWith('\n') ? result.css : `${result.css}\n`;
      await fs.writeFile(path.join(assetsRoot, outputName), css);
    }
  }

  const action = isCheck ? 'Validated' : 'Built';
  console.log(`${action} ${sources.length} SCSS sources${isCheck ? '.' : ` into assets/ (${style}).`}`);
}

await buildStyles();

if (isWatch) {
  console.log('Watching src/styles/ for SCSS changes...');
  let timer;
  watch(stylesRoot, { recursive: true }, (_eventType, filename) => {
    if (!filename?.endsWith('.scss')) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      buildStyles().catch((error) => console.error(error));
    }, 100);
  });
}
