# Store listings

Chrome Web Store, Microsoft Edge Add-ons, and Firefox (AMO) are independent listings. Do not upload one tree's zip to every store.

| Store | Listing version | How behavior updates |
| --- | --- | --- |
| Chrome Web Store | 2.5.0 | Hardcoded in the extension. Does not read `patches.json`. |
| Microsoft Edge | 2.2.0 | Depends on `patcher/dist/patches.json` published to `main`. |
| Firefox (AMO) | 2.2.0 | Same as Edge. |

## Chrome Web Store (2.5.0)

Submit `dist/gizmo-ai-unlimited-v2.5.0-chrome.zip` only.

v2.5.0 does not fetch patch rules. The three behaviors (subscription status, `isSubscribedStore`, import-cooldown flag) are hardcoded in `src/lib/runtime-patch.ts` and applied in memory after Gizmo's own Metro factories run. There is no bundled copy of `patches.json`. A Gizmo deploy that renames `SnapshotState`, `isSubscribedStore`, or `runtimeConfig` needs a new Chrome Web Store submission.

## Edge and Firefox (2.2.0)

Leave the live Edge and Firefox listings on the already-published 2.2.0 binaries. Those builds fetch `patcher/dist/patches.json` from `main` (the patcher Action writes that file; there is no `patcher/patches.json`). While those binaries stay installed and the patcher keeps publishing, those two stores can fast-patch without a resubmission.

`package.sh` builds both zips from the current tree, so `dist/gizmo-ai-unlimited-v2.5.0-firefox.zip` is not what the live Firefox listing runs. Do not upload a build from this tree to Edge or Firefox unless you intend to drop fast-patch.

`v2.2.1` is also a fetch-based tag. The listings to leave in place are 2.2.0.
