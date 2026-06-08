# redirect

Standalone Vercel project for Gizmo AI Unlimited subdomain redirects on `gizmo.best`. All routing is declared in `vercel.json` — no runtime, no build step.

Every destination carries `?utm_source=<originating-subdomain>` for attribution.

## Subdomain map

### Install

| Subdomain | Destination | Status |
|---|---|---|
| `extension.gizmo.best` | Auto-detected by `User-Agent`: Firefox AMO, Edge Add-ons, or Chrome Web Store (default) | 301 |
| `ext.gizmo.best` | Auto-detected by `User-Agent`: Firefox AMO, Edge Add-ons, or Chrome Web Store (default) | 301 |
| `chrome.gizmo.best` | Chrome Web Store listing | 301 |
| `edge.gizmo.best` | Microsoft Edge Add-ons listing | 301 |
| `firefox.gizmo.best` | Firefox AMO listing | 301 |

### Source

| Subdomain | Destination | Status |
|---|---|---|
| `github.gizmo.best` | `github.com/alexey-max-fedorov/gizmo-ai-unlimited` | 301 |
| `gh.gizmo.best` | `github.com/alexey-max-fedorov/gizmo-ai-unlimited` | 301 |

### Author

| Subdomain | Destination | Status |
|---|---|---|
| `author.gizmo.best` | `alexey-fedorov.com` | 301 |
| `alexey.gizmo.best` | `alexey-fedorov.com` | 301 |

### Tutorial

| Subdomain | Destination | Status |
|---|---|---|
| `youtube.gizmo.best` | `youtu.be/UlrEFLQGZHY` | 301 |
| `yt.gizmo.best` | `youtu.be/UlrEFLQGZHY` | 301 |
| `tutorial.gizmo.best` | `youtu.be/UlrEFLQGZHY` | 301 |

## Browser detection

`extension.gizmo.best` and `ext.gizmo.best` match the visitor's `User-Agent` header:

1. Contains `Firefox` → Firefox AMO
2. Contains `Edg/` → Edge Add-ons
3. Fallback (Chrome and everything else) → Chrome Web Store

Edge's UA string also contains the word `Chrome`, so the Edge rule **must** be evaluated before the Chrome fallback in `vercel.json`. Vercel evaluates redirects top-down — if the Chrome fallback (no UA condition) came first, Edge users would land on the Chrome Web Store instead.

## Files

- `vercel.json` — redirect rules and status codes
- `public/index.html` — minimal static fallback (served only on unmatched routes)
- `.gitignore` — excludes `.vercel` directory

## DNS

Each subdomain needs a CNAME / ALIAS pointing to this Vercel project (or use a wildcard ALIAS on `gizmo.best` and let Vercel route by `host`). Add the subdomains under Project Settings → Domains.
