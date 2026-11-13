<h1 align="center">👋</h1>

<h1 align="center">Emoji Motion</h1>

<p align="center"><a href="https://github.com/dofy/emoji-motion/blob/main/README.md">English</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.zh-CN.md">简体中文</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.zh-TW.md">繁體中文</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.ja.md">日本語</a></p>

<p align="center">
  <strong>Give your emoji a little more feeling. ✨</strong><br />
  Small, expressive animations for the native emoji you already use.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@dofy/native-emoji-motion"><img src="https://img.shields.io/npm/v/%40dofy%2Fnative-emoji-motion?label=npm" alt="npm version" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license" /></a>
  <a href="https://www.npmjs.com/package/@dofy/native-emoji-motion"><img src="https://img.shields.io/node/v/%40dofy%2Fnative-emoji-motion" alt="Node.js version" /></a>
</p>

Bring 👋, ❤️, 📡 and more to life in React, Vue, Svelte or plain HTML. Emoji Motion animates your system's native emoji, with reusable motions, optional decorative effects and room for your own ideas. Explore the collection and try any emoji in the [live demo](https://emoji-motion.phpz.org/).

- 🎨 **Native and adaptable:** keep the platform's emoji style, with skin tone support and optional SVG effects.
- 🧩 **Easy to use:** drop a component into a sentence or use it as a block.
- 🛠️ **Made to extend:** customize individual emoji, motion families and classification rules.
- 🌍 **Ready for more:** Unicode-based automatic classification provides a fallback for recognized emoji.

## 📊 Collection at a glance

| In version 0.7.0 | Count | What it covers |
| --- | ---: | --- |
| Handcrafted presets | 182 | Individually configured base emoji |
| Reviewed motion families | 34 | 223 additional base emoji sharing reviewed motions |
| Categories | 10 | Groups used to organize the collection |
| Reusable motions | 58 | Motions shared by presets and families |
| Emoji with optional SVG effects | 106 | Base emoji with decorative effects |
| Recognized Unicode sequences | 5,235 | Unicode Emoji 18.0 sequences, including skin tones and other variants |

Skin tones and other variants count as additional Unicode sequences. Similar emoji may share a motion. Recognized emoji without a preset or reviewed family receive a category-based fallback.

## 📦 Get started

```sh
npm install @dofy/native-emoji-motion
```

```jsx
import { EmojiMotion } from '@dofy/native-emoji-motion/react';

<p>Hello <EmojiMotion emoji="👋" skinTone="medium" /></p>
```

Use components with React, Vue, Svelte or the Web Component, or add motion to existing text with the `enhance()` API. See the [documentation](https://emoji-motion.phpz.org/docs/) for setup, framework examples, skin tones, customization and API details.

> Upgrading from 0.3.0? The `display` prop was removed in 0.4.0. Use a block container or CSS to control layout.

## 📄 License

[MIT](./LICENSE). Unicode data is covered by the [Unicode License](./UNICODE-LICENSE.txt).
