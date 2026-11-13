import { JSDOM } from 'jsdom';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { compile } from 'svelte/compiler';
const dom = new JSDOM('<!doctype html><body><main></main></body>', { url: 'https://example.test' });
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'SVGElement', 'Text', 'Comment', 'Document']) globalThis[key] = key === 'window' ? dom.window : dom.window[key];
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
let played = 0;
dom.window.Element.prototype.animate = () => { played++; return { finished: new Promise(() => {}), cancel() {} }; };
const source = await readFile(new URL('../src/EmojiMotion.svelte', import.meta.url), 'utf8');
const code = compile(source, { filename: 'EmojiMotion.svelte', generate: 'client' }).js.code;
const file = new URL(`../src/.svelte-test-${process.pid}.mjs`, import.meta.url);
try {
  await writeFile(file, code);
  const { default: Component } = await import(file.href);
  const { mount, unmount, flushSync } = await import('svelte');
  const root = document.querySelector('main');
  const component = mount(Component, { target: root, props: { emoji: '👋', skinTone: 'dark', display: 'block' } });
  flushSync();
  const element = root.firstElementChild;
  element.dispatchEvent(new dom.window.Event('click'));
  if (element.textContent.trim() !== '👋🏿' || element.style.display !== 'block' || played !== 1) throw new Error('Svelte component failed to render or animate');
  await unmount(component);
} finally { await unlink(file); }
