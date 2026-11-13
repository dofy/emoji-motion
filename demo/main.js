import { emojiMotion } from '../src/index.js';
const grid = document.querySelector('#grid');
const filters = document.querySelector('#filters');
const count = document.querySelector('#count');
const all = emojiMotion.list();
let cleanups = [];
let selected = 'all';
const palette = ['peach', 'lilac', 'yellow', 'mint', 'blue', 'pink'];
function render() {
  cleanups.forEach(cleanup => cleanup()); cleanups = []; grid.replaceChildren();
  const shown = all.filter(glyph => selected === 'all' || emojiMotion.resolve(glyph).groupId === selected);
  count.textContent = `${String(shown.length).padStart(2, '0')} LITTLE MOVEMENTS`;
  for (const [index, glyph] of shown.entries()) {
    const item = emojiMotion.resolve(glyph);
    const button = document.createElement('button');
    button.className = `emoji-card ${palette[all.indexOf(glyph) % palette.length]}`;
    button.type = 'button'; button.setAttribute('aria-label', `${item.name}, play animation`);
    const number = document.createElement('span'); number.className = 'card-number'; number.textContent = String(all.indexOf(glyph) + 1).padStart(2, '0');
    const arrow = document.createElement('span'); arrow.className = 'card-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    const stage = document.createElement('span'); stage.className = 'emoji-stage';
    const visual = document.createElement('span'); visual.className = 'emoji-visual';
    const glyphEl = document.createElement('span'); glyphEl.className = 'glyph'; glyphEl.textContent = glyph; glyphEl.setAttribute('aria-hidden','true'); visual.append(glyphEl); stage.append(visual);
    const bottom = document.createElement('span'); bottom.className = 'card-bottom';
    const name = document.createElement('span'); name.textContent = item.name;
    const group = document.createElement('span'); group.textContent = item.group.label;
    bottom.append(name, group); button.append(number, arrow, stage, bottom); grid.append(button);
    cleanups.push(emojiMotion.bind(glyphEl, glyph, { trigger: button, events: ['pointerenter', 'focus', 'click'], ...(item.decorationPreset ? { decoration: { container: visual } } : {}) }));
  }
}
function makeFilter(id, label) { const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.className = 'filter'; button.setAttribute('aria-pressed', String(id === selected)); button.addEventListener('click', () => { selected = id; for (const el of filters.children) el.setAttribute('aria-pressed', String(el === button)); render(); }); filters.append(button); }
makeFilter('all', 'All emoji'); for (const group of emojiMotion.groups()) makeFilter(group.id, group.label); render();
