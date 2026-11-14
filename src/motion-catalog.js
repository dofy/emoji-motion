// Legacy names remain valid keys in the public motions registry. Each alias
// shares its default implementation with the canonical variant; applications
// can still override either key independently through createEmojiMotion().
export { motionAliases } from './motion-aliases.js';

// Categories describe the dominant visible movement, not the emoji subject.
// A combined motion belongs to the category that best describes its main beat.
export const motionCategories = [
  { id: 'bounce', icon: '🏀', labelEn: 'Bounce & rhythm', label: '弹跳与颠簸', description: '落地、回弹或有节奏的上下颠簸', motions: ['bounce','hop','spring','pastryBounce','pose','gardenBounce','dropletBounce','softSettle','climbStep','shoeStep','birdBounce','limbStep','steps','trainRhythm','roadBounce','slam'] },
  { id: 'sway', icon: '👋', labelEn: 'Sway & tilt', label: '摆动与倾斜', description: '围绕支点摇摆、点头或倾斜', motions: ['wave','wobble','swing','sway','sip','twirl','nod','leafSway','gentleSip','rhythm','curiousTilt','writingTilt','fabricSway','toolWiggle','vesselRock','mantelSwing','clockTick','jugglingBeat','hatTip','mealJiggle','sportSwing','alarmRing','seaSwell'] },
  { id: 'rotate', icon: '🔄', labelEn: 'Spin & flip', label: '旋转与翻转', description: '完整转圈、翻面或立体转动', motions: ['spin','carousel','flipHorizontal','flipVertical','hourglassTurn','bookPeek','toss','somersault'] },
  { id: 'float', icon: '🎈', labelEn: 'Float & lift', label: '漂浮与升降', description: '空中、水中或缓慢起落', motions: ['glide','launch','float','flutter','bob','hoverFlight','underwater','cloudDrift','orbitFloat','gentleFall','mailFloat','leafDrift','aircraftHover','flightLift','rocketLift'] },
  { id: 'scale', icon: '💓', labelEn: 'Pulse & squash', label: '缩放与形变', description: '放大、收缩、挤压或伸展', motions: ['pulse','pop','breathe','steady','handEmphasis','treatPop','gestureBeat','cleaningBeat','drumBeat','screenWake','peek'] },
  { id: 'fade', icon: '✨', labelEn: 'Fade & dissolve', label: '渐隐与消散', description: '通过透明度变化表现消失、融化或飘落', motions: ['etherealFade','meltAway','leafFade'] },
  { id: 'travel', icon: '〰️', labelEn: 'Move & shake', label: '移动与抖动', description: '平移、探寻或快速振动', motions: ['ride','search','shake','railRide','creatureSkitter','vehicleRumble'] }
];

// Semantic variants also appear in the movement-oriented comparison lab.
const semanticVariantCategories = {
  bounce: ['animalLeap', 'walkingBeat', 'weightedLift', 'trackBeat'],
  sway: ['greetingWave', 'bowGesture', 'animalCuriosity', 'cupLift', 'toolStrike', 'bellRing'],
  rotate: ['diceToss'],
  float: ['rocketAscent'],
  scale: ['joyPop', 'gestureEmphasis', 'plantGrow', 'softJiggle', 'lightFlash', 'celebrationBurst', 'heartBeat', 'symbolTwinkle'],
  fade: ['meltFade', 'fallingLeaf']
};
for (const category of motionCategories) category.motions.push(...(semanticVariantCategories[category.id] ?? []));
