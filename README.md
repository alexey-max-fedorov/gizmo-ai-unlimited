<p align="center">
  <a href="https://chromewebstore.google.com/detail/jnbnbecephjaglcnfhmpopikchhifgnh?utm_source=github-readme"><img src="https://img.shields.io/badge/Chrome-Install-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" height="50" alt="Install on Chrome"></a>
  &nbsp;&nbsp;
  <a href="https://microsoftedge.microsoft.com/addons/detail/gizmo-ai-unlimited/gajdekhpddjnkkldabhaahhhanmkkegi?utm_source=github-readme"><img src="https://img.shields.io/badge/Edge-Install-0078D7?style=for-the-badge&logo=microsoftedge&logoColor=white" height="50" alt="Install on Edge"></a>
  &nbsp;&nbsp;
  <a href="https://addons.mozilla.org/en-US/firefox/addon/gizmo-ai-unlimited/?utm_source=github-readme"><img src="https://img.shields.io/badge/Firefox-Install-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white" height="50" alt="Install on Firefox"></a>
</p>

# Gizmo AI Unlimited

Unlocks unlimited hearts and hints on [app.gizmo.ai](https://app.gizmo.ai/) quizzes.

## How it works

Two pieces in this repo:

1. **Patcher (`patcher/`)** — a Node CLI run every 2 hours by a GitHub Action. It fetches the live Gizmo JavaScript bundle, rewrites `get isSubscribed(){...}` to return `true`, and commits the result to `patcher/dist/entry.min.js` on the `main` branch.
2. **Browser extension (root)** — a Plasmo MV3 extension. On any `app.gizmo.ai` page it uses declarativeNetRequest to block the original Gizmo bundle, then fetches the pre-patched bundle from this repo's `main` branch and injects it into the page.

## Install

- **Chrome / Edge / Brave:** Load unpacked from `build/chrome-mv3-prod/` after running `pnpm build`.
- **Firefox:** `about:debugging` → "Load Temporary Add-on" → pick `build/firefox-mv3-prod/manifest.json` after `pnpm build:firefox`.

## Build

See `.claude/build.md`.

## Privacy

See `PRIVACY_POLICY.md`. The extension fetches a JavaScript file from this repo's GitHub raw URL — nothing else is sent over the network.

## License

See `LICENSE.txt`.

## FAQ

**What is Gizmo AI Unlimited?**
Gizmo AI Unlimited is a free, open-source browser extension for Chrome, Edge, Brave, and Firefox that removes the daily hearts and hints limits on [app.gizmo.ai](https://app.gizmo.ai/), so you can study and practice without interruption.

**Does it stay up to date automatically?**
Yes. A GitHub Action re-patches the Gizmo JavaScript bundle every 2 hours. Whenever Gizmo pushes an update to their app, the extension self-heals without any action on your part.

**Is it safe to use?**
The extension only activates on `app.gizmo.ai` pages. It collects no personal data and makes no outbound network requests except to load the patched bundle from this public GitHub repository. See `PRIVACY_POLICY.md` for the full details.

**Which browsers are supported?**
Chrome, Edge, Brave, and Firefox. The extension is available on the Chrome Web Store, Microsoft Edge Add-ons, and Firefox Add-ons (AMO).

**Is it free?**
Yes — completely free and open source.
