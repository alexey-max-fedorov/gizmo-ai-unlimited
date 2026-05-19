# Firefox Add-ons (AMO) Listing

## Summary (up to 250 characters)

Unlimited hearts and hints for Gizmo AI quizzes — no interruptions, no paywalls, just studying.

---

## Description

GIZMO AI UNLIMITED — Study Without Limits

Gizmo AI is one of the best flashcard and quiz platforms out there. It's also one that cuts you off mid-session the moment your streak slips — hearts run out, a modal blocks the interface, and you can't continue until you wait, upgrade, or reload. This extension removes those limits so you can keep studying without hitting a wall every time you make a mistake.

If you've ever been locked out of a quiz right before finishing a deck, this extension is for you.

________

WHY THIS EXISTS

Gizmo AI uses a hearts system to gate continued practice. Run out of hearts and a full-screen modal blocks the interface. Hints are similarly gated behind a subscription. For students trying to cram before a test, those interruptions don't teach discipline. They just waste time.

________

WHAT IT DOES

— Removes the out-of-hearts modal so you can keep practicing indefinitely
— Unlocks hints on every question without a subscription
— Activates automatically when you navigate into a quiz, even via SPA navigation from the decks page
— Deactivates automatically when you leave a quiz so it never interferes with the rest of the site
— Works without requiring a page reload

________

WHAT IT DOES NOT DO

— It does not modify Gizmo's servers, APIs, or account state
— It does not collect, transmit, or store any personal data about you
— It does not use cookies, browser web localStorage, or session storage
— It does not contact any third-party analytics, advertising, or telemetry service
— It has no settings panel because it needs none

________

PRIVACY

The extension fetches a patch rules file (patches.json) from this project's own GitHub repository and Gizmo AI's own JavaScript bundle from app.gizmo.ai. Patches are applied locally. The patched result is cached in extension-private storage on your device. No personal information is involved at any step and nothing about you is ever sent anywhere. See the full privacy policy linked in the source repository.

________

TECHNICAL

Built with Plasmo (MV3). Uses declarativeNetRequest to block Gizmo's original bundle. The background service worker fetches patch rules (patches.json) from GitHub and Gizmo's own bundle from app.gizmo.ai, applies the patches locally, and caches the result in extension-private storage. The patch rules are refreshed automatically every 2 hours via a GitHub Actions workflow to stay current with Gizmo's deployments. Source available at github.com/alexey-max-fedorov/gizmo-ai-unlimited. Every line of code that runs in your browser is in that repository.

Created by Alexey Fedorov.
