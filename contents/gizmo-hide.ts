import type { PlasmoCSConfig } from "plasmo"
import { buildHidingCSS } from "./filter-rules"

export const config: PlasmoCSConfig = {
  matches: ["https://app.gizmo.ai/quiz/*"],
  run_at: "document_start"
}

const MARKER = "data-gizmo-hearts-style"

function inject(): void {
  if (document.documentElement.querySelector(`style[${MARKER}]`)) return
  const style = document.createElement("style")
  style.setAttribute(MARKER, "1")
  style.textContent = buildHidingCSS()
  document.documentElement.appendChild(style)
}

if (document.documentElement) {
  inject()
} else {
  // documentElement not yet present at document_start in rare cases — wait for it
  const obs = new MutationObserver(() => {
    if (document.documentElement) {
      obs.disconnect()
      inject()
    }
  })
  obs.observe(document, { childList: true })
}
