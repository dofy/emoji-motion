export interface Motion { keyframes: Keyframe[]; options?: KeyframeAnimationOptions; origin?: string }
export interface Group { label: string; description?: string; motion: string }
export interface Anchor { x: string; y: string }
export interface SvgShape { tag: 'path' | 'circle' | 'ellipse' | 'rect' | 'line' | 'polyline' | 'polygon'; attrs: Record<string, string> }
export interface DecorationLayer { style: Partial<CSSStyleDeclaration>; keyframes: Keyframe[]; options?: KeyframeAnimationOptions; svg?: { viewBox: string; elements: SvgShape[] } }
export interface Decoration { anchor: Anchor; layers: DecorationLayer[] }
export type SkinTone = 'default' | 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';
export interface EmojiEntry { group: string; name: string; motion?: string; decoration?: string; variants?: string[]; skinTones?: Partial<Record<Exclude<SkinTone, 'default'>, string>> }
export interface Config { defaults?: boolean; defaultSkinTone?: SkinTone; motions?: Record<string, Motion>; decorations?: Record<string, Decoration>; groups?: Record<string, Group>; emoji?: Record<string, EmojiEntry> }
export interface PlayOptions { ignoreReducedMotion?: boolean; skinTone?: SkinTone; animation?: KeyframeAnimationOptions; decoration?: { container: HTMLElement; anchor?: Anchor; flipX?: boolean; rotate?: number } }
export interface BindOptions extends PlayOptions { trigger?: EventTarget; events?: string[] }
export interface Resolution extends EmojiEntry { glyph: string; canonical: string; skinTone: SkinTone; groupId: string; group: Group; motionId: string; motion: Motion; decorationPreset?: Decoration }
export interface EmojiMotion { resolve(glyph: string, options?: { skinTone?: SkinTone }): Resolution | undefined; setDefaultSkinTone(tone: SkinTone): void; getDefaultSkinTone(): SkinTone; play(element: Element, glyph: string, options?: PlayOptions): Animation | null; bind(element: Element, glyph: string, options?: BindOptions): () => void; list(): string[]; groups(): (Group & { id: string })[] }
export declare function createEmojiMotion(config?: Config): EmojiMotion;
export declare const motions: Record<string, Motion>;
export declare const groups: Record<string, Group>;
export declare const emoji: Record<string, EmojiEntry>;
export declare const emojiMotion: EmojiMotion;
export declare const decorations: Record<string, Decoration>;
