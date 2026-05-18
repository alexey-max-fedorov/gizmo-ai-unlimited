// Background service worker for Gizmo AI Unlimited.
//
// Responsibilities:
// 1. Register a declarativeNetRequest rule that BLOCKs the original
//    entry-*.js bundle (defense-in-depth alongside the MAIN-world overrides).
// 2. On first install, reload any open gizmo.ai tabs so the patch activates
//    without requiring a manual refresh.
// 3. Handle GET_PATCHED_BUNDLE messages from the ISOLATED-world bridge:
//    fetch patches.json, check the cache, fetch+patch the original on miss,
//    return the patched JS source.

import { reloadGizmoTabs } from "./lib/reload-tabs";
import {
  PATCHES_URL,
  entryFilenameFromUrl
} from "./lib/patch-config";
import { applyPatchRules, wrapWithMarkers, type PatchRule } from "./lib/patches";
import {
  getCachedBundle,
  setCachedBundle,
  type CacheEntry,
  type StorageLocalApi
} from "./lib/bundle-cache";

type PatchesJson = {
  schemaVersion: number;
  patcherVersion: string;
  generatedAt: string;
  hash: string;
  rules: PatchRule[];
};

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

const fetchPatchesJson = async (): Promise<PatchesJson> => {
  const r = await fetch(PATCHES_URL, { cache: "default" });
  if (!r.ok) throw new Error(`patches.json HTTP ${r.status}`);
  const json = (await r.json()) as PatchesJson;
  if (!Array.isArray(json.rules) || typeof json.hash !== "string") {
    throw new Error("patches.json malformed: missing rules[] or hash");
  }
  return json;
};

const fetchOriginalBundle = async (url: string): Promise<string> => {
  const r = await fetch(url, { cache: "default" });
  if (!r.ok) throw new Error(`original bundle HTTP ${r.status} for ${url}`);
  const body = await r.text();
  if (body.length < 1000) {
    throw new Error(`original bundle suspiciously small (${body.length} bytes)`);
  }
  return body;
};

const getOrBuildPatchedBundle = async (originalUrl: string): Promise<string> => {
  const storage = chrome.storage.local as unknown as StorageLocalApi;
  const bundleFilename = entryFilenameFromUrl(originalUrl);
  if (!bundleFilename) throw new Error(`unparseable originalUrl: ${originalUrl}`);

  const patches = await fetchPatchesJson();
  const cached = await getCachedBundle(storage);
  if (
    cached &&
    cached.bundleFilename === bundleFilename &&
    cached.patchesHash === patches.hash
  ) {
    console.log(`[Gizmo Unlimited] cache HIT for ${bundleFilename} (hash=${patches.hash})`);
    return cached.patchedBundle;
  }

  console.log(
    `[Gizmo Unlimited] cache MISS for ${bundleFilename} (hash=${patches.hash}) — building`
  );
  const original = await fetchOriginalBundle(originalUrl);
  const { output, perRuleCounts } = applyPatchRules(original, patches.rules);
  for (const rule of patches.rules) {
    console.log(`[Gizmo Unlimited] rule "${rule.id}" matched ${perRuleCounts[rule.id] ?? 0}x`);
  }
  const manifestVersion = chrome.runtime.getManifest().version;
  const patchedBundle = wrapWithMarkers(output, manifestVersion);

  const entry: CacheEntry = {
    bundleFilename,
    patchesHash: patches.hash,
    patchedBundle,
    storedAt: Date.now()
  };
  await setCachedBundle(storage, entry);
  console.log(`[Gizmo Unlimited] cache STORED for ${bundleFilename}`);
  return patchedBundle;
};

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "GET_PATCHED_BUNDLE" || typeof msg.originalUrl !== "string") {
    return false;
  }
  getOrBuildPatchedBundle(msg.originalUrl)
    .then((patchedBundle) => sendResponse({ ok: true, patchedBundle }))
    .catch((err: unknown) => {
      console.error("[Gizmo Unlimited] GET_PATCHED_BUNDLE failed:", err);
      sendResponse({ ok: false, error: err instanceof Error ? err.message : String(err) });
    });
  return true; // keep the message channel open for async sendResponse
});

export {};
