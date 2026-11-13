const curve = 'cubic-bezier(.22,1,.36,1)';
function boundedNumber(name, value, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} must be between ${min} and ${max}`);
  return value;
}
/** Build a direction-neutral bounce; height is a percentage of glyph height. */
export function createSpringMotion({ height = 24, rebounds = 1, duration = 900 } = {}) {
  boundedNumber('height', height, 0, 60); boundedNumber('duration', duration, 1, 10000);
  if (!Number.isInteger(rebounds) || rebounds < 0 || rebounds > 2) throw new RangeError('rebounds must be 0, 1, or 2');
  const frames = [{ transform: 'translateY(0) scale(1)', offset: 0 }, { transform: `translateY(-${height}%) scale(.97,1.03)`, offset: .3 }, { transform: 'translateY(0) scale(1.09,.91)', offset: .6 }];
  if (rebounds >= 1) frames.push({ transform: `translateY(-${height * .3}%) scale(1)`, offset: .78 });
  if (rebounds === 2) frames.push({ transform: 'translateY(0) scale(1)', offset: .88 }, { transform: `translateY(-${height * .12}%) scale(1)`, offset: .94 });
  frames.push({ transform: 'translateY(0) scale(1)', offset: 1 });
  return { keyframes: frames, options: { duration, easing: curve }, origin: '50% 90%' };
}
/** Build a balanced sway; no assumption about the native glyph's direction. */
export function createSwayMotion({ angle = 8, duration = 1200, origin = '50% 90%' } = {}) {
  boundedNumber('angle', angle, 0, 30); boundedNumber('duration', duration, 1, 10000);
  return { keyframes: [{ transform: 'rotate(0deg)' }, { transform: `rotate(-${angle}deg)` }, { transform: `rotate(${angle}deg)` }, { transform: `rotate(-${angle / 2}deg)` }, { transform: 'rotate(0deg)' }], options: { duration, easing: curve }, origin };
}
// Motions transform the entire native glyph. Keyframes deliberately begin and end at rest.
export const motions = {
  glide: { keyframes: [{ transform: 'translate(0, 0) rotate(0deg)' }, { transform: 'translate(-12%, 8%) rotate(-9deg)', offset: .25 }, { transform: 'translate(12%, -22%) rotate(9deg)', offset: .6 }, { transform: 'translate(0, 0) rotate(0deg)' }], options: { duration: 1050, easing: 'cubic-bezier(.22,1,.36,1)' } },
  ride: { keyframes: [{ transform: 'translateY(0) rotate(0deg)' }, { transform: 'translateY(-15%) rotate(-6deg)', offset: .24 }, { transform: 'translateY(0) rotate(4deg)', offset: .48 }, { transform: 'translateY(-9%) rotate(-4deg)', offset: .68 }, { transform: 'translateY(0) rotate(0deg)' }], options: { duration: 950, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 80%' },
  wave: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(18deg)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(16deg)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(0deg)' }], options: { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '70% 75%' },
  bounce: { keyframes: [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-22%) scale(1.07,.94)', offset: .38 }, { transform: 'translateY(0) scale(.93,1.07)', offset: .72 }, { transform: 'translateY(0) scale(1)' }], options: { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 85%' },
  pulse: { keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.25)', offset: .28 }, { transform: 'scale(.96)', offset: .5 }, { transform: 'scale(1.16)', offset: .68 }, { transform: 'scale(1)' }], options: { duration: 750, easing: 'cubic-bezier(.22,1,.36,1)' } },
  wobble: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-13deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0deg)' }], options: { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 80%' },
  spin: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], options: { duration: 800, easing: 'cubic-bezier(.22,1,.36,1)' } },
  launch: { keyframes: [{ transform: 'translate(0,0) rotate(0deg)' }, { transform: 'translate(-5%,5%) rotate(-8deg)', offset: .22 }, { transform: 'translate(18%,-22%) rotate(8deg)', offset: .55 }, { transform: 'translate(0,0) rotate(0deg)' }], options: { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)' } },
  search: { keyframes: [{ transform: 'translate(0,0) rotate(0deg)' }, { transform: 'translate(-12%,-8%) rotate(-12deg)' }, { transform: 'translate(12%,6%) rotate(12deg)' }, { transform: 'translate(0,0) rotate(0deg)' }], options: { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '65% 65%' },
  swing: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(18deg)' }, { transform: 'rotate(-15deg)' }, { transform: 'rotate(9deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0deg)' }], options: { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 10%' },
  float: { keyframes: [{ transform: 'translateY(0) rotate(0deg)' }, { transform: 'translateY(-18%) rotate(-8deg)', offset: .4 }, { transform: 'translateY(-10%) rotate(6deg)', offset: .7 }, { transform: 'translateY(0) rotate(0deg)' }], options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' } },
  shake: { keyframes: [{ transform: 'translateX(0)' }, { transform: 'translateX(-10%) rotate(-8deg)' }, { transform: 'translateX(10%) rotate(8deg)' }, { transform: 'translateX(-6%) rotate(-5deg)' }, { transform: 'translateX(4%) rotate(3deg)' }, { transform: 'translateX(0)' }], options: { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' } },
  hop: { keyframes: [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-28%) scale(1.04,.96)', offset: .32 }, { transform: 'translateY(0) scale(1.1,.9)', offset: .64 }, { transform: 'translateY(-9%) scale(1)', offset: .8 }, { transform: 'translateY(0) scale(1)' }], options: { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 90%' },
  flutter: { keyframes: [{ transform: 'translateY(0) rotate(0deg)' }, { transform: 'translateY(-12%) rotate(-8deg)' }, { transform: 'translateY(-21%) rotate(8deg)' }, { transform: 'translateY(-10%) rotate(-5deg)' }, { transform: 'translateY(0) rotate(0deg)' }], options: { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)' } },
  sway: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-9deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(0deg)' }], options: { duration: 1100, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 95%' },
  flip: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(185deg)', offset: .5 }, { transform: 'rotate(360deg)' }], options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' } },
  sip: { keyframes: [{ transform: 'translateY(0) rotate(0deg)' }, { transform: 'translateY(-8%) rotate(-6deg)', offset: .35 }, { transform: 'translateY(-8%) rotate(6deg)', offset: .65 }, { transform: 'translateY(0) rotate(0deg)' }], options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 80%' },
  twirl: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(0deg)' }], options: { duration: 950, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 80%' },
  nod: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(8deg)', offset: .3 }, { transform: 'rotate(-4deg)', offset: .6 }, { transform: 'rotate(0deg)' }], options: { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 85%' },
  pop: { keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(.85)', offset: .2 }, { transform: 'scale(1.18)', offset: .48 }, { transform: 'scale(.97)', offset: .75 }, { transform: 'scale(1)' }], options: { duration: 750, easing: 'cubic-bezier(.22,1,.36,1)' } },
  bob: { keyframes: [{ transform: 'translateY(0) rotate(0deg)' }, { transform: 'translateY(-12%) rotate(-4deg)', offset: .3 }, { transform: 'translateY(4%) rotate(4deg)', offset: .65 }, { transform: 'translateY(0) rotate(0deg)' }], options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' } },
  breathe: { keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.09,1.05)', offset: .48 }, { transform: 'scale(1)' }], options: { duration: 1200, easing: 'cubic-bezier(.22,1,.36,1)' } },
  spring: createSpringMotion(),
  leafSway: createSwayMotion(),
  hoverFlight: { keyframes: [{ transform: 'translateY(0) rotate(0deg)' }, { transform: 'translateY(-15%) rotate(-6deg)', offset: .3 }, { transform: 'translateY(-9%) rotate(6deg)', offset: .6 }, { transform: 'translateY(0) rotate(0deg)' }], options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' } },
  gentleSip: { keyframes: [{ transform: 'translateY(0) rotate(0deg)' }, { transform: 'translateY(-7%) rotate(-4deg)', offset: .35 }, { transform: 'translateY(-7%) rotate(4deg)', offset: .65 }, { transform: 'translateY(0) rotate(0deg)' }], options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 85%' },
  pose: { keyframes: [{ transform: 'scale(1) translateY(0)' }, { transform: 'scale(1.04,1.06) translateY(-3%)', offset: .45 }, { transform: 'scale(1) translateY(0)' }], options: { duration: 1100, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 90%' },
  carousel: { keyframes: [{ transform: 'perspective(500px) rotateY(0deg) translateY(0)' }, { transform: 'perspective(500px) rotateY(-35deg) translateY(-8%)', offset: .3 }, { transform: 'perspective(500px) rotateY(35deg) translateY(-4%)', offset: .65 }, { transform: 'perspective(500px) rotateY(0deg) translateY(0)' }], options: { duration: 1200, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 85%' },
  flipHorizontal: { keyframes: [{ transform: 'perspective(500px) rotateY(0deg)' }, { transform: 'perspective(500px) rotateY(180deg)', offset: .5 }, { transform: 'perspective(500px) rotateY(360deg)' }], options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' } },
  flipVertical: { keyframes: [{ transform: 'perspective(500px) rotateX(0deg)' }, { transform: 'perspective(500px) rotateX(180deg)', offset: .5 }, { transform: 'perspective(500px) rotateX(360deg)' }], options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' } },
  steady: { keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.025)', offset: .5 }, { transform: 'scale(1)' }], options: { duration: 1100, easing: 'cubic-bezier(.22,1,.36,1)' }, origin: '50% 100%' },
  hourglassTurn: { keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)', offset: .4 }, { transform: 'rotate(180deg)', offset: .6 }, { transform: 'rotate(0deg)' }], options: { duration: 1300, easing: 'cubic-bezier(.22,1,.36,1)' } }
};

// Groups describe semantic families; emoji entries may override the group's motion.
export const groups = {
  gestures: { label: 'Gestures', motion: 'wave', description: 'Hands with a friendly wave.' },
  faces: { label: 'Faces', motion: 'bounce', description: 'Expressions with a little bounce.' },
  hearts: { label: 'Hearts', motion: 'pulse', description: 'A soft double heartbeat.' },
  objects: { label: 'Objects', motion: 'wobble', description: 'Everyday things, gently brought to life.' },
  nature: { label: 'Nature', motion: 'float', description: 'A light, drifting movement.' },
  travel: { label: 'Travel', motion: 'launch', description: 'Things ready to take off.' },
  symbols: { label: 'Symbols', motion: 'spin', description: 'A small turn for signs and shapes.' },
  people: { label: 'People', motion: 'bounce', description: 'People and activities.' },
  food: { label: 'Food', motion: 'bounce', description: 'Food and drink.' },
  activities: { label: 'Activities', motion: 'bounce', description: 'Sports, arts and celebrations.' },
  flags: { label: 'Flags', motion: 'float', description: 'A gentle flag motion.' },
  other: { label: 'Other', motion: 'bounce', description: 'A gentle fallback.' }
};

// Explicit mappings avoid guessing at modifier placement in complex sequences.
const skinTones = glyph => Object.fromEntries(['light', 'medium-light', 'medium', 'medium-dark', 'dark'].map((tone, index) => [tone, glyph + String.fromCodePoint(0x1f3fb + index)]));
// A person modifier belongs before the joiner, never at the end of the sequence.
const personSkinTones = suffix => Object.fromEntries(['light', 'medium-light', 'medium', 'medium-dark', 'dark'].map((tone, index) => [tone, `🧑${String.fromCodePoint(0x1f3fb + index)}‍${suffix}`]));
const familyToneAliases = glyphs => Object.fromEntries(glyphs.flatMap(glyph => Object.values(skinTones(glyph)).map(variant => [variant, glyph])));
// Members are reviewed explicitly; no entire Unicode subgroup is assumed to move alike.
export const families = {
  balls: { label: 'Balls', group: 'activities', motion: 'spring', members: ['⚾', '🥎', '🎱', '🎳'], animation: { duration: 900 }, decorations: ['impact', 'sparkle'] },
  plants: { label: 'Plants', group: 'nature', motion: 'leafSway', members: ['🌷', '🌹', '🌺', '🪻', '🌴', '🌿', '🍀'] },
  drinks: { label: 'Drinks', group: 'food', motion: 'gentleSip', members: ['🥤', '🧃', '🧋', '🍹', '🍸'] },
  flying: { label: 'Flying animals', group: 'nature', motion: 'hoverFlight', members: ['🦜', '🦉', '🦅', '🪰', '🦟'] },
  poses: { label: 'People in poses', group: 'people', motion: 'pose', members: ['🧎', '🧍', '🙇'], aliases: familyToneAliases(['🧎', '🧍', '🙇']) }
};
// Variants are explicit: unrelated sequences are never silently normalized.
export const emoji = {
  '👋': { group: 'gestures', name: 'Waving hand', skinTones: skinTones('👋') },
  '👍': { group: 'gestures', name: 'Thumbs up', motion: 'bounce', skinTones: skinTones('👍') },
  '👏': { group: 'gestures', name: 'Clapping hands', motion: 'shake', skinTones: skinTones('👏') },
  '👎': { group: 'gestures', name: 'Thumbs down', motion: 'wobble', skinTones: skinTones('👎') },
  '✋': { group: 'gestures', name: 'Raised hand', skinTones: skinTones('✋') },
  '🖐️': { group: 'gestures', name: 'Hand with fingers splayed', skinTones: skinTones('🖐') },
  '🤚': { group: 'gestures', name: 'Raised back of hand', skinTones: skinTones('🤚') },
  '🤘': { group: 'gestures', name: 'Sign of the horns', motion: 'bounce', skinTones: skinTones('🤘') },
  '🤙': { group: 'gestures', name: 'Call me hand', motion: 'wobble', skinTones: skinTones('🤙') },
  '👌': { group: 'gestures', name: 'OK hand', motion: 'pulse', skinTones: skinTones('👌') },
  '🤞': { group: 'gestures', name: 'Crossed fingers', motion: 'wobble', skinTones: skinTones('🤞') },
  '🫶': { group: 'gestures', name: 'Heart hands', motion: 'pulse', skinTones: skinTones('🫶') },
  '🙌': { group: 'gestures', name: 'Raising hands', motion: 'bounce', skinTones: skinTones('🙌') },
  '🙏': { group: 'gestures', name: 'Folded hands', motion: 'bounce', skinTones: skinTones('🙏') },
  '💪': { group: 'gestures', name: 'Flexed biceps', motion: 'pulse', skinTones: skinTones('💪') },
  '👆': { group: 'gestures', name: 'Pointing up', motion: 'bounce', skinTones: skinTones('👆') },
  '👇': { group: 'gestures', name: 'Pointing down', motion: 'bounce', skinTones: skinTones('👇') },
  '👉': { group: 'gestures', name: 'Pointing right', motion: 'wobble', skinTones: skinTones('👉') },
  '😊': { group: 'faces', name: 'Smiling face' }, '😂': { group: 'faces', name: 'Tears of joy', motion: 'shake' }, '🥳': { group: 'faces', name: 'Party face', motion: 'wobble' },
  '😍': { group: 'faces', name: 'Smiling face with heart eyes', motion: 'pulse' }, '😉': { group: 'faces', name: 'Winking face', motion: 'wobble' }, '😎': { group: 'faces', name: 'Sunglasses face', motion: 'wobble' }, '🤔': { group: 'faces', name: 'Thinking face', motion: 'wobble' }, '😴': { group: 'faces', name: 'Sleeping face', motion: 'float' }, '😭': { group: 'faces', name: 'Loudly crying face', motion: 'shake' },
  '❤️': { group: 'hearts', name: 'Red heart', variants: ['❤'] }, '💛': { group: 'hearts', name: 'Yellow heart' }, '💖': { group: 'hearts', name: 'Sparkling heart' },
  '💚': { group: 'hearts', name: 'Green heart' }, '💙': { group: 'hearts', name: 'Blue heart' }, '💜': { group: 'hearts', name: 'Purple heart' }, '💔': { group: 'hearts', name: 'Broken heart', motion: 'shake' },
  '🔍': { group: 'objects', name: 'Magnifying glass', motion: 'search' }, '🔔': { group: 'objects', name: 'Bell', motion: 'swing', decoration: 'sound' }, '🎁': { group: 'objects', name: 'Gift', motion: 'shake' }, '📡': { group: 'objects', name: 'Satellite antenna', motion: 'wobble', decoration: 'signal' }, '⏱️': { group: 'objects', name: 'Stopwatch', motion: 'swing', variants: ['⏱'] },
  '💡': { group: 'objects', name: 'Light bulb', motion: 'breathe', decoration: 'glow' }, '📷': { group: 'objects', name: 'Camera', motion: 'bounce', decoration: 'flash' }, '🔑': { group: 'objects', name: 'Key', motion: 'wobble' }, '📌': { group: 'objects', name: 'Pushpin', motion: 'bounce' }, '📦': { group: 'objects', name: 'Package', motion: 'shake' }, '🧭': { group: 'objects', name: 'Compass', motion: 'wobble' },
  '🌸': { group: 'nature', name: 'Blossom', decoration: 'petals' }, '🍃': { group: 'nature', name: 'Leaves' }, '☀️': { group: 'nature', name: 'Sun', motion: 'spin', decoration: 'glow', variants: ['☀'] },
  '🌻': { group: 'nature', name: 'Sunflower', motion: 'leafSway' }, '🌈': { group: 'nature', name: 'Rainbow', motion: 'float' }, '🌙': { group: 'nature', name: 'Crescent moon', motion: 'float' }, '⭐': { group: 'nature', name: 'Star', motion: 'pulse', decoration: 'sparkle' }, '🔥': { group: 'nature', name: 'Fire', motion: 'wobble', decoration: 'flicker' }, '🌊': { group: 'nature', name: 'Water wave', motion: 'float' },
  '🚀': { group: 'travel', name: 'Rocket' }, '✈️': { group: 'travel', name: 'Airplane', motion: 'glide', variants: ['✈'] }, '🚲': { group: 'travel', name: 'Bicycle', motion: 'ride' },
  '🚗': { group: 'travel', name: 'Car', motion: 'ride' }, '🚂': { group: 'travel', name: 'Locomotive', motion: 'ride' }, '🛸': { group: 'travel', name: 'Flying saucer', motion: 'float' }, '🚢': { group: 'travel', name: 'Ship', motion: 'wobble' },
  '✨': { group: 'symbols', name: 'Sparkles', motion: 'pulse', decoration: 'sparkle' }, '⚙️': { group: 'symbols', name: 'Gear', variants: ['⚙'] }, '🎯': { group: 'symbols', name: 'Target', motion: 'bounce' }, '🎵': { group: 'symbols', name: 'Musical note', motion: 'swing', decoration: 'sound' }, '💤': { group: 'symbols', name: 'Sleeping symbol', motion: 'float' }, '💥': { group: 'symbols', name: 'Collision', motion: 'pulse' }, '❗': { group: 'symbols', name: 'Exclamation mark', motion: 'bounce' }, '❓': { group: 'symbols', name: 'Question mark', motion: 'wobble' }, '✅': { group: 'symbols', name: 'Check mark', motion: 'bounce' },
  '🐰': { group: 'nature', name: 'Rabbit face', motion: 'hop' }, '🦋': { group: 'nature', name: 'Butterfly', motion: 'flutter' }, '🐝': { group: 'nature', name: 'Bee', motion: 'flutter' }, '🌱': { group: 'nature', name: 'Seedling', motion: 'sway' }, '🌧️': { group: 'nature', name: 'Cloud with rain', motion: 'float', decoration: 'rain', variants: ['🌧'] },
  '☕': { group: 'food', name: 'Hot beverage', motion: 'sip', decoration: 'steam' }, '🍵': { group: 'food', name: 'Teacup', motion: 'sip', decoration: 'steam' }, '🍕': { group: 'food', name: 'Pizza', motion: 'bounce' }, '🍦': { group: 'food', name: 'Soft ice cream', motion: 'sway' },
  '🏀': { group: 'activities', name: 'Basketball', motion: 'hop' }, '⚽': { group: 'activities', name: 'Soccer ball', motion: 'hop' }, '🎈': { group: 'activities', name: 'Balloon', motion: 'float' }, '🎉': { group: 'activities', name: 'Party popper', motion: 'bounce', decoration: 'sparkle' },
  '💃': { group: 'people', name: 'Woman dancing', motion: 'twirl', skinTones: skinTones('💃') }, '🕺': { group: 'people', name: 'Man dancing', motion: 'twirl', skinTones: skinTones('🕺') },
  '⏳': { group: 'objects', name: 'Hourglass', motion: 'hourglassTurn' }, '⏰': { group: 'objects', name: 'Alarm clock', motion: 'shake' }, '🕯️': { group: 'objects', name: 'Candle', motion: 'steady', decoration: 'flicker', variants: ['🕯'] },

  // Additional handcrafted entries share motions where their physical action fits.
  '😀': { group: 'faces', name: 'Grinning face', motion: 'bounce' }, '🤣': { group: 'faces', name: 'Rolling on the floor laughing', motion: 'shake' },
  '🤩': { group: 'faces', name: 'Star struck', motion: 'pop', decoration: 'sparkle' }, '🥺': { group: 'faces', name: 'Pleading face', motion: 'breathe' },
  '😮': { group: 'faces', name: 'Face with open mouth', motion: 'pop' }, '😡': { group: 'faces', name: 'Angry face', motion: 'shake' },
  '🤗': { group: 'faces', name: 'Hugging face', motion: 'breathe' }, '🤯': { group: 'faces', name: 'Exploding head', motion: 'pop', decoration: 'sparkle' },
  '✌️': { group: 'gestures', name: 'Victory hand', motion: 'twirl', variants: ['✌'], skinTones: skinTones('✌') },
  '🤟': { group: 'gestures', name: 'Love you gesture', motion: 'wave', skinTones: skinTones('🤟') }, '👊': { group: 'gestures', name: 'Oncoming fist', motion: 'pop', skinTones: skinTones('👊') },
  '🤜': { group: 'gestures', name: 'Right facing fist', motion: 'nod', skinTones: skinTones('🤜') }, '🤛': { group: 'gestures', name: 'Left facing fist', motion: 'nod', skinTones: skinTones('🤛') },
  '🫰': { group: 'gestures', name: 'Hand with index finger and thumb crossed', motion: 'pop', skinTones: skinTones('🫰') },
  '🐱': { group: 'nature', name: 'Cat face', motion: 'nod' }, '🐻': { group: 'nature', name: 'Bear', motion: 'nod' }, '🐼': { group: 'nature', name: 'Panda', motion: 'sway' },
  '🐸': { group: 'nature', name: 'Frog', motion: 'hop' }, '🐧': { group: 'nature', name: 'Penguin', motion: 'sway' }, '🐥': { group: 'nature', name: 'Front facing baby chick', motion: 'hop' },
  '🐢': { group: 'nature', name: 'Turtle', motion: 'bob' }, '🐟': { group: 'nature', name: 'Fish', motion: 'bob' }, '🐬': { group: 'nature', name: 'Dolphin', motion: 'bob' },
  '🐙': { group: 'nature', name: 'Octopus', motion: 'twirl' }, '🌵': { group: 'nature', name: 'Cactus', motion: 'sway' }, '🌲': { group: 'nature', name: 'Evergreen tree', motion: 'sway' },
  '🌼': { group: 'nature', name: 'Blossom flower', motion: 'sway', decoration: 'petals' }, '❄️': { group: 'nature', name: 'Snowflake', motion: 'float', variants: ['❄'] }, '☁️': { group: 'nature', name: 'Cloud', motion: 'float', variants: ['☁'] },
  '🍎': { group: 'food', name: 'Red apple', motion: 'nod' }, '🍉': { group: 'food', name: 'Watermelon', motion: 'wobble' }, '🍓': { group: 'food', name: 'Strawberry', motion: 'bounce' },
  '🍌': { group: 'food', name: 'Banana', motion: 'wobble' }, '🥑': { group: 'food', name: 'Avocado', motion: 'nod' }, '🍰': { group: 'food', name: 'Shortcake', motion: 'bounce' },
  '🍩': { group: 'food', name: 'Doughnut', motion: 'spin' }, '🍿': { group: 'food', name: 'Popcorn', motion: 'pop' }, '🍪': { group: 'food', name: 'Cookie', motion: 'wobble' },
  '🍜': { group: 'food', name: 'Steaming bowl', motion: 'sip', decoration: 'steam' }, '🫖': { group: 'food', name: 'Teapot', motion: 'sip', decoration: 'steam' },
  '🏐': { group: 'activities', name: 'Volleyball', motion: 'hop' }, '🎾': { group: 'activities', name: 'Tennis', motion: 'hop' }, '🏓': { group: 'activities', name: 'Ping pong', motion: 'bounce' },
  '🎨': { group: 'activities', name: 'Artist palette', motion: 'twirl' }, '🎸': { group: 'activities', name: 'Guitar', motion: 'sway', decoration: 'sound' },
  '🥁': { group: 'activities', name: 'Drum', motion: 'shake', decoration: 'sound' }, '🎮': { group: 'activities', name: 'Game controller', motion: 'wobble' }, '🪁': { group: 'activities', name: 'Kite', motion: 'flutter' },
  '🙋': { group: 'people', name: 'Person raising hand', motion: 'wave', skinTones: skinTones('🙋') }, '🧘': { group: 'people', name: 'Person in lotus position', motion: 'breathe', skinTones: skinTones('🧘') },
  '🏃': { group: 'people', name: 'Person running', motion: 'hop', skinTones: skinTones('🏃') }, '🤸': { group: 'people', name: 'Person cartwheeling', motion: 'twirl', skinTones: skinTones('🤸') },
  '🏊': { group: 'people', name: 'Person swimming', motion: 'bob', skinTones: skinTones('🏊') }, '🏄': { group: 'people', name: 'Person surfing', motion: 'bob', skinTones: skinTones('🏄') },
  '🧑‍🍳': { group: 'people', name: 'Cook', motion: 'nod', skinTones: personSkinTones('🍳') }, '🧑‍🎨': { group: 'people', name: 'Artist', motion: 'twirl', skinTones: personSkinTones('🎨') },
  '🧑‍🚀': { group: 'people', name: 'Astronaut', motion: 'float', skinTones: personSkinTones('🚀') }, '🧑‍💻': { group: 'people', name: 'Technologist', motion: 'nod', skinTones: personSkinTones('💻') },
  '📱': { group: 'objects', name: 'Mobile phone', motion: 'shake' }, '📚': { group: 'objects', name: 'Books', motion: 'nod' }, '✉️': { group: 'objects', name: 'Envelope', motion: 'bob', variants: ['✉'] },
  '💌': { group: 'objects', name: 'Love letter', motion: 'bob', decoration: 'sparkle' }, '🔒': { group: 'objects', name: 'Locked', motion: 'wobble' }, '🔓': { group: 'objects', name: 'Unlocked', motion: 'pop' },
  '🔦': { group: 'objects', name: 'Flashlight', motion: 'nod', decoration: 'flash' }, '🪄': { group: 'objects', name: 'Magic wand', motion: 'twirl', decoration: 'sparkle' }, '🎤': { group: 'objects', name: 'Microphone', motion: 'swing', decoration: 'sound' },
  '🚌': { group: 'travel', name: 'Bus', motion: 'ride' }, '🚕': { group: 'travel', name: 'Taxi', motion: 'ride' }, '🚁': { group: 'travel', name: 'Helicopter', motion: 'bob' },
  '🎡': { group: 'travel', name: 'Ferris wheel', motion: 'steady' }, '⛵': { group: 'travel', name: 'Sailboat', motion: 'bob' }, '🎠': { group: 'travel', name: 'Carousel horse', motion: 'carousel' },
  // Direction-neutral lighting for other objects that naturally emit or reflect light.
  '📸': { group: 'objects', name: 'Camera with flash', motion: 'bounce', decoration: 'flash' },
  '🪔': { group: 'objects', name: 'Oil lamp', motion: 'sway', decoration: 'flicker' },
  '🚨': { group: 'objects', name: 'Police car light', motion: 'pulse', decoration: 'alertLight' },
  '🔅': { group: 'symbols', name: 'Dim button', motion: 'breathe', decoration: 'glow' },
  '🔆': { group: 'symbols', name: 'Bright button', motion: 'pulse', decoration: 'glow' },
  '🌞': { group: 'nature', name: 'Sun with face', motion: 'breathe', decoration: 'glow' },
  '🌟': { group: 'nature', name: 'Glowing star', motion: 'pulse', decoration: 'sparkle' },
  '⚡': { group: 'nature', name: 'High voltage', motion: 'pop', decoration: 'flash' },
  '🎆': { group: 'activities', name: 'Fireworks', motion: 'pop', decoration: 'sparkle' },
  '🎇': { group: 'activities', name: 'Sparkler', motion: 'wobble', decoration: 'sparkle' },
  '🔮': { group: 'objects', name: 'Crystal ball', motion: 'breathe', decoration: 'sparkle' },
  '💎': { group: 'objects', name: 'Gem stone', motion: 'pulse', decoration: 'sparkle' },
  '🪩': { group: 'objects', name: 'Mirror ball', motion: 'spin', decoration: 'sparkle' },
  '🌠': { group: 'nature', name: 'Shooting star', motion: 'float', decoration: 'sparkle' },
  '🪙': { group: 'objects', name: 'Coin', motion: 'flipHorizontal' },
  '🎲': { group: 'activities', name: 'Game die', motion: 'spin' }
};

// Declarative SVG layers never alter the native glyph. Anchors are relative to
// the consumer's glyph container and may be overridden for a particular font.
const signalShape = { viewBox: '0 0 100 100', elements: [{ tag: 'circle', attrs: { cx: '50', cy: '50', r: '29', fill: 'none', stroke: '#7c8ee8', 'stroke-width': '2.5' } }] };
const notesShape = { viewBox: '0 0 100 100', elements: [
  { tag: 'path', attrs: { d: 'M24 37c-7 3-7 8-3 10s9-1 9-5V23l12-3v15c-7 3-7 8-3 10s9-1 9-5V12l-24 6z', fill: '#b780c8' } },
  { tag: 'path', attrs: { d: 'M75 67c-5 2-5 6-2 7s7-1 7-4V54l8-2v12c-5 2-5 6-2 7s7-1 7-4V46l-18 5z', fill: '#dc8f72' } }
] };
const sparkleShape = { viewBox: '0 0 100 100', elements: [
  { tag: 'path', attrs: { d: 'M18 9c1.5 9 3 10.5 12 12-9 1.5-10.5 3-12 12-1.5-9-3-10.5-12-12 9-1.5 10.5-3 12-12z', fill: '#e0a63e' } },
  { tag: 'path', attrs: { d: 'M80 58c1 6 2 7 8 8-6 1-7 2-8 8-1-6-2-7-8-8 6-1 7-2 8-8z', fill: '#d787ad' } }
] };
const centered = { width: '160%', height: '160%', overflow: 'visible' };
const steamShape = { viewBox: '0 0 100 100', elements: [
  { tag: 'path', attrs: { d: 'M38 30c-5-5 5-8 0-14M50 27c-5-5 5-8 0-14M62 30c-5-5 5-8 0-14', fill: 'none', stroke: '#a29aa5', 'stroke-width': '2.5', 'stroke-linecap': 'round' } }
] };
const rainShape = { viewBox: '0 0 100 100', elements: [
  { tag: 'path', attrs: { d: 'M30 67v6M50 72v6M70 67v6', fill: 'none', stroke: '#7c9fca', 'stroke-width': '3', 'stroke-linecap': 'round' } }
] };
// Symmetric rays sit around the glyph rather than assuming a bulb, lens or flame position.
const lightShape = color => ({ viewBox: '0 0 100 100', elements: [
  { tag: 'path', attrs: { d: 'M50 4v9M50 87v9M4 50h9M87 50h9M17 17l6 6M77 77l6 6M83 17l-6 6M23 77l-6 6', fill: 'none', stroke: color, 'stroke-width': '3', 'stroke-linecap': 'round' } }
] });
export const decorations = {
  alertLight: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: lightShape('#df625e'), style: centered,
    keyframes: [{ opacity: 0, transform: 'translate(-50%, -50%) scale(.85)' }, { opacity: .9, transform: 'translate(-50%, -50%) scale(1)', offset: .3 }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1.12)' }],
    options: { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)' }
  }] },
  glow: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: lightShape('#e0a63e'), style: centered,
    keyframes: [{ opacity: 0, transform: 'translate(-50%, -50%) scale(.85)' }, { opacity: .9, transform: 'translate(-50%, -50%) scale(1)', offset: .35 }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1.08)' }],
    options: { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' }
  }] },
  flicker: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: lightShape('#df985c'), style: centered,
    keyframes: [{ opacity: 0, transform: 'translate(-50%, -50%) scale(.9)' }, { opacity: .7, transform: 'translate(-50%, -50%) scale(1)', offset: .3 }, { opacity: .3, transform: 'translate(-50%, -50%) scale(.95)', offset: .5 }, { opacity: .75, transform: 'translate(-50%, -50%) scale(1.03)', offset: .7 }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1)' }],
    options: { duration: 1100, easing: 'cubic-bezier(.22,1,.36,1)' }
  }] },
  flash: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: lightShape('#a5b7df'), style: centered,
    keyframes: [{ opacity: 0, transform: 'translate(-50%, -50%) scale(.75)' }, { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', offset: .18 }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1.2)', offset: .52 }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1.2)' }],
    options: { duration: 800, easing: 'cubic-bezier(.22,1,.36,1)' }
  }] },
  impact: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: { viewBox: '0 0 100 100', elements: [{ tag: 'path', attrs: { d: 'M28 75l-5 4M72 75l5 4M50 79v6', fill: 'none', stroke: '#d49b70', 'stroke-width': '3', 'stroke-linecap': 'round' } }] }, style: centered,
    keyframes: [{ opacity: 0, transform: 'translate(-50%, -50%) scale(.8)' }, { opacity: 0, transform: 'translate(-50%, -50%) scale(.8)', offset: .45 }, { opacity: .85, transform: 'translate(-50%, -50%) scale(1)', offset: .65 }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1.1)' }], options: { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)' }
  }] },
  petals: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: { viewBox: '0 0 100 100', elements: [{ tag: 'ellipse', attrs: { cx: '24', cy: '33', rx: '3', ry: '5', fill: '#d89cb9' } }, { tag: 'ellipse', attrs: { cx: '76', cy: '38', rx: '3', ry: '5', fill: '#d89cb9' } }] }, style: centered,
    keyframes: [{ opacity: 0, transform: 'translate(-50%, -58%) rotate(-8deg)' }, { opacity: .8, transform: 'translate(-50%, -50%) rotate(0deg)', offset: .35 }, { opacity: 0, transform: 'translate(-50%, -35%) rotate(8deg)' }], options: { duration: 1200, easing: 'cubic-bezier(.22,1,.36,1)' }
  }] },
  steam: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: steamShape, style: centered,
    keyframes: [{ opacity: 0, transform: 'translate(-50%, -48%)' }, { opacity: .9, transform: 'translate(-50%, -54%)', offset: .4 }, { opacity: 0, transform: 'translate(-50%, -65%)' }],
    options: { duration: 1000, easing: 'cubic-bezier(.22,1,.36,1)' }
  }] },
  rain: { anchor: { x: '50%', y: '50%' }, layers: [{ svg: rainShape, style: centered,
    keyframes: [{ opacity: 0, transform: 'translate(-50%, -55%)' }, { opacity: .9, transform: 'translate(-50%, -50%)', offset: .3 }, { opacity: 0, transform: 'translate(-50%, -40%)' }],
    options: { duration: 950, easing: 'cubic-bezier(.22,1,.36,1)' }
  }] },
  signal: {
    anchor: { x: '50%', y: '50%' },
    layers: [0, 180, 360].map(delay => ({
      svg: signalShape, style: centered,
      keyframes: [{ opacity: .75, transform: 'translate(-50%, -50%) scale(.55)' }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1.2)' }],
      options: { duration: 700, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }
    }))
  },
  sound: {
    anchor: { x: '50%', y: '50%' },
    layers: [{ svg: notesShape, style: centered,
      keyframes: [{ opacity: 0, transform: 'translate(-50%, -45%) scale(.75)' }, { opacity: .9, transform: 'translate(-50%, -55%) scale(1)', offset: .35 }, { opacity: 0, transform: 'translate(-50%, -70%) scale(1.1)' }],
      options: { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)' }
    }]
  },
  sparkle: {
    anchor: { x: '50%', y: '50%' },
    layers: [{ svg: sparkleShape, style: centered,
      keyframes: [{ opacity: 0, transform: 'translate(-50%, -50%) scale(.6) rotate(-15deg)' }, { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', offset: .42 }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1.2) rotate(10deg)' }],
      options: { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' }
    }]
  }
};
