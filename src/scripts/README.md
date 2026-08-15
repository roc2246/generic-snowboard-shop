# TypeScript architecture

The theme keeps Shopify's browser-ready JavaScript in `assets/`, while authored TypeScript lives in `src/scripts/`.

## Strategy

This theme started from Dawn-style JavaScript, so there are two deliberate compiler layers:

1. **Inherited theme layer (`tsconfig.json`)** — all existing storefront scripts are compiled and type-checked without blanket suppressions. DOM/custom-element compatibility declarations live in `types/` so Liquid-generated runtime APIs are described once instead of cast repeatedly.
2. **Strict custom layer (`tsconfig.strict.json`)** — shared event infrastructure plus everything under `custom/` uses full strict TypeScript. New snowboard-shop functionality belongs here.

This prevents the common anti-pattern of renaming `.js` to `.ts` and adding `@ts-nocheck`, while still allowing a large inherited theme to be migrated safely.

## Important patterns

- `constants.ts` defines literal pub/sub event names with `as const`.
- `pubsub.ts` uses a typed event map, so subscribers and publishers agree on payload shapes.
- `types/shopify-globals.d.ts` contains Shopify/Liquid/browser integration boundaries.
- Custom elements declare their persistent instance fields instead of relying on implicit JavaScript properties.
- DOM event handlers use concrete event types where behavior depends on keyboard/input/select semantics.
- New code should prefer `unknown` plus guards over adding new `any` types.

## Commands

- `npm run build:scripts` — compile TypeScript into Shopify's `assets/*.js`.
- `npm run watch:scripts` — compile continuously during development.
- `npm run typecheck` — check the entire inherited + custom source tree.
- `npm run typecheck:strict` — enforce strict typing for shared infrastructure and new custom code.
- `npm run check:types` — reject blanket TypeScript suppressions and run both type-check layers.
