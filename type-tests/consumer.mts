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
