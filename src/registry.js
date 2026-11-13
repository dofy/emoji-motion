import { enhance } from './enhance.js';
import { motions as defaultMotions, groups as defaultGroups, emoji as defaultEmoji, decorations as defaultDecorations, families as defaultFamilies } from './presets.js';

const toneNames = ['default', 'light', 'medium-light', 'medium', 'medium-dark', 'dark'];
function validateTone(tone) { if (!toneNames.includes(tone)) throw new Error(`Unknown skin tone "${tone}"`); }
function defaultClassification(info) {
  const group = info.unicodeGroup; const sub = info.unicodeSubgroup;
  if (group === 'Smileys & Emotion') return { group: sub === 'heart' ? 'hearts' : 'faces' };
  if (group === 'People & Body') return { group: sub.startsWith('hand') ? 'gestures' : 'people', ...(sub.startsWith('hand') && sub !== 'hand-fingers-open' ? { motion: 'wobble' } : {}) };
  if (group === 'Animals & Nature') return { group: 'nature', ...(sub.startsWith('animal-') ? { motion: 'bounce' } : {}) };
  if (group === 'Food & Drink') return { group: 'food' };
  if (group === 'Travel & Places') return { group: 'travel', motion: sub === 'transport-ground' ? 'ride' : sub === 'transport-air' ? 'glide' : sub === 'transport-water' ? 'wobble' : 'float' };
  if (group === 'Activities') return { group: 'activities' };
  if (group === 'Objects') return { group: 'objects' };
  if (group === 'Symbols') return { group: 'symbols', motion: 'pulse' };
  if (group === 'Flags') return { group: 'flags' };
  return { group: 'other' };
}

/** Build a registry with an optional classifier. User definitions always win. */
export function createRegistry(config = {}, classifier) {
  const useDefaults = config.defaults !== false;
  const motions = { ...(useDefaults ? defaultMotions : {}), ...config.motions };
  const decorations = { ...(useDefaults ? defaultDecorations : {}), ...config.decorations };
  const groups = { ...(useDefaults ? defaultGroups : {}), ...config.groups };
  const builtin = useDefaults ? defaultEmoji : {};
  const user = config.emoji ?? {};
  const entries = { ...builtin, ...user };
  const userFamilies = config.families ?? {};
  const builtinFamilies = useDefaults ? Object.fromEntries(Object.entries(defaultFamilies).filter(([id]) => !Object.hasOwn(userFamilies, id))) : {};
  if (config.autoDetect === true && !classifier) throw new Error('Automatic classification is not included in the lite entry');
  const autoDetect = (config.autoDetect ?? useDefaults) && Boolean(classifier);
  const rules = config.classifications ?? {};
  let defaultSkinTone = config.defaultSkinTone ?? 'default'; validateTone(defaultSkinTone);
  function makeAliases(definitions) {
    const result = new Map();
    for (const [glyph, entry] of Object.entries(definitions)) {
      if (!groups[entry.group]) throw new Error(`Unknown group "${entry.group}" for ${glyph}`);
      const name = entry.motion ?? groups[entry.group].motion;
      if (!motions[name]) throw new Error(`Unknown motion "${name}" for ${glyph}`);
      if (entry.decoration && !decorations[entry.decoration]) throw new Error(`Unknown decoration "${entry.decoration}" for ${glyph}`);
      for (const tone of Object.keys(entry.skinTones ?? {})) { validateTone(tone); if (tone === 'default') throw new Error('Use the canonical glyph for the default skin tone'); }
      for (const alias of [...(entry.variants ?? []), ...Object.values(entry.skinTones ?? {})]) {
        if (Object.hasOwn(definitions, alias) || result.has(alias)) throw new Error(`Duplicate emoji variant: ${alias}`);
        result.set(alias, glyph);
      }
    }
    return result;
  }
  const builtinAliases = makeAliases(builtin); const userAliases = makeAliases(user);
  function makeFamilyIndex(definitions) {
    const index = new Map();
    for (const [id, family] of Object.entries(definitions)) {
      if (!groups[family.group]) throw new Error(`Unknown group "${family.group}" for family ${id}`);
      if (!motions[family.motion]) throw new Error(`Unknown motion "${family.motion}" for family ${id}`);
      if (family.decoration && !decorations[family.decoration]) throw new Error(`Unknown decoration "${family.decoration}" for family ${id}`);
      if (family.decorations && !Array.isArray(family.decorations)) throw new Error(`Family ${id} decorations must be an array`);
      for (const decoration of family.decorations ?? []) if (!decorations[decoration]) throw new Error(`Unknown decoration "${decoration}" for family ${id}`);
      if (!Array.isArray(family.members) || !family.members.length) throw new Error(`Family ${id} needs members`);
      const toneMaps = new Map();
      for (const [alias, base] of Object.entries(family.aliases ?? {})) {
        if (!family.members.includes(base)) throw new Error(`Unknown family member "${base}" for alias ${alias}`);
        const modifiers = [...alias].filter(char => { const code = char.codePointAt(0); return code >= 0x1f3fb && code <= 0x1f3ff; });
        if (modifiers.length === 1) {
          const map = toneMaps.get(base) ?? {}; map[toneNames[modifiers[0].codePointAt(0) - 0x1f3fb + 1]] = alias; toneMaps.set(base, map);
        }
      }
      for (const [glyph, base] of [...family.members.map(glyph => [glyph, glyph]), ...Object.entries(family.aliases ?? {})]) {
        if (typeof glyph !== 'string' || !glyph || index.has(glyph)) throw new Error(`Duplicate or invalid family member: ${glyph}`);
        index.set(glyph, { id, family, base, skinTones: toneMaps.get(base) });
      }
    }
    return index;
  }
  const builtinFamilyIndex = makeFamilyIndex(builtinFamilies);
  const userFamilyIndex = makeFamilyIndex(userFamilies);
  for (const [id, group] of Object.entries(groups)) if (!motions[group.motion]) throw new Error(`Unknown motion "${group.motion}" for group ${id}`);
  for (const rule of [...Object.values(rules.groups ?? {}), ...Object.values(rules.subgroups ?? {}), ...(rules.fallback ? [rules.fallback] : [])]) {
    if (!groups[rule.group]) throw new Error(`Unknown classification group "${rule.group}"`);
    if (rule.motion && !motions[rule.motion]) throw new Error(`Unknown classification motion "${rule.motion}"`);
  }
  const active = new WeakMap();
  function resolve(glyph, options = {}) {
    if (typeof glyph !== 'string') return undefined;
    if (options.skinTone !== undefined) validateTone(options.skinTone);
    const info = autoDetect ? classifier.lookup(glyph) : undefined;
    const desiredTone = options.skinTone ?? info?.tone ?? defaultSkinTone;
    const requestedVariant = info && !info.multiTone && desiredTone !== 'default' ? info.skinTones[desiredTone] : undefined;
    const candidates = [requestedVariant, glyph, userAliases.get(requestedVariant), userAliases.get(glyph), info?.canonical, builtinAliases.get(glyph)].filter(Boolean);
    let canonical = candidates.find(key => Object.hasOwn(user, key));
    let source = canonical ? 'user' : undefined;
    const userRule = info && (rules.subgroups?.[info.unicodeSubgroup] ?? rules.groups?.[info.unicodeGroup]);
    const familyKeys = [requestedVariant, glyph, info?.canonical].filter(Boolean);
    const findFamily = index => familyKeys.map(key => index.get(key)).find(Boolean);
    const userFamily = !canonical && !userRule ? findFamily(userFamilyIndex) : undefined;
    // A custom emoji wins first, followed by custom classification rules.
    if (!canonical && !userRule && !userFamily) { canonical = candidates.find(key => Object.hasOwn(builtin, key)); if (canonical) source = 'preset'; }
    const familyMatch = !canonical && !userRule ? (userFamily ?? findFamily(builtinFamilyIndex)) : undefined;
    let entry;
    let autoRule;
    if (familyMatch) {
      canonical = familyMatch.base; source = 'family';
      const family = familyMatch.family;
      entry = { group: family.group, name: info?.name ?? family.label, motion: family.motion, decoration: family.decoration, decorations: family.decorations, skinTones: familyMatch.skinTones, familyId: familyMatch.id, animation: family.animation };
    } else if (canonical) entry = source === 'user' ? user[canonical] : builtin[canonical];
    else if (info) {
      canonical = info.canonical; source = userRule ? 'user-classification' : 'unicode';
      autoRule = userRule ?? defaultClassification(info);
      // A user-defined group overrides the default automatic motion too.
      if (!userRule && config.groups?.[autoRule.group]) autoRule = { group: autoRule.group };
      entry = { group: autoRule.group, name: info.name, motion: autoRule.motion };
    } else if (autoDetect && classifier.looksLikeEmoji(glyph)) {
      canonical = glyph; source = 'fallback'; autoRule = rules.fallback ?? { group: 'other' };
      entry = { group: autoRule.group, name: 'Emoji', motion: autoRule.motion };
    } else return undefined;
    const group = groups[entry.group];
    if (!group) throw new Error(`Unknown classification group "${entry.group}"`);
    // An explicitly supplied group default outranks handcrafted preset motions.
    // A user-defined emoji or classification remains more specific.
    const groupOverride = (source === 'preset' || (source === 'family' && !userFamily)) && Object.hasOwn(config.groups ?? {}, entry.group);
    const motionId = groupOverride ? group.motion : entry.motion ?? group.motion;
    if (!motions[motionId]) throw new Error(`Unknown classification motion "${motionId}"`);
    const mappedTones = entry.skinTones ?? info?.skinTones;
    const explicitTone = entry.skinTones ? Object.entries(entry.skinTones).find(([, variant]) => variant === glyph)?.[0] : info?.tone;
    const skinTone = options.skinTone ?? explicitTone ?? defaultSkinTone;
    let renderedGlyph = glyph;
    // Mixed-tone sequences are retained: no single requested tone can safely rewrite them.
    if (mappedTones && !info?.multiTone) {
      if (skinTone !== 'default') renderedGlyph = mappedTones[skinTone] ?? glyph;
      else if (explicitTone) renderedGlyph = canonical;
    }
    const motion = entry.animation && !groupOverride ? { ...motions[motionId], options: { ...motions[motionId].options, ...entry.animation } } : motions[motionId];
    const decorationPresets = [entry.decoration, ...(entry.decorations ?? [])].filter(Boolean).map(name => decorations[name]);
    return { ...entry, glyph: renderedGlyph, canonical, skinTone, groupId: entry.group, group, motionId, motion, decorationPreset: decorationPresets[0], decorationPresets, source, ...(info ? { unicodeGroup: info.unicodeGroup, unicodeSubgroup: info.unicodeSubgroup } : {}) };
  }
  function play(element, glyph, options = {}) {
    const result = resolve(glyph, { skinTone: options.skinTone });
    if (!result || typeof element?.animate !== 'function') return null;
    if (!options.ignoreReducedMotion && typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
    active.get(element)?.dispose();
    const { motion } = result;
    // transformOrigin belongs in keyframes so it never mutates the host element's styles.
    const keyframes = motion.keyframes.map(frame => motion.origin ? { ...frame, transformOrigin: motion.origin } : { ...frame });
    const animation = element.animate(keyframes, { ...motion.options, ...options.animation });
    const decorationRoots = [];
    const decorationAnimations = [];
    const decorationOptions = options.decoration;
    if (decorationOptions) for (const preset of result.decorationPresets) {
      const { container, anchor = preset.anchor, flipX = false, rotate = 0 } = decorationOptions;
      const decorationRoot = container.ownerDocument.createElement('span');
      decorationRoots.push(decorationRoot);
      decorationRoot.setAttribute('aria-hidden', 'true');
      Object.assign(decorationRoot.style, { position: 'absolute', pointerEvents: 'none', left: anchor.x, top: anchor.y, width: '100%', height: '100%', transform: `scaleX(${flipX ? -1 : 1}) rotate(${rotate}deg)` });
      container.appendChild(decorationRoot);
      const start = decorationAnimations.length;
      for (const layer of preset.layers) {
        const node = layer.svg ? container.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'svg') : container.ownerDocument.createElement('span');
        if (layer.svg) {
          node.setAttribute('viewBox', layer.svg.viewBox);
          for (const shape of layer.svg.elements) {
            const child = container.ownerDocument.createElementNS('http://www.w3.org/2000/svg', shape.tag);
            for (const [key, value] of Object.entries(shape.attrs)) child.setAttribute(key, value);
            node.appendChild(child);
          }
        }
        Object.assign(node.style, { position: 'absolute', left: '0', top: '0', opacity: '0', ...layer.style });
        decorationRoot.appendChild(node);
        decorationAnimations.push(node.animate(layer.keyframes, layer.options));
      }
      const layerAnimations = decorationAnimations.slice(start);
      Promise.allSettled(layerAnimations.map(item => item.finished)).then(() => decorationRoot.remove());
    }
    active.set(element, { dispose() { animation.cancel(); decorationAnimations.forEach(item => item.cancel()); decorationRoots.forEach(root => root.remove()); } });
    return animation;
  }
  function bind(element, glyph, options = {}) {
    const trigger = options.trigger ?? element;
    const events = options.events ?? ['pointerenter', 'focus'];
    const cooldown = options.cooldown ?? 260;
    let lastStart = -Infinity;
    const handler = event => {
      // A tap fires pointerenter and click together; let the click play it once.
      if (event?.type === 'pointerenter' && event.pointerType === 'touch') return;
      // A mouse click also focuses the trigger; only keyboard focus replays.
      if ((event?.type === 'focus' || event?.type === 'focusin') && typeof event.target?.matches === 'function') {
        try { if (!event.target.matches(':focus-visible')) return; } catch { /* Older engines without :focus-visible. */ }
      }
      // Quick repeated triggers would restart the motion before it reads.
      const now = globalThis.performance?.now?.() ?? Date.now();
      if (now - lastStart < cooldown) return;
      lastStart = now;
      play(element, glyph, options);
    };
    for (const event of events) trigger.addEventListener(event, handler);
    return () => { for (const event of events) trigger.removeEventListener(event, handler); active.get(element)?.dispose(); active.delete(element); };
  }
  return { resolve, play, bind, enhance(options) { return enhance({ resolve, bind }, options); }, setDefaultSkinTone(tone) { validateTone(tone); defaultSkinTone = tone; }, getDefaultSkinTone: () => defaultSkinTone, list: () => Object.keys(entries), groups: () => Object.entries(groups).map(([id, group]) => ({ id, ...group })), families: () => Object.entries({ ...builtinFamilies, ...userFamilies }).map(([id, family]) => ({ ...family, id, members: [...family.members], ...(family.aliases ? { aliases: { ...family.aliases } } : {}), ...(family.decorations ? { decorations: [...family.decorations] } : {}), ...(family.animation ? { animation: { ...family.animation } } : {}) })) };
}
