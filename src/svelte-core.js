
/** Svelte action. Apply it to a span dedicated to the emoji. */
export function createAnimateEmoji(emojiMotion) {
 return function animateEmoji(node, initial) {
  const hadMarker = node.hasAttribute('data-emoji-motion');
  if (!hadMarker) node.setAttribute('data-emoji-motion', 'action');
  let dispose = () => {};
  function update(options) {
    dispose();
    const { emoji, skinTone, registry = emojiMotion, trigger = node, decoration = false, events = ['pointerenter', 'focus', 'click'] } = options;
    node.textContent = registry.resolve(emoji, { skinTone })?.glyph ?? emoji;
    dispose = registry.bind(node, emoji, { trigger, events, skinTone, ...(decoration && node.parentElement ? { decoration: { container: node.parentElement } } : {}) });
  }
  update(initial);
  return { update, destroy() { dispose(); if (!hadMarker) node.removeAttribute('data-emoji-motion'); } };
}
}
