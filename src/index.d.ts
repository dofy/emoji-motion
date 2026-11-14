export interface Motion { keyframes: Keyframe[]; options?: KeyframeAnimationOptions; origin?: string }
export interface Group { label: string; description?: string; motion: string }
export interface Anchor { x: string; y: string }
export interface SvgShape { tag: 'path' | 'circle' | 'ellipse' | 'rect' | 'line' | 'polyline' | 'polygon'; attrs: Record<string, string> }
export interface DecorationLayer { /** Paint behind the glyph; the container must create a stacking context, for example with isolation: isolate. */ behind?: boolean; style: Partial<CSSStyleDeclaration>; keyframes: Keyframe[]; options?: KeyframeAnimationOptions; svg?: { viewBox: string; elements: SvgShape[] } }
export interface Decoration { anchor: Anchor; layers: DecorationLayer[] }
export type SkinTone = 'default' | 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';
export interface EmojiEntry { group: string; name: string; motion?: string; semanticFamily?: string; decoration?: string; variants?: string[]; skinTones?: Partial<Record<Exclude<SkinTone, 'default'>, string>> }
export interface ClassificationRule { group: string; motion?: string; semanticFamily?: string }
export interface MotionFamily { label: string; group: string; motion: string; semanticFamily?: string; members: string[]; aliases?: Record<string, string>; decoration?: string; decorations?: string[]; animation?: KeyframeAnimationOptions }
export interface Config { defaults?: boolean; autoDetect?: boolean; classifications?: { groups?: Record<string, ClassificationRule>; subgroups?: Record<string, ClassificationRule>; fallback?: ClassificationRule }; defaultSkinTone?: SkinTone; motions?: Record<string, Motion>; decorations?: Record<string, Decoration>; groups?: Record<string, Group>; emoji?: Record<string, EmojiEntry>; families?: Record<string, MotionFamily> }
export interface PlayOptions { ignoreReducedMotion?: boolean; skinTone?: SkinTone; animation?: KeyframeAnimationOptions; decoration?: { container: HTMLElement; anchor?: Anchor; flipX?: boolean; rotate?: number } }
export interface BindOptions extends PlayOptions { trigger?: EventTarget; events?: string[]; /** Milliseconds during which repeated triggers are ignored. Defaults to 260. */ cooldown?: number }
export interface SemanticMotionFamily { id: string; label: string; icon: string; variants: { id: string; label: string; example: string; motion: Motion }[] }
export declare const semanticFamilies: SemanticMotionFamily[];
export interface Resolution extends Omit<EmojiEntry, 'group' | 'motion'> { semanticFamily: string; glyph: string; canonical: string; skinTone: SkinTone; groupId: string; group: Group; motionId: string; motion: Motion; decorationPreset?: Decoration; decorationPresets: Decoration[]; familyId?: string; animation?: KeyframeAnimationOptions; source: 'user' | 'user-classification' | 'preset' | 'family' | 'unicode' | 'fallback'; unicodeGroup?: string; unicodeSubgroup?: string }
export interface EnhanceOptions { root?: string | Element | Document | DocumentFragment; exclude?: string; enabled?: boolean; observe?: boolean; decoration?: boolean; events?: string[] }
export interface EmojiEnhancer { enable(): void; disable(): void; cleanup(): void }
export interface EmojiMotion { enhance(options?: EnhanceOptions): EmojiEnhancer; resolve(glyph: string, options?: { skinTone?: SkinTone }): Resolution | undefined; setDefaultSkinTone(tone: SkinTone): void; getDefaultSkinTone(): SkinTone; play(element: Element, glyph: string, options?: PlayOptions): Animation | null; bind(element: Element, glyph: string, options?: BindOptions): () => void; list(): string[]; groups(): (Group & { id: string })[]; families(): (MotionFamily & { id: string })[] }
export declare function createEmojiMotion(config?: Config): EmojiMotion;
export declare const motions: Record<string, Motion>;
export declare const groups: Record<string, Group>;
export declare const emoji: Record<string, EmojiEntry>;
export declare const emojiMotion: EmojiMotion;
export declare const decorations: Record<string, Decoration>;
export declare const families: Record<string, MotionFamily>;
export declare function createSpringMotion(options?: { height?: number; rebounds?: 0 | 1 | 2; duration?: number }): Motion;
export declare function createSwayMotion(options?: { angle?: number; duration?: number; origin?: string }): Motion;
export declare const unicodeVersion: string;
