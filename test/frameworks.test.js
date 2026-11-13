import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.test' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.Node = dom.window.Node;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let animations = [];
dom.window.Element.prototype.animate = function () { const a = { finished: new Promise(() => {}), cancel() { this.cancelled = true; } }; animations.push(a); return a; };
const React = await import('react');
const { createRoot } = await import('react-dom/client');
const { renderToString } = await import('react-dom/server');
const { EmojiMotion: ReactEmoji } = await import('../src/react.js');
const Vue = await import('vue');
const { EmojiMotion: VueEmoji } = await import('../src/vue.js');

test('React component renders skin tones, reacts to events and cleans up on unmount', async () => {
  const el = document.createElement('div'); document.body.append(el); const root = createRoot(el); animations = [];
  await React.act(() => root.render(React.createElement(ReactEmoji, { emoji: '👋', skinTone: 'dark' })));
  assert.equal(el.textContent, '👋🏿'); const wrapper = el.firstChild;
  wrapper.dispatchEvent(new dom.window.Event('click')); assert.equal(animations.length, 1);
  await React.act(() => root.render(React.createElement(ReactEmoji, { emoji: '❤️' })));
  assert.equal(animations[0].cancelled, true); assert.equal(el.textContent, '❤️');
  await React.act(() => root.unmount()); el.remove();
  assert.match(renderToString(React.createElement(ReactEmoji, { emoji: '👋' })), /Waving hand/);
});

test('Vue component renders skin tones, animates and cleans up on unmount', async () => {
  const el = document.createElement('div'); document.body.append(el); animations = [];
  const current = Vue.ref('light'); const app = Vue.createApp({ setup: () => () => Vue.h(VueEmoji, { emoji: '👋', skinTone: current.value }) });
  app.mount(el); await Vue.nextTick(); assert.equal(el.textContent, '👋🏻');
  el.firstChild.dispatchEvent(new dom.window.Event('click')); assert.equal(animations.length, 1);
  current.value = 'dark'; await Vue.nextTick(); assert.equal(el.textContent, '👋🏿'); assert.equal(animations[0].cancelled, true);
  el.firstChild.dispatchEvent(new dom.window.Event('click')); assert.equal(animations.length, 2);
  app.unmount(); assert.equal(animations[1].cancelled, true); el.remove();
});

test('Svelte action updates glyph and cleans up listeners', async () => {
  const { animateEmoji } = await import('../src/svelte.js'); animations = [];
  const glyph = document.createElement('span'); const action = animateEmoji(glyph, { emoji: '👋', skinTone: 'medium' });
  assert.equal(glyph.textContent, '👋🏽'); glyph.dispatchEvent(new dom.window.Event('click')); assert.equal(animations.length, 1);
  action.update({ emoji: '❤️' }); assert.equal(animations[0].cancelled, true); assert.equal(glyph.textContent, '❤️');
  glyph.dispatchEvent(new dom.window.Event('click')); assert.equal(animations.length, 2); action.destroy(); assert.equal(animations[1].cancelled, true);
});

test('React and Vue components support block layout and decorations', async () => {
  const reactEl = document.createElement('div'); document.body.append(reactEl); const root = createRoot(reactEl); animations = [];
  await React.act(() => root.render(React.createElement(ReactEmoji, { emoji: '📡', display: 'block' })));
  assert.equal(reactEl.firstChild.style.display, 'block'); reactEl.firstChild.dispatchEvent(new dom.window.Event('click'));
  assert.equal(reactEl.querySelectorAll('svg').length, 3); await React.act(() => root.unmount()); reactEl.remove();
  const vueEl = document.createElement('div'); document.body.append(vueEl); const app = Vue.createApp({ render: () => Vue.h(VueEmoji, { emoji: '📡', display: 'block' }) });
  app.mount(vueEl); await Vue.nextTick(); assert.equal(vueEl.firstChild.style.display, 'block'); vueEl.firstChild.dispatchEvent(new dom.window.Event('click'));
  assert.equal(vueEl.querySelectorAll('svg').length, 3); app.unmount(); vueEl.remove();
});

test('web component registers, updates attributes and disposes decorations', async () => {
  globalThis.customElements = dom.window.customElements;
  await import('../src/element.js');
  const el = document.createElement('emoji-motion'); el.setAttribute('emoji', '📡'); el.setAttribute('display', 'block'); document.body.append(el);
  assert.equal(el.style.display, 'block'); el.dispatchEvent(new dom.window.Event('click')); assert.equal(el.querySelectorAll('svg').length, 3);
  el.setAttribute('emoji', '👋'); el.setAttribute('skin-tone', 'dark'); assert.equal(el.textContent, '👋🏿'); assert.equal(el.querySelectorAll('svg').length, 0);
  el.setAttribute('display', 'inline'); assert.equal(el.style.display, 'inline-block'); el.remove();
});

test('Svelte component compiles for client and server rendering', async () => {
  const { readFile } = await import('node:fs/promises');
  const { compile } = await import('svelte/compiler');
  const source = await readFile(new URL('../src/EmojiMotion.svelte', import.meta.url), 'utf8');
  for (const generate of ['client', 'server']) {
    const result = compile(source, { filename: 'EmojiMotion.svelte', generate });
    assert.ok(result.js.code.length > 0);
  }
});

test('Svelte component mounts and animates in a DOM', async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, ['--conditions=browser', new URL('../scripts/svelte-client-check.mjs', import.meta.url).pathname], { stdio: 'pipe' });
});

test('Svelte 4 compiles the component for browser and SSR', async () => {
  const { readFile } = await import('node:fs/promises');
  const { compile } = await import('svelte4/compiler');
  const source = await readFile(new URL('../src/EmojiMotion.svelte', import.meta.url), 'utf8');
  for (const generate of ['dom', 'ssr']) assert.ok(compile(source, { filename: 'EmojiMotion.svelte', generate }).js.code.length > 0);
});

test('React and Vue can animate from an external trigger', async () => {
  const reactEl = document.createElement('div'); document.body.append(reactEl); const root = createRoot(reactEl); animations = [];
  function Parent() { const trigger = React.useRef(null); return React.createElement('button', { ref: trigger }, React.createElement(ReactEmoji, { emoji: '👋', triggerRef: trigger })); }
  await React.act(() => root.render(React.createElement(Parent))); reactEl.querySelector('button').dispatchEvent(new dom.window.Event('click'));
  assert.equal(animations.length, 1); await React.act(() => root.unmount()); reactEl.remove();
  const vueEl = document.createElement('div'); document.body.append(vueEl); animations = [];
  const app = Vue.createApp({ setup() { const target = Vue.ref(null); return () => Vue.h('button', { ref: target }, [Vue.h(VueEmoji, { emoji: '👋', trigger: target.value })]); } });
  app.mount(vueEl); await Vue.nextTick(); await Vue.nextTick(); vueEl.querySelector('button').dispatchEvent(new dom.window.Event('click'));
  assert.equal(animations.length, 1); app.unmount(); vueEl.remove();
});
