# redirect

The `*.gizmo.best` shortlinks are served by a free Cloudflare Worker, `gizmo-redirects`. `worker.js` here is the single source of truth for the host map. The apex site is on GitHub Pages.

## DNS (Cloudflare, zone `gizmo.best`, Free plan)

Registrar is Namecheap with custom nameservers `aron.ns.cloudflare.com` and `merlin.ns.cloudflare.com`.

- `@` A records `185.199.108.153` .. `185.199.111.153` (GitHub Pages), **DNS-only**
- `www` CNAME `alexey-max-fedorov.github.io`, **DNS-only** (GitHub redirects www to apex)
- `@` TXT: Google Search Console verification
- `*` A `192.0.2.1`, **proxied**: dummy origin so wildcard subdomains hit the Worker
- Worker route `*.gizmo.best/*` -> `gizmo-redirects` (the apex does not match this route)

## Subdomain map

Every destination carries `?utm_source=<sub>.gizmo.best`, except `links` and `support`.

| Subdomain | Destination |
|---|---|
| `extension`, `ext` | Firefox User-Agent: Firefox AMO listing. Anything else: `https://gizmo.best/get` |
| `chrome`, `edge` | `https://gizmo.best/get` (Chrome Web Store and Edge Add-ons listings are down) |
| `firefox` | Firefox AMO listing |
| `github`, `gh` | `github.com/alexey-max-fedorov/gizmo-ai-unlimited` |
| `author`, `alexey` | `alexey-fedorov.com` |
| `youtube`, `yt`, `tutorial` | `youtu.be/UlrEFLQGZHY` |
| `links` | `https://gizmo.best/links` |
| `support` | `github.com/alexey-max-fedorov/gizmo-ai-unlimited/issues/new` |

All are 301 over HTTPS (Cloudflare Universal SSL). Unknown subdomains return 404.

## Deploying changes

Edit `worker.js`, then upload it as a module Worker named `gizmo-redirects` (Cloudflare dashboard > Workers, or `PUT /accounts/{id}/workers/scripts/gizmo-redirects` with `main_module: index.js`). Add new shortlinks to the `MAP` and to `website/src/app/links/page.tsx`. Free plan limit: 100k requests/day.
