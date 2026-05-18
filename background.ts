// Background service worker for Gizmo AI Unlimited.
// Registers a declarativeNetRequest rule that BLOCKs the original
// entry-*.js bundle. The MAIN-world content script (contents/gizmo-patch.ts)
// intercepts the corresponding <script> insertion and injects the
// patched bundle from raw.githubusercontent.com instead.
//
// On first install, also reloads any open gizmo.ai tabs so the
// patch activates without requiring the user to manually refresh.

import { reloadGizmoTabs } from "./lib/reload-tabs";

const RULES: chrome.declarativeNetRequest.Rule[] = [
  {
    id: 1,
    priority: 1,
    action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
    condition: {
      urlFilter: "*://app.gizmo.ai/_expo/static/js/web/entry-*.js",
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.SCRIPT]
    }
  }
];

chrome.runtime.onInstalled.addListener(async (details) => {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const existingIds = existing.map((r) => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingIds,
    addRules: RULES
  });

  console.log("[Gizmo Unlimited] declarativeNetRequest rules registered");

  if (details.reason === "install") {
    try {
      const count = await reloadGizmoTabs(chrome.tabs);
      console.log(`[Gizmo Unlimited] reloaded ${count} gizmo.ai tab(s) on install`);
    } catch (err) {
      console.error("[Gizmo Unlimited] tab reload on install failed:", err);
    }
  }
});

export {};
