<h1 align="center">👋</h1>

<h1 align="center">Emoji Motion</h1>

<p align="center"><a href="https://github.com/dofy/emoji-motion/blob/main/README.md">English</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.zh-CN.md">简体中文</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.zh-TW.md">繁體中文</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.ja.md">日本語</a></p>

<p align="center"><strong>讓你的 emoji 多一點情緒。 ✨</strong></p>

<p align="center"><a href="https://www.npmjs.com/package/@dofy/native-emoji-motion"><img src="https://img.shields.io/npm/v/%40dofy%2Fnative-emoji-motion?label=npm" alt="npm version" /></a> <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license" /></a> <a href="https://www.npmjs.com/package/@dofy/native-emoji-motion"><img src="https://img.shields.io/node/v/%40dofy%2Fnative-emoji-motion" alt="Node.js version" /></a></p>

為裝置上的原生 emoji 加入小巧、富有表現力的動畫，支援 React、Vue、Svelte 和 Web Component。支援膚色、可選 SVG 裝飾、自訂動作與 Unicode 自動分類。前往[線上展示](https://emoji-motion.phpz.org/)體驗。

## 📊 專案概覽

| 0.5.1 版本 | 數量 | 說明 |
| --- | ---: | --- |
| 個別訂製預設 | 177 | 逐一設定的基礎 emoji |
| 已審核動作家族 | 16 | 另外涵蓋 123 個基礎 emoji |
| 類別 | 10 | 用來組織內容的分組 |
| 可重複使用動作 | 42 | 預設和家族共用 |
| 帶可選 SVG 效果的 emoji | 67 | 基礎 emoji 數量 |
| 可辨識 Unicode 序列 | 5,235 | Unicode Emoji 18.0，包含膚色等變體 |

膚色和其他變體按額外 Unicode 序列計數；沒有預設或已審核家族匹配的已辨識 emoji 使用分類備援動作。

## 📦 快速開始

```sh
npm install @dofy/native-emoji-motion
```

```jsx
import { EmojiMotion } from '@dofy/native-emoji-motion/react';

<p>Hello <EmojiMotion emoji="👋" skinTone="medium" /></p>
```

可使用 React、Vue、Svelte 元件或 Web Component，也可透過 `enhance()` 為現有文字加入動效。完整接入、參數、膚色與自訂說明請參閱[說明文件](https://emoji-motion.phpz.org/docs/)。

> 從 0.3.0 升級？0.4.0 移除了 `display` 參數，請使用區塊容器或 CSS 控制版面配置。

## 📄 授權

[MIT](../../LICENSE)。Unicode 資料適用 [Unicode License](../../UNICODE-LICENSE.txt)。
