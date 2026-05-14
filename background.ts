// Background service worker for Gizmo AI Unlimited.
// Registers a declarativeNetRequest rule that BLOCKs the original
// entry-*.js bundle. The MAIN-world content script (contents/gizmo-patch.ts)
// intercepts the corresponding <script> insertion and injects the
// patched bundle from raw.githubusercontent.com instead.

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

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const existingIds = existing.map((r) => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingIds,
    addRules: RULES
  });

  console.log("[Gizmo Unlimited] declarativeNetRequest rules registered");
});

export {};
