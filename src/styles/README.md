# SCSS architecture

This theme uses a Shopify-adapted 7-1 structure. Shopify section boundaries are preserved because they are more useful than forcing every file into a generic layout bucket.

## Rules

- `abstracts/` contains build-time Sass tools only: maps, variables, functions, and mixins. It must not emit CSS by itself.
- Merchant-editable values stay as CSS custom properties (`--color-*`, `--font-*`, `--duration-*`, etc.) so Shopify theme settings continue to work at runtime.
- Use `a.media-up`, `a.media-down`, and `a.media-between` instead of repeating Dawn's standard 750px/990px media queries.
- Use `a.theme-color()` for straightforward Shopify color custom-property expressions. Leave complicated runtime-alpha expressions in native CSS when wrapping them would reduce clarity.
- Use mixins only for repeated behavior with semantic value (`flex-center`, `visually-hidden`, responsive helpers). Do not replace every two-line declaration pair with a mixin.
- Prefer shallow nesting (normally no more than 2–3 levels). Nest pseudo-elements, states, and selectors that are clearly owned by a component. Avoid recreating the entire DOM tree in SCSS.
- Prefer BEM-style classes already used by Dawn and use `&` for modifiers/elements when it improves readability.
- Keep section-specific styling in `sections/`; move a rule to `components/` only when the UI pattern is genuinely reusable across sections.
- Generated `assets/*.css` files are build output. Edit `src/styles/**/*.scss`, never the compiled CSS.

## Examples

```scss
@use 'abstracts' as a;

.product-card {
  color: a.theme-color(foreground);

  &__actions {
    @include a.flex-center;
  }

  &:hover {
    color: a.theme-color(foreground, 0.75);
  }

  @include a.media-up(tablet) {
    &__actions {
      justify-content: flex-end;
    }
  }
}
```

Do not convert Shopify runtime tokens to Sass simply to make the file look "more SCSS-like." Sass runs at build time; Shopify theme settings run in the browser/theme-rendering layer.
