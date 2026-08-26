import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tokenFileSchema, type Token } from '../schemas/tokens.schema';
import { readYaml, root, yamlFiles } from './_shared';

type Scalar = string | number | boolean;
type Responsive = Record<'sm' | 'md' | 'lg' | 'xl', Scalar>;
type ResolvedValue = Scalar | Responsive;

const files = await yamlFiles(resolve(root, 'design-system/tokens'));
const tokens = new Map<string, Token>();

for (const file of files) {
  const parsed = tokenFileSchema.parse(await readYaml(file));
  for (const [name, token] of Object.entries(parsed.tokens)) {
    if (tokens.has(name)) throw new Error(`Duplicate token: ${name}`);
    tokens.set(name, token);
  }
}

const reference = /^\{([a-z0-9.-]+)\}$/;
const cache = new Map<string, ResolvedValue>();

function resolveScalar(value: Scalar, stack: string[]): ResolvedValue {
  if (typeof value !== 'string') return value;
  const match = value.match(reference);
  return match ? resolveToken(match[1], stack) : value;
}

function resolveToken(name: string, stack: string[] = []): ResolvedValue {
  if (cache.has(name)) return cache.get(name)!;
  if (stack.includes(name)) throw new Error(`Circular token reference: ${[...stack, name].join(' -> ')}`);
  const token = tokens.get(name);
  if (!token) throw new Error(`Unknown token: ${name}`);
  const nextStack = [...stack, name];
  let resolved: ResolvedValue;
  if (typeof token.value === 'object') {
    resolved = Object.fromEntries(Object.entries(token.value).map(([bp, value]) => {
      const item = resolveScalar(value, nextStack);
      if (typeof item === 'object') throw new Error(`Nested responsive token in ${name}.${bp}`);
      return [bp, item];
    })) as Responsive;
  } else {
    resolved = resolveScalar(token.value, nextStack);
  }
  cache.set(name, resolved);
  return resolved;
}

for (const name of tokens.keys()) resolveToken(name);

const cssTokens = [...tokens.entries()]
  .filter(([, token]) => token.css && token.emit !== false)
  .sort(([a], [b]) => a.localeCompare(b));
const breakpoints = Object.fromEntries(['sm', 'md', 'lg', 'xl'].map((bp) => [bp, resolveToken(`breakpoint.${bp}`)])) as Responsive;

const declaration = (token: Token, value: Scalar) => `  ${token.css}: ${String(value)};`;
const base = cssTokens.map(([name, token]) => {
  const value = resolveToken(name);
  return declaration(token, typeof value === 'object' ? value.sm : value);
});

const media = ['md', 'lg', 'xl'].map((bp) => {
  const declarations = cssTokens.flatMap(([name, token]) => {
    const value = resolveToken(name);
    if (typeof value !== 'object' || value[bp as keyof Responsive] === value.sm) return [];
    return [declaration(token, value[bp as keyof Responsive])];
  });
  if (!declarations.length) return '';
  return `@media (min-width: ${String(breakpoints[bp as keyof Responsive])}) {\n  :root {\n${declarations.map((line) => `  ${line}`).join('\n')}\n  }\n}`;
}).filter(Boolean);

const header = '/* GENERATED FILE — DO NOT EDIT. Source: design-system token YAML files. */';
const css = `${header}\n:root {\n${base.join('\n')}\n}\n\n${media.join('\n\n')}\n`;
const resolved = Object.fromEntries([...tokens.keys()].sort().map((name) => [name, resolveToken(name)]));
const typescript = `// GENERATED FILE — DO NOT EDIT. Source: design-system/tokens/**/*.yaml\nexport const designTokens = ${JSON.stringify(resolved, null, 2)} as const;\nexport type DesignTokenName = keyof typeof designTokens;\n`;

await mkdir(resolve(root, 'src/styles'), { recursive: true });
await mkdir(resolve(root, 'src/generated'), { recursive: true });
await writeFile(resolve(root, 'src/styles/tokens.css'), css);
await writeFile(resolve(root, 'src/generated/design-tokens.ts'), typescript);
