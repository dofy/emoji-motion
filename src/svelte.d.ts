import type { EmojiMotion as Registry, SkinTone } from './index.js';
export interface AnimateEmojiOptions { emoji: string; skinTone?: SkinTone; registry?: Registry; trigger?: EventTarget; decoration?: boolean; events?: string[] }
export declare function animateEmoji(node: HTMLElement, options: AnimateEmojiOptions): { update(options: AnimateEmojiOptions): void; destroy(): void };
