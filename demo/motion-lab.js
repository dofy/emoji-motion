import { emojiMotion, motions, families, emoji } from '../src/index.js';
import { subgroups } from '../src/unicode-data.js';
import { motionAliases, motionCategories } from '../src/motion-catalog.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const reducedNote = document.querySelector('#reduced-note');
function updateReducedNote() { reducedNote.hidden = !reducedMotion.matches; }
reducedMotion.addEventListener?.('change', updateReducedNote);
updateReducedNote();
const rhythmDemo = {
  keyframes: [
    { transform: 'translateY(0) scale(1)', offset: 0, easing: 'cubic-bezier(.3,0,.6,1)' },
    { transform: 'translateY(0) scale(1.12,.88)', offset: .12, easing: 'cubic-bezier(.2,.7,.35,1)' },
    { transform: 'translateY(-32%) scale(.96,1.06)', offset: .35, easing: 'ease-out' },
    { transform: 'translateY(-30%) scale(1)', offset: .43, easing: 'cubic-bezier(.6,0,.85,.45)' },
    { transform: 'translateY(0) scale(1.14,.86)', offset: .58, easing: 'ease-out' },
    { transform: 'translateY(-13%) scale(.98,1.04)', offset: .72, easing: 'cubic-bezier(.6,0,.85,.45)' },
    { transform: 'translateY(0) scale(1.06,.94)', offset: .84, easing: 'ease-out' },
    { transform: 'translateY(-3%) scale(1)', offset: .92, easing: 'ease-out' },
    { transform: 'translateY(0) scale(1)', offset: 1 }
  ], options: { duration: 1150, easing: 'linear' }, origin: '50% 90%'
};
function play(element, motion) {
  if (reducedMotion.matches) return;
  for (const active of element.getAnimations()) active.cancel();
  element.animate(motion.keyframes.map(frame => motion.origin ? { ...frame, transformOrigin: motion.origin } : { ...frame }), motion.options);
}
for (const button of document.querySelectorAll('[data-demo]')) {
  button.addEventListener('click', () => play(button.querySelector('.compare-glyph'), button.dataset.demo === 'current' ? motions.bounce : rhythmDemo));
}
const locale = await fetch('/i18n/zh-CN.json').then(response => response.json()).catch(() => ({}));
const groupNames = { gestures: '手势', faces: '表情', hearts: '爱心', objects: '物件', nature: '自然', travel: '旅行', symbols: '符号', people: '人物', food: '食物', activities: '活动', flags: '旗帜', other: '其他' };
const registry = new Map(motionCategories.flatMap(category => category.motions.map(id => [id, { id, category, aliases: Object.keys(motionAliases).filter(alias => motionAliases[alias] === id), members: new Map(), groups: new Set(), families: new Set() }])));
// Use fully-qualified sequences, but count each canonical base only once.
const candidates = new Set(Object.keys(emoji));
for (const family of Object.values(families)) for (const glyph of family.members) candidates.add(glyph);
for (const [, , entries] of subgroups) for (const token of entries.split(' ')) if (token.endsWith('!')) candidates.add(token.slice(0, token.lastIndexOf('=')));
for (const glyph of candidates) {
  const result = emojiMotion.resolve(glyph, { skinTone: 'default' });
  const record = registry.get(motionAliases[result?.motionId] ?? result?.motionId);
  if (!record) continue;
  record.groups.add(groupNames[result.groupId] ?? result.groupId);
  if (result.familyId) record.families.add(locale[families[result.familyId]?.label] ?? families[result.familyId]?.label ?? result.familyId);
  if (!record.members.has(result.canonical)) record.members.set(result.canonical, { glyph: result.canonical, name: result.name, source: result.source, subgroup: result.unicodeSubgroup ?? result.groupId });
}
// The badge identifies changes made in this review, not earlier rounds.
const reviewedMotionIds = new Set(['glide', 'ride', 'wave', 'pulse', 'wobble', 'launch', 'search', 'swing', 'float', 'shake', 'flutter', 'sway', 'sip', 'twirl', 'nod', 'bob', 'breathe', 'leafSway', 'hoverFlight', 'gentleSip', 'carousel', 'underwater', 'railRide', 'rhythm', 'curiousTilt', 'cloudDrift', 'orbitFloat', 'writingTilt', 'gardenBounce', 'fabricSway', 'toolWiggle', 'bookPeek', 'handEmphasis', 'vesselRock', 'treatPop', 'mantelSwing', 'dropletBounce', 'clockTick', 'gentleFall', 'softSettle', 'climbStep', 'jugglingBeat', 'gestureBeat', 'hatTip', 'labSwirl', 'cleaningBeat', 'mailFloat', 'shoeStep', 'drumBeat', 'leafDrift', 'aircraftHover', 'creatureSkitter', 'birdBounce', 'mealJiggle', 'limbStep', 'vehicleRumble', 'peekTilt', 'sportSwing', 'bounce', 'fruitBounce', 'animalHop', 'luggageHop', 'toyBounce', 'spin', 'flip', 'flipHorizontal', 'flipVertical', 'hourglassTurn']);
const addedMotionIds = new Set(['etherealFade', 'meltAway', 'leafFade', 'flightLift', 'trainRhythm', 'roadBounce', 'seaSwell', 'rocketLift']);
const grid = document.querySelector('#motion-grid');
const sections = new Map();
for (const category of motionCategories) {
  const section = document.createElement('section'); section.className = 'motion-category';
  const heading = document.createElement('h3'); heading.textContent = category.label;
  const description = document.createElement('p'); description.textContent = category.description;
  const items = document.createElement('div'); items.className = 'motion-grid';
  section.append(heading, description, items); grid.append(section); sections.set(category.id, { section, items });
}
const cards = [];
for (const record of registry.values()) {
  const card = document.createElement('article'); card.className = 'motion-card';
  const header = document.createElement('div'); header.className = 'motion-header';
  const title = document.createElement('h3'); title.textContent = record.id;
  const duration = document.createElement('span'); duration.textContent = `基础 ${motions[record.id].options?.duration ?? 0} ms`;
  header.append(title, duration); card.append(header);
  if (addedMotionIds.has(record.id)) { const badge = document.createElement('span'); badge.className = 'motion-badge'; badge.textContent = '本次新增'; card.append(badge); }
  else if (reviewedMotionIds.has(record.id)) { const badge = document.createElement('span'); badge.className = 'motion-badge'; badge.textContent = '本次优化'; card.append(badge); }
  const examples = document.createElement('div'); examples.className = 'motion-examples';
  const members = [...record.members.values()].sort((a, b) => (a.source === 'family' ? 0 : a.source === 'preset' ? 1 : 2) - (b.source === 'family' ? 0 : b.source === 'preset' ? 1 : 2));
  const chosen = []; const usedSubgroups = new Set();
  for (const member of members) if (chosen.length < 3 && !usedSubgroups.has(member.subgroup)) { chosen.push(member); usedSubgroups.add(member.subgroup); }
  for (const member of members) if (chosen.length < 3 && !chosen.includes(member)) chosen.push(member);
  if (!chosen.length) chosen.push({ glyph: '🟡', name: '示意图形' });
  for (const member of chosen) {
    const button = document.createElement('button'); button.type = 'button'; button.title = locale[member.name] ?? member.name; button.setAttribute('aria-label', `播放 ${record.id}: ${locale[member.name] ?? member.name}`);
    const glyph = document.createElement('span'); glyph.textContent = member.glyph; glyph.setAttribute('aria-hidden', 'true'); button.append(glyph);
    button.addEventListener('click', () => {
      const assigned = emojiMotion.resolve(member.glyph);
      play(glyph, (motionAliases[assigned?.motionId] ?? assigned?.motionId) === record.id ? assigned.motion : motions[record.id]);
    }); examples.append(button);
  }
  card.append(examples);
  if (record.aliases.length) { const aliases = document.createElement('p'); aliases.className = 'motion-info motion-aliases'; const label = document.createElement('strong'); label.textContent = '兼容名称 '; aliases.append(label, document.createTextNode(record.aliases.join('、'))); card.append(aliases); }
  const details = document.createElement('p'); details.className = 'motion-info';
  const label = document.createElement('strong'); label.textContent = '适用分类 '; details.append(label, document.createTextNode([...record.groups].join('、') || '暂无内置匹配')); card.append(details);
  const familyInfo = document.createElement('p'); familyInfo.className = 'motion-info';
  const familyLabel = document.createElement('strong'); familyLabel.textContent = '动作家族 '; familyInfo.append(familyLabel, document.createTextNode([...record.families].join('、') || '—')); card.append(familyInfo);
  const count = document.createElement('p'); count.className = 'motion-info'; count.textContent = record.members.size ? `匹配 ${record.members.size} 个基础 emoji（不含肤色变体）` : '暂无内置匹配，使用示意图形'; card.append(count);
  card.dataset.search = [record.id, record.category.label, record.category.description, ...record.aliases, ...(addedMotionIds.has(record.id) ? ['本次新增'] : reviewedMotionIds.has(record.id) ? ['本次优化'] : []), ...record.groups, ...record.families, ...members.flatMap(m => [m.glyph, m.name, locale[m.name] ?? ''])].join(' ').toLowerCase();
  sections.get(record.category.id).items.append(card); cards.push(card);
}
const search = document.querySelector('#search'); const count = document.querySelector('#count'); const empty = document.querySelector('#empty');
function filter() { const query = search.value.trim().toLowerCase(); let visible = 0; for (const card of cards) { card.hidden = Boolean(query) && !card.dataset.search.includes(query); if (!card.hidden) visible++; } for (const { section, items } of sections.values()) section.hidden = ![...items.children].some(card => !card.hidden); count.textContent = `${visible} / ${cards.length} 个动作变体 · ${motionCategories.length} 个类别`; empty.hidden = visible !== 0; }
search.addEventListener('input', filter); filter();
