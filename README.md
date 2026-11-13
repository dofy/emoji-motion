# Emoji Motion

Small, expressive animations for native emoji. A framework independent, dependency free prototype built around semantic groups, reusable motion presets and explicit per emoji overrides.

## Try the demo

[Explore the live demo](https://emoji-motion.phpz.org/) or run it locally:

```sh
npm run dev
```

Open http://127.0.0.1:4173. Hover, focus or tap a card; use the filters to explore the groups. The demo imports the same public entry point as an application. Use **With effects** to preview all emoji with decorative SVG layers, or choose a semantic group. Select an emoji to copy its markup, then use the one time setup in the examples section to enable its animation. The examples show how to place an emoji in a sentence or inside a card.

## Use

This project is not published yet. After publication, import the package in an ESM application:

```js
import { emojiMotion } from 'native-emoji-motion';

// Keep the emoji in its own inline-block element. The card can be the trigger.
const dispose = emojiMotion.bind(emojiElement, '👋', { trigger: card });
// When the component is removed:
dispose();
```

Or play once manually: `emojiMotion.play(emojiElement, '❤️')`. `resolve(glyph)` returns the entry, group and selected motion, or `undefined` for unknown emoji. `list()` returns canonical entries; `groups()` lists groups. `bind` listens to `pointerenter` and `focus` by default. Pass `events: ['click']` or any DOM event names to change this. Make the trigger keyboard accessible; a `<button>` is a good default. The element being animated should have `display: inline-block`, and should be dedicated to the emoji because Web Animations controls its transform.

Motion is skipped when the user prefers reduced motion. `play` returns `null` for unknown emoji, reduced motion, or an element without Web Animations support; otherwise it returns the browser's `Animation`. A repeated play cancels the previous one on the same element. `ignoreReducedMotion` is an explicit opt out and should only be used with the user's consent.

## Skin tone

A registry can specify a default and change it later. `resolve` returns the glyph to render; animation never changes your element's text automatically.

```js
import { createEmojiMotion } from 'native-emoji-motion';

const motion = createEmojiMotion({ defaultSkinTone: 'medium' });
motion.resolve('👋').glyph; // 👋🏽
motion.resolve('👋', { skinTone: 'dark' }).glyph; // 👋🏿
motion.setDefaultSkinTone('light');
motion.resolve('👋').glyph; // 👋🏻
```

The available values are `default`, `light`, `medium-light`, `medium`, `medium-dark` and `dark`. Explicitly supplied skin tone variants retain their tone unless a per-call override is supplied. Emoji without a skin tone mapping stay unchanged. When adding custom emoji, supply `skinTones` as an explicit map from the tone names to complete Unicode sequences, including any joiners; the library does not guess modifier placement. If the default tone changes, update rendered text by resolving again.

## Extend

An isolated registry combines built ins and your definitions; existing IDs can be replaced. Set `defaults: false` to use only your own definitions. Emoji variants are explicit rather than guessed, so skin tone and multi code point sequences remain under your control.

```js
import { createEmojiMotion } from 'native-emoji-motion';

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

`npm test` runs the registry and lifecycle tests; `npm run build:demo` creates the isolated static site in `dist/`; `npm run pack:check` previews package contents. The package name is provisional. The npm registry returned no public package under this name during development; check again before publishing. This prototype uses ESM and the browser Web Animations API; it does not require a framework. Before publishing, check the name and license ownership, test the packed package in a real consumer, and verify Windows, Linux and mobile browser rendering. No release has been made.
