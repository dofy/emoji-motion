import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEmojiMotion, emojiMotion } from '../src/index.js';

test('group defaults, per emoji overrides, and explicit variants resolve', () => {
  assert.equal(emojiMotion.resolve('👋🏽').motionId, 'wave');
  assert.equal(emojiMotion.resolve('👋🏽').canonical, '👋');
  assert.equal(emojiMotion.resolve('🔔').motionId, 'swing');
  assert.equal(emojiMotion.resolve('❤️').motionId, 'pulse');
  assert.equal(emojiMotion.resolve('❤').canonical, '❤️');
  assert.equal(emojiMotion.resolve('🦑').source, 'unicode');
});
test('custom registries are isolated and validate references', () => {
  const custom = createEmojiMotion({ defaults: false, motions: { wiggle: { keyframes: [{ transform: 'rotate(0deg)' }] } }, groups: { creatures: { label: 'Creatures', motion: 'wiggle' } }, emoji: { '🐙': { name: 'Octopus', group: 'creatures', variants: ['🐙️'] } } });
  assert.equal(custom.resolve('🐙️').motionId, 'wiggle');
  assert.equal(emojiMotion.resolve('🐙').source, 'unicode');
  assert.throws(() => createEmojiMotion({ emoji: { '🐙': { name: 'Octopus', group: 'missing' } } }), /Unknown group/);
  assert.throws(() => createEmojiMotion({ emoji: { '🐙': { name: 'Octopus', group: 'faces', variants: ['🐬'] }, '🐬': { name: 'Dolphin', group: 'nature' } } }), /Duplicate emoji variant/);
});
test('play cancels previous animation, respects reduced motion, and preserves host styles', () => {
  const animations = [];
  const el = { style: { transformOrigin: 'left' }, animate(frames, options) { const animation = { frames, options, cancel() { this.cancelled = true; } }; animations.push(animation); return animation; } };
  const first = emojiMotion.play(el, '👋');
  const second = emojiMotion.play(el, '👋', { animation: { duration: 100 } });
  assert.equal(first.cancelled, true); assert.equal(second.options.duration, 100);
  assert.equal(second.frames[0].transformOrigin, '70% 75%'); assert.equal(el.style.transformOrigin, 'left');
  const old = globalThis.matchMedia; globalThis.matchMedia = () => ({ matches: true });
  try { assert.equal(emojiMotion.play(el, '👋'), null); assert.ok(emojiMotion.play(el, '👋', { ignoreReducedMotion: true })); } finally { if (old) globalThis.matchMedia = old; else delete globalThis.matchMedia; }
});
test('bind attaches and cleans listeners and cancels its animation', () => {
  const trigger = new EventTarget(); let canceled = false; let calls = 0;
  const el = { animate() { calls++; return { cancel() { canceled = true; } }; } };
  const cleanup = emojiMotion.bind(el, '👋', { trigger });
  trigger.dispatchEvent(new Event('pointerenter')); assert.equal(calls, 1);
  cleanup(); assert.equal(canceled, true);
  trigger.dispatchEvent(new Event('focus')); assert.equal(calls, 1);
});

test('optional decorations use configurable positioning and clean up on replay and disposal', async () => {
  const instances = [];
  function node() { return { style: {}, children: [], setAttribute() {}, appendChild(child) { this.children.push(child); }, remove() { this.removed = true; }, animate() { const animation = { finished: new Promise(() => {}), cancel() { this.cancelled = true; } }; instances.push(animation); return animation; } }; }
  const container = node(); container.ownerDocument = { createElement: node, createElementNS: node };
  const glyph = node(); const trigger = new EventTarget();
  const cleanup = emojiMotion.bind(glyph, '📡', { trigger, events: ['click'], decoration: { container, anchor: { x: '75%', y: '25%' }, flipX: true, rotate: 15 } });
  trigger.dispatchEvent(new Event('click'));
  const root = container.children[0];
  assert.equal(root.style.left, '75%'); assert.equal(root.style.top, '25%');
  assert.equal(root.style.transform, 'scaleX(-1) rotate(15deg)'); assert.equal(root.children.length, 3);
  trigger.dispatchEvent(new Event('click')); assert.equal(root.removed, true);
  const second = container.children[1]; cleanup(); assert.equal(second.removed, true);
  assert.ok(instances.every(item => item.cancelled));
});

test('decorations are validated and skipped when no container or reduced motion is supplied', () => {
  assert.throws(() => createEmojiMotion({ emoji: { '🐙': { name: 'Octopus', group: 'faces', decoration: 'missing' } } }), /Unknown decoration/);
  let created = 0; const el = { animate() { return { cancel() {} }; } };
  const container = { ownerDocument: { createElement() { created++; } } };
  emojiMotion.play(el, '📡'); assert.equal(created, 0);
  const old = globalThis.matchMedia; globalThis.matchMedia = () => ({ matches: true });
  try { assert.equal(emojiMotion.play(el, '📡', { decoration: { container } }), null); assert.equal(created, 0); } finally { if (old) globalThis.matchMedia = old; else delete globalThis.matchMedia; }
});

test('custom SVG decoration creates its declared shapes', () => {
  const nodes = [];
  function makeNode(tag) { const value = { tag, style: {}, attrs: {}, children: [], setAttribute(key, val) { this.attrs[key] = val; }, appendChild(child) { this.children.push(child); }, remove() {}, animate() { return { finished: new Promise(() => {}), cancel() {} }; } }; nodes.push(value); return value; }
  const doc = { createElement: tag => makeNode(tag), createElementNS: (_ns, tag) => makeNode(tag) };
  const container = makeNode('container'); container.ownerDocument = doc;
  const custom = createEmojiMotion({ decorations: { star: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: { viewBox: '0 0 10 10', elements: [{ tag: 'circle', attrs: { r: '4', fill: 'gold' } }] }, style: {}, keyframes: [{ opacity: 1 }, { opacity: 0 }] }] } }, emoji: { '🌟': { name: 'Star', group: 'symbols', decoration: 'star' } } });
  custom.play(makeNode('glyph'), '🌟', { decoration: { container } });
  const svg = nodes.find(node => node.tag === 'svg');
  assert.equal(svg.attrs.viewBox, '0 0 10 10');
  assert.equal(svg.children[0].tag, 'circle');
  assert.equal(svg.children[0].attrs.fill, 'gold');
});

test('skin tone defaults, overrides, variants and unsupported glyphs', () => {
  const motion = createEmojiMotion({ defaultSkinTone: 'medium' });
  assert.equal(motion.resolve('👋').glyph, '👋🏽');
  assert.equal(motion.resolve('👋', { skinTone: 'dark' }).glyph, '👋🏿');
  assert.equal(motion.resolve('👋🏻').glyph, '👋🏻');
  assert.equal(motion.resolve('👋🏻', { skinTone: 'default' }).glyph, '👋');
  assert.equal(motion.resolve('😊').glyph, '😊');
  assert.equal(motion.resolve('❤').glyph, '❤');
  motion.setDefaultSkinTone('light');
  assert.equal(motion.getDefaultSkinTone(), 'light');
  assert.equal(motion.resolve('👍').glyph, '👍🏻');
  assert.throws(() => motion.setDefaultSkinTone('purple'), /Unknown skin tone/);
  assert.throws(() => createEmojiMotion({ defaultSkinTone: 'purple' }), /Unknown skin tone/);
});
