import { emojiMotion } from './lite.js';
import { createEmojiMotionElement } from './element-core.js';
export const EmojiMotionElement = createEmojiMotionElement(emojiMotion);
export function defineEmojiMotion() {
  if (globalThis.customElements && !customElements.get('emoji-motion')) customElements.define('emoji-motion', EmojiMotionElement);
}
defineEmojiMotion();
