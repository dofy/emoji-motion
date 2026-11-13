<script>
  import { animateEmoji } from './svelte-lite.js';
  import { emojiMotion } from './lite.js';
  export let emoji;
  export let skinTone = undefined;
  export let registry = emojiMotion;
  export let decoration = true;
  export let display = 'inline';
  export let trigger = undefined;
  export let label = undefined;
  export let events = ['pointerenter', 'focus', 'click'];
  let wrapper;
  $: resolved = registry.resolve(emoji, { skinTone });
</script>

<span bind:this={wrapper} role="img" aria-label={label ?? resolved?.name ?? emoji}
  tabindex={trigger ? -1 : 0} style:display={display === 'block' ? 'block' : 'inline-block'}>
  <span style="display: inline-block; position: relative">
    <span aria-hidden="true" style="display: inline-block"
      use:animateEmoji={{ emoji, skinTone, registry, trigger: trigger ?? wrapper, decoration, events }}>{resolved?.glyph ?? emoji}</span>
  </span>
</span>
