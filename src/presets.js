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
  shake: { keyframes: [{ transform: 'translateX(0)' }, { transform: 'translateX(-10%) rotate(-8deg)' }, { transform: 'translateX(10%) rotate(8deg)' }, { transform: 'translateX(-6%) rotate(-5deg)' }, { transform: 'translateX(4%) rotate(3deg)' }, { transform: 'translateX(0)' }], options: { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' } }
};

// Groups describe semantic families; emoji entries may override the group's motion.
export const groups = {
  gestures: { label: 'Gestures', motion: 'wave', description: 'Hands with a friendly wave.' },
  faces: { label: 'Faces', motion: 'bounce', description: 'Expressions with a little bounce.' },
  hearts: { label: 'Hearts', motion: 'pulse', description: 'A soft double heartbeat.' },
  objects: { label: 'Objects', motion: 'wobble', description: 'Everyday things, gently brought to life.' },
  nature: { label: 'Nature', motion: 'float', description: 'A light, drifting movement.' },
  travel: { label: 'Travel', motion: 'launch', description: 'Things ready to take off.' },
  symbols: { label: 'Symbols', motion: 'spin', description: 'A small turn for signs and shapes.' }
};

// Variants are explicit: unrelated sequences are never silently normalized.
export const emoji = {
  '👋': { group: 'gestures', name: 'Waving hand', variants: ['👋🏻','👋🏼','👋🏽','👋🏾','👋🏿'] },
  '👍': { group: 'gestures', name: 'Thumbs up', motion: 'bounce', variants: ['👍🏻','👍🏼','👍🏽','👍🏾','👍🏿'] },
  '👏': { group: 'gestures', name: 'Clapping hands', motion: 'shake', variants: ['👏🏻','👏🏼','👏🏽','👏🏾','👏🏿'] },
  '😊': { group: 'faces', name: 'Smiling face' }, '😂': { group: 'faces', name: 'Tears of joy', motion: 'shake' }, '🥳': { group: 'faces', name: 'Party face', motion: 'wobble' },
  '❤️': { group: 'hearts', name: 'Red heart', variants: ['❤'] }, '💛': { group: 'hearts', name: 'Yellow heart' }, '💖': { group: 'hearts', name: 'Sparkling heart' },
  '🔍': { group: 'objects', name: 'Magnifying glass', motion: 'search' }, '🔔': { group: 'objects', name: 'Bell', motion: 'swing', decoration: 'sound' }, '🎁': { group: 'objects', name: 'Gift', motion: 'shake' }, '📡': { group: 'objects', name: 'Satellite antenna', motion: 'wobble', decoration: 'signal' }, '⏱️': { group: 'objects', name: 'Stopwatch', motion: 'swing', variants: ['⏱'] },
  '🌸': { group: 'nature', name: 'Blossom' }, '🍃': { group: 'nature', name: 'Leaves' }, '☀️': { group: 'nature', name: 'Sun', motion: 'spin', variants: ['☀'] },
  '🚀': { group: 'travel', name: 'Rocket' }, '✈️': { group: 'travel', name: 'Airplane', motion: 'glide', variants: ['✈'] }, '🚲': { group: 'travel', name: 'Bicycle', motion: 'ride' },
  '✨': { group: 'symbols', name: 'Sparkles', motion: 'pulse', decoration: 'sparkle' }, '⚙️': { group: 'symbols', name: 'Gear', variants: ['⚙'] }, '🎯': { group: 'symbols', name: 'Target', motion: 'bounce' }, '🎵': { group: 'symbols', name: 'Musical note', motion: 'swing', decoration: 'sound' }
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
export const decorations = {
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
