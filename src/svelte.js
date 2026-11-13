import { emojiMotion } from './index.js';

/** Svelte action. Apply it to a span dedicated to the emoji. */
export function animateEmoji(node, initial) {
  let dispose = () => {};
  function update(options) {
    dispose();
    const { emoji, skinTone, registry = emojiMotion, trigger = node, decoration = false, events = ['pointerenter', 'focus', 'click'] } = options;
    node.textContent = registry.resolve(emoji, { skinTone })?.glyph ?? emoji;
    dispose = registry.bind(node, emoji, { trigger, events, ...(decoration && node.parentElement ? { decoration: { container: node.parentElement } } : {}) });
  }
  update(initial);
  return { update, destroy() { dispose(); } };
}
