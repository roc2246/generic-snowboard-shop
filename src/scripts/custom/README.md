# Custom TypeScript

Put new storefront behavior in this directory. New code is checked with the strict TypeScript configuration (`tsconfig.strict.json`). Prefer:

- explicit interfaces/types at external boundaries;
- `unknown` over `any` for data you have not validated;
- typed DOM queries and event objects;
- discriminated unions for stateful UI flows;
- typed pub/sub payloads;
- small custom elements with declared fields;
- runtime guards for Liquid/merchant-controlled markup.

Do not add `@ts-nocheck`. If inherited Dawn code needs changes, improve its types while touching it rather than weakening the compiler.
