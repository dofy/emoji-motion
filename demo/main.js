import { emojiMotion } from '../src/index.js';
import '../src/element.js';
const heroWave = document.querySelector('.hero-wave');
const heroGlyph = heroWave.querySelector('.art-main');
emojiMotion.bind(heroGlyph, '👋', { trigger: heroWave, events: ['pointerenter', 'focus', 'click'] });
// Play once when the artwork enters view, including when it starts below the fold on mobile.
if ('IntersectionObserver' in globalThis) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); emojiMotion.play(heroGlyph, '👋'); }
  }, { threshold: 0.25 });
  observer.observe(heroWave);
} else emojiMotion.play(heroGlyph, '👋');
const grid = document.querySelector('#grid');
const filters = document.querySelector('#filters');
const count = document.querySelector('#count');
const skinTone = document.querySelector('#skin-tone');
const framework = document.querySelector('#framework');
const frameworkSelectors = document.querySelectorAll('[data-framework]');
const displayMode = document.querySelector('#display-mode');
const autoInput = document.querySelector('#auto-emoji');
const autoPreview = document.querySelector('#auto-preview');
const autoResult = document.querySelector('#auto-result');
skinTone.addEventListener('change', () => { emojiMotion.setDefaultSkinTone(skinTone.value); render(); updateAutoPreview(); });
const all = emojiMotion.list();
// Curated examples live in the demo, not the library's complete registry.
const featured = ['👋', '😊', '❤️', '🔔', '🌸', '🚀', '✨', '📡', '🔍', '🚲', '🔥', '🎵'];
let cleanups = [];
let selected = 'featured';
const palette = ['peach', 'lilac', 'yellow', 'mint', 'blue', 'pink'];
function render() {
  cleanups.forEach(cleanup => cleanup()); cleanups = []; grid.replaceChildren();
  const shown = selected === 'featured'
    ? featured.filter(glyph => emojiMotion.resolve(glyph))
    : all.filter(glyph => selected === 'all' || (selected === 'effects' ? Boolean(emojiMotion.resolve(glyph).decorationPreset) : emojiMotion.resolve(glyph).groupId === selected));
  count.textContent = `${String(shown.length).padStart(2, '0')} LITTLE MOVEMENTS`;
  for (const [index, glyph] of shown.entries()) {
    const item = emojiMotion.resolve(glyph);
    const button = document.createElement('button');
    button.className = `emoji-card ${palette[all.indexOf(glyph) % palette.length]}`;
    button.type = 'button'; button.setAttribute('aria-label', `${item.name}, preview and copy component`);
    const number = document.createElement('span'); number.className = 'card-number'; number.textContent = String(index + 1).padStart(2, '0');
    const arrow = document.createElement('span'); arrow.className = 'card-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    const stage = document.createElement('span'); stage.className = 'emoji-stage';
    const visual = document.createElement('span'); visual.className = 'emoji-visual';
    const glyphEl = document.createElement('span'); glyphEl.className = 'glyph'; glyphEl.textContent = item.glyph; glyphEl.setAttribute('aria-hidden','true'); visual.append(glyphEl); stage.append(visual);
    const bottom = document.createElement('span'); bottom.className = 'card-bottom';
    const name = document.createElement('span'); name.textContent = item.name;
    const group = document.createElement('span'); group.textContent = item.group.label;
    bottom.append(name, group); button.append(number, arrow, stage, bottom); grid.append(button);
    button.addEventListener('click', async () => {
      const copied = await copyText(markupFor(item), document.querySelector('#copy-status'), document.querySelector('#copy-fallback'), `${item.name} component copied. Import it using the setup below.`);
      if (copied) { group.textContent = 'Copied ✓'; setTimeout(() => { group.textContent = item.group.label; }, 2000); }
    });
    cleanups.push(emojiMotion.bind(glyphEl, glyph, { trigger: button, events: ['pointerenter', 'focus', 'click'], ...(item.decorationPreset ? { decoration: { container: visual } } : {}) }));
  }
}
function makeFilter(id, label) { const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.className = 'filter'; button.setAttribute('aria-pressed', String(id === selected)); button.addEventListener('click', () => { selected = id; for (const el of filters.children) el.setAttribute('aria-pressed', String(el === button)); render(); }); filters.append(button); }
function updateAutoPreview() {
  const value = autoInput.value.trim();
  const result = emojiMotion.resolve(value);
  autoPreview.hidden = !result;
  if (!result) { autoResult.textContent = value ? 'Enter one recognized emoji.' : 'Enter an emoji to try it.'; return; }
  autoPreview.setAttribute('emoji', value);
  if (skinTone.value === 'default') autoPreview.removeAttribute('skin-tone');
  else autoPreview.setAttribute('skin-tone', skinTone.value);
  const category = result.unicodeSubgroup?.replaceAll('-', ' ') ?? result.group.label;
  const source = result.source === 'preset' ? 'Custom preset' : result.source === 'unicode' ? 'Automatic' : 'Fallback';
  autoResult.textContent = `${source} · ${category} · ${result.motionId}`;
}
autoInput.addEventListener('input', updateAutoPreview);
updateAutoPreview();
makeFilter('featured', 'Featured'); makeFilter('all', 'All presets'); makeFilter('effects', 'With effects ✦'); for (const group of emojiMotion.groups()) if (all.some(glyph => emojiMotion.resolve(glyph).groupId === group.id)) makeFilter(group.id, group.label); render();
const previousFilter = document.querySelector('#filter-prev');
const nextFilter = document.querySelector('#filter-next');
function updateFilterControls() {
  const overflow = filters.scrollWidth > filters.clientWidth + 1;
  previousFilter.hidden = nextFilter.hidden = !overflow;
  previousFilter.disabled = filters.scrollLeft <= 1;
  nextFilter.disabled = filters.scrollLeft + filters.clientWidth >= filters.scrollWidth - 1;
}
previousFilter.addEventListener('click', () => filters.scrollBy({ left: -filters.clientWidth * 0.7, behavior: 'auto' }));
nextFilter.addEventListener('click', () => filters.scrollBy({ left: filters.clientWidth * 0.7, behavior: 'auto' }));
filters.addEventListener('scroll', updateFilterControls, { passive: true });
window.addEventListener('resize', updateFilterControls);
if (document.fonts?.ready) document.fonts.ready.then(updateFilterControls);
updateFilterControls();


const exampleCode = {
  inline: `<!-- Import once in your app's entry module. -->
<script type="module">
  import '@dofy/native-emoji-motion/element';
</script>

<p>Made with a little <emoji-motion emoji="❤️"></emoji-motion> and a lot of care.</p>`,
  card: `<!-- Import once in your app's entry module. -->
<script type="module">
  import '@dofy/native-emoji-motion/element';
</script>

<div class="card">
  <strong>Say hello</strong>
  <emoji-motion emoji="👋" display="block"></emoji-motion>
</div>`,
  setup: `// Import once in your app's entry module.
import '@dofy/native-emoji-motion/element';

// Paste <emoji-motion emoji="👋"></emoji-motion> into your HTML.`
};
function escapeAttribute(value) { return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
function markupFor(item) {
  const glyph = escapeAttribute(item.glyph);
  const display = displayMode.value;
  if (framework.value === 'vanilla') return `<emoji-motion emoji="${glyph}" display="${display}"></emoji-motion>`;
  return `<EmojiMotion emoji="${glyph}" display="${display}" />`;
}
async function copyText(value, status, fallback, success) {
  fallback.hidden = true;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    status.textContent = success;
    return true;
  } catch {
    fallback.value = value; fallback.hidden = false; fallback.focus(); fallback.select();
    status.textContent = 'Copy was unavailable. Select and copy the code below.';
    return false;
  }
}
const frameworkCode = {
  vanilla: exampleCode,
  react: {
    inline: `import { EmojiMotion } from '@dofy/native-emoji-motion/react';

export function Message() {
  return <p>Made with a little <EmojiMotion emoji="❤️" /> and a lot of care.</p>;
}`,
    card: `import { EmojiMotion } from '@dofy/native-emoji-motion/react';

export function HelloCard() {
  return (
    <div className="card">
      <strong>Say hello</strong>
      <EmojiMotion emoji="👋" display="block" />
    </div>
  );
}`,
    setup: `import { EmojiMotion } from '@dofy/native-emoji-motion/react';

// Paste <EmojiMotion emoji="👋" /> into your JSX.`
  },
  vue: {
    inline: `<script setup>
import { EmojiMotion } from '@dofy/native-emoji-motion/vue';
</script>

<template>
  <p>Made with a little <EmojiMotion emoji="❤️" /> and a lot of care.</p>
</template>`,
    card: `<script setup>
import { EmojiMotion } from '@dofy/native-emoji-motion/vue';
</script>

<template>
  <div class="card">
    <strong>Say hello</strong>
    <EmojiMotion emoji="👋" display="block" />
  </div>
</template>`,
    setup: `<script setup>
import { EmojiMotion } from '@dofy/native-emoji-motion/vue';
</script>

<!-- Paste <EmojiMotion emoji="👋" /> into your template. -->`
  },
  svelte: {
    inline: `<script>
  import EmojiMotion from '@dofy/native-emoji-motion/svelte/EmojiMotion.svelte';
</script>

<p>Made with a little <EmojiMotion emoji="❤️" /> and a lot of care.</p>`,
    card: `<script>
  import EmojiMotion from '@dofy/native-emoji-motion/svelte/EmojiMotion.svelte';
</script>

<div class="card">
  <strong>Say hello</strong>
  <EmojiMotion emoji="👋" display="block" />
</div>`,
    setup: `<script>
  import EmojiMotion from '@dofy/native-emoji-motion/svelte/EmojiMotion.svelte';
</script>

<!-- Paste <EmojiMotion emoji="👋" /> into your component. -->`
  }
};
function updateCode() {
  const selected = frameworkCode[framework.value];
  for (const [id, source] of Object.entries(selected)) {
    const element = document.querySelector(`#code-${id}`);
    element.textContent = source;
    const language = framework.value === 'react' ? 'jsx' : (id === 'setup' && framework.value === 'vanilla' ? 'javascript' : 'markup');
    element.className = `language-${language}`;
    if (globalThis.Prism) globalThis.Prism.highlightElement(element);
  }
  for (const label of document.querySelectorAll('.example-code-language')) label.textContent = framework.value === 'react' ? 'REACT / JSX' : framework.value === 'vue' ? 'VUE' : framework.value === 'svelte' ? 'SVELTE' : 'HTML + JAVASCRIPT';
  document.querySelector('#setup-language').textContent = framework.value === 'react' ? 'REACT / JSX' : framework.value === 'vue' ? 'VUE' : framework.value === 'svelte' ? 'SVELTE' : 'JAVASCRIPT';
}
for (const selector of frameworkSelectors) selector.addEventListener('change', () => {
  for (const other of frameworkSelectors) other.value = selector.value;
  updateCode(); document.querySelector('#copy-status').textContent = '';
});
displayMode.addEventListener('change', () => { document.querySelector('#copy-status').textContent = ''; });
updateCode();
for (const button of document.querySelectorAll('[data-copy-example]')) {
  button.addEventListener('click', async () => {
    const original = button.dataset.copyExample === 'setup' ? 'Copy setup' : 'Copy code';
    if (await copyText(frameworkCode[framework.value][button.dataset.copyExample], document.querySelector('#example-copy-status'), document.querySelector('#example-copy-fallback'), 'Code copied.')) {
      button.textContent = 'Copied ✓'; setTimeout(() => { button.textContent = original; }, 2000);
    }
  });
}
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, focus = false) {
  for (const item of tabs) {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  }
  if (focus) tab.focus();
}
for (const tab of tabs) {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = tabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    activateTab(tabs[next], true);
  });
}
