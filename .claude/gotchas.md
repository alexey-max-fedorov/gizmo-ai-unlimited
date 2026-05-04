# Gotchas

## Do not add `engines.node` to package.json
Parcel reads `engines` and switches to **Node.js target resolution**, which breaks the browser-extension build silently. If you want to document Node version, do it in README prose only.

## Firefox AMO: `data_collection_permissions`
AMO's validator requires `browser_specific_settings.gecko.data_collection_permissions` even for extensions that collect nothing. Use the `"none"` sentinel:
```json
"data_collection_permissions": { "required": ["none"], "optional": [] }
```
See commits `6b8d23a`, `139aa06`, `894e764` for the iteration that landed on this shape.

## Tests use `--experimental-strip-types`
Node strips TS types at runtime — no transpile step. This means **only type annotations** are allowed; TS-only constructs (enums, namespaces, parameter properties, decorators) will fail. Stick to `type` / `interface` / `as` casts.

## React 19 + Plasmo
Plasmo 0.90.x supports React 19. Don't downgrade React without checking Plasmo compat.
