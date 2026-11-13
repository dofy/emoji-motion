import type { DefineComponent } from 'vue';
import type { EmojiMotion as Registry, SkinTone } from './index.js';
export interface EmojiMotionProps {
  emoji: string;
  skinTone?: SkinTone;
  registry?: Registry;
  decoration?: boolean;
  display?: 'inline' | 'block';
  events?: string[];
  label?: string;
  trigger?: HTMLElement | null;
}
export declare const EmojiMotion: DefineComponent<EmojiMotionProps>;
