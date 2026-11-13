import { defineComponent, h, ref, watchEffect, onBeforeUnmount } from 'vue';
import { emojiMotion } from './index.js';

const defaultEvents = ['pointerenter', 'focus', 'click'];
export const EmojiMotion = defineComponent({
  name: 'EmojiMotion',
  inheritAttrs: false,
  props: {
    emoji: { type: String, required: true }, skinTone: String, registry: { type: Object, default: () => emojiMotion },
    decoration: { type: Boolean, default: true }, display: { type: String, default: 'inline' }, trigger: { type: Object, default: null }, events: { type: Array, default: () => defaultEvents }, label: String
  },
  setup(props, { attrs }) {
    const wrapper = ref(null); const visual = ref(null); const glyph = ref(null);
    const stop = watchEffect(onCleanup => {
      const target = glyph.value; const trigger = wrapper.value;
      const { emoji, registry, skinTone, decoration, events } = props;
      // Access skinTone so rebinding also happens when the rendered variant changes.
      void skinTone;
      if (target && trigger) onCleanup(registry.bind(target, emoji, { trigger: props.trigger ?? trigger, events, ...(decoration ? { decoration: { container: visual.value } } : {}) }));
    }, { flush: 'post' });
    onBeforeUnmount(stop);
    return () => {
      const result = props.registry.resolve(props.emoji, { skinTone: props.skinTone });
      return h('span', { ...attrs, ref: wrapper, role: 'img', 'aria-label': props.label ?? result?.name ?? props.emoji, tabindex: attrs.tabindex ?? (props.trigger ? -1 : 0), style: [attrs.style, { display: props.display === 'block' ? 'block' : 'inline-block' }] },
        h('span', { ref: visual, style: { display: 'inline-block', position: 'relative' } },
          h('span', { ref: glyph, 'aria-hidden': 'true', style: { display: 'inline-block' } }, result?.glyph ?? props.emoji)));
    };
  }
});
