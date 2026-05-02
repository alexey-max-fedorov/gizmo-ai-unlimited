import type { PlasmoCSConfig } from "plasmo"
import { buildHidingCSS } from "./filter-rules"

export const config: PlasmoCSConfig = {
  matches: ["https://app.gizmo.ai/quiz/*"],
  run_at: "document_start"
}

const STYLE_MARKER_ATTR = "data-gizmo-hearts-style"
const STYLE_MARKER_SELECTOR = `style[${STYLE_MARKER_ATTR}]`

function inject(): void {
  if (document.documentElement.querySelector(STYLE_MARKER_SELECTOR)) return
  const style = document.createElement("style")
  style.setAttribute(STYLE_MARKER_ATTR, "1")
  style.textContent = buildHidingCSS()
  document.documentElement.appendChild(style)
}

if (document.documentElement) {
  inject()
} else {
  // documentElement is not yet present at document_start in rare cases.
  // Once it is inserted as a direct child of document, the observer fires
  // and inject() runs. By then the synchronous check above is always truthy,
  // so the race (observer fires after documentElement exists but before we
  // reach this branch) cannot occur in practice.
  const obs = new MutationObserver(() => {
    if (document.documentElement) {
      obs.disconnect()
      inject()
    }
  })
  obs.observe(document, { childList: true })
}
