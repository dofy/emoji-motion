const excluded = 'script, style, noscript, template, textarea, input, select, option, pre, code, kbd, samp, svg, math, [contenteditable]:not([contenteditable="false"]), [data-emoji-motion], [data-emoji-motion-ignore], emoji-motion';
const fallbackPattern = /(?:[\u{1F1E6}-\u{1F1FF}]{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}[\uFE0E\uFE0F]?(?:\p{Emoji_Modifier})?(?:[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u200D\p{Extended_Pictographic}[\uFE0E\uFE0F]?(?:\p{Emoji_Modifier})?)*)/gu;

// Do not split a ZWJ sequence, flag, keycap, or skin tone into separate glyphs.
function segments(text, segmenter) {
  if (segmenter) {
    return Array.from(segmenter.segment(text), part => ({ glyph: part.segment, index: part.index }));
  }
  return Array.from(text.matchAll(fallbackPattern), match => ({ glyph: match[0], index: match.index }));
}

export function enhance(registry, options = {}) {
  const doc = globalThis.document;
  if (!doc) throw new Error('enhance() requires a browser document');
  const root = typeof options.root === 'string' ? doc.querySelector(options.root) : (options.root ?? doc.body);
  if (!root || ![1, 9, 11].includes(root.nodeType)) throw new Error('enhance() root must match an element or be a DOM container');
  const exclusion = options.exclude ? `${excluded}, ${options.exclude}` : excluded;
  // Validate selectors before doing any DOM work.
  doc.createElement('span').matches(exclusion);
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const owned = new Map();
  let closed = false;
  let enabled = false;
  const isExcluded = node => {
    const parent = node.nodeType === 1 ? node : node.parentElement;
    return Boolean(parent?.closest(exclusion));
  };
  function transform(node) {
    if (!node.parentNode || isExcluded(node)) return;
    const text = node.data;
    const hits = segments(text, segmenter).filter(({ glyph }) => registry.resolve(glyph));
    if (!hits.length) return;
    const fragment = node.ownerDocument.createDocumentFragment();
    let cursor = 0;
    for (const { glyph, index } of hits) {
      if (index > cursor) fragment.append(node.ownerDocument.createTextNode(text.slice(cursor, index)));
      const wrapper = node.ownerDocument.createElement('span');
      wrapper.setAttribute('data-emoji-motion', 'enhanced');
      Object.assign(wrapper.style, { display: 'inline-block', position: 'relative', isolation: 'isolate' });
      const inner = node.ownerDocument.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = glyph;
      wrapper.append(inner);
      const dispose = registry.bind(inner, glyph, { events: options.events ?? ['pointerenter', 'focus', 'click'], ...(options.decoration ? { decoration: { container: wrapper } } : {}) });
      owned.set(wrapper, dispose);
      fragment.append(wrapper);
      cursor = index + glyph.length;
    }
    if (cursor < text.length) fragment.append(node.ownerDocument.createTextNode(text.slice(cursor)));
    node.replaceWith(fragment);
  }
  function scan(container) {
    if (isExcluded(container)) return;
    if (container.nodeType === 3) { transform(container); return; }
    const walker = container.ownerDocument.createTreeWalker(container, 4);
    const nodes = [];
    while (walker.nextNode()) if (!isExcluded(walker.currentNode)) nodes.push(walker.currentNode);
    for (const node of nodes) transform(node);
  }
  const Observer = root.ownerDocument?.defaultView?.MutationObserver ?? doc.defaultView?.MutationObserver;
  const observer = options.observe === false || !Observer ? null : new Observer(records => {
    if (!enabled || closed) return;
    const candidates = new Set();
    for (const record of records) {
      if (record.type === 'characterData') candidates.add(record.target);
      else for (const node of record.addedNodes) if ([1, 3, 11].includes(node.nodeType)) candidates.add(node);
    }
    for (const node of candidates) if (root.contains(node)) scan(node);
    // Discard bindings for removed content without touching nodes the application moved.
    for (const [wrapper, dispose] of owned) if (!root.contains(wrapper)) { dispose(); wrapper.removeAttribute('data-emoji-motion'); owned.delete(wrapper); }
  });
  function disable() {
    if (closed || !enabled) return;
    enabled = false;
    observer?.disconnect();
    for (const [wrapper, dispose] of owned) {
      dispose();
      if (wrapper.parentNode && root.contains(wrapper)) wrapper.replaceWith(wrapper.ownerDocument.createTextNode(wrapper.textContent));
    }
    owned.clear();
  }
  function enable() {
    if (closed) throw new Error('Cannot enable a cleaned up enhancer');
    if (enabled) return;
    enabled = true;
    scan(root.nodeType === 9 ? root.documentElement : root);
    observer?.observe(root, { childList: true, subtree: true, characterData: true });
  }
  if (options.enabled !== false) enable();
  return { enable, disable, cleanup() {
    if (closed) return;
    disable();
    closed = true;
  } };
}
