# redirect

Documentation for the `*.gizmo.best` shortlinks. They are **Namecheap URL Redirect records** (Domain List > gizmo.best > Advanced DNS), not a Vercel project. The old `gizmo-best-redirect` Vercel project and its `vercel.json` were deleted when the site moved to GitHub Pages.

DNS for `gizmo.best` is on Namecheap BasicDNS (`dns1/dns2.registrar-servers.com`):

- `@` A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages)
- `www` CNAME: `alexey-max-fedorov.github.io.`
- `@` TXT: Google Search Console verification
- One URL Redirect (Permanent, 301, unmasked) record per subdomain below

Every destination carries `?utm_source=<originating-subdomain>` for attribution, except `links` and `support`, which have no UTM.

## Subdomain map

| Subdomain | Destination |
|---|---|
| `extension.gizmo.best`, `ext.gizmo.best` | `https://gizmo.best/get?utm_source=<sub>` |
| `chrome.gizmo.best` | `https://gizmo.best/get?utm_source=chrome.gizmo.best` |
| `edge.gizmo.best` | `https://gizmo.best/get?utm_source=edge.gizmo.best` |
| `firefox.gizmo.best` | Firefox AMO listing |
| `github.gizmo.best`, `gh.gizmo.best` | `github.com/alexey-max-fedorov/gizmo-ai-unlimited` |
| `author.gizmo.best`, `alexey.gizmo.best` | `alexey-fedorov.com` |
| `youtube.gizmo.best`, `yt.gizmo.best`, `tutorial.gizmo.best` | `youtu.be/UlrEFLQGZHY` |
| `links.gizmo.best` | `https://gizmo.best/links` |
| `support.gizmo.best` | `github.com/alexey-max-fedorov/gizmo-ai-unlimited/issues/new` |

## Behavior change: no more browser detection

`extension.` and `ext.` used to pick a store from the `User-Agent` (Firefox AMO, Edge Add-ons, or `/get` for Chrome). Namecheap redirects cannot branch on `User-Agent`, so both now always go to `gizmo.best/get`, which lists every browser (Firefox store, plus manual install for Chrome and Edge). Chrome Web Store and Edge Add-ons listings are down, so `/get` is the right place for those browsers anyway.

## Notes

- Unknown subdomains no longer resolve (the old Vercel wildcard ALIAS is gone). Add a new URL Redirect record for any new shortlink and list it in `website/src/app/links/page.tsx`.
- Namecheap URL Redirect is HTTP-only for subdomains without a certificate, so `https://<sub>.gizmo.best` may show a certificate warning. Plain `http://` links and typed shortlinks work.
