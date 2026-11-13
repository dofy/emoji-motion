import { createEmojiMotion, emojiMotion, createSpringMotion, type MotionFamily, type Resolution, type SkinTone } from '@dofy/native-emoji-motion';

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
import { EmojiMotion as ReactEmoji } from '@dofy/native-emoji-motion/react';
import { EmojiMotion as VueEmoji } from '@dofy/native-emoji-motion/vue';
import { animateEmoji } from '@dofy/native-emoji-motion/svelte';
const ref = createRef<HTMLButtonElement>();
createElement(ReactEmoji, { emoji: '👋', skinTone: 'medium', triggerRef: ref });
void VueEmoji;
const action = animateEmoji(document.createElement('span'), { emoji: '👋', skinTone: 'dark' });
action.destroy();
import SvelteEmoji from '@dofy/native-emoji-motion/svelte/EmojiMotion.svelte';
import { EmojiMotionElement } from '@dofy/native-emoji-motion/element';
void SvelteEmoji;
void EmojiMotionElement;
createElement(ReactEmoji, { emoji: '👋', display: 'block' });
import { createEmojiMotion as createLite } from '@dofy/native-emoji-motion/lite';
import { EmojiMotion as ReactLite } from '@dofy/native-emoji-motion/react/lite';
import { EmojiMotion as VueLite } from '@dofy/native-emoji-motion/vue/lite';
import SvelteLite from '@dofy/native-emoji-motion/svelte/EmojiMotionLite.svelte';
import { EmojiMotionElement as ElementLite } from '@dofy/native-emoji-motion/element/lite';
void [createLite, ReactLite, VueLite, SvelteLite, ElementLite];
const automaticRegistry = createEmojiMotion({
  autoDetect: true,
  classifications: {
    subgroups: { 'animal-mammal': { group: 'nature', motion: 'bounce' } },
    groups: { 'Animals & Nature': { group: 'nature' } },
    fallback: { group: 'other', motion: 'bounce' },
  },
});
const classification = automaticRegistry.resolve('🐶');
if (classification) { const source: string = classification.source; void source; }
const family: MotionFamily = { label: 'Balls', group: 'activities', motion: 'custom', members: ['🥎'], decorations: ['sparkle', 'impact'] };
const familyRegistry = createEmojiMotion({ motions: { custom: createSpringMotion({ height: 20, rebounds: 2 }) }, families: { balls: family } });
familyRegistry.families();
