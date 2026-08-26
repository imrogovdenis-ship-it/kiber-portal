import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { blockSchema } from '../schemas/block.schema';
import { visualReferenceMapSchema } from '../schemas/visual-reference.schema';
import { readYaml, root, yamlFiles } from './_shared';

const blocks = await Promise.all((await yamlFiles(resolve(root, 'design-system/blocks'))).map(async (file) => blockSchema.parse(await readYaml(file))));
const rows = blocks.sort((a, b) => a.review_id.localeCompare(b.review_id)).map((block) =>
  `| ${block.review_id} | \`${block.id}\` | ${block.name} | ${block.status} | ${block.variants.join(', ')} | \`${block.component}\` |`,
);
const output = `<!-- GENERATED FILE — DO NOT EDIT. Source: design-system/blocks/*.yaml -->\n# Реестр блоков\n\n| Review ID | ID | Название | Статус | Варианты | Компонент |\n|---|---|---|---|---|---|\n${rows.join('\n')}\n`;
await mkdir(resolve(root, 'docs/generated'), { recursive: true });
await writeFile(resolve(root, 'docs/generated/BLOCK-SPEC-TABLE.md'), output);

const referenceMap = visualReferenceMapSchema.parse(await readYaml(resolve(root, 'design-system/references/visual-source-map.yaml')));
const referenceRows = referenceMap.blocks.map((block) =>
  `| ${block.review_id} | \`${block.id}\` | \`${block.desktop.marker}\` / \`${block.desktop.selector}\` | \`${block.mobile.marker}\` / \`${block.mobile.selector}\` |`,
);
const referenceOutput = `<!-- GENERATED FILE — DO NOT EDIT. Source: design-system/references/visual-source-map.yaml -->
# Трассировка HTML-референсов

Desktop: \`${referenceMap.sources.desktop.path}\`. Mobile: \`${referenceMap.sources.mobile.path}\`.

| Review ID | ID | Desktop locator | Mobile locator |
|---|---|---|---|
${referenceRows.join('\n')}
`;
await writeFile(resolve(root, 'docs/generated/REFERENCE-TRACEABILITY.md'), referenceOutput);
