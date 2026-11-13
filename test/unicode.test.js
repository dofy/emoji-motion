import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emojiMotion, createEmojiMotion, unicodeVersion } from '../src/index.js';
import { emojiMotion as lite, createEmojiMotion as createLite } from '../src/lite.js';
import { subgroups } from '../src/unicode-data.js';

test('every generated Unicode entry resolves without treating text as emoji', () => {
  let count = 0;
  for (const [, , rows] of subgroups) for (const row of rows.split(' ')) {
    const glyph = row.slice(0, row.lastIndexOf('='));
    assert.ok(emojiMotion.resolve(glyph), `missing ${glyph}`); count++;
  }
  assert.equal(count, 5235); assert.equal(unicodeVersion, '18.0.0');
  for (const text of ['', '1', 'hello', '👋👋', '🏽', '🐶‍A', '\uFE0F', '\u{1FC00}', '🦰']) assert.equal(emojiMotion.resolve(text), undefined, text);
});

test('unknown emoji choose semantic group and preserve the entire sequence', () => {
  for (const [glyph, group, subgroup, motion] of [['🐶', 'nature', 'animal-mammal', 'bounce'], ['🍕', 'food', 'food-prepared', 'bounce'], ['🇨🇳', 'flags', 'country-flag', 'float'], ['👩🏽‍🚀', 'people', 'person-role', 'bounce']]) {
    const result = emojiMotion.resolve(glyph);
    assert.equal(result.source, 'unicode'); assert.equal(result.glyph, glyph); assert.equal(result.groupId, group); assert.equal(result.unicodeSubgroup, subgroup); assert.equal(result.motionId, motion);
  }
  assert.equal(emojiMotion.resolve('👩‍🚀', { skinTone: 'dark' }).glyph, '👩🏿‍🚀');
  assert.equal(emojiMotion.resolve('👩🏽‍🚀', { skinTone: 'default' }).glyph, '👩‍🚀');
  assert.equal(emojiMotion.resolve('👩🏽‍🚀').glyph, '👩🏽‍🚀');
  assert.equal(emojiMotion.resolve('👩🏻‍❤️‍👩🏿', { skinTone: 'light' }).glyph, '👩🏻‍❤️‍👩🏿');
});

test('user emoji and category rules override presets, aliases and Unicode defaults', () => {
  const customized = createEmojiMotion({
    classifications: { groups: { 'Animals & Nature': { group: 'hearts', motion: 'pulse' } }, subgroups: { 'animal-bird': { group: 'objects', motion: 'swing' }, 'hand-fingers-open': { group: 'faces', motion: 'shake' } } },
    emoji: { '🐶': { name: 'Personal dog', group: 'people', motion: 'spin' }, '👋🏿': { name: 'Personal wave', group: 'hearts', motion: 'pulse' } }
  });
  assert.equal(customized.resolve('🐶').motionId, 'spin'); assert.equal(customized.resolve('🐶').source, 'user');
  assert.equal(customized.resolve('🐱').motionId, 'pulse'); assert.equal(customized.resolve('🐱').source, 'user-classification');
  assert.equal(customized.resolve('🐦').motionId, 'swing');
  assert.equal(customized.resolve('👋').motionId, 'shake');
  assert.equal(customized.resolve('👋🏿').motionId, 'pulse');
  assert.equal(customized.resolve('👋', { skinTone: 'dark' }).motionId, 'pulse');
  const overrideBase = createEmojiMotion({ emoji: { '👩‍🚀': { name: 'Astronaut', group: 'hearts', motion: 'pulse' } } });
  assert.equal(overrideBase.resolve('👩🏽‍🚀').source, 'user');
  assert.equal(overrideBase.resolve('👩🏽‍🚀').motionId, 'pulse');
  assert.equal(overrideBase.resolve('👩🏽‍🚀').glyph, '👩🏽‍🚀');
  const userAlias = createEmojiMotion({ emoji: { '🐙': { name: 'Wave substitute', group: 'faces', variants: ['👋'] } } });
  assert.equal(userAlias.resolve('👋').name, 'Wave substitute');
});

test('lite entry contains presets only and rejects enabling unavailable data', () => {
  assert.equal(lite.resolve('👋').motionId, 'wave');
  assert.equal(lite.resolve('🐶'), undefined);
  assert.throws(() => createLite({ autoDetect: true }), /not included/);
  assert.equal(createEmojiMotion({ autoDetect: false }).resolve('🐶'), undefined);
  assert.equal(createEmojiMotion({ defaults: false }).resolve('🐶'), undefined);
});

test('user fallback rule has priority over the built in fallback', async () => {
  const { createRegistry } = await import('../src/registry.js');
  const registry = createRegistry({ classifications: { fallback: { group: 'hearts', motion: 'pulse' } } }, { lookup: () => undefined, looksLikeEmoji: value => value === 'future-emoji' });
  const result = registry.resolve('future-emoji');
  assert.equal(result.source, 'fallback'); assert.equal(result.groupId, 'hearts'); assert.equal(result.motionId, 'pulse');
});

test('all lite entry points exclude Unicode classification modules', async () => {
  const { readFile } = await import('node:fs/promises');
  const { dirname, resolve } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const visited = new Set();
  async function visit(file) {
    if (visited.has(file)) return; visited.add(file);
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"](\.\.?\/[^'"]+)['"]/g)) await visit(resolve(dirname(file), match[1]));
  }
  for (const file of ['lite.js', 'react-lite.js', 'vue-lite.js', 'svelte-lite.js', 'EmojiMotionLite.svelte', 'element-lite.js']) await visit(fileURLToPath(new URL(`../src/${file}`, import.meta.url)));
  assert.ok([...visited].every(path => !/unicode(?:-data)?\.js$/.test(path)), 'lite must not load Unicode data');
});


test('user group defaults override handcrafted and automatic motions', () => {
  const registry = createEmojiMotion({
    groups: { gestures: { label: 'Custom gestures', motion: 'pulse' }, nature: { label: 'Custom nature', motion: 'shake' } },
    emoji: { '👌': { name: 'Custom OK', group: 'gestures', motion: 'spin' } },
  });
  assert.equal(registry.resolve('👍').motionId, 'pulse');
  assert.equal(registry.resolve('👋').motionId, 'pulse');
  assert.equal(registry.resolve('🐶').motionId, 'shake');
  assert.equal(registry.resolve('👌').motionId, 'spin');
});
