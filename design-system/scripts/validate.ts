import { access, readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { analyticsSchema } from '../schemas/analytics.schema';
import { blockSchema } from '../schemas/block.schema';
import { fixtureSchema } from '../schemas/fixture.schema';
import { recipeSchema } from '../schemas/recipe.schema';
import { tokenFileSchema } from '../schemas/tokens.schema';
import { visualReferenceMapSchema, type VisualReferenceMap } from '../schemas/visual-reference.schema';
import { readYaml, repoPath, root, tokenReferences, yamlFiles } from './_shared';

const errors: string[] = [];
const tokenNames = new Set<string>();
const tokenSources = new Map<string, string>();
const tokenValues = new Map<string, unknown>();

const hierarchyFiles = {
  hierarchy: resolve(root, 'docs/VISUAL-SOURCE-HIERARCHY.md'),
  decision: resolve(root, 'docs/DECISIONS/003-controlled-rebuild-and-source-hierarchy.md'),
  specification: resolve(root, 'docs/DESIGN-SYSTEM-TZ.md'),
};

try {
  const [hierarchy, decision, specification] = await Promise.all([
    readFile(hierarchyFiles.hierarchy, 'utf8'),
    readFile(hierarchyFiles.decision, 'utf8'),
    readFile(hierarchyFiles.specification, 'utf8'),
  ]);
  const levels = [
    'Утверждённый дизайн и решения владельца',
    'Машинно-читаемая дизайн-система в Git',
    'Корневая Astro-реализация',
    'Live Tilda',
    'Export и legacy archive',
  ];
  const positions = levels.map((level) => hierarchy.indexOf(level));
  if (positions.some((position) => position < 0) || positions.some((position, index) => index > 0 && position <= positions[index - 1])) {
    errors.push('Visual source hierarchy is missing or out of order');
  }
  for (const requirement of ['375', '768', '1024', '1440', 'human visual approval', 'Сгенерированные файлы нельзя менять вручную']) {
    if (!hierarchy.includes(requirement)) errors.push(`Visual source hierarchy is missing requirement: ${requirement}`);
  }
  if (!decision.includes('Статус: принято')) errors.push('ADR-003 is not accepted');
  if (!decision.includes('Один application runtime в корне')) errors.push('ADR-003 does not declare the root runtime');
  if (!specification.includes('Hermes работает только через отдельную ветку и pull request')) errors.push('Design-system specification is missing the Hermes PR boundary');
} catch (error) {
  errors.push(`Visual source hierarchy validation failed: ${String(error)}`);
}

let visualReferences: VisualReferenceMap | undefined;

try {
  visualReferences = visualReferenceMapSchema.parse(await readYaml(resolve(root, 'design-system/references/visual-source-map.yaml')));
  const legend = await readFile(resolve(root, '.github/hermes/BLOCK-LEGEND.md'), 'utf8');
  const seenReviewIds = new Set<string>();
  const seenBlockIds = new Set<string>();
  const sourceContents = new Map<'desktop' | 'mobile', string>();

  for (const sourceName of ['desktop', 'mobile'] as const) {
    const source = visualReferences.sources[sourceName];
    sourceContents.set(sourceName, await readFile(resolve(root, source.path), 'utf8'));
  }

  for (const block of visualReferences.blocks) {
    if (seenReviewIds.has(block.review_id)) errors.push(`Duplicate visual reference review_id ${block.review_id}`);
    if (seenBlockIds.has(block.id)) errors.push(`Duplicate visual reference block id ${block.id}`);
    seenReviewIds.add(block.review_id);
    seenBlockIds.add(block.id);

    const legendRow = `| ${block.review_id} | \`${block.id}\` |`;
    if (!legend.includes(legendRow)) errors.push(`Visual reference ${block.review_id}/${block.id} is missing from BLOCK-LEGEND.md`);

    for (const sourceName of ['desktop', 'mobile'] as const) {
      const content = sourceContents.get(sourceName)!;
      const locator = block[sourceName];
      if (!content.includes(locator.marker)) errors.push(`${sourceName} reference is missing marker ${locator.marker} for ${block.review_id}/${block.id}`);
      if (!content.includes(locator.selector)) errors.push(`${sourceName} reference is missing selector ${locator.selector} for ${block.review_id}/${block.id}`);
    }
  }

  const expectedReviewIds = Array.from({ length: 34 }, (_, index) => String(index + 1).padStart(2, '0'));
  for (const reviewId of expectedReviewIds) if (!seenReviewIds.has(reviewId)) errors.push(`Visual reference map is missing review_id ${reviewId}`);
} catch (error) {
  errors.push(`Visual reference map validation failed: ${String(error)}`);
}

for (const file of await yamlFiles(resolve(root, 'design-system/tokens'))) {
  try {
    const parsed = tokenFileSchema.parse(await readYaml(file));
    for (const [name, token] of Object.entries(parsed.tokens)) {
      if (tokenNames.has(name)) errors.push(`Duplicate token ${name}`);
      tokenNames.add(name);
      tokenSources.set(name, repoPath(file));
      tokenValues.set(name, token.value);
      const raw = JSON.stringify(token.value);
      if (/#[0-9a-f]{3,8}\b/i.test(raw) && repoPath(file) !== 'design-system/tokens/primitive/colors.yaml') errors.push(`Raw color outside primitive colors: ${repoPath(file)}:${name}`);
      if (/\b\d+(?:\.\d+)?px\b/.test(raw) && !repoPath(file).startsWith('design-system/tokens/primitive/')) errors.push(`Raw px outside primitive tokens: ${repoPath(file)}:${name}`);
    }
  } catch (error) {
    errors.push(`${repoPath(file)}: ${String(error)}`);
  }
}

for (const [name, value] of tokenValues) {
  for (const ref of tokenReferences(value)) if (!tokenNames.has(ref)) errors.push(`Unknown token reference ${ref} in ${name}`);
}

const analytics = analyticsSchema.parse(await readYaml(resolve(root, 'design-system/analytics/events.yaml')));
const analyticsNames = new Set(analytics.events.map((event) => event.name));
const blocks = [];
const reviewIds = new Set<string>();
const blockIds = new Set<string>();

for (const file of await yamlFiles(resolve(root, 'design-system/blocks'))) {
  try {
    const block = blockSchema.parse(await readYaml(file));
    blocks.push(block);
    if (reviewIds.has(block.review_id)) errors.push(`Duplicate review_id ${block.review_id}`);
    if (blockIds.has(block.id)) errors.push(`Duplicate block id ${block.id}`);
    reviewIds.add(block.review_id);
    blockIds.add(block.id);
    await access(resolve(root, block.component));
    for (const ref of tokenReferences(block.tokens)) if (!tokenNames.has(ref)) errors.push(`Unknown token ${ref} in ${repoPath(file)}`);
    for (const event of block.analytics.events) if (!analyticsNames.has(event)) errors.push(`Unknown analytics event ${event} in ${repoPath(file)}`);
    if (visualReferences) {
      const visualBlock = visualReferences.blocks.find((candidate) => candidate.review_id === block.review_id && candidate.id === block.id);
      if (!visualBlock) {
        errors.push(`Missing visual reference mapping for ${block.review_id}/${block.id}`);
      } else {
        for (const sourceName of ['desktop', 'mobile'] as const) {
          const source = visualReferences.sources[sourceName].path;
          const locator = `${visualBlock[sourceName].marker}; ${visualBlock[sourceName].selector}`;
          if (!block.traceability.some((entry) => entry.source === source && entry.locator === locator)) {
            errors.push(`${repoPath(file)} is missing exact ${sourceName} reference traceability: ${source} -> ${locator}`);
          }
        }
      }
    }
    const fixtureDir = resolve(root, 'design-system/fixtures', block.id);
    const parsedFixtures = await Promise.all((await yamlFiles(fixtureDir)).map(async (fixtureFile) => fixtureSchema.parse(await readYaml(fixtureFile))));
    const names = new Set(parsedFixtures.map((fixture) => basename(fixture.id.replace(`${block.id}-`, ''))));
    for (const fixtureName of block.fixtures) if (!names.has(fixtureName)) errors.push(`Missing fixture ${block.id}/${fixtureName}`);
    const requiredModes = ['reference', 'long-content', 'minimal', 'missing-optional', 'mobile'];
    for (const mode of requiredModes) if (!parsedFixtures.some((fixture) => fixture.mode === mode)) errors.push(`Missing ${mode} fixture for ${block.id}`);
    for (const fixture of parsedFixtures) {
      if (fixture.block_id !== block.id) errors.push(`Fixture ${fixture.id} belongs to ${fixture.block_id}, expected ${block.id}`);
      if (!block.variants.includes(fixture.variant)) errors.push(`Unknown variant ${fixture.variant} in ${fixture.id}`);
    }
  } catch (error) {
    errors.push(`${repoPath(file)}: ${String(error)}`);
  }
}

for (const file of await yamlFiles(resolve(root, 'design-system/recipes'))) {
  try {
    const recipe = recipeSchema.parse(await readYaml(file));
    for (const item of recipe.blocks) {
      const block = blocks.find((candidate) => candidate.id === item.id);
      if (!block) errors.push(`Unknown block ${item.id} in ${repoPath(file)}`);
      else if (!block.variants.includes(item.variant)) errors.push(`Unknown variant ${item.variant} for ${item.id} in ${repoPath(file)}`);
    }
  } catch (error) {
    errors.push(`${repoPath(file)}: ${String(error)}`);
  }
}

if (errors.length) throw new Error(`Design-system validation failed:\n- ${errors.join('\n- ')}`);
console.log(`Validated source hierarchy, 34 visual reference mappings, ${tokenNames.size} tokens, ${blocks.length} block, ${analyticsNames.size} analytics event.`);
