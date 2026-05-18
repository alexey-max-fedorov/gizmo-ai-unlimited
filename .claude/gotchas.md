# Gotchas

## Do not add `engines.node` to package.json (extension root)
Parcel reads `engines` and switches to **Node.js target resolution**, which breaks the browser-extension build silently. If you want to document Node version, do it in README prose only. (The patcher's `package.json` is fine to mark — it's not a Plasmo build.)

## Firefox AMO: `data_collection_permissions`
AMO's validator requires `browser_specific_settings.gecko.data_collection_permissions` even for extensions that collect nothing. Use the `"none"` sentinel:
```json
"data_collection_permissions": { "required": ["none"], "optional": [] }
```

## Tests use `--experimental-strip-types`
Node strips TS types at runtime — no transpile step. This means **only type annotations** are allowed; TS-only constructs (enums, namespaces, parameter properties, decorators) will fail. Stick to `type` / `interface` / `as` casts. Imports must use the `.ts` extension.

## React 19 + Plasmo
Plasmo 0.90.x supports React 19. Don't downgrade React without checking Plasmo compat.

## Gizmo bot detection
A bare `curl` of `https://app.gizmo.ai/quiz/198926301` returns a "We think you're a bot" stub HTML, not the real script tags. The patcher MUST send a realistic Chrome User-Agent header. See `patcher/src/constants.ts:USER_AGENT`.

## `onreset` and `URL` shadowing
HTML event-handler attributes (like `onreset`) run with `document` in their scope chain. Inside such a handler, the bare identifier `URL` resolves to `document.URL` (a string) instead of `window.URL` (the constructor). The patched bundle uses `new URL(...)`, so the injection payload prepends `var URL=window.URL;` to shadow the document field. If you change the injection mechanism, preserve this fix.

## `isSubscribed` regex tightness
`/\bget isSubscribed\(\)\{[^}]*\}/g` works because the observed minified bodies don't contain a `}`. If a future Gizmo build inlines logic with nested braces, the regex will under-match. The patcher exits non-zero when the match count is **zero**; a fluctuating non-zero count is the early warning sign — investigate before assuming success.

## DNR `urlFilter` wildcards
`*://app.gizmo.ai/_expo/static/js/web/entry-*.js` works because DNR's `urlFilter` supports leading scheme wildcards (`*://`) and bare `*` wildcards within the path. Don't try to use a regex; DNR has a separate `regexFilter` field that is more constrained and not necessary here.

## `patches.json` URL points at `main`
`PATCHES_URL` in `lib/patch-config.ts` references the `main` branch on GitHub. While developing on a feature branch, the extension still pulls patches from `main`. To test changes to the patcher locally, override `PATCHES_URL` temporarily, or use the chrome.storage cache to seed a known-good bundle directly.

## chrome.storage.local quota
The cached patched bundle is ~18MB. The default `chrome.storage.local` quota is 10MB, so the manifest declares the `unlimitedStorage` permission. This permission shows no install-time warning to users.

## `storage` AND `unlimitedStorage` are separate permissions
`unlimitedStorage` only relaxes the quota — it does NOT expose `chrome.storage`. To use `chrome.storage.local` at all, the manifest must declare BOTH `"storage"` (exposes the API) AND `"unlimitedStorage"` (raises the cap). Missing `storage` makes `chrome.storage` itself `undefined` at runtime — the symptom is a confusing `Cannot read properties of undefined (reading 'local')` in the background service worker with no compile-time warning.

## ISOLATED bridge must be registered before MAIN dispatches
Both content scripts run at `document_start`, but the MAIN-world script only dispatches `__gizmo_patch_request__` AFTER a script tag is detected (i.e., not synchronously at load). The ISOLATED bridge registers its listener at script top, synchronously — so it is always ready before any request fires.

## Cross-realm CustomEvent
MAIN and ISOLATED content scripts share the DOM. CustomEvents dispatched on `document` from either realm are visible to listeners in the other. This is the only practical bridge — `window.postMessage` works too but requires origin checks.
