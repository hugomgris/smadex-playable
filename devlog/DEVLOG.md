# Smadex Playable Ad - Devlog

## Raid: Shadow Legends | Technical & Creative Assessment


## 1. Approach & Research

Before any design or implementation work, I dedicated time to grounding the assessment in a solid understanding of the playable ad format: its conventions, technical constraints, and performance metrics. This included researching the anatomy of high-performing playable ads, reviewing real examples across platforms, and mapping the format's requirements to the available tech stack.

Key constraints identified early:
- Single self-contained HTML file: all assets must be inlined, no runtime network calls
- Mobile-first: portrait orientation, touch input, 60fps on mid-range devices
- Short session engagement: 15–20 seconds, one satisfying loop, CTA at peak excitement
- Lightweight and performant: target around 5MB

With those constraints defined, tech stack and game choice decisions followed naturally.

### Stack selected: TypeScript + PixiJS v8, bundled with Vite + vite-plugin-singlefile
PixiJS provides hardware-accelerated WebGL rendering, clean sprite and container APIs, and a ticker system well-suited to game-loop animation. Vite's build pipeline with `vite-plugin-singlefile` handles asset inlining automatically, producing a single HTML file with all resources embedded as base64. Final build size: ~5.5MB.

### Game selected: Raid: Shadow Legends
The power fantasy of the game (powerful champion, dramatic combat, crushing enemies) maps directly to what a playable ad needs to communicate in under 20 seconds. The provided assets (character sprites, effects, backgrounds) offered strong composition material for a hero-vs-enemy layout.

<br>

## 2. Concept & Design

Before writing any implementation code, the full experience was designed and mocked up in Photoshop: **four screens** covering the complete user journey: battle round 1, battle round 2, battle round 3, and the CTA screen.

This upfront composition work served as a spatial contract for the implementation: character positions, UI element placement, layer ordering, and the visual progression across rounds were all resolved before touching the codebase. It also confirmed asset viability, verifying that the available sprites, effects, and UI elements could support the intended composition.

An asset preparation phase was necessary to collect, crop and size the chosen material from the provided source. Some pre-composition of banners, animation sheets and character sprites was done in Photoshop to create the asset base implemented in the delivered build.

### Core design concept: the onboarding ladder

Each round introduces exactly one new mechanic, building on the previous:
- **Round 1**: tap the enemy to attack. Baseline interaction, no explanation needed.
- **Round 2**: a gear pickup appears. Tap it to equip, upgrading the hero visually. Enemy is stronger.
- **Round 3**: a skill orb appears center-screen. Tap it to trigger the boss kill sequence.

No instruction text anywhere. A tutorial hand points at whatever requires interaction. Mechanics are demonstrated, not described.

This structure serves two purposes simultaneously: it functions as a natural onboarding sequence for a new player, and it gives the playable a sense of escalating stakes across its 20-second runtime.

**CTA placement:** the download prompt appears immediately after the boss kill animation, at the moment of highest engagement, not after a cooldown. Timing the CTA to peak excitement is a deliberate conversion optimization.

<br>

## 3. Architecture

The codebase is organized around clear separation of concerns:

```
main.ts           - Bootstrap, game loop, asset loading, top-level orchestration
builder.ts        - Scene layer construction, background, UI, hero composite, pickups
EnemyManager.ts   - Enemy state, hit detection, health bar updates, round transitions
OverlayManager.ts - Gear pickups, skill orb, tutorial hand, CTA screen
vfx.ts            - Particles, screen shake, tween utility, vignette
constants.ts      - Viewport dimensions, positional constants, game configuration
types.ts          - Shared interfaces
```

**Scene layer system:** all visual elements are organized into ordered containers (`bgLayer`, `arenaLayer`, `enemyLayer`, `heroLayer`, `fxLayer`, `uiLayer`, `overlayLayer`, `ctaLayer`), all children of a root `world` container that receives screen shake transforms. This keeps render order explicit and effects cleanly scoped.

**Manager pattern:** `EnemyManager` owns the combat state machine and round progression. `OverlayManager` owns everything that appears over the combat: pickups, tutorials, end screen. They communicate through a shared state object and a `onRoundCleared` callback. When a round ends, the enemy manager fires the callback; the overlay manager decides what to show next. This separation meant combat logic and UI logic could be developed and debugged independently.

**Positional constants:** all sprite positions that the ticker animation loop touches are defined as named constants (`ENEMY_X`, `ENEMY_Y`, `HERO_BASE_Y`). Any value set at initialization, tweened during animation, and written every frame by the ticker must reference the same constant. Otherwise, frame-by-frame overwrites produce visual inconsistencies.

**Tween utility:** a lightweight promise-based tween function handles all animation: alpha transitions, scale entrances, position lerps. It takes a target object, a property name, a destination value, a duration, and an optional easing function. Returning a promise allows sequential and parallel animation composition via `await` and `Promise.all`.

<br>

## 4. Build Process

Development followed a strict phase-by-phase protocol, with each phase having a single testable goal before moving forward:

1. App boots, canvas renders, background fills screen
2. Layer system established
3. Static UI: logo, tracker icons, health bar
4. Enemy sprite positioned correctly
5. Hero composite assembled and positioned
6. Ticker running: idle animations only
7. State machine and `startGame()` flow
8. Enemy tap interaction, hit feedback, health depletion
9. Enemy kill sequence and round transitions
10. Tutorial hand
11. Gear pickup -> sword equip, hero upgrade
12. Skill pickup -> boss fight sequence
13. Win sequence and CTA screen
14. Polish pass: particles, screen shake, visual transitions
15. Build pipeline: single HTML output, mobile testing

Each phase was verified visually and interactively before the next began. This incremental approach kept the codebase understandable at each step and made debugging straightforward, as any new issue was introduced by the most recent change.

<br>

## 5. Hero Composite

The hero character is assembled from individually cropped sprite parts (body, cape, head, arms, sword, shoulders), each positioned within a shared root `Container`. This approach allows per-part animation (arm rotation on attack, shoulder visibility toggle on gear equip) without requiring pre-composed animation frames. Said per-part animation was not fully developed due to time constraints, but thanks to the scaffolding being in place it would be pretty much a straigth forward and quick implementation.

The visual upgrade on gear equip (swapping head and sword sprites, revealing shoulder armor) communicates progression through the character itself rather than through UI. The player's action (tapping the pickup) has a visible consequence on the avatar they've been watching fight. This is a deliberate design choice: the character reflects what the player has done.

<br>

## 6. Delivery

**Live demo:** [hugomgris.github.io/smadex-playable](https://hugomgris.github.io/smadex-playable/)
Served via GitHub Pages. Opens and plays directly in any modern browser, no installation required.

**Source:** [github.com/hugomgris/smadex-playable](https://github.com/hugomgris/smadex-playable)
Full TypeScript source, asset pipeline, and built deliverable.

**Technical note:** a minor bottom crop is observable when opening the file directly on Android Chrome due to the browser's navigation chrome consuming viewport height. This is specific to the `file://` and direct browser context, and in a WebView ad delivery environment, where browser chrome is absent, the layout fills the screen correctly.