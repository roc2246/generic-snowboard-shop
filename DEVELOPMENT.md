# Theme development

Shopify serves browser-ready CSS and JavaScript from `assets/`. Treat `src/` as the source of truth and `assets/` as generated output.

## Architecture

### SCSS: Shopify-adapted 7-1

The theme keeps Shopify's section-oriented design instead of forcing every style into a textbook 7-1 layout:

```text
src/styles/
├── abstracts/   # Sass variables, mixins, functions
├── base/        # Global/base theme styling
├── components/  # Reusable UI/component styles
├── layout/      # Reserved for truly global layout primitives
├── sections/    # Shopify section-specific styles
├── pages/       # Customer/template/page-specific styles
└── vendors/     # Reserved for third-party styles
```

Section files intentionally keep their Dawn/Shopify names, such as `_section-main-product.scss`. The build flattens them back into the exact asset names Shopify/Liquid already expects, such as `assets/section-main-product.css`.

Do not move a Shopify section stylesheet into `layout/` merely to satisfy textbook 7-1. The section boundary is more useful in a Shopify theme.

### TypeScript: gradual migration

Existing Dawn JavaScript is retained as TypeScript source in `src/scripts/`. Most inherited files still use `// @ts-nocheck` so the migration does not change runtime behavior or require a large unrelated typing rewrite.

`constants.ts` and `pubsub.ts` are already type-checked as small foundation files. **Any new TypeScript you add should be written without `// @ts-nocheck`**, so `strict` mode applies immediately. When you substantially modify an inherited Dawn file, remove `// @ts-nocheck` from that file and type it as part of that change.

This gives custom functionality real TypeScript safety without spending time rewriting untouched Dawn internals.

## Install tooling

```bash
npm install
```

## Build once

```bash
npm run build
```

This performs:

- SCSS source -> flat Shopify CSS assets
- TypeScript source -> Shopify JavaScript assets

## Type-check

```bash
npm run typecheck
```

New/custom TypeScript is checked strictly. Inherited files with `// @ts-nocheck` are intentionally migration exceptions.

## Develop locally

Use two terminals:

```bash
npm run watch
```

```bash
shopify theme dev
```

The watchers regenerate the existing Shopify asset filenames, so Liquid asset references do not need to change.

## Rules for future work

1. Edit SCSS/TS source files, not generated CSS/JS in `assets/`.
2. Keep Shopify section-specific SCSS in `src/styles/sections/`.
3. Put genuinely reusable UI styling in `components/`.
4. Use `abstracts/` only for build-time Sass helpers; retain merchant/theme tokens as CSS custom properties when appropriate.
5. Write all new JavaScript functionality in TypeScript without `// @ts-nocheck`.
6. Gradually type inherited Dawn files only when you are already modifying them.
