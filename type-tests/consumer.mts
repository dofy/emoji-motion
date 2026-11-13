import { createEmojiMotion, emojiMotion, type Resolution, type SkinTone } from 'native-emoji-motion';

const tone: SkinTone = 'medium';
const registry = createEmojiMotion({ defaultSkinTone: tone });
const result: Resolution | undefined = registry.resolve('👋');
if (result) {
  const label: string = result.group.label;
  const frames: Keyframe[] = result.motion.keyframes;
  const glyph: string = result.glyph;
  void [label, frames, glyph];
}
const element = document.createElement('span');
const dispose: () => void = emojiMotion.bind(element, '👋', { trigger: element });
dispose();

import { createElement, createRef } from 'react';
import { EmojiMotion as ReactEmoji } from 'native-emoji-motion/react';
import { EmojiMotion as VueEmoji } from 'native-emoji-motion/vue';
import { animateEmoji } from 'native-emoji-motion/svelte';
const ref = createRef<HTMLButtonElement>();
createElement(ReactEmoji, { emoji: '👋', skinTone: 'medium', triggerRef: ref });
void VueEmoji;
const action = animateEmoji(document.createElement('span'), { emoji: '👋', skinTone: 'dark' });
action.destroy();
import SvelteEmoji from 'native-emoji-motion/svelte/EmojiMotion.svelte';
import { EmojiMotionElement } from 'native-emoji-motion/element';
void SvelteEmoji;
void EmojiMotionElement;
createElement(ReactEmoji, { emoji: '👋', display: 'block' });
