import { readdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export async function readYaml<T = unknown>(path: string): Promise<T> {
  return YAML.parse(await readFile(path, 'utf8')) as T;
}

export async function yamlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? yamlFiles(path) : /\.ya?ml$/.test(entry.name) ? [path] : [];
  }));
  return paths.flat().sort();
}

export function repoPath(path: string): string {
  return relative(root, path).replaceAll('\\', '/');
}

export function tokenReferences(value: unknown): string[] {
  const matches = JSON.stringify(value).matchAll(/\{([a-z0-9.-]+)\}/g);
  return [...matches].map((match) => match[1]);
}
