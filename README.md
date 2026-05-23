# RAID: Shadow Legends - Playable Ad
### Smadex Creative Studio Technical Assessment

A self-contained HTML5 playable ad built with TypeScript and PixiJS.
Three escalating combat rounds, gear progression, and a full CTA screen.

## Play it
Open `dist/index.html` directly in any browser. No server required.

## Stack
- TypeScript + PixiJS v8
- Vite + vite-plugin-singlefile (single-file HTML output)

## Run locally
```
npm install
npm run dev
```

## Build
```
npm run build
```

## Structure
```
src/
  main.ts             - Bootstrap, game loop, asset loading
  builder.ts          - Scene, background, UI, hero construction
  EnemyManager.ts     - Enemy state, hit logic, round transitions
  OverlayManager.ts   - Pickups, tutorial hand, CTA screen
  vfx.ts              - Particles, shake, tween, vignette
  constants.ts        - Viewport, positions, game constants
  types.ts            - Shared interfaces
```
