import { SvelteComponentTyped } from 'svelte';
import type { EmojiMotion as Registry, SkinTone } from './index.js';
export interface EmojiMotionProps {
  emoji: string;
  skinTone?: SkinTone;
  registry?: Registry;
  decoration?: boolean;
  trigger?: EventTarget;
  label?: string;
  events?: string[];
}
export default class EmojiMotion extends SvelteComponentTyped<EmojiMotionProps> {}
