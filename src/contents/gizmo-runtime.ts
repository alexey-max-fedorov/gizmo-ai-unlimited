import type { PlasmoCSConfig } from "plasmo";
import { installMetroHook, patchCounts } from "../lib/runtime-patch";

export const config: PlasmoCSConfig = {
  matches: ["https://app.gizmo.ai/*"],
  run_at: "document_start",
  world: "MAIN"
};

(globalThis as { __GIZMO_UNLIMITED__?: typeof patchCounts }).__GIZMO_UNLIMITED__ = patchCounts;
console.log("[Gizmo Unlimited] runtime hooks installed");
try {
  installMetroHook(globalThis);
} catch (err) {
  console.error("[Gizmo Unlimited] failed to install Metro hook:", err);
}
