import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

const maxLink = 'https://max.ru/u/f9LHodD0cOJhJ-X4IZgcN132WZOzWIuvqM8KhYmQShyPoEZQ-C84DJgI4M0';

test('site public config exposes the owner-approved MAX messenger link', () => {
  const config = read('src/config/site.ts');
  const envExample = read('.env.example');

  assert.match(config, /max:\s*z\.url\(\)/);
  assert.match(config, new RegExp(maxLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(envExample, /PUBLIC_MAX=/);
  assert.match(envExample, new RegExp(maxLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('contacts and footer present MAX as a public messenger choice without enabling lead routing', () => {
  const contacts = read('src/pages/contacts.astro');
  const footer = read('src/components/layout/Footer.astro');
  const contract = read('data/lead/capability-contract.json');

  assert.match(contacts, /MAX/);
  assert.match(contacts, /siteConfig\.max/);
  assert.match(footer, /MAX/);
  assert.match(footer, /siteConfig\.max/);
  assert.match(contract, /"enabled": false/);
  assert.match(contract, /"destinations": \[\]/);
});
