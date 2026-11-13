'use client';
import { createElement, useEffect, useRef } from 'react';

const defaultEvents = ['pointerenter', 'focus', 'click'];
/** A native emoji with optional motion and decorations. */
export function createEmojiMotionComponent(emojiMotion) {
  return function EmojiMotion({ emoji, skinTone, registry = emojiMotion, decoration = true, events = defaultEvents, triggerRef, label, className, style, ...attributes }) {
  const wrapper = useRef(null);
  const glyph = useRef(null);
  const visual = useRef(null);
  const result = registry.resolve(emoji, { skinTone });
  useEffect(() => {
    if (!wrapper.current || !glyph.current) return;
    return registry.bind(glyph.current, emoji, { trigger: triggerRef?.current ?? wrapper.current, events, skinTone, ...(decoration ? { decoration: { container: visual.current } } : {}) });
  }, [registry, emoji, skinTone, decoration, events, triggerRef]);
  return createElement('span', { ...attributes, className, ref: wrapper, 'data-emoji-motion': 'component', role: 'img', 'aria-label': label ?? result?.name ?? emoji, tabIndex: attributes.tabIndex ?? (triggerRef ? -1 : 0), style },
    createElement('span', { ref: visual, style: { display: 'inline-block', position: 'relative', isolation: 'isolate' } },
      createElement('span', { ref: glyph, 'aria-hidden': 'true', style: { display: 'inline-block' } }, result?.glyph ?? emoji)));
}
}
