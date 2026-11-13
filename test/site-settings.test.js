import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const source = await readFile(new URL('../shared/settings.js', import.meta.url), 'utf8');

async function setup({ languages = ['en'], theme = null, dark = false } = {}) {
  const dom = new JSDOM('<!doctype html><html><head><title>Demo</title></head><body><header class="topbar"></header><p>Hello <code>emojiMotion.enhance()</code>.</p><pre><code>👋 code</code></pre></body></html>', { url: 'https://example.test/', runScripts: 'outside-only' });
  const { window } = dom;
  Object.defineProperty(window.navigator, 'languages', { value: languages });
  if (theme) window.localStorage.setItem('emoji-motion.theme', theme);
  let listener;
  const media = { matches: dark, addEventListener: (_name, callback) => { listener = callback; } };
  window.matchMedia = () => media;
  window.fetch = async () => ({ ok: true, json: async () => ({ '@Hello ZZX0XZ .': '你好 ZZX0XZ。', Language: '语言', Theme: '主题' }) });
  window.eval(source);
  await window.emojiSite.ready;
  await new Promise(resolve => setTimeout(resolve, 0));
  window.emojiSite.translate(window.document.body);
  return { window, media, change: () => listener?.() };
}

test('system locale is resolved and prose translation preserves code nodes', async () => {
  const { window } = await setup({ languages: ['zh-Hant-HK', 'en'] });
  assert.equal(window.document.documentElement.lang, 'zh-TW');
  assert.equal(window.document.querySelector('p').textContent, '你好 emojiMotion.enhance()。');
  assert.equal(window.document.querySelector('pre code').textContent, '👋 code');
  window.close();
});

test('auto theme follows system changes; explicit preference is retained', async () => {
  const auto = await setup({ dark: true });
  assert.equal(auto.window.document.documentElement.dataset.theme, 'dark');
  auto.media.matches = false; auto.change();
  assert.equal(auto.window.document.documentElement.dataset.theme, 'light');
  auto.window.close();
  const manual = await setup({ dark: true, theme: 'light' });
  assert.equal(manual.window.document.documentElement.dataset.theme, 'light');
  manual.media.matches = true; manual.change();
  assert.equal(manual.window.document.documentElement.dataset.theme, 'light');
  manual.window.close();
});

test('settings expose a dismissible language menu and animated, persistent theme buttons', async () => {
  const { window, media, change } = await setup({ dark: true });
  const { document } = window;
  const menu = document.querySelector('.language-menu');
  const summary = menu.querySelector('summary');
  assert.equal(summary.getAttribute('aria-label'), 'Language');
  menu.open = true;
  menu.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(menu.open, false);
  assert.equal(document.activeElement, summary);
  const calls = [];
  await window.emojiSite.animateControls({ bind: (element, glyph, options) => calls.push({ element, glyph, options }) });
  assert.deepEqual(calls.map(call => call.glyph), ['🌍', '🖥️', '☀️', '🌙']);
  assert.ok(calls.every(call => call.options.events.includes('pointerenter') && call.options.events.includes('click')));
  const light = document.querySelector('.theme-option[data-theme="light"]');
  light.click();
  assert.equal(window.localStorage.getItem('emoji-motion.theme'), 'light');
  assert.equal(document.documentElement.dataset.theme, 'light');
  assert.equal(light.getAttribute('aria-pressed'), 'true');
  assert.equal(document.querySelectorAll('.theme-option[aria-pressed="true"]').length, 1);
  document.querySelector('.theme-option[data-theme="auto"]').click();
  assert.equal(document.documentElement.dataset.theme, 'dark');
  media.matches = false; change();
  assert.equal(document.documentElement.dataset.theme, 'light');
  window.close();
});
