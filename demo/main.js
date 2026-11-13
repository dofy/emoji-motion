import { emojiMotion } from '../src/index.js';
const grid = document.querySelector('#grid');
const filters = document.querySelector('#filters');
const count = document.querySelector('#count');
const skinTone = document.querySelector('#skin-tone');
skinTone.addEventListener('change', () => { emojiMotion.setDefaultSkinTone(skinTone.value); render(); });
const all = emojiMotion.list();
let cleanups = [];
let selected = 'all';
const palette = ['peach', 'lilac', 'yellow', 'mint', 'blue', 'pink'];
function render() {
  cleanups.forEach(cleanup => cleanup()); cleanups = []; grid.replaceChildren();
  const shown = all.filter(glyph => selected === 'all' || (selected === 'effects' ? Boolean(emojiMotion.resolve(glyph).decorationPreset) : emojiMotion.resolve(glyph).groupId === selected));
  count.textContent = `${String(shown.length).padStart(2, '0')} LITTLE MOVEMENTS`;
  for (const [index, glyph] of shown.entries()) {
    const item = emojiMotion.resolve(glyph);
    const button = document.createElement('button');
    button.className = `emoji-card ${palette[all.indexOf(glyph) % palette.length]}`;
    button.type = 'button'; button.setAttribute('aria-label', `${item.name}, preview and copy markup`);
    const number = document.createElement('span'); number.className = 'card-number'; number.textContent = String(all.indexOf(glyph) + 1).padStart(2, '0');
    const arrow = document.createElement('span'); arrow.className = 'card-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    const stage = document.createElement('span'); stage.className = 'emoji-stage';
    const visual = document.createElement('span'); visual.className = 'emoji-visual';
    const glyphEl = document.createElement('span'); glyphEl.className = 'glyph'; glyphEl.textContent = item.glyph; glyphEl.setAttribute('aria-hidden','true'); visual.append(glyphEl); stage.append(visual);
    const bottom = document.createElement('span'); bottom.className = 'card-bottom';
    const name = document.createElement('span'); name.textContent = item.name;
    const group = document.createElement('span'); group.textContent = item.group.label;
    bottom.append(name, group); button.append(number, arrow, stage, bottom); grid.append(button);
    button.addEventListener('click', async () => {
      const copied = await copyText(markupFor(item), document.querySelector('#copy-status'), document.querySelector('#copy-fallback'), `${item.name} markup copied. Paste it into your page and use the setup below.`);
      if (copied) { group.textContent = 'Copied ✓'; setTimeout(() => { group.textContent = item.group.label; }, 2000); }
    });
    cleanups.push(emojiMotion.bind(glyphEl, glyph, { trigger: button, events: ['pointerenter', 'focus', 'click'], ...(item.decorationPreset ? { decoration: { container: visual } } : {}) }));
  }
}
function makeFilter(id, label) { const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.className = 'filter'; button.setAttribute('aria-pressed', String(id === selected)); button.addEventListener('click', () => { selected = id; for (const el of filters.children) el.setAttribute('aria-pressed', String(el === button)); render(); }); filters.append(button); }
makeFilter('all', 'All emoji'); makeFilter('effects', 'With effects ✦'); for (const group of emojiMotion.groups()) makeFilter(group.id, group.label); render();


const exampleCode = {
  inline: `<!-- Place this wherever the emoji should appear. -->
<p>
  Made with a little
  <span id="heart" role="img" aria-label="Red heart" tabindex="0"
        style="display: inline-block">❤️</span>
  and a lot of care.
</p>

<script type="module">
  import { emojiMotion } from 'native-emoji-motion';
  const heart = document.querySelector('#heart');
  emojiMotion.bind(heart, '❤️', {
    events: ['pointerenter', 'focus', 'click']
  });
</script>`,
  card: `<!-- Put the emoji inside the element you want to trigger it. -->
<button type="button" id="hello-card">
  Say hello
  <span id="wave" aria-hidden="true"
        style="display: inline-block">👋</span>
</button>

<script type="module">
  import { emojiMotion } from 'native-emoji-motion';
  const card = document.querySelector('#hello-card');
  const wave = document.querySelector('#wave');
  emojiMotion.bind(wave, '👋', {
    trigger: card,
    events: ['pointerenter', 'focus', 'click']
  });
</script>`,
  setup: `import { emojiMotion } from 'native-emoji-motion';

// Run once after adding the copied markup to the page.
document.querySelectorAll('[data-emoji-motion]').forEach(wrapper => {
  const emoji = wrapper.querySelector('[data-emoji]');
  emojiMotion.bind(emoji, emoji.dataset.emoji, {
    trigger: wrapper,
    events: ['pointerenter', 'focus', 'click'],
    decoration: { container: wrapper }
  });
});`
};
function escapeAttribute(value) { return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
function markupFor(item) {
  const glyph = escapeAttribute(item.glyph);
  const name = escapeAttribute(item.name);
  return `<span data-emoji-motion role="img" aria-label="${name}" tabindex="0" style="display: inline-block; position: relative"><span data-emoji="${glyph}" aria-hidden="true" style="display: inline-block">${glyph}</span></span>`;
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
for (const [id, source] of Object.entries(exampleCode)) document.querySelector(`#code-${id}`).textContent = source;
for (const button of document.querySelectorAll('[data-copy-example]')) {
  button.addEventListener('click', async () => {
    const original = button.dataset.copyExample === 'setup' ? 'Copy setup' : 'Copy code';
    if (await copyText(exampleCode[button.dataset.copyExample], document.querySelector('#example-copy-status'), document.querySelector('#example-copy-fallback'), 'Code copied.')) {
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
const exampleHeart = document.querySelector('[data-example-glyph="❤️"]');
const exampleWave = document.querySelector('[data-example-glyph="👋"]');
emojiMotion.bind(exampleHeart, '❤️', { events: ['pointerenter', 'focus', 'click'] });
emojiMotion.bind(exampleWave, '👋', { trigger: document.querySelector('#example-card'), events: ['pointerenter', 'focus', 'click'] });
