# Emoji Motion

Small, expressive animations for native emoji. A framework independent library with Unicode based automatic classification, reusable motion presets and explicit per emoji overrides.

## Try the demo

[Explore the live demo](https://emoji-motion.phpz.org/) or run it locally:

```sh
npm run dev
```

Open http://127.0.0.1:4173. Hover, focus or tap a card; use the filters to explore the groups. The demo imports the same public entry point as an application. Use **Try any emoji** to preview automatic classification. The gallery starts with a curated selection from across the groups. Choose **All presets** for the complete handcrafted list, **With effects** for decorative SVG layers, or select a semantic group. Choose a framework and display mode, then select an emoji to copy its component. The examples show how to place an emoji in a sentence or on its own line.

## Installation

```sh
npm install @dofy/native-emoji-motion
```

The package is ESM and uses the browser Web Animations API. React, Vue and Svelte are optional peers: install the framework used by your application.

## Components

Use an emoji directly as a component. `display` is `inline` by default and can be set to `block`; all components animate on hover, focus and click and use built in SVG effects when available. Use these imports in a bundled app. React, Vue and Svelte are optional peers, so the core stays framework independent.

```jsx
import { EmojiMotion } from '@dofy/native-emoji-motion/react';

<p>Hello <EmojiMotion emoji="👋" skinTone="medium" /></p>
<EmojiMotion emoji="📡" display="block" />
```

```vue
<script setup>
import { EmojiMotion } from '@dofy/native-emoji-motion/vue';
</script>
<template>
  <p>Hello <EmojiMotion emoji="👋" skin-tone="medium" /></p>
  <EmojiMotion emoji="📡" display="block" />
</template>
```

```svelte
<script>
  import EmojiMotion from '@dofy/native-emoji-motion/svelte/EmojiMotion.svelte';
</script>
<p>Hello <EmojiMotion emoji="👋" skinTone="medium" /></p>
<EmojiMotion emoji="📡" display="block" />
```

For plain HTML or other frameworks, import `@dofy/native-emoji-motion/element` once in a bundled entry module, then use `<emoji-motion emoji="👋" display="block"></emoji-motion>`. The web component can be used with Angular or any other framework that supports custom elements. It registers itself when the module is imported. Its attributes include `emoji`, `skin-tone`, `display`, `label` and `decoration="false"`; assign the `registry` property to use a custom registry.

React, Vue and Svelte components accept `emoji`, `skinTone`, `display`, `decoration`, `label`, `events`, and a custom `registry`. For a custom interaction target, React accepts `triggerRef` and Vue/Svelte accept `trigger`. Components clean up their listeners when updated or unmounted. A global skin tone set on a registry is read when a component renders; to update an already mounted component, update its `skinTone` prop or cause a framework rerender.

## Low level API

Import the package in an ESM application:

```js
import { emojiMotion } from '@dofy/native-emoji-motion';

// Keep the emoji in its own inline-block element. The card can be the trigger.
const dispose = emojiMotion.bind(emojiElement, '👋', { trigger: card });
// When the component is removed:
dispose();
```

Or play once manually: `emojiMotion.play(emojiElement, '❤️')`. `resolve(glyph)` returns the entry, group and selected motion, or `undefined` when the input cannot be recognized. `list()` returns canonical entries; `groups()` lists groups. `bind` listens to `pointerenter` and `focus` by default. Pass `events: ['click']` or any DOM event names to change this. Make the trigger keyboard accessible; a `<button>` is a good default. The element being animated should have `display: inline-block`, and should be dedicated to the emoji because Web Animations controls its transform.

Motion is skipped when the user prefers reduced motion. `play` returns `null` for unknown emoji, reduced motion, or an element without Web Animations support; otherwise it returns the browser's `Animation`. A repeated play cancels the previous one on the same element. `ignoreReducedMotion` is an explicit opt out and should only be used with the user's consent.

## Automatic classification

The default entry recognizes emoji using data generated from Unicode Emoji 18.0, including fully qualified, minimally qualified, and unqualified sequences. A known emoji is classified by its Unicode group and subgroup and receives a conservative reusable motion; existing handcrafted presets retain their special animations and optional decorations. Exact Unicode sequences, including flags and ZWJ sequences, are used rather than guessing category from a code point range. `resolve()` exposes `source`, `unicodeGroup` and `unicodeSubgroup` where available:

```js
import { emojiMotion } from '@dofy/native-emoji-motion';

emojiMotion.resolve('🐶'); // source: 'unicode', subgroup: 'animal-mammal', motion: 'bounce'
emojiMotion.resolve('👩🏽‍🚀').glyph; // 👩🏽‍🚀
emojiMotion.resolve('📡').source; // 'preset', including its signal decoration
emojiMotion.resolve('hello'); // undefined
```

The precedence is: **user emoji and aliases → user subgroup or group classification rule → user group default → handcrafted preset → generated Unicode classification → conservative fallback**. User emoji entries always take precedence over user classification rules. Within user classifications, subgroup rules take precedence over group rules. An explicitly supplied group default overrides handcrafted and automatic motions for that group; a more specific user emoji or classification rule can override it. User-defined motions replace built in motions with the same ID. User classification rules also override matching handcrafted presets.

```js
import { createEmojiMotion } from '@dofy/native-emoji-motion';

const custom = createEmojiMotion({
  classifications: {
    groups: { 'Animals & Nature': { group: 'nature', motion: 'float' } },
    subgroups: { 'animal-bird': { group: 'nature', motion: 'swing' } },
    fallback: { group: 'other', motion: 'bounce' },
  },
  emoji: { '🐶': { group: 'hearts', name: 'My dog', motion: 'pulse' } },
});
// 🐶 uses pulse, 🐦 uses swing, and other animals use float.
```

A generated Unicode name and subgroup are used for uncustomized emoji. `list()` remains the small set of handcrafted and explicitly added entries; it is not a list of the entire Unicode dataset. Generated classifications do not automatically create SVG decorations. Unknown sequences newer than the pinned dataset receive a generic fallback only if the JavaScript engine recognizes them as emoji; otherwise they remain unrecognized. Detection does not guarantee that the system font can render the glyph. Standalone components and arbitrary text are not treated as emoji.

The `defaults: false` setting disables both built in presets and automatic classification unless `autoDetect: true` is explicitly supplied; with no built in groups or motions, the caller must define the groups and motions used by its rules. Set `autoDetect: false` to disable automatic classification while keeping built in presets.

## Smaller preset only entry

Use the lite entry to omit the Unicode classifier and its data. Unknown emoji do not automatically animate; user-defined entries and handcrafted presets still work. The matching framework entries also omit Unicode data:

```js
import { createEmojiMotion } from '@dofy/native-emoji-motion/lite';
import { EmojiMotion as ReactEmoji } from '@dofy/native-emoji-motion/react/lite';
import { EmojiMotion as VueEmoji } from '@dofy/native-emoji-motion/vue/lite';
import '@dofy/native-emoji-motion/element/lite';
// Svelte: import EmojiMotion from '@dofy/native-emoji-motion/svelte/EmojiMotionLite.svelte';
```

Import either the full or lite web component entry on a page, not both: both register the same `emoji-motion` tag and the first registration wins. To keep a framework bundle small, use its lite entry rather than passing a lite registry to a full component entry, which still imports the full classifier.

Unicode data is generated with `npm run generate:unicode` from a version-pinned, checksum-verified official file. The data is covered by [UNICODE-LICENSE.txt](./UNICODE-LICENSE.txt).

## Skin tone

A registry can specify a default and change it later. `resolve` returns the glyph to render; animation never changes your element's text automatically.

```js
import { createEmojiMotion } from '@dofy/native-emoji-motion';

const motion = createEmojiMotion({ defaultSkinTone: 'medium' });
motion.resolve('👋').glyph; // 👋🏽
motion.resolve('👋', { skinTone: 'dark' }).glyph; // 👋🏿
motion.setDefaultSkinTone('light');
motion.resolve('👋').glyph; // 👋🏻
```

The available values are `default`, `light`, `medium-light`, `medium`, `medium-dark` and `dark`. Explicitly supplied skin tone variants retain their tone unless a per-call override is supplied. Automatic skin tones are applied only where an official single-tone variant is unambiguous; mixed-tone sequences stay unchanged rather than being rewritten. Emoji without a skin tone mapping stay unchanged. When adding custom emoji, supply `skinTones` as an explicit map from the tone names to complete Unicode sequences, including any joiners; the library does not guess modifier placement. If the default tone changes, update rendered text by resolving again.

## Extend

An isolated registry combines built ins and your definitions; existing IDs can be replaced. Set `defaults: false` to use only your own definitions. Emoji variants are explicit rather than guessed, so skin tone and multi code point sequences remain under your control.

```js
import { createEmojiMotion } from '@dofy/native-emoji-motion';

const motion = createEmojiMotion({
  motions: {
    wiggle: {
      keyframes: [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(12deg)' },
        { transform: 'rotate(0deg)' },
      ],
      options: { duration: 600, easing: 'ease-out' },
      origin: '50% 80%',
    },
  },
  groups: { creatures: { label: 'Creatures', motion: 'wiggle' } },
  emoji: { '🐙': { name: 'Octopus', group: 'creatures' } },
});
motion.bind(emojiElement, '🐙', { trigger: card });
```

Groups select a default motion; an emoji entry can override it with `motion`, and `variants` lists exact alternate sequences that inherit its settings. References and duplicate variants are validated when a registry is created. Definitions are ordinary JavaScript objects; do not mutate exported built in data. Create a new registry to change configuration. API types are included.

## Optional decorative effects

Emoji can also reference a decoration preset. The built in 📡 example adds a neutral signal halo around the whole glyph; 🔔 and 🎵 add notes, and ✨ adds sparkles. Decorations are opt in and render inside a container you provide. Make the container `position: relative` and size it to the glyph. Effects do not change the emoji itself.

```html
<button id="antenna"><span class="emoji-box"><span id="dish">📡</span></span></button>
<style>.emoji-box { position: relative; display: inline-block } #dish { display: inline-block }</style>
```

```js
emojiMotion.bind(document.querySelector('#dish'), '📡', {
  trigger: document.querySelector('#antenna'),
  decoration: {
    container: document.querySelector('.emoji-box'),
    // Optional: adjust for the font actually used by your application.
    anchor: { x: '50%', y: '50%' },
    flipX: false,
    rotate: 0,
  },
});
```

`anchor` is relative to the container. `flipX` and `rotate` affect the decoration, never the glyph. For asymmetric effects, select explicit settings for the actual font or environment you support; OS detection alone cannot reliably determine the font or its direction. The default signal effect is centered rather than tied to a specific antenna position. When no decoration container is supplied, only the emoji moves. Decoration layers are removed after playback, on replay and on cleanup; reduced motion skips both.

Add custom `decorations` in `createEmojiMotion`: each named preset has an `anchor` and `layers`, each with CSS `style`, Web Animations `keyframes` and `options`. Optionally provide `svg: { viewBox, elements }`, where each element has a `tag` and `attrs`; without `svg`, a styled span is used. Reference its name using the emoji entry's `decoration` field. Layer styles are trusted application code, and the library does not bundle images or fonts.

For example, this adds an SVG sparkle to a custom group:

```js
const custom = createEmojiMotion({
  decorations: {
    star: {
      anchor: { x: '50%', y: '50%' },
      layers: [{
        svg: { viewBox: '0 0 100 100', elements: [
          { tag: 'circle', attrs: { cx: '50', cy: '20', r: '5', fill: 'gold' } },
        ] },
        style: { width: '160%', height: '160%' },
        keyframes: [
          { opacity: 1, transform: 'translate(-50%, -50%) scale(.6)' },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(1.2)' },
        ],
        options: { duration: 700 },
      }],
    },
  },
  emoji: { '🌟': { name: 'Glowing star', group: 'symbols', decoration: 'star' } },
});
custom.bind(emojiElement, '🌟', { trigger: card, decoration: { container: emojiBox } });
```

## Platform boundaries

The library animates the entire native glyph, not individual parts. Rendering, supported emoji, sizes and font fallback vary by operating system, browser and installed fonts. Unsupported sequences may appear as missing glyphs or multiple characters. This library deliberately ships no emoji images or fonts and does not replace unsupported glyphs. Test the target browser, OS and font combinations for your product. Keyframes use relative transforms, but the visual pivot can still vary between fonts.

## Development and release

`npm test` runs the registry and lifecycle tests; `npm run build:demo` creates the isolated static site in `dist/`; `npm run pack:check` previews package contents. The core uses ESM and the browser Web Animations API; it does not require a framework. See [RELEASE.md](https://github.com/dofy/emoji-motion/blob/main/RELEASE.md) for the release checklist.
