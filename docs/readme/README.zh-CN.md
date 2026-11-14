<h1 align="center">👋</h1>

<h1 align="center">Emoji Motion</h1>

<p align="center"><a href="https://github.com/dofy/emoji-motion/blob/main/README.md">English</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.zh-CN.md">简体中文</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.zh-TW.md">繁體中文</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.ja.md">日本語</a></p>

<p align="center"><strong>让你的 emoji 多一点情绪。 ✨</strong></p>

<p align="center"><a href="https://www.npmjs.com/package/@dofy/native-emoji-motion"><img src="https://img.shields.io/npm/v/%40dofy%2Fnative-emoji-motion?label=npm" alt="npm version" /></a> <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license" /></a> <a href="https://www.npmjs.com/package/@dofy/native-emoji-motion"><img src="https://img.shields.io/node/v/%40dofy%2Fnative-emoji-motion" alt="Node.js version" /></a></p>

为设备上的原生 emoji 添加小巧、富有表现力的动画，支持 React、Vue、Svelte 和 Web Component。支持肤色、可选 SVG 装饰、自定义动作与 Unicode 自动分类。前往 [在线演示](https://emoji-motion.phpz.org/) 体验。

## 📊 项目概览

| 0.7.1 版本 | 数量 | 说明 |
| --- | ---: | --- |
| 单独定制预设 | 186 | 逐个配置的基础 emoji |
| 已审核动作家族 | 56 | 另外覆盖 323 个基础 emoji |
| 动作类别 | 7 | 用于浏览动作的分组 |
| 可复用动作 | 104 | 预设和家族共享 |
| 带可选 SVG 效果的 emoji | 108 | 基础 emoji 数量 |
| 可识别 Unicode 序列 | 5,235 | Unicode Emoji 18.0，包含肤色等变体 |

肤色及其他变体按额外 Unicode 序列计数；没有预设或已审核家族匹配的已识别 emoji 使用分类兜底动作。

## 📦 快速开始

```sh
npm install @dofy/native-emoji-motion
```

```jsx
import { EmojiMotion } from '@dofy/native-emoji-motion/react';

<p>Hello <EmojiMotion emoji="👋" skinTone="medium" /></p>
```

可使用 React、Vue、Svelte 组件或 Web Component，也可通过 `enhance()` 为现有文本添加动效。完整接入、参数、肤色与自定义说明请参阅[帮助文档](https://emoji-motion.phpz.org/docs/)。

> 从 0.3.0 升级？0.4.0 移除了 `display` 参数，请使用块级容器或 CSS 控制布局。

## 📄 许可证

[MIT](../../LICENSE)。Unicode 数据适用 [Unicode License](../../UNICODE-LICENSE.txt)。
