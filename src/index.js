import { motions as defaultMotions, groups as defaultGroups, emoji as defaultEmoji, decorations as defaultDecorations } from './presets.js';

/** Create an isolated registry; user definitions override defaults without global mutation. */
export function createEmojiMotion(config = {}) {
  const motions = { ...(config.defaults === false ? {} : defaultMotions), ...config.motions };
  const decorations = { ...(config.defaults === false ? {} : defaultDecorations), ...config.decorations };
  const groups = { ...(config.defaults === false ? {} : defaultGroups), ...config.groups };
  const entries = { ...(config.defaults === false ? {} : defaultEmoji), ...config.emoji };
  const aliases = new Map();
  for (const [glyph, entry] of Object.entries(entries)) {
    if (!groups[entry.group]) throw new Error(`Unknown group "${entry.group}" for ${glyph}`);
    const name = entry.motion ?? groups[entry.group].motion;
    if (!motions[name]) throw new Error(`Unknown motion "${name}" for ${glyph}`);
    if (entry.decoration && !decorations[entry.decoration]) throw new Error(`Unknown decoration "${entry.decoration}" for ${glyph}`);
    for (const alias of entry.variants ?? []) {
      if (alias in entries || aliases.has(alias)) throw new Error(`Duplicate emoji variant: ${alias}`);
      aliases.set(alias, glyph);
    }
  }
  for (const [id, group] of Object.entries(groups)) if (!motions[group.motion]) throw new Error(`Unknown motion "${group.motion}" for group ${id}`);
  const active = new WeakMap();
  function resolve(glyph) {
    const canonical = entries[glyph] ? glyph : aliases.get(glyph);
    if (!canonical) return undefined;
    const entry = entries[canonical];
    const group = groups[entry.group];
    const motionId = entry.motion ?? group.motion;
    return { glyph, canonical, ...entry, groupId: entry.group, group, motionId, motion: motions[motionId], decorationPreset: entry.decoration ? decorations[entry.decoration] : undefined };
  }
  function play(element, glyph, options = {}) {
    const result = resolve(glyph);
    if (!result || typeof element?.animate !== 'function') return null;
    if (!options.ignoreReducedMotion && typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
    active.get(element)?.dispose();
    const { motion } = result;
    // transformOrigin belongs in keyframes so it never mutates the host element's styles.
    const keyframes = motion.keyframes.map(frame => motion.origin ? { ...frame, transformOrigin: motion.origin } : { ...frame });
    const animation = element.animate(keyframes, { ...motion.options, ...options.animation });
    let decorationRoot;
    const decorationAnimations = [];
    const decorationOptions = options.decoration;
    const preset = result.decorationPreset;
    if (decorationOptions && preset) {
      const { container, anchor = preset.anchor, flipX = false, rotate = 0 } = decorationOptions;
      decorationRoot = container.ownerDocument.createElement('span');
      decorationRoot.setAttribute('aria-hidden', 'true');
      Object.assign(decorationRoot.style, { position: 'absolute', pointerEvents: 'none', left: anchor.x, top: anchor.y, width: '100%', height: '100%', transform: `scaleX(${flipX ? -1 : 1}) rotate(${rotate}deg)` });
      container.appendChild(decorationRoot);
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
      Promise.allSettled(decorationAnimations.map(item => item.finished)).then(() => decorationRoot.remove());
    }
    active.set(element, { dispose() { animation.cancel(); decorationAnimations.forEach(item => item.cancel()); decorationRoot?.remove(); } });
    return animation;
  }
  function bind(element, glyph, options = {}) {
    const trigger = options.trigger ?? element;
    const events = options.events ?? ['pointerenter', 'focus'];
    const handler = () => play(element, glyph, options);
    for (const event of events) trigger.addEventListener(event, handler);
    return () => { for (const event of events) trigger.removeEventListener(event, handler); active.get(element)?.dispose(); active.delete(element); };
  }
  return { resolve, play, bind, list: () => Object.keys(entries), groups: () => Object.entries(groups).map(([id, group]) => ({ id, ...group })) };
}
export { motions, groups, emoji, decorations } from './presets.js';
export const emojiMotion = createEmojiMotion();
