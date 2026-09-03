# Firefox Add-ons (AMO) Listing

## Summary (up to 250 characters)

Unlimited hearts and hints for Gizmo AI, plus no client-side Magic Import cooldown — fewer interruptions, more studying.

---

## Description

GIZMO AI UNLIMITED — Study Without Limits

Gizmo AI is one of the best flashcard and quiz platforms out there, but it can interrupt study sessions: hearts run out, hints stay locked, and Magic Import makes you wait on a client-side cooldown before another import. This extension removes those client-side limits so you can keep studying.

If you've ever been stopped mid-quiz or made to wait before importing more study material, this extension is for you.

________

WHY THIS EXISTS

Gizmo AI uses a hearts system to gate continued practice. Run out of hearts and a full-screen modal blocks the interface. Hints are similarly gated behind a subscription, while Magic Import adds a client-side cooldown before another import. For students trying to cram before a test, those interruptions don't teach discipline. They just waste time.

________

WHAT IT DOES

— Removes the out-of-hearts modal so you can keep practicing indefinitely
— Unlocks hints on every question without a subscription
— Removes Magic Import's client-side cooldown so its local timer does not delay another import
— Activates automatically when you navigate into a quiz, even via SPA navigation from the decks page
— Deactivates automatically when you leave a quiz so it never interferes with the rest of the site
— Works without requiring a page reload

________

WHAT IT DOES NOT DO

— It does not modify Gizmo's servers, APIs, or account state or bypass server-side limits
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
