import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emojiMotion, createEmojiMotion, unicodeVersion } from '../src/index.js';
import { emojiMotion as lite, createEmojiMotion as createLite } from '../src/lite.js';
import { subgroups } from '../src/unicode-data.js';
import { lookupUnicode } from '../src/unicode.js';
import { emoji as presets, families } from '../src/presets.js';

test('family members and declared skin tone aliases match Unicode', () => {
  for (const [id, family] of Object.entries(families)) {
    for (const glyph of family.members) assert.ok(lookupUnicode(glyph), `${id}: ${glyph}`);
    for (const [variant, base] of Object.entries(family.aliases ?? {})) {
      assert.equal(lookupUnicode(variant)?.canonical, base, `${id}: ${variant}`);
      assert.equal(emojiMotion.resolve(variant)?.canonical, base);
      assert.equal(lite.resolve(variant)?.canonical, base);
    }
  }
});

test('reviewed role and walking families preserve official variants and user overrides', () => {
  for (const id of ['professionals', 'walkers']) {
    const family = families[id];
    for (const base of family.members) {
      const official = lookupUnicode(base);
      assert.equal(emojiMotion.resolve(base).familyId, id);
      assert.equal(lite.resolve(base).familyId, id);
      for (const [tone, variant] of Object.entries(official.skinTones)) {
        assert.equal(emojiMotion.resolve(base, { skinTone: tone }).glyph, variant, `${base}: ${tone}`);
        assert.equal(lite.resolve(base, { skinTone: tone }).glyph, variant, `${base}: ${tone} lite`);
        assert.equal(lite.resolve(variant, { skinTone: 'default' }).glyph, base);
      }
    }
  }
  const override = createEmojiMotion({
    classifications: { subgroups: { 'person-role': { group: 'hearts', motion: 'pulse' } } },
    emoji: { '👩‍⚕️': { name: 'My doctor', group: 'faces', motion: 'spin' } }
  });
  assert.equal(override.resolve('👩🏽‍⚕️').source, 'user');
  assert.equal(override.resolve('👨🏽‍⚕️').source, 'user-classification');
  assert.equal(override.resolve('👩🏽‍⚕️').glyph, '👩🏽‍⚕️');
});

test('new person and gesture presets use official complete skin tone sequences', () => {
  const glyphs = ['✌️', '🤟', '👊', '🤜', '🤛', '🫰', '🙋', '🧘', '🏃', '🤸', '🏊', '🏄', '🧑‍🍳', '🧑‍🎨', '🧑‍🚀', '🧑‍💻'];
  for (const glyph of glyphs) {
    const entry = presets[glyph];
    const official = lookupUnicode(glyph);
    for (const [tone, variant] of Object.entries(entry.skinTones)) {
      assert.equal(official.skinTones[tone], variant, `${glyph}: ${tone}`);
      assert.equal(emojiMotion.resolve(glyph, { skinTone: tone }).glyph, variant);
      assert.equal(lite.resolve(variant)?.canonical, glyph);
    }
  }
});

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
  for (const [glyph, group, subgroup, motion] of [['🐷', 'nature', 'animal-mammal', 'bounce'], ['🍔', 'food', 'food-prepared', 'bounce'], ['🇨🇳', 'flags', 'country-flag', 'float'], ['👩🏽‍🚀', 'people', 'person-role', 'bounce']]) {
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
  assert.equal(lite.resolve('🐷'), undefined);
  assert.throws(() => createLite({ autoDetect: true }), /not included/);
  assert.equal(createEmojiMotion({ autoDetect: false }).resolve('🐷'), undefined);
  assert.equal(createEmojiMotion({ defaults: false }).resolve('🐷'), undefined);
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

test('new motion families preserve presentation variants and user overrides', () => {
  for (const [glyph, family, motion, effect] of [
    ['🍊', 'fruit', 'fruitBounce', true], ['🐶', 'animalFaces', 'curiousTilt', false],
    ['🌤️', 'clouds', 'cloudDrift', false], ['🪐', 'celestial', 'orbitFloat', false],
    ['✏️', 'writingTools', 'writingTilt', false],
  ]) {
    for (const registry of [emojiMotion, lite]) {
      const result = registry.resolve(glyph);
      assert.equal(result.source, 'family', glyph);
      assert.equal(result.familyId, family, glyph);
      assert.equal(result.motionId, motion, glyph);
      assert.equal(Boolean(result.decorationPreset), effect, glyph);
      assert.equal(result.glyph, glyph, glyph);
    }
  }
  for (const [variant, canonical, family] of [['✏', '✏️', 'writingTools'], ['🌦', '🌦️', 'clouds']]) {
    for (const registry of [emojiMotion, lite]) {
      const result = registry.resolve(variant);
      assert.equal(result.familyId, family);
      assert.equal(result.canonical, canonical);
      assert.equal(result.glyph, variant);
    }
  }
  const custom = createEmojiMotion({
    classifications: { subgroups: { 'food-fruit': { group: 'hearts', motion: 'pulse' } } },
    emoji: { '🐶': { group: 'objects', name: 'My dog', motion: 'spin' } },
  });
  assert.equal(custom.resolve('🍊').source, 'user-classification');
  assert.equal(custom.resolve('🍊').motionId, 'pulse');
  assert.equal(custom.resolve('🐶').source, 'user');
  assert.equal(custom.resolve('🐶').motionId, 'spin');
});

test('new professions preserve official gender and skin tone sequences', () => {
  for (const base of ['👩‍⚖️', '👨‍⚖️', '🧑‍✈️', '👨‍✈️', '👩‍🎤', '🧑‍🎤']) {
    const official = lookupUnicode(base);
    assert.equal(emojiMotion.resolve(base).familyId, 'professionals');
    for (const [tone, variant] of Object.entries(official.skinTones)) {
      for (const registry of [emojiMotion, lite]) {
        const result = registry.resolve(variant);
        assert.equal(result.familyId, 'professionals');
        assert.equal(result.glyph, variant);
        assert.equal(result.skinTone, tone);
      }
    }
  }
});
