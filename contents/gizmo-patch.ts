import type { PlasmoCSConfig } from "plasmo";
import { isEntryScriptSrc } from "../lib/patch-config";

export const config: PlasmoCSConfig = {
  matches: ["https://app.gizmo.ai/*"],
  run_at: "document_start",
  world: "MAIN"
};

declare global {
  interface Window {
    __GIZMO_PATCH_INJECTED__?: boolean;
    __GIZMO_PATCH_HANDLED__?: boolean;
  }
}

// ─── Save originals so our overrides can delegate ───
const origAppendChild = Node.prototype.appendChild;
const origInsertBefore = Node.prototype.insertBefore;
const origAppend = Element.prototype.append;
const origRemoveAttribute = Element.prototype.removeAttribute;
const origSetAttribute = Element.prototype.setAttribute;
const origGetAttribute = Element.prototype.getAttribute;
const origCreateElement = Document.prototype.createElement;

// ─── Integrity (SRI) bypass ───
const lockIntegrity = (el: HTMLElement): void => {
  Object.defineProperty(el, "integrity", {
    set() {},
    get() { return ""; },
    configurable: true
  });
};

Document.prototype.createElement = function (
  tagName: string,
  options?: ElementCreationOptions
): HTMLElement {
  const el = origCreateElement.call(this, tagName, options) as HTMLElement;
  const tag = tagName.toLowerCase();
  if (tag === "script" || tag === "link") {
    lockIntegrity(el);
  }
  return el;
};

Element.prototype.setAttribute = function (name: string, value: string) {
  if (name === "integrity") return;
  return origSetAttribute.call(this, name, value);
};

for (const Proto of [HTMLScriptElement.prototype, HTMLLinkElement.prototype]) {
  Object.defineProperty(Proto, "integrity", {
    set() {},
    get() { return ""; },
    configurable: true
  });
}

const stripIntegrity = (node: Node): void => {
  if (node instanceof HTMLScriptElement || node instanceof HTMLLinkElement) {
    if (origGetAttribute.call(node, "integrity")) {
      origRemoveAttribute.call(node, "integrity");
    }
  }
};

// ─── Bridge round-trip ───

type ResponseDetail =
  | { ok: true; patchedBundle: string }
  | { ok: false; error: string };

const requestPatchedBundle = (originalUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const onResponse = (e: Event) => {
      document.removeEventListener("__gizmo_patch_response__", onResponse);
      const detail = (e as CustomEvent<ResponseDetail>).detail;
      if (detail.ok) resolve(detail.patchedBundle);
      else reject(new Error(detail.error || "patch failed"));
    };
    document.addEventListener("__gizmo_patch_response__", onResponse);
    document.dispatchEvent(
      new CustomEvent("__gizmo_patch_request__", { detail: { originalUrl } })
    );
  });
};

// ─── Entry-script detection + injection ───

const isInterceptableGameScript = (node: Node): node is HTMLScriptElement => {
  if (!(node instanceof HTMLScriptElement)) return false;
  if (origGetAttribute.call(node, "data-gizmo-patched") === "1") return false;
  return isEntryScriptSrc(node.src || origGetAttribute.call(node, "src") || "");
};

const captureSrc = (node: HTMLScriptElement): string =>
  node.src || origGetAttribute.call(node, "src") || "";

const createNopScript = (): HTMLScriptElement => {
  const nop = origCreateElement.call(document, "script") as HTMLScriptElement;
  lockIntegrity(nop);
  origSetAttribute.call(nop, "data-gizmo-patched", "1");
  return nop;
};

const injectPatchedBundle = (originalUrl: string): void => {
  if (window.__GIZMO_PATCH_HANDLED__) return;
  window.__GIZMO_PATCH_HANDLED__ = true;

  console.log(`[Gizmo Unlimited] requesting patched bundle (origin=${originalUrl})`);
  requestPatchedBundle(originalUrl)
    .then((js) => {
      // Inject via `onreset`. HTML event handlers run in the document scope,
      // so we shadow `URL` (which would otherwise resolve to document.URL,
      // a string) with the real `window.URL` class before the bundle code runs.
      const payload = "var URL=window.URL;\n" + js;
      document.documentElement.setAttribute("onreset", payload);
      document.documentElement.dispatchEvent(new CustomEvent("reset"));
      document.documentElement.removeAttribute("onreset");
      console.log("[Gizmo Unlimited] patched bundle injected via onreset");
    })
    .catch((e) => {
      console.error("[Gizmo Unlimited] failed to obtain patched bundle:", e);
    });
};

// ─── Override script-insertion APIs ───

Node.prototype.appendChild = function <T extends Node>(child: T): T {
  if (isInterceptableGameScript(child)) {
    const originalUrl = captureSrc(child as unknown as HTMLScriptElement);
    injectPatchedBundle(originalUrl);
    return origAppendChild.call(this, createNopScript()) as unknown as T;
  }
  stripIntegrity(child);
  return origAppendChild.call(this, child) as T;
};

Node.prototype.insertBefore = function <T extends Node>(newNode: T, refNode: Node | null): T {
  if (isInterceptableGameScript(newNode)) {
    const originalUrl = captureSrc(newNode as unknown as HTMLScriptElement);
    injectPatchedBundle(originalUrl);
    return origInsertBefore.call(this, createNopScript(), refNode) as unknown as T;
  }
  stripIntegrity(newNode);
  return origInsertBefore.call(this, newNode, refNode) as T;
};

Element.prototype.append = function (...nodes: (Node | string)[]) {
  const processed = nodes.map((node) => {
    if (node instanceof Node && isInterceptableGameScript(node)) {
      const originalUrl = captureSrc(node as HTMLScriptElement);
      injectPatchedBundle(originalUrl);
      return createNopScript();
    }
    if (node instanceof Node) stripIntegrity(node);
    return node;
  });
  return origAppend.apply(this, processed);
};

// ─── MutationObserver: catch parser-added script tags ───

const handleParserAddedEntryScript = (script: HTMLScriptElement): void => {
  const originalUrl = captureSrc(script);
  origSetAttribute.call(script, "data-gizmo-patched", "1");
  script.removeAttribute("src");
  script.textContent = "";
  injectPatchedBundle(originalUrl);
};

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node instanceof HTMLScriptElement) {
        if (origGetAttribute.call(node, "integrity")) {
          origRemoveAttribute.call(node, "integrity");
        }
        if (
          origGetAttribute.call(node, "data-gizmo-patched") !== "1" &&
          isEntryScriptSrc(node.src || origGetAttribute.call(node, "src") || "")
        ) {
          handleParserAddedEntryScript(node);
        }
      } else if (node instanceof HTMLLinkElement) {
        if (origGetAttribute.call(node, "integrity")) {
          origRemoveAttribute.call(node, "integrity");
        }
        const href = node.href || "";
        const rel = (node.rel || "").toLowerCase();
        if (rel === "preload" && isEntryScriptSrc(href)) {
          node.remove();
        }
      }
    }
  }
});

const scanExistingDom = (): void => {
  const existing = document.querySelector<HTMLScriptElement>(
    'script[src*="/_expo/static/js/web/entry-"]:not([data-gizmo-patched])'
  );
  if (existing) handleParserAddedEntryScript(existing);

  document
    .querySelectorAll<HTMLLinkElement>('link[rel="preload"]')
    .forEach((link) => {
      if (isEntryScriptSrc(link.href)) link.remove();
    });

  document
    .querySelectorAll<HTMLScriptElement | HTMLLinkElement>("script[integrity], link[integrity]")
    .forEach((el) => origRemoveAttribute.call(el, "integrity"));
};

// ─── Init ───
(function main() {
  if (window.__GIZMO_PATCH_INJECTED__) return;
  window.__GIZMO_PATCH_INJECTED__ = true;

  const root = document.documentElement || document;
  observer.observe(root, { childList: true, subtree: true });

  if (!document.documentElement) {
    const earlyObserver = new MutationObserver(() => {
      if (document.documentElement) {
        earlyObserver.disconnect();
        observer.observe(document.documentElement, { childList: true, subtree: true });
      }
    });
    earlyObserver.observe(document, { childList: true });
  }

  scanExistingDom();
  console.log("[Gizmo Unlimited] content script active");
})();
