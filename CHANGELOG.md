# Changelog

## 0.7.1 — 2026-11-14

- Choose reusable motions directly for Unicode fallback, retain semantic metadata for compatibility, and preserve handcrafted overrides and the 22 new motion variants.

- Group motion variants by visible movement and merge seven near-duplicates; legacy motion names remain available and independently overridable.

- Add opacity and scale-driven fade and melt motions and direction-neutral movements for aircraft, trains, road vehicles, boats and rockets.

- Refine shared animations with stronger, varied anticipation, movement and recovery while preserving named motions and custom overrides.

- Add stronger anticipation, pauses and rebounds to steady, pose, steps, pastryBounce, spring and hop; give screens a separate wake-up motion.

- Add motion families for climbing, juggling, body gestures, hats, lab equipment, optics, toys and cleaning supplies, including official gender and skin tone variants.

- Add reviewed families and reusable motions for mail, footwear, percussion, fallen leaves, aircraft and cutlery.

- Add reviewed motions for small creatures, birds, meals, legs and feet, road vehicles, shy faces and sports gear.
- Refine bounces and sways with more pronounced, rhythmic phases.
- Give the mantel clock, droplet and luggage dedicated, more visible motions.

## 0.7.0 — 2026-11-14

- **Behavior change:** emoji that use the bounce, hop or spring motions, including most animals and faces, now move with the new rhythm. The game die, alarm clock, cartwheeling person and turtle use new motions, and the hammer leaves the hand tools family.
- Give springs, bounces, hops and pop a gravity-aware rhythm with anticipation, per-segment easing and squash on landing.
- Add toss, somersault, alarmRing, peek and slam motions for dice, cartwheels, alarm clocks and telephones, peeking faces and the hammer.
- Burst sparkles one after another, and add a scan effect for screens and documents.
- Let decoration layers paint behind the glyph, and read built-in effect colors from CSS custom properties.
- `bind()` ignores touch hover, mouse focus and repeats within its new `cooldown` (260 ms by default).

## 0.6.4 — 2026-11-14

- Add ripple, splash and wake effects for water.
- Add families for swimmers, surfers, water polo players and rowers, covering their gender and skin tone variants.
- Boats, the ring buoy, the water wave, the dolphin and the diving mask now use water effects.

## 0.6.0 — 2026-11-14

- Add motion families for vegetables, land animals, clothing, tools, books, hand gestures, boats and sweet treats.
- Support the official skin tone variants for the new hand gestures.
- Add gentle ticking, falling and settling motions for clocks, rain and containers.

## 0.5.1 — 2026-11-13

- Fix the npm package page to show the English README by default.

## 0.5.0 — 2026-11-13

- Add reviewed motion families for fruit, animal faces, clouds, celestial bodies and writing tools.
- Add judges, pilots and singers with their official skin tone variants.
- Add five reusable motions and optional sparkles for fruit.

## 0.4.0 — 2026-11-13

- **Breaking:** Remove the component `display` prop and web component attribute. Components use normal inline layout; use a block container or CSS for placement.
- Add `enhance()` to animate emoji in existing text and observe dynamic content.
- Expand reviewed motion families and improve the demo.

## 0.3.0 — 2026-11-13

- Add lighting and sparkle effects for light sources, reflective objects, and celebrations.
- Expand the handcrafted collection to 177 emoji, including 44 with optional SVG effects.
- Refine motions for amusement rides, dice, compass, sunflower, candle, and hourglass.
- Add reusable 3D carousel and object flip motions.

## 0.2.0 — 2026-11-13

- Expand the handcrafted collection to 161 emoji and add five reviewed motion families.
- Add configurable spring and sway motion builders and composable SVG decorations.
- Support custom families with explicit variant aliases and user-defined priority.
- Improve the demo with family previews, persistent preferences and clearer examples.

## 0.1.0 — 2026-11-13

Initial public release.

- Animate native emoji using handcrafted presets or automatic Unicode 18.0 classification.
- Customize emoji, group and classification motions with user-defined rules taking priority.
- Support skin tone variants, optional SVG decorations and reduced-motion preferences.
- Provide components for React, Vue and Svelte, plus a framework-independent web component.
- Offer preset-only lite entry points and TypeScript declarations.
