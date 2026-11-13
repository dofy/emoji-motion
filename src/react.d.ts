import type { CSSProperties, HTMLAttributes, ReactElement, RefObject } from 'react';
import type { EmojiMotion as Registry, SkinTone } from './index.js';
export interface EmojiMotionProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  emoji: string;
  skinTone?: SkinTone;
  registry?: Registry;
  decoration?: boolean;
  display?: 'inline' | 'block';
  events?: string[];
  label?: string;
  triggerRef?: RefObject<HTMLElement | null>;
  style?: CSSProperties;
}
export declare function EmojiMotion(props: EmojiMotionProps): ReactElement;
