import { createRegistry } from './registry.js';
/** Preset-only entry: does not load Unicode classification data. */
export function createEmojiMotion(config = {}) { return createRegistry(config); }
export { motions, groups, emoji, decorations } from './presets.js';
export const emojiMotion = createEmojiMotion();
