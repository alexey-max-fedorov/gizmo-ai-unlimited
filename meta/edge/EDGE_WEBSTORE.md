# Edge Add-ons Listing

## Short description (up to 132 characters)

Unlimited hearts and hints for Gizmo AI quizzes — no interruptions, no paywalls, just studying.

---

## Full description

GIZMO AI UNLIMITED — Study Without Limits

Gizmo AI Unlimited is a free Edge extension that removes the hearts limit and unlocks hints on every Gizmo AI quiz — no subscription required, no account changes, no data collected. Install it once and study without interruption.

Gizmo AI is one of the best flashcard and quiz platforms available. It is also one that cuts you off mid-session the moment your streak slips — hearts run out, a modal blocks the interface, and you cannot continue until you wait, upgrade, or reload. This extension eliminates those interruptions so you can keep studying without hitting a wall every time you make a mistake.

________________________________________________________________

WHAT IT DOES

— Removes the out-of-hearts modal so you can practice indefinitely
— Unlocks hints on every question without a subscription
— Activates automatically on every Gizmo AI quiz, including SPA navigation from the decks page
— Stays current automatically: the patched bundle is refreshed every 2 hours via a scheduled GitHub Actions workflow

________________________________________________________________

WHAT IT DOES NOT DO

— Does not modify Gizmo's servers, APIs, or account state
— Does not collect, transmit, or store any personal data about you
— Does not use cookies, browser web localStorage, or session storage
— Does not contact any third-party analytics, advertising, or telemetry service
— Has no settings panel because it needs none

________________________________________________________________

FREQUENTLY ASKED QUESTIONS

Does Gizmo AI Unlimited still work?
Yes. The extension checks for bundle updates every 2 hours automatically. If Gizmo deploys a change, the patch is refreshed within 2 hours.

How do I get unlimited hearts on Gizmo AI?
Install this extension. Once installed, the hearts modal is removed and you can practice indefinitely without waiting or upgrading.

How do I unlock hints on Gizmo AI without a subscription?
This extension unlocks hints on every question automatically. No subscription or account change is needed.

Does it require creating an account or logging in?
No. The extension works without any account and makes no changes to your Gizmo account or profile.

Is it free?
Yes, completely free. No in-app purchases, no premium tier.

Does it work after SPA navigation (when you click into a quiz from the decks page)?
Yes. The extension is designed specifically to handle Gizmo's single-page app navigation.

Is it safe? Does it steal my data?
No personal data is ever collected or transmitted. The extension fetches a patch rules file (patches.json) from this project's own GitHub repository and Gizmo AI's own JavaScript bundle from app.gizmo.ai. Patches are applied locally in the background. The result is cached in extension-private storage on your device. Full source code is publicly available.

________________________________________________________________

PRIVACY

The extension fetches a patch rules file (patches.json) from this project's GitHub repository and Gizmo AI's own JavaScript bundle from app.gizmo.ai. Patches are applied locally. The patched result is cached in extension-private storage on your device. No personal information is involved at any step and nothing about you is ever sent anywhere. See the full privacy policy linked in the source repository.

________________________________________________________________

TECHNICAL

Built with Plasmo (MV3). Uses declarativeNetRequest to block Gizmo's original bundle. The background service worker fetches patch rules (patches.json) from GitHub and Gizmo's own bundle from app.gizmo.ai, applies the patches locally, and caches the result in chrome.storage.local. The patch rules are refreshed automatically every 2 hours via a GitHub Actions workflow to stay current with Gizmo's deployments. Source available at github.com/alexey-max-fedorov/gizmo-ai-unlimited. Every line of code that runs in your browser is in that repository.

Created by Alexey Fedorov.
