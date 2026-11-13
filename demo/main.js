import { createEmojiMotion, emojiMotion, motions } from '../src/index.js';
import '../src/element.js';
import { subgroups } from '../src/unicode-data.js';
await window.emojiSite.ready;
window.emojiSite.translate(document.body);
const t = window.emojiSite.t;
window.emojiSite.setupCopyButtons();
window.emojiSite.animateControls(emojiMotion);
const customRegistry = createEmojiMotion({
  motions: { wiggle: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(14deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(0deg)' }], options: { duration: 700, easing: 'ease-out' }, origin: '50% 80%' } },
  groups: { creatures: { label: 'Creatures', motion: 'wiggle' } },
  emoji: { '🐙': { name: 'Octopus', group: 'creatures' } }
});
document.querySelector('#custom-preview').registry = customRegistry;
// The brand remains a native emoji; motion uses the same registry as the gallery.
for (const brand of document.querySelectorAll('.brand')) {
  const mark = brand.querySelector('.brand-mark');
  if (mark) emojiMotion.bind(mark, '👋', { trigger: brand, events: ['pointerenter', 'focus'] });
}
const brandMark = document.querySelector('.topbar .brand-mark');
if (brandMark) requestAnimationFrame(() => emojiMotion.play(brandMark, '👋'));
const heroWave = document.querySelector('.hero-wave');
const heroGlyph = heroWave.querySelector('.art-main');
const heroChoices = ['📡', '🔔', '🎵', '💡', '🎉', '✨', '☕', '🌸', '🚀', '🦋', '❤️', '🍊', '📷', '🔦', '🕯️', '🎨', '🎻', '🚄', '🌈', '🐠', '🥐', '🧋', '🦜', '🎲', '🪙', '🌻', '🎠'];
const heroOptions = { decoration: { container: heroWave } };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let heroCurrent = '';
let heroCleanup = () => {};
let heroTimer;
let heroVisible = !('IntersectionObserver' in globalThis);
let heroHovered = false;
function pickHero() {
  const choices = heroChoices.filter(glyph => glyph !== heroCurrent);
  return choices[Math.floor(Math.random() * choices.length)];
}
function changeHero(animate = true) {
  heroCleanup();
  heroCurrent = pickHero();
  heroGlyph.textContent = heroCurrent;
  heroWave.setAttribute('aria-label', `${t('Play emoji animation')}: ${heroCurrent}`);
  heroCleanup = emojiMotion.bind(heroGlyph, heroCurrent, { ...heroOptions, trigger: heroWave, events: ['pointerenter', 'focus', 'click'] });
  if (animate) emojiMotion.play(heroGlyph, heroCurrent, heroOptions);
}
function scheduleHero() {
  clearTimeout(heroTimer);
  if (heroVisible && !document.hidden && !reducedMotion.matches && !heroHovered && !heroWave.matches(':focus-visible')) {
    heroTimer = setTimeout(() => { changeHero(); scheduleHero(); }, 3000);
  }
}
changeHero(false);
if ('IntersectionObserver' in globalThis) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.some(entry => entry.isIntersecting);
    if (visible && !heroVisible) emojiMotion.play(heroGlyph, heroCurrent, heroOptions);
    heroVisible = visible; scheduleHero();
  }, { threshold: 0.25 });
  observer.observe(heroWave);
} else { emojiMotion.play(heroGlyph, heroCurrent, heroOptions); scheduleHero(); }
heroWave.addEventListener('pointerenter', () => { heroHovered = true; scheduleHero(); });
heroWave.addEventListener('pointerleave', () => { heroHovered = false; scheduleHero(); });
heroWave.addEventListener('focus', scheduleHero);
heroWave.addEventListener('blur', scheduleHero);
document.addEventListener('visibilitychange', scheduleHero);
reducedMotion.addEventListener?.('change', scheduleHero);
const grid = document.querySelector('#grid');
const filters = document.querySelector('#filters');
const count = document.querySelector('#count');
const skinTone = document.querySelector('#skin-tone');
const framework = document.querySelector('#framework');
const frameworkSelectors = document.querySelectorAll('[data-framework]');
const autoInput = document.querySelector('#auto-emoji');
const autoPreview = document.querySelector('#auto-preview');
const autoResult = document.querySelector('#auto-result');
const preferenceKey = name => `emoji-motion.${name}`;
function readPreference(name) { try { return localStorage.getItem(preferenceKey(name)); } catch { return null; } }
function savePreference(name, value) { try { localStorage.setItem(preferenceKey(name), value); } catch { /* The page still works without storage. */ } }
function restoreSelect(select, name) {
  const value = readPreference(name);
  if ([...select.options].some(option => option.value === value)) select.value = value;
}
restoreSelect(skinTone, 'skin-tone');
restoreSelect(framework, 'framework');
for (const selector of frameworkSelectors) selector.value = framework.value;
const savedEmoji = readPreference('auto-emoji');
if (savedEmoji !== null && savedEmoji.length <= autoInput.maxLength && emojiMotion.resolve(savedEmoji.trim())) autoInput.value = savedEmoji;
emojiMotion.setDefaultSkinTone(skinTone.value);
skinTone.addEventListener('change', () => { savePreference('skin-tone', skinTone.value); emojiMotion.setDefaultSkinTone(skinTone.value); render(); updateAutoPreview(); });
const all = emojiMotion.list();
// Curated examples live in the demo, not the library's complete registry.
const featured = ['🕰️', '💧', '🧳', '🥕', '🐘', '👕', '🪛', '📘', '🤏', '🛶', '🧁', '👋', '🍊', '🐶', '🌤️', '🪐', '✏️', '👩‍⚖️', '📡', '🥐', '🎻', '❤️', '🪄', '😊', '🔔', '🌸', '🚀', '✨', '🐠', '🦋', '☕', '💡', '📷', '🔦', '💃', '🕯️', '🚶‍♀️', '🚄', '🧑‍⚕️', '🧑‍🚀', '🏄', '🥎', '🌷', '🧋', '🦜', '🧎', '🎡', '🎠', '🪙', '🎲', '⏳', '🧭', '🌻'];
let cleanups = [];
const familyGlyphs = [...new Set(emojiMotion.families().flatMap(family => family.members))].filter(glyph => emojiMotion.resolve(glyph)?.source === 'family');
const galleryGlyphs = [...new Set([...all, ...familyGlyphs])];
const filterGroups = emojiMotion.groups().filter(group => galleryGlyphs.some(glyph => emojiMotion.resolve(glyph).groupId === group.id));
const effectCount = galleryGlyphs.filter(glyph => emojiMotion.resolve(glyph).decorationPreset).length;
const unicodeSequenceCount = subgroups.reduce((total, [, , entries]) => total + entries.split(' ').length, 0);
// Count fully qualified sequences, not unique base emoji: skin tones and ZWJ variants are included.
// An independent default registry keeps this statistic stable when a visitor changes the skin tone.
const statsRegistry = createEmojiMotion();
let qualifiedCount = 0; let customizedCount = 0;
for (const [, , entries] of subgroups) for (const token of entries.split(' ')) {
  if (!token.endsWith('!')) continue;
  qualifiedCount++;
  const result = statsRegistry.resolve(token.slice(0, token.lastIndexOf('=')));
  if (result?.source === 'preset' || result?.source === 'family') customizedCount++;
}
const coverage = `${customizedCount.toLocaleString('en-US')} / ${qualifiedCount.toLocaleString('en-US')}`;
const percentage = (customizedCount / qualifiedCount * 100).toFixed(1);
const stats = [[all.length, t('handcrafted emoji')], [emojiMotion.families().length, t('motion families')], [filterGroups.length, t('categories')], [Object.keys(motions).length, t('shared motions')], [effectCount, t('with SVG effects')], [coverage, `${t('fully qualified sequences customized')} (${percentage}%, ${t('including skin tones')})`], [unicodeSequenceCount.toLocaleString('en-US'), t('Unicode sequences incl. variants')]];
for (const [value, label] of stats) {
  const item = document.createElement('span'); item.className = 'collection-stat';
  if (value === coverage) item.classList.add('collection-stat--coverage');
  const number = document.createElement('strong'); number.textContent = value;
  item.append(number, document.createTextNode(` ${label}`));
  document.querySelector('#collection-stats').append(item);
}
const filterIds = new Set(['featured', 'all', 'family', 'effects', ...filterGroups.map(group => group.id)]);
let selected = 'featured';
const savedFilter = readPreference('gallery-filter');
if (filterIds.has(savedFilter)) selected = savedFilter;
const palette = ['peach', 'lilac', 'yellow', 'mint', 'blue', 'pink'];
const pageSize = 24;
const savedPage = Number(readPreference('gallery-page'));
let page = Number.isSafeInteger(savedPage) && savedPage > 0 ? savedPage : 1;
let pageCount = 1;
const pagination = document.querySelector('#gallery-pagination');
const pageLabel = document.querySelector('#gallery-page');
const pagePrevious = document.querySelector('#gallery-prev');
const pageNext = document.querySelector('#gallery-next');
function render() {
  cleanups.forEach(cleanup => cleanup()); cleanups = []; grid.replaceChildren();
  const shown = selected === 'featured'
    ? featured.filter(glyph => emojiMotion.resolve(glyph))
    : selected === 'all' ? all : selected === 'family' ? familyGlyphs
    : galleryGlyphs.filter(glyph => selected === 'effects' ? Boolean(emojiMotion.resolve(glyph).decorationPreset) : emojiMotion.resolve(glyph).groupId === selected);
  count.textContent = `${String(shown.length).padStart(2, '0')} ${t('LITTLE MOVEMENTS')}`;
  pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  page = Math.min(page, pageCount);
  savePreference('gallery-page', String(page));
  pagination.hidden = pageCount <= 1;
  pagePrevious.disabled = page === 1;
  pageNext.disabled = page === pageCount;
  pageLabel.textContent = window.emojiSite.language === 'en' ? `Page ${page} of ${pageCount}` : `${page} / ${pageCount}`;
  const offset = (page - 1) * pageSize;
  for (const [index, glyph] of shown.slice(offset, offset + pageSize).entries()) {
    const item = emojiMotion.resolve(glyph);
    const button = document.createElement('button');
    button.className = `emoji-card ${palette[galleryGlyphs.indexOf(glyph) % palette.length]}`;
    button.type = 'button'; button.setAttribute('aria-label', `${t(item.name)}, ${t('preview and copy component')}`);
    const number = document.createElement('span'); number.className = 'card-number'; number.textContent = String(offset + index + 1).padStart(2, '0');
    const copyIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    copyIcon.classList.add('card-arrow'); copyIcon.setAttribute('viewBox', '0 0 24 24'); copyIcon.setAttribute('fill', 'none'); copyIcon.setAttribute('stroke', 'currentColor'); copyIcon.setAttribute('stroke-width', '1.6'); copyIcon.setAttribute('aria-hidden', 'true');
    const copyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    copyPath.setAttribute('d', 'M8 8h10v12H8z M6 16H4V4h10v2'); copyPath.setAttribute('stroke-linecap', 'round'); copyPath.setAttribute('stroke-linejoin', 'round'); copyIcon.append(copyPath);
    const stage = document.createElement('span'); stage.className = 'emoji-stage';
    const visual = document.createElement('span'); visual.className = 'emoji-visual';
    const glyphEl = document.createElement('span'); glyphEl.className = 'glyph'; glyphEl.textContent = item.glyph; glyphEl.setAttribute('aria-hidden','true'); visual.append(glyphEl); stage.append(visual);
    const bottom = document.createElement('span'); bottom.className = 'card-bottom';
    const name = document.createElement('span'); name.textContent = t(item.name);
    const groupLabel = item.source === 'family' ? `${t(item.group.label)} · ${t('Family')}` : t(item.group.label);
    const group = document.createElement('span'); group.textContent = groupLabel; group.setAttribute('aria-live', 'polite');
    bottom.append(name, group); button.append(number, copyIcon, stage, bottom); grid.append(button);
    let copiedTimer;
    button.addEventListener('click', async () => {
      const copied = await copyText(markupFor(item), document.querySelector('#copy-status'), document.querySelector('#copy-fallback'), '');
      if (copied) { clearTimeout(copiedTimer); group.textContent = t('Copied ✓'); group.classList.add('card-copied'); copiedTimer = setTimeout(() => { group.textContent = groupLabel; group.classList.remove('card-copied'); }, 2000); }
    });
    cleanups.push(emojiMotion.bind(glyphEl, glyph, { trigger: button, events: ['pointerenter', 'focus', 'click'], ...(item.decorationPreset ? { decoration: { container: visual } } : {}) }));
  }
}
const filterIcons = { featured: '✨', all: '🗂️', family: '🧩', effects: '💫', gestures: '👋', faces: '😊', hearts: '❤️', objects: '💡', nature: '🌿', travel: '🚀', symbols: '🔣', people: '🧑', food: '🍎', activities: '🎨', flags: '🏳️', other: '🌟' };
function makeFilter(id, label) { const button = document.createElement('button'); button.type = 'button'; const icon = document.createElement('span'); icon.className = 'filter-icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = filterIcons[id] ?? '✨'; button.append(icon, document.createTextNode(` ${t(label)}`)); button.className = 'filter'; button.setAttribute('aria-pressed', String(id === selected)); button.addEventListener('click', () => { selected = id; page = 1; savePreference('gallery-filter', id); for (const el of filters.children) el.setAttribute('aria-pressed', String(el === button)); render(); }); filters.append(button); }
function changePage(nextPage) {
  if (nextPage < 1 || nextPage > pageCount) return;
  page = nextPage;
  render();
  grid.scrollIntoView({ block: 'start', behavior: 'instant' });
  grid.focus({ preventScroll: true });
}
pagePrevious.addEventListener('click', () => changePage(page - 1));
pageNext.addEventListener('click', () => changePage(page + 1));
function updateAutoPreview() {
  const value = autoInput.value.trim();
  const result = emojiMotion.resolve(value);
  autoPreview.hidden = !result;
  if (!result) { autoResult.textContent = value ? t('Enter one recognized emoji.') : t('Enter an emoji to try it.'); return; }
  autoPreview.setAttribute('emoji', value);
  if (skinTone.value === 'default') autoPreview.removeAttribute('skin-tone');
  else autoPreview.setAttribute('skin-tone', skinTone.value);
  const category = t(result.unicodeSubgroup?.replaceAll('-', ' ') ?? result.group.label);
  const familyName = emojiMotion.families().find(family => family.id === result.familyId)?.label ?? result.familyId;
  const source = result.source === 'preset' ? t('Handcrafted preset') : result.source === 'family' ? `${t('Motion family')}: ${t(familyName)}` : result.source === 'unicode' ? t('Automatic') : t('Fallback');
  autoResult.textContent = `${source} · ${category} · ${result.motionId}`;
}
autoInput.addEventListener('input', () => { savePreference('auto-emoji', autoInput.value); updateAutoPreview(); });
updateAutoPreview();
makeFilter('featured', 'Featured'); makeFilter('all', 'All presets'); makeFilter('family', 'Motion families'); makeFilter('effects', 'With effects ✦'); for (const group of filterGroups) makeFilter(group.id, group.label); render();
function revealSelectedFilter() {
  const selectedFilter = filters.querySelector('[aria-pressed="true"]');
  if (!selectedFilter) return;
  const containerRect = filters.getBoundingClientRect(); const buttonRect = selectedFilter.getBoundingClientRect();
  if (buttonRect.right > containerRect.right) filters.scrollLeft += buttonRect.right - containerRect.right + 8;
  else if (buttonRect.left < containerRect.left) filters.scrollLeft += buttonRect.left - containerRect.left - 8;
}
// Browsers may restore scroll positions after scripts run; adjust only the filter row.
window.addEventListener('pageshow', () => requestAnimationFrame(revealSelectedFilter), { once: true });
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
  <div style="text-align: right">
    <emoji-motion emoji="👋"></emoji-motion>
  </div>
</div>`,
  setup: `// Import once in your app's entry module.
import '@dofy/native-emoji-motion/element';

// Paste <emoji-motion emoji="👋"></emoji-motion> into your HTML.`
};
function escapeAttribute(value) { return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
function markupFor(item) {
  const glyph = escapeAttribute(item.glyph);
  if (framework.value === 'vanilla') return `<emoji-motion emoji="${glyph}"></emoji-motion>`;
  return `<EmojiMotion emoji="${glyph}" />`;
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
    status.textContent = t('Copy was unavailable. Select and copy the code below.');
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
      <div style={{ textAlign: 'right' }}>
        <EmojiMotion emoji="👋" />
      </div>
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
    <div style="text-align: right">
      <EmojiMotion emoji="👋" />
    </div>
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
  <div style="text-align: right">
    <EmojiMotion emoji="👋" />
  </div>
</div>`,
    setup: `<script>
  import EmojiMotion from '@dofy/native-emoji-motion/svelte/EmojiMotion.svelte';
</script>

<!-- Paste <EmojiMotion emoji="👋" /> into your component. -->`
  }
};
const customDefinition = `const motion = createEmojiMotion({
  motions: {
    wiggle: {
      keyframes: [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(14deg)' },
        { transform: 'rotate(-14deg)' },
        { transform: 'rotate(0deg)' },
      ],
      options: { duration: 700, easing: 'ease-out' },
      origin: '50% 80%',
    },
  },
  groups: { creatures: { label: 'Creatures', motion: 'wiggle' } },
  emoji: { '🐙': { name: 'Octopus', group: 'creatures' } },
});`;
const customCode = {
  react: `import { createEmojiMotion } from '@dofy/native-emoji-motion';
import { EmojiMotion } from '@dofy/native-emoji-motion/react';

${customDefinition}

export function Message() {
  return <p>A little <EmojiMotion emoji="🐙" registry={motion} /> goes a long way.</p>;
}`,
  vue: `<script setup>
import { createEmojiMotion } from '@dofy/native-emoji-motion';
import { EmojiMotion } from '@dofy/native-emoji-motion/vue';

${customDefinition}
</script>

<template>
  <p>A little <EmojiMotion emoji="🐙" :registry="motion" /> goes a long way.</p>
</template>`,
  svelte: `<script>
import { createEmojiMotion } from '@dofy/native-emoji-motion';
import EmojiMotion from '@dofy/native-emoji-motion/svelte/EmojiMotion.svelte';

${customDefinition}
</script>

<p>A little <EmojiMotion emoji="🐙" registry={motion} /> goes a long way.</p>`,
  vanilla: `<p>A little <emoji-motion id="octopus" emoji="🐙"></emoji-motion> goes a long way.</p>

<script type="module">
import { createEmojiMotion } from '@dofy/native-emoji-motion';
import '@dofy/native-emoji-motion/element';

${customDefinition}

document.querySelector('#octopus').registry = motion;
</script>`
};
function localizedExample(source) {
  for (const phrase of ['Made with a little', 'and a lot of care.', 'Say hello', 'A little', 'goes a long way.']) source = source.replaceAll(phrase, t(phrase));
  return source;
}
function updateCode() {
  const selected = frameworkCode[framework.value];
  for (const [id, source] of Object.entries(selected)) {
    const element = document.querySelector(`#code-${id}`);
    element.textContent = localizedExample(source);
    const language = framework.value === 'react' ? 'jsx' : (id === 'setup' && framework.value === 'vanilla' ? 'javascript' : 'markup');
    element.className = `language-${language}`;
    if (globalThis.Prism) globalThis.Prism.highlightElement(element);
  }
  for (const label of document.querySelectorAll('.example-code-language')) label.textContent = framework.value === 'react' ? 'REACT / JSX' : framework.value === 'vue' ? 'VUE' : framework.value === 'svelte' ? 'SVELTE' : 'HTML + JAVASCRIPT';
  document.querySelector('#setup-language').textContent = framework.value === 'react' ? 'REACT / JSX' : framework.value === 'vue' ? 'VUE' : framework.value === 'svelte' ? 'SVELTE' : 'JAVASCRIPT';
  const custom = document.querySelector('#code-custom');
  custom.textContent = localizedExample(customCode[framework.value]);
  custom.className = `language-${framework.value === 'react' ? 'jsx' : 'markup'}`;
  if (globalThis.Prism) globalThis.Prism.highlightElement(custom);
  document.querySelector('#custom-language').textContent = framework.value === 'react' ? 'REACT / JSX' : framework.value === 'vue' ? 'VUE' : framework.value === 'svelte' ? 'SVELTE' : 'HTML + JAVASCRIPT';
}
for (const selector of frameworkSelectors) selector.addEventListener('change', () => {
  for (const other of frameworkSelectors) other.value = selector.value;
  savePreference('framework', selector.value);
  updateCode(); document.querySelector('#copy-status').textContent = '';
});
updateCode();
document.querySelector('#copy-install').addEventListener('click', async event => {
  const button = event.currentTarget;
  if (await copyText('npm install @dofy/native-emoji-motion', document.querySelector('#install-copy-status'), document.querySelector('#install-copy-fallback'), '')) {
    window.emojiSite.copyFeedback(button, 'copied');
  }
});
document.querySelector('#copy-custom').addEventListener('click', async event => {
  const button = event.currentTarget;
  if (await copyText(localizedExample(customCode[framework.value]), document.querySelector('#custom-copy-status'), document.querySelector('#custom-copy-fallback'), '')) {
    window.emojiSite.copyFeedback(button, 'copied');
  }
});
for (const button of document.querySelectorAll('[data-copy-example]')) {
  button.addEventListener('click', async () => {
    if (await copyText(localizedExample(frameworkCode[framework.value][button.dataset.copyExample]), document.querySelector('#example-copy-status'), document.querySelector('#example-copy-fallback'), '')) {
      window.emojiSite.copyFeedback(button, 'copied');
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
  savePreference('example-tab', tab.id);
  if (focus) tab.focus();
}
const savedTab = readPreference('example-tab');
activateTab(tabs.find(tab => tab.id === savedTab) ?? tabs[0]);
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

// Enhance the ordinary text shown in the adjacent original HTML example.
const enhanceContent = document.querySelector('#enhance-content');
const enhanceExamples = {
  html: `<div id="enhance-content">
  <p>${t('Good morning 👋🏽 The coffee is ready ☕')}</p>
  <p>${t('Let’s make something lovely today ✨')}</p>
</div>`,
  js: `import { emojiMotion } from '@dofy/native-emoji-motion';

const enhancer = emojiMotion.enhance({
  root: '#enhance-content',
  // enabled: false, // Wait until enable() to start.
});

// New text is enhanced automatically.
// enhancer.disable(); // Temporarily turn off.
// enhancer.enable();  // Turn on and rescan.
// enhancer.cleanup(); // Permanently clean up.`
};
for (const [key, code] of Object.entries(enhanceExamples)) {
  const element = document.querySelector(`#enhance-${key}`);
  element.textContent = code;
  if (globalThis.Prism) globalThis.Prism.highlightElement(element);
}
const enhancer = emojiMotion.enhance({ root: enhanceContent });
let enhanceEnabled = true;
const demoSentences = [
  'A little progress is worth celebrating 🎉',
  'Fresh ideas are starting to bloom 🌱',
  'Taking a moment to enjoy the sunshine ☀️',
  'A friendly hello from across the world 🌍',
  'Every small step can lead somewhere new 🚶🏽',
  'A good song makes the day brighter 🎵',
];
let nextSentence = 0;
document.querySelector('#enhance-add').addEventListener('click', () => {
  const additions = enhanceContent.querySelectorAll('[data-demo-sentence]');
  if (additions.length >= 4) additions[0].remove();
  const paragraph = document.createElement('p');
  paragraph.dataset.demoSentence = '';
  paragraph.textContent = t(demoSentences[nextSentence]);
  nextSentence = (nextSentence + 1) % demoSentences.length;
  enhanceContent.append(paragraph);
});
document.querySelector('#enhance-toggle').addEventListener('click', event => {
  if (enhanceEnabled) enhancer.disable();
  else enhancer.enable();
  enhanceEnabled = !enhanceEnabled;
  event.currentTarget.textContent = enhanceEnabled ? t('Turn off animation') : t('Turn on animation');
});
for (const button of document.querySelectorAll('[data-enhance-copy]')) button.addEventListener('click', async () => {
  if (await copyText(enhanceExamples[button.dataset.enhanceCopy], document.querySelector('#enhance-copy-status'), document.querySelector('#enhance-copy-fallback'), '')) {
    window.emojiSite.copyFeedback(button, 'copied');
  }
});

// Native selects remain the source of truth for the existing form and persistence logic.
// The visible control uses the same details menu as the language picker.
const toneIcons = { default: '🖐️', light: '🖐🏻', 'medium-light': '🖐🏼', medium: '🖐🏽', 'medium-dark': '🖐🏾', dark: '🖐🏿' };
const selectControls = [];
for (const select of document.querySelectorAll('select')) {
  const menu = document.createElement('details'); menu.className = 'custom-select';
  const trigger = document.createElement('summary'); trigger.className = 'custom-select-trigger';
  const sourceLabel = select.getAttribute('aria-label') || document.querySelector(`label[for="${select.id}"]`)?.textContent.trim() || document.getElementById(select.getAttribute('aria-labelledby'))?.textContent.trim() || t('Framework');
  trigger.setAttribute('aria-label', sourceLabel);
  const current = document.createElement('span'); current.className = 'custom-select-value'; trigger.append(current);
  const options = document.createElement('div'); options.className = 'language-options custom-select-options';
  const buttons = [];
  for (const option of select.options) {
    const button = document.createElement('button'); button.type = 'button';
    if (select.id === 'skin-tone') {
      button.textContent = toneIcons[option.value];
      button.setAttribute('aria-label', option.textContent);
      button.title = option.textContent;
    } else button.textContent = option.textContent;
    button.addEventListener('click', () => {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      menu.open = false; trigger.focus();
    });
    buttons.push(button); options.append(button);
  }
  menu.append(trigger, options); select.after(menu); select.hidden = true;
  menu.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.open) { menu.open = false; trigger.focus(); } });
  const sync = () => {
    const option = select.selectedOptions[0];
    current.textContent = option ? (select.id === 'skin-tone' ? toneIcons[option.value] : option.textContent) : '';
    trigger.setAttribute('aria-label', `${sourceLabel}: ${option?.textContent ?? ''}`);
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(select.options[index].selected)));
  };
  selectControls.push(sync);
  select.addEventListener('change', () => queueMicrotask(() => selectControls.forEach(update => update())));
  sync();
}
document.addEventListener('click', event => {
  for (const menu of document.querySelectorAll('.custom-select[open]')) if (!menu.contains(event.target)) menu.open = false;
});
