import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEmojiMotion, emojiMotion, createSpringMotion, createSwayMotion } from '../src/index.js';
import { emojiMotion as liteMotion } from '../src/lite.js';

test('motion families resolve reviewed members and preserve user priority', () => {
  for (const [glyph, family] of [['🥎', 'balls'], ['🌷', 'plants'], ['🧋', 'drinks'], ['🦜', 'flying'], ['🧎', 'poses']]) {
    assert.equal(emojiMotion.resolve(glyph).source, 'family');
    assert.equal(emojiMotion.resolve(glyph).familyId, family);
    assert.equal(liteMotion.resolve(glyph).familyId, family);
  }
  assert.equal(emojiMotion.resolve('🏀').source, 'preset');
  assert.equal(emojiMotion.resolve('🥎').motion.options.duration, 900);
  assert.ok(emojiMotion.resolve('🥎').decorationPreset);
  assert.equal(emojiMotion.resolve('🧎', { skinTone: 'dark' }).glyph, '🧎🏿');
  assert.equal(liteMotion.resolve('🧎🏽').familyId, 'poses');
  assert.equal(liteMotion.resolve('🧎', { skinTone: 'light' }).glyph, '🧎🏻');
  const custom = createEmojiMotion({ families: { mine: { label: 'Mine', group: 'hearts', motion: 'pulse', members: ['🥎', '🏀'] } } });
  assert.equal(custom.resolve('🥎').familyId, 'mine');
  assert.equal(custom.resolve('🏀').familyId, 'mine');
  assert.equal(createEmojiMotion({ ...{ families: { mine: { label: 'Mine', group: 'hearts', motion: 'pulse', members: ['🥎'] } } }, emoji: { '🥎': { name: 'Mine', group: 'faces', motion: 'shake' } } }).resolve('🥎').source, 'user');
  assert.equal(createEmojiMotion({ classifications: { subgroups: { sport: { group: 'hearts', motion: 'pulse' } } } }).resolve('🥎').source, 'user-classification');
  assert.equal(createEmojiMotion({ groups: { activities: { label: 'Activities', motion: 'spin' } } }).resolve('🥎').motionId, 'spin');
  assert.equal(createEmojiMotion({ groups: { hearts: { label: 'Hearts', motion: 'spin' } }, families: { mine: { label: 'Mine', group: 'hearts', motion: 'pulse', members: ['🥎'] } } }).resolve('🥎').motionId, 'pulse');
  assert.equal(createEmojiMotion({ families: { balls: { label: 'My balls', group: 'activities', motion: 'spin', members: ['🏀'] } } }).resolve('🥎').source, 'unicode');
  assert.throws(() => createEmojiMotion({ families: { invalid: { label: 'Bad', group: 'nature', motion: 'missing', members: ['🐙'] } } }), /Unknown motion/);
  assert.throws(() => createEmojiMotion({ families: { invalid: { label: 'Bad', group: 'nature', motion: 'bounce', members: ['🐙'], aliases: { '🐙️': '🐬' } } } }), /Unknown family member/);
});
test('motion builders apply bounded parameters and can power custom families', () => {
  const spring = createSpringMotion({ height: 35, rebounds: 2, duration: 1100 });
  assert.ok(spring.keyframes.some(frame => frame.transform.includes('-35%')));
  assert.equal(spring.options.duration, 1100);
  const sway = createSwayMotion({ angle: 12 });
  assert.ok(sway.keyframes.some(frame => frame.transform === 'rotate(12deg)'));
  assert.throws(() => createSpringMotion({ height: 100 }), RangeError);
  assert.throws(() => createSpringMotion({ rebounds: 1.5 }), RangeError);
  assert.throws(() => createSwayMotion({ angle: NaN }), RangeError);
  const registry = createEmojiMotion({ motions: { mySpring: spring }, families: { mine: { label: 'Mine', group: 'nature', motion: 'mySpring', members: ['🦑'], animation: { duration: 700 } } } });
  assert.equal(registry.resolve('🦑').motion.options.duration, 700);
  assert.ok(registry.resolve('🦑').motion.keyframes.some(frame => frame.transform.includes('-35%')));
});
test('composed family effects retain their own anchors and clean up', () => {
  function node() { return { style: {}, children: [], setAttribute() {}, appendChild(child) { this.children.push(child); }, remove() { this.removed = true; }, animate() { return { finished: new Promise(() => {}), cancel() {} }; } }; }
  const effect = x => ({ anchor: { x, y: '50%' }, layers: [{ style: {}, keyframes: [{ opacity: 0 }, { opacity: 1 }] }] });
  const custom = createEmojiMotion({ decorations: { first: effect('20%'), second: effect('80%') }, families: { mine: { label: 'Mine', group: 'nature', motion: 'bounce', members: ['🦑'], decorations: ['first', 'second'] } } });
  const container = node(); container.ownerDocument = { createElement: node, createElementNS: node };
  const trigger = new EventTarget(); const cleanup = custom.bind(node(), '🦑', { trigger, events: ['click'], decoration: { container } });
  trigger.dispatchEvent(new Event('click'));
  assert.deepEqual(container.children.map(root => root.style.left), ['20%', '80%']);
  cleanup(); assert.ok(container.children.every(root => root.removed));
  assert.throws(() => createEmojiMotion({ families: { bad: { label: 'Bad', group: 'nature', motion: 'bounce', members: ['🦑'], decorations: ['unknown'] } } }), /Unknown decoration/);
});

test('group defaults, per emoji overrides, and explicit variants resolve', () => {
  assert.equal(emojiMotion.resolve('👋🏽').motionId, 'wave');
  assert.equal(emojiMotion.resolve('👋🏽').canonical, '👋');
  assert.equal(emojiMotion.resolve('🔔').motionId, 'swing');
  assert.equal(emojiMotion.resolve('❤️').motionId, 'pulse');
  assert.equal(emojiMotion.resolve('❤').canonical, '❤️');
  assert.equal(emojiMotion.resolve('🦑').source, 'unicode');
});
test('new diverse presets expose their motion, effects, variants, and skin tones', () => {
  for (const [glyph, group, motion] of [['🐰', 'nature', 'hop'], ['🦋', 'nature', 'flutter'], ['🌱', 'nature', 'sway'], ['☕', 'food', 'sip'], ['🏀', 'activities', 'hop'], ['💃', 'people', 'twirl'], ['⏳', 'objects', 'hourglassTurn']]) {
    const result = emojiMotion.resolve(glyph);
    assert.equal(result.source, 'preset'); assert.equal(result.groupId, group); assert.equal(result.motionId, motion);
  }
  assert.ok(emojiMotion.resolve('☕').decorationPreset);
  assert.equal(emojiMotion.resolve('🌧').canonical, '🌧️');
  assert.ok(emojiMotion.resolve('🌧️').decorationPreset);
  assert.equal(emojiMotion.resolve('💃', { skinTone: 'dark' }).glyph, '💃🏿');
  assert.equal(emojiMotion.resolve('🕺🏽').motionId, 'twirl');
});
test('light sources use centered effects without depending on glyph direction', () => {
  for (const [glyph, effect] of [['💡', 'glow'], ['📷', 'flash'], ['🔦', 'flash'], ['🕯️', 'flicker'], ['📸', 'flash'], ['🪔', 'flicker'], ['🚨', 'alertLight'], ['🔅', 'glow'], ['🔆', 'glow'], ['🌞', 'glow'], ['⚡', 'flash'], ['🔥', 'flicker'], ['☀️', 'glow']]) {
    const result = emojiMotion.resolve(glyph);
    assert.equal(result.decoration, effect);
    assert.deepEqual(result.decorationPreset.anchor, { x: '50%', y: '50%' });
    assert.equal(result.decorationPreset.layers[0].svg.elements[0].tag, 'path');
  }
  assert.equal(emojiMotion.resolve('🕯').decoration, 'flicker');
  assert.equal(emojiMotion.resolve('☀').decoration, 'glow');
  for (const glyph of ['🌟', '🎆', '🎇', '🔮', '💎', '🪩', '🌠']) assert.equal(emojiMotion.resolve(glyph).decoration, 'sparkle');
});
test('rides, dice, and upright objects use appropriate motion', () => {
  const wheel = emojiMotion.resolve('🎡');
  assert.equal(wheel.motionId, 'steady');
  assert.ok(wheel.motion.keyframes.every(frame => !frame.transform.includes('rotate')));
  assert.ok(emojiMotion.resolve('🎠').motion.keyframes.some(frame => frame.transform.includes('rotateY(')));
  assert.ok(emojiMotion.resolve('🪙').motion.keyframes.some(frame => frame.transform.includes('rotateY(360deg)')));
  assert.equal(emojiMotion.resolve('🎲').motionId, 'toss');
  assert.ok(emojiMotion.resolve('🎲').motion.keyframes.some(frame => frame.transform.includes('rotate(360deg)')));
  assert.equal(emojiMotion.resolve('🌻').motion.origin, '50% 90%');
  assert.equal(emojiMotion.resolve('🧭').motionId, 'wobble');
  assert.equal(emojiMotion.resolve('🕯️').motionId, 'steady');
  assert.ok(emojiMotion.resolve('⏳').motion.keyframes.some(frame => frame.transform === 'rotate(180deg)'));
});
test('rhythm motions are assigned and return to rest', () => {
  for (const [glyph, motion] of [['🎲', 'toss'], ['🔢', 'toss'], ['🤸', 'somersault'], ['⏰', 'alarmRing'], ['☎️', 'alarmRing'], ['🛎', 'alarmRing'], ['🫣', 'peek'], ['🐢', 'peek'], ['🔨', 'slam']]) {
    const result = emojiMotion.resolve(glyph);
    assert.equal(result.motionId, motion, glyph);
    const frames = result.motion.keyframes; const last = frames.at(-1);
    assert.ok(!/translateY\((?!0\))/.test(frames[0].transform + last.transform), `${motion} starts and ends level`);
    assert.ok(/rotate\((0|360|-360)deg\)/.test(last.transform), `${motion} ends upright`);
    if ('opacity' in last) assert.equal(last.opacity, 1);
  }
  assert.equal(emojiMotion.resolve('🔨').decoration, 'impact');
});

test('custom registries are isolated and validate references', () => {
  const custom = createEmojiMotion({ defaults: false, motions: { wiggle: { keyframes: [{ transform: 'rotate(0deg)' }] } }, groups: { creatures: { label: 'Creatures', motion: 'wiggle' } }, emoji: { '🐙': { name: 'Octopus', group: 'creatures', variants: ['🐙️'] } } });
  assert.equal(custom.resolve('🐙️').motionId, 'wiggle');
  assert.equal(emojiMotion.resolve('🐙').motionId, 'twirl');
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

test('bind ignores touch hover, mouse focus and rapid repeats', () => {
  const trigger = new EventTarget(); let calls = 0; let now = 1000;
  const realNow = performance.now; performance.now = () => now;
  try {
    const el = { animate() { calls++; return { cancel() {} }; } };
    const cleanup = emojiMotion.bind(el, '👋', { trigger, events: ['pointerenter', 'focus', 'click'] });
    const touch = new Event('pointerenter'); touch.pointerType = 'touch'; trigger.dispatchEvent(touch); assert.equal(calls, 0);
    trigger.dispatchEvent(new Event('click')); assert.equal(calls, 1);
    now += 100; trigger.dispatchEvent(new Event('click')); assert.equal(calls, 1);
    now += 300; trigger.dispatchEvent(new Event('click')); assert.equal(calls, 2);
    now += 300; const focus = new Event('focus'); Object.defineProperty(focus, 'target', { value: { matches: selector => selector !== ':focus-visible' } }); trigger.dispatchEvent(focus); assert.equal(calls, 2);
    const keyboard = new Event('focus'); Object.defineProperty(keyboard, 'target', { value: { matches: () => true } }); trigger.dispatchEvent(keyboard); assert.equal(calls, 3);
    cleanup();
  } finally { performance.now = realNow; }
});

test('optional decorations use configurable positioning and clean up on replay and disposal', async () => {
  const instances = [];
  function node() { return { style: {}, children: [], setAttribute() {}, appendChild(child) { this.children.push(child); }, remove() { this.removed = true; }, animate() { const animation = { finished: new Promise(() => {}), cancel() { this.cancelled = true; } }; instances.push(animation); return animation; } }; }
  const container = node(); container.ownerDocument = { createElement: node, createElementNS: node };
  const glyph = node(); const trigger = new EventTarget();
  const cleanup = emojiMotion.bind(glyph, '📡', { trigger, events: ['click'], cooldown: 0, decoration: { container, anchor: { x: '75%', y: '25%' }, flipX: true, rotate: 15 } });
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

test('themed decoration colors keep a fallback and behind layers sit under the glyph', () => {
  const made = [];
  function node() { const item = { style: {}, attrs: {}, children: [], setAttribute(key, value) { this.attrs[key] = value; }, appendChild(child) { this.children.push(child); }, append(child) { this.children.push(child); }, remove() {}, animate() { return { finished: new Promise(() => {}), cancel() {} }; } }; made.push(item); return item; }
  const container = node(); container.ownerDocument = { createElement: node, createElementNS: node };
  emojiMotion.play(node(), '🛶', { ignoreReducedMotion: true, decoration: { container } });
  const layer = container.children[0].children[0];
  assert.equal(layer.style.zIndex, '-1');
  const ring = layer.children[0];
  assert.equal(ring.attrs.stroke, '#7cafd0');
  assert.equal(ring.style.stroke, 'var(--emoji-motion-water, #7cafd0)');
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
