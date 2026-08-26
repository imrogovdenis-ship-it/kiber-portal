import { readdir, readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { repoPath, root } from './_shared';

const roots = [
  'src',
  'public',
  'design-system/blocks',
  'design-system/fixtures',
  'design-system/recipes',
  'design-system/tokens/semantic',
  'design-system/tokens/component',
];
const textExtensions = new Set(['.astro', '.css', '.ts', '.yaml', '.yml', '.json', '.svg', '.txt']);
const ignored = new Set(['src/styles/tokens.css']);

async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return files(path);
    return textExtensions.has(extname(entry.name)) ? [path] : [];
  }))).flat();
}

const errors: string[] = [];
const scanned = (await Promise.all(roots.map((directory) => files(resolve(root, directory))))).flat()
  .filter((file) => !repoPath(file).startsWith('src/generated/'))
  .filter((file) => !ignored.has(repoPath(file)));

for (const file of scanned) {
  const contents = await readFile(file, 'utf8');
  if (/#[0-9a-f]{3,8}\b/i.test(contents) || /\b(?:rgb|hsl)a?\(/i.test(contents)) errors.push(`${repoPath(file)} contains a raw color`);
  if (/\b\d+(?:\.\d+)?px\b/.test(contents)) errors.push(`${repoPath(file)} contains a raw px value`);
}

if (errors.length) throw new Error(`Lint failed:\n- ${errors.join('\n- ')}`);
console.log(`Linted ${scanned.length} design-system and runtime source files.`);
