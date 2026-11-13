import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createEmojiMotion } from '../src/index.js';
import { emojiMotion as lite } from '../src/lite.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

test('enhance preserves text and emoji sequences, skips protected areas, and cleans up', async () => {
  const dom = new JSDOM('<body><main id="content">Hello 👋🏽 🇨🇳 👩🏽‍🚀! <code>👋</code><span data-emoji-motion="component">❤️</span><span data-emoji-motion-ignore>🐶</span><span contenteditable="true">👋</span></main></body>');
  const previous = globalThis.document; globalThis.document = dom.window.document;
  try {
    const root = document.querySelector('main');
    const original = root.textContent;
    const motion = createEmojiMotion({ defaultSkinTone: 'dark', emoji: { '👋🏽': { name: 'custom wave', group: 'gestures', motion: 'pulse' } } });
    const controller = motion.enhance({ root: '#content' });
    assert.equal(root.textContent, original);
    assert.deepEqual([...root.querySelectorAll('[data-emoji-motion="enhanced"]')].map(el => el.textContent), ['👋🏽', '🇨🇳', '👩🏽‍🚀']);
    assert.equal(root.querySelector('code').querySelector('[data-emoji-motion]'), null);
    const second = motion.enhance({ root });
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 3);
    second.cleanup();
    const appended = document.createElement('p'); appended.textContent = 'New 🐶'; root.append(appended);
    await tick();
    assert.equal(appended.querySelector('[data-emoji-motion="enhanced"]').textContent, '🐶');
    appended.append(document.createTextNode(' ✨')); await tick();
    assert.equal(appended.querySelectorAll('[data-emoji-motion="enhanced"]').length, 2);
    controller.cleanup(); controller.cleanup();
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 0);
    assert.equal(root.textContent, original + 'New 🐶 ✨');
    appended.append(' 👋'); await tick();
    assert.equal(appended.querySelectorAll('[data-emoji-motion="enhanced"]').length, 0);
  } finally { globalThis.document = previous; dom.window.close(); }
});

test('enhance supports lite, exclusions and disabled observation', async () => {
  const dom = new JSDOM('<body><div id="root"><p>👋 🐶</p><p class="skip">👋</p></div></body>');
  const previous = globalThis.document; globalThis.document = dom.window.document;
  try {
    const root = document.querySelector('#root');
    const controller = lite.enhance({ root, exclude: '.skip', observe: false });
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 1);
    root.append(' 👋'); await tick();
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 1);
    controller.cleanup();
    assert.throws(() => lite.enhance({ root: '#missing' }), /root/);
  } finally { globalThis.document = previous; dom.window.close(); }
});

test('enhancer can disable, rescan changed content and re-enable without duplicate listeners', async () => {
  const dom = new JSDOM('<body><main>Hi 👋🏽 <code>🐶</code></main></body>');
  const previous = globalThis.document; globalThis.document = dom.window.document;
  let calls = 0; let cancelled = 0;
  dom.window.Element.prototype.animate = () => { calls++; return { finished: new Promise(() => {}), cancel() { cancelled++; } }; };
  try {
    const root = document.querySelector('main');
    const enhancer = createEmojiMotion().enhance({ root });
    root.querySelector('[data-emoji-motion="enhanced"] > span').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    assert.equal(calls, 1);
    enhancer.disable(); enhancer.disable();
    assert.equal(cancelled, 1);
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 0);
    const paragraph = document.createElement('p'); paragraph.textContent = 'New 👩🏽‍🚀'; root.append(paragraph);
    await tick(); assert.equal(paragraph.querySelector('[data-emoji-motion]'), null);
    enhancer.enable(); enhancer.enable();
    assert.deepEqual([...root.querySelectorAll('[data-emoji-motion="enhanced"]')].map(node => node.textContent), ['👋🏽', '👩🏽‍🚀']);
    assert.equal(root.querySelector('code').textContent, '🐶');
    paragraph.querySelector('[data-emoji-motion="enhanced"] > span').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    assert.equal(calls, 2);
    paragraph.append(' ✨'); await tick();
    assert.equal(paragraph.querySelectorAll('[data-emoji-motion="enhanced"]').length, 2);
    enhancer.cleanup(); enhancer.cleanup(); enhancer.disable();
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 0);
    assert.throws(() => enhancer.enable(), /cleaned up/);
  } finally { globalThis.document = previous; dom.window.close(); }
});

test('enable rescans even when ongoing observation is disabled', async () => {
  const dom = new JSDOM('<body><main>👋</main></body>');
  const previous = globalThis.document; globalThis.document = dom.window.document;
  try {
    const root = document.querySelector('main');
    const enhancer = createEmojiMotion().enhance({ root, observe: false });
    enhancer.disable(); root.append(' 🐶'); enhancer.enable();
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 2);
    root.append(' ✨'); await tick();
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 2);
    enhancer.cleanup();
  } finally { globalThis.document = previous; dom.window.close(); }
});

test('enabled false defers scanning and observation until explicitly enabled', async () => {
  const dom = new JSDOM('<body><main>Hello 👋🏽</main></body>');
  const previous = globalThis.document; globalThis.document = dom.window.document;
  try {
    const root = document.querySelector('main');
    const enhancer = createEmojiMotion().enhance({ root, enabled: false });
    assert.equal(root.querySelector('[data-emoji-motion]'), null);
    root.append(' 🐶'); await tick();
    assert.equal(root.querySelector('[data-emoji-motion]'), null);
    enhancer.enable();
    assert.deepEqual([...root.querySelectorAll('[data-emoji-motion="enhanced"]')].map(node => node.textContent), ['👋🏽', '🐶']);
    root.append(' ✨'); await tick();
    assert.equal(root.querySelectorAll('[data-emoji-motion="enhanced"]').length, 3);
    enhancer.cleanup();
    const neverStarted = lite.enhance({ root, enabled: false });
    neverStarted.cleanup(); neverStarted.cleanup();
    assert.throws(() => neverStarted.enable(), /cleaned up/);
    assert.equal(root.querySelector('[data-emoji-motion]'), null);
  } finally { globalThis.document = previous; dom.window.close(); }
});
