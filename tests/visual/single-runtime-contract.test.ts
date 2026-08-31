import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const ignoredContextDirs = new Set(['.astro', '.git', 'dist', 'node_modules', 'site-export']);

const workspaceFiles = (dir = '.', prefix = ''): string[] => readdirSync(dir)
  .flatMap((entry) => {
    if (ignoredContextDirs.has(entry)) return [];
    const absolute = join(dir, entry);
    const relative = prefix ? `${prefix}/${entry}` : entry;
    const stat = statSync(absolute);
    if (stat.isDirectory()) return workspaceFiles(absolute, relative);
    if (stat.isFile()) return [relative];
    return [];
  })
  .sort();

const trackedFiles = () => {
  if (process.env.KIBER_TEST_NO_GIT === 'true') return workspaceFiles();
  try {
    return execFileSync('git', ['ls-files'], { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  } catch (error) {
    return workspaceFiles();
  }
};

const hasGitTrackedFiles = () => {
  if (process.env.KIBER_TEST_NO_GIT === 'true') return false;
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return true;
  } catch (error) {
    return false;
  }
};

test('KIBER-19 keeps exactly one root Astro runtime and one production Dockerfile', () => {
  const files = trackedFiles();
  assert.deepEqual(files.filter((file) => file === 'Dockerfile'), ['Dockerfile']);
  assert.equal(files.filter((file) => file.split('/').pop()?.startsWith('Dockerfile')).length, 1);
  assert.deepEqual(files.filter((file) => file === 'package.json'), ['package.json']);
  assert.deepEqual(files.filter((file) => file === 'astro.config.mjs'), ['astro.config.mjs']);
  assert.equal(files.some((file) => file.startsWith('src/')), true, 'root src runtime is required');
  assert.equal(files.some((file) => file.startsWith('public/')), true, 'root public assets are required');
  assert.equal(files.some((file) => file.startsWith('app/')), false, 'legacy app runtime must not stay tracked');
  assert.equal(files.some((file) => file.startsWith('app-v2/')), false, 'secondary app-v2 runtime is forbidden');
});

test('KIBER-19 keeps legacy constructor export out of runtime while preserving media provenance assets', () => {
  const files = trackedFiles();
  const disallowedLegacyRuntime = files.filter((file) =>
    file === 'site-export/404.html'
    || file === 'site-export/robots.txt'
    || file === 'site-export/sitemap.xml'
    || file === 'site-export/htaccess'
    || /^site-export\/(?:css|js|files)\//.test(file)
    || /^site-export\/page\d+\.html$/.test(file),
  );

  assert.deepEqual(disallowedLegacyRuntime, []);
  if (hasGitTrackedFiles()) {
    assert.equal(
      files.some((file) => file.startsWith('site-export/images/')),
      true,
      'approved media provenance images can remain for review registries',
    );
  } else {
    assert.equal(
      files.some((file) => file.startsWith('site-export/')),
      false,
      'Docker build context must stay free of legacy constructor export files',
    );
  }
});

test('KIBER-19 single-runtime guard is documented and CI-visible', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
  assert.match(packageJson.scripts['test:visual'], /tests\/visual\/\*\*\/\*\.test\.ts/);

  const decision = await readFile('docs/DECISIONS/003-controlled-rebuild-and-source-hierarchy.md', 'utf8');
  assert.match(decision, /второй production Dockerfile запрещены/);
});
