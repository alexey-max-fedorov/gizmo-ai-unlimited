import type { PlasmoCSConfig } from "plasmo";

// Bridges the MAIN-world patch script and the extension service worker.
// MAIN world cannot use chrome.* APIs; ISOLATED can. The two share the DOM,
// so we relay via CustomEvent on `document`.

export const config: PlasmoCSConfig = {
  matches: ["https://app.gizmo.ai/*"],
  run_at: "document_start",
  world: "ISOLATED"
};

type RequestDetail = { originalUrl: string };
type ResponseDetail =
  | { ok: true; patchedBundle: string }
  | { ok: false; error: string };

document.addEventListener("__gizmo_patch_request__", (e: Event) => {
  const detail = (e as CustomEvent<RequestDetail>).detail;
  if (!detail || typeof detail.originalUrl !== "string") return;

  chrome.runtime
    .sendMessage({ type: "GET_PATCHED_BUNDLE", originalUrl: detail.originalUrl })
    .then((response: ResponseDetail) => {
      document.dispatchEvent(
        new CustomEvent<ResponseDetail>("__gizmo_patch_response__", { detail: response })
      );
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      document.dispatchEvent(
        new CustomEvent<ResponseDetail>("__gizmo_patch_response__", {
          detail: { ok: false, error: `bridge: ${message}` }
        })
      );
    });
});

console.log("[Gizmo Unlimited] bridge active");
