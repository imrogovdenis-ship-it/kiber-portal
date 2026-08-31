import { mkdir, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { blockSchema } from '../schemas/block.schema';
import { fixtureSchema } from '../schemas/fixture.schema';
import { readYaml, root, yamlFiles } from './_shared';

const specs = await Promise.all((await yamlFiles(resolve(root, 'design-system/blocks'))).map(async (file) => blockSchema.parse(await readYaml(file))));
const fixtureFiles = await yamlFiles(resolve(root, 'design-system/fixtures'));
const fixtures = await Promise.all(fixtureFiles.map(async (file) => ({ file, value: fixtureSchema.parse(await readYaml(file)) })));

const entries = specs.sort((a, b) => a.review_id.localeCompare(b.review_id)).map((spec) => {
  const componentImport = `../${spec.component.replace(/^src\//, '')}`;
  const blockFixtures = fixtures.filter(({ value }) => value.block_id === spec.id).map(({ file, value }) => ({
    ...value,
    source: `design-system/fixtures/${spec.id}/${basename(file)}`,
  }));
  return `  {\n    spec: ${JSON.stringify(spec, null, 2).replaceAll('\n', '\n    ')},\n    fixtures: ${JSON.stringify(blockFixtures, null, 2).replaceAll('\n', '\n    ')},\n    load: () => import(${JSON.stringify(componentImport)}),\n  }`;
});

const output = `// GENERATED FILE — DO NOT EDIT. Source: design-system/blocks and fixtures\nexport const blockRegistry = [\n${entries.join(',\n')}\n] as const;\n\nexport type RegisteredBlockId = (typeof blockRegistry)[number]['spec']['id'];\n`;
await mkdir(resolve(root, 'src/generated'), { recursive: true });
await writeFile(resolve(root, 'src/generated/block-registry.ts'), output);
