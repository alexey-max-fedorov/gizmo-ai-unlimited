# Privacy Policy — Gizmo AI Unlimited v2.2.1

**Effective date:** May 18, 2026
**Author:** Alexey Fedorov

---

## What data this extension collects

None. Zero.

Gizmo AI Unlimited operates entirely inside your browser. It uses `declarativeNetRequest` to block the original Gizmo JavaScript bundle, then the background service worker fetches `patches.json` (a small JSON rules file) from this repository's `raw.githubusercontent.com` URL and Gizmo's own JavaScript bundle directly from `app.gizmo.ai`, applies the patch rules locally, and caches the result in extension-private storage (`chrome.storage.local`) on your device. That is the full extent of what it does.

The extension does not:
- Collect, read, or store any personal information
- Transmit any data to any server — including the author's
- Use cookies, browser web localStorage, or session storage
- Track your browsing history, quiz activity, or any other behavior
- Load any code from unknown or unauthorized sources — it fetches only from this project's own GitHub repository and from Gizmo AI's own `app.gizmo.ai` domain
- Contact any third-party analytics, advertising, or telemetry service

## What this extension stores locally

The extension caches the patched JavaScript bundle in `chrome.storage.local` — the browser extension's own private storage, inaccessible to websites. This cache contains only a modified copy of Gizmo AI's own public JavaScript bundle. It stores no personal information and never leaves your device. The cache is cleared automatically when the extension is uninstalled.

## Data sharing and sale

There is no data to share or sell. The extension has no backend, no database, and no analytics of any kind. Your data stays in your browser because nothing is ever taken out of it.

## Chrome Web Store installs and uninstalls

If you install this extension through the Chrome Web Store, Google may record that install or uninstall event as part of their platform analytics. This data is collected by Google, not by this extension or its author. Refer to [Google's Privacy Policy](https://policies.google.com/privacy) and the [Chrome Web Store Terms of Service](https://play.google.com/about/play-terms/) for details on what Google tracks and how they use it.

## Disclaimer of liability

This extension is provided **"as is"**, without warranty of any kind, express or implied. The author makes no representations about the suitability, reliability, or accuracy of the extension for any purpose. To the maximum extent permitted by applicable law, the author shall not be liable for any direct, indirect, incidental, special, exemplary, or consequential damages arising from the use of or inability to use this extension, even if advised of the possibility of such damages.

## Changes to this policy

If the extension ever changes in a way that affects data handling, this policy will be updated and the version number in the header will change. The current version (v2.2.1) collects no data.

## Contact

https://github.com/alexey-max-fedorov/gizmo-ai-unlimited/issues
