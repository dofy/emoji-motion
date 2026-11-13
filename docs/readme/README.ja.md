<h1 align="center">👋</h1>

<h1 align="center">Emoji Motion</h1>

<p align="center"><a href="https://github.com/dofy/emoji-motion/blob/main/README.md">English</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.zh-CN.md">简体中文</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.zh-TW.md">繁體中文</a> · <a href="https://github.com/dofy/emoji-motion/blob/main/docs/readme/README.ja.md">日本語</a></p>

<p align="center"><strong>いつもの絵文字に、もう少し気持ちを。 ✨</strong></p>

<p align="center"><a href="https://www.npmjs.com/package/@dofy/native-emoji-motion"><img src="https://img.shields.io/npm/v/%40dofy%2Fnative-emoji-motion?label=npm" alt="npm version" /></a> <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license" /></a> <a href="https://www.npmjs.com/package/@dofy/native-emoji-motion"><img src="https://img.shields.io/node/v/%40dofy%2Fnative-emoji-motion" alt="Node.js version" /></a></p>

端末のネイティブ絵文字に小さく表情豊かなアニメーションを追加します。React、Vue、Svelte、Web Component に対応し、肌の色、任意の SVG エフェクト、カスタムモーション、Unicode による自動分類を利用できます。[ライブデモ](https://emoji-motion.phpz.org/)でお試しください。

## 📊 コレクションの概要

| バージョン 0.6.4 | 数 | 内容 |
| --- | ---: | --- |
| 個別のプリセット | 177 | 個別に設定された基本絵文字 |
| 確認済みモーションファミリー | 31 | さらに 212 種類の基本絵文字に対応 |
| カテゴリ | 10 | コレクションの分類 |
| 再利用可能なモーション | 53 | プリセットとファミリーで共有 |
| SVG エフェクト付き絵文字 | 96 | 基本絵文字の数 |
| 認識できる Unicode シーケンス | 5,235 | 肌の色などのバリエーションを含む Unicode Emoji 18.0 |

肌の色などのバリエーションは追加の Unicode シーケンスとして数えます。プリセットや確認済みファミリーに一致しない絵文字には、分類に基づくフォールバックを適用します。

## 📦 はじめに

```sh
npm install @dofy/native-emoji-motion
```

```jsx
import { EmojiMotion } from '@dofy/native-emoji-motion/react';

<p>Hello <EmojiMotion emoji="👋" skinTone="medium" /></p>
```

React、Vue、Svelte コンポーネントまたは Web Component を使用できます。`enhance()` で既存のテキストにもモーションを追加できます。設定、パラメーター、肌の色、カスタマイズの詳細は[ドキュメント](https://emoji-motion.phpz.org/docs/)をご覧ください。

> 0.3.0 からアップグレードする場合：0.4.0 では `display` プロパティを削除しました。ブロック要素または CSS でレイアウトを調整してください。

## 📄 ライセンス

[MIT](../../LICENSE)。Unicode データには [Unicode License](../../UNICODE-LICENSE.txt) が適用されます。
