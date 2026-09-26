# Store listings

v2.5.0 is Chrome Web Store exclusive. Microsoft Edge and Firefox stay on the v2.2.x / v2.3.x line. Do not upload one tree's zip to every store.

| Store | Listing line | How behavior updates |
| --- | --- | --- |
| Chrome Web Store | 2.5.0 only | Hardcoded in the extension. Does not read `patches.json`. |
| Microsoft Edge | v2.2.x / v2.3.x | Fetches `patcher/dist/patches.json` from `main`. |
| Firefox (AMO) | v2.2.x / v2.3.x | Same as Edge. |

## Chrome Web Store (2.5.0)

Submit `dist/gizmo-ai-unlimited-v2.5.0-chrome.zip` only. Do not submit this zip to Edge or Firefox.

v2.5.0 does not fetch patch rules. The three behaviors (subscription status, `isSubscribedStore`, import-cooldown flag) are hardcoded in `src/lib/runtime-patch.ts` and applied in memory after Gizmo's own Metro factories run. There is no bundled copy of `patches.json`. A Gizmo deploy that renames `SnapshotState`, `isSubscribedStore`, or `runtimeConfig` needs a new Chrome Web Store submission.

The 2.5.0 Chrome zip is also attached to the GitHub release so the store build's source is public. It is not the recommended sideload. It cannot pick up patcher updates.

## Edge and Firefox (v2.2.x / v2.3.x)

Leave Edge and Firefox on the fetch-based line. v2.2.x and v2.3.x both read `patcher/dist/patches.json` from `main` (the patcher Action writes that file; there is no `patcher/patches.json`). While one of those binaries stays installed and the patcher keeps publishing, those stores can fast-patch without a resubmission.

v2.3.0 is the current build on that line. The live listings may still be 2.2.0 until they are updated; either version is the right line. Do not replace them with 2.5.0.

`package.sh` builds both zips from the current tree, so `dist/gizmo-ai-unlimited-v2.5.0-firefox.zip` is a 2.5.0 build, not the Firefox listing. Do not upload a build from this tree to Edge or Firefox.
