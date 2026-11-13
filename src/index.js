import { createRegistry } from './registry.js';
import { lookupUnicode, looksLikeEmoji } from './unicode.js';

const classifier = { lookup: lookupUnicode, looksLikeEmoji };
export function createEmojiMotion(config = {}) { return createRegistry(config, classifier); }
export { motions, groups, emoji, decorations } from './presets.js';
export { unicodeVersion } from './unicode.js';
export const emojiMotion = createEmojiMotion();
