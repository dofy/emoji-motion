import { unicodeVersion, names, subgroups } from './unicode-data.js';

const skinCodes = new Map([['🏻', 'light'], ['🏼', 'medium-light'], ['🏽', 'medium'], ['🏾', 'medium-dark'], ['🏿', 'dark']]);
const stripped = glyph => [...glyph].filter(char => char !== '\uFE0F' && !skinCodes.has(char)).join('');
let database;
function prepare() {
  if (database) return database;
  const entries = new Map(); const baseCandidates = new Map();
  for (const [group, subgroup, packed] of subgroups) for (const token of packed.split(' ')) {
    const separator = token.lastIndexOf('=');
    const glyph = token.slice(0, separator); const info = token.slice(separator + 1);
    const qualified = info.endsWith('!');
    const name = names[parseInt(qualified ? info.slice(0, -1) : info, 36)];
    const toneChars = [...glyph].filter(char => skinCodes.has(char));
    entries.set(glyph, { glyph, unicodeGroup: group, unicodeSubgroup: subgroup, name, qualified, toneChars });
    if (qualified && toneChars.length === 0) {
      const key = stripped(glyph); const candidates = baseCandidates.get(key) ?? new Set();
      candidates.add(glyph); baseCandidates.set(key, candidates);
    }
  }
  const variants = new Map();
  for (const entry of entries.values()) {
    const candidates = baseCandidates.get(stripped(entry.glyph));
    entry.canonical = candidates?.size === 1 ? candidates.values().next().value : entry.glyph;
    if (entry.qualified && entry.toneChars.length === 1 && candidates?.size === 1) {
      const tones = variants.get(entry.canonical) ?? new Map();
      const tone = skinCodes.get(entry.toneChars[0]);
      // Do not guess if more than one official sequence maps to the same tone.
      tones.set(tone, tones.has(tone) && tones.get(tone) !== entry.glyph ? null : entry.glyph);
      variants.set(entry.canonical, tones);
    }
  }
  database = { entries, variants };
  return database;
}
export function lookupUnicode(glyph) {
  const data = prepare(); const entry = data.entries.get(glyph);
  if (!entry) return undefined;
  const tone = entry.toneChars.length === 1 ? skinCodes.get(entry.toneChars[0]) : undefined;
  const skinTones = Object.fromEntries([...(data.variants.get(entry.canonical) ?? [])].filter(([, value]) => value));
  return { canonical: entry.canonical, unicodeGroup: entry.unicodeGroup, unicodeSubgroup: entry.unicodeSubgroup, name: entry.name, tone, multiTone: entry.toneChars.length > 1, skinTones };
}
// Only recognize future sequences when the engine can validate them, or a single
// pictographic code point (with an optional presentation selector). Never treat
// arbitrary strings, components, digits, or invented ZWJ sequences as emoji.
let rgi;
try { rgi = new RegExp('^\\p{RGI_Emoji}$', 'v'); } catch { /* old engines use the conservative fallback */ }
const pictographic = /^(?=\p{Assigned})\p{Extended_Pictographic}\uFE0F?$/u;
const component = /^\p{Emoji_Component}$/u;
export function looksLikeEmoji(glyph) {
  if (typeof glyph !== 'string' || !glyph || component.test(glyph)) return false;
  return Boolean(rgi?.test(glyph) || pictographic.test(glyph));
}
export { unicodeVersion };
