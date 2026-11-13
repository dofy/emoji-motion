import { emojiMotion } from './index.js';
const BaseElement = globalThis.HTMLElement ?? class {};
/** Framework-independent web component. Import this module to register <emoji-motion>. */
export class EmojiMotionElement extends BaseElement {
  static observedAttributes = ['emoji', 'skin-tone', 'display', 'decoration', 'label'];
  #registry = emojiMotion;
  #dispose = () => {};
  get registry() { return this.#registry; }
  set registry(value) { this.#registry = value ?? emojiMotion; if (this.isConnected) this.#render(); }
  connectedCallback() { this.#render(); }
  disconnectedCallback() { this.#dispose(); }
  attributeChangedCallback() { if (this.isConnected) this.#render(); }
  #render() {
    this.#dispose();
    const emoji = this.getAttribute('emoji') ?? '';
    const skinTone = this.getAttribute('skin-tone') ?? undefined;
    const result = this.#registry.resolve(emoji, { skinTone });
    this.style.display = this.getAttribute('display') === 'block' ? 'block' : 'inline-block';
    this.setAttribute('role', 'img');
    this.setAttribute('aria-label', this.getAttribute('label') ?? result?.name ?? emoji);
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    const visual = this.ownerDocument.createElement('span');
    Object.assign(visual.style, { display: 'inline-block', position: 'relative' });
    const glyph = this.ownerDocument.createElement('span');
    Object.assign(glyph.style, { display: 'inline-block' });
    glyph.setAttribute('aria-hidden', 'true'); glyph.textContent = result?.glyph ?? emoji;
    visual.append(glyph); this.replaceChildren(visual);
    this.#dispose = this.#registry.bind(glyph, emoji, { trigger: this, events: ['pointerenter', 'focus', 'click'], ...(this.getAttribute('decoration') !== 'false' ? { decoration: { container: visual } } : {}) });
  }
}
export function defineEmojiMotion() {
  const tag = 'emoji-motion';
  if (!globalThis.customElements) return;
  if (!customElements.get(tag)) customElements.define(tag, EmojiMotionElement);
}
defineEmojiMotion();
