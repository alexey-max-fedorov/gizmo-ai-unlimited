# Chrome Web Store Listing

## Short description (up to 132 characters)

Unlimited hearts and hints for Gizmo AI quizzes — no interruptions, no paywalls, just studying.

---

## Full description

GIZMO AI UNLIMITED — Study Without Limits

Gizmo AI is one of the best flashcard and quiz platforms out there. It's also one that cuts you off mid-session the moment your streak slips — hearts run out, a modal blocks the interface, and you can't continue until you wait, upgrade, or reload. This extension removes those limits so you can keep studying without hitting a wall every time you make a mistake.

If you've ever been locked out of a quiz right before finishing a deck, this extension is for you.

________________________________________________________________

WHY THIS EXISTS

Gizmo AI uses a hearts system to gate continued practice. Run out of hearts and a full-screen modal blocks the interface. Hints are similarly gated behind a subscription. For students trying to cram before a test, those interruptions don't teach discipline. They just waste time.

________________________________________________________________

WHAT IT DOES

— Removes the out-of-hearts modal so you can keep practicing indefinitely
— Unlocks hints on every question without a subscription
— Activates automatically when you navigate into a quiz, even via SPA navigation from the decks page
— Deactivates automatically when you leave a quiz so it never interferes with the rest of the site
— Works without requiring a page reload

________________________________________________________________

WHAT IT DOES NOT DO

— It does not modify Gizmo's servers, APIs, or account state
— It does not collect, transmit, or store any data about you
— It does not use cookies, local storage, or any persistence mechanism
— It does not contact any third-party analytics, advertising, or telemetry service
— It has no settings panel because it needs none

________________________________________________________________

PRIVACY

The extension fetches a pre-patched version of Gizmo's JavaScript bundle from this project's own GitHub repository (raw.githubusercontent.com). No other network activity occurs. Nothing about you is ever sent anywhere. See the full privacy policy linked in the source repository.

________________________________________________________________

TECHNICAL

Built with Plasmo (MV3). The patched bundle is refreshed automatically every 2 hours via a GitHub Actions workflow to stay current with Gizmo's deployments. Source available at github.com/alexey-max-fedorov/gizmo-ai-unlimited. Every line of code that runs in your browser is in that repository.
