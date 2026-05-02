import type { PlasmoCSConfig } from "plasmo"
import { buildHidingCSS } from "../lib/filter-rules"

export const config: PlasmoCSConfig = {
  matches: ["https://app.gizmo.ai/*"],
  run_at: "document_start"
}

const STYLE_ATTR = "data-gizmo-hearts-style"
const STYLE_SEL = `style[${STYLE_ATTR}]`

function isQuizPage(): boolean {
  return window.location.pathname.startsWith("/quiz/")
}

function inject(): void {
  if (document.documentElement.querySelector(STYLE_SEL)) return
  const el = document.createElement("style")
  el.setAttribute(STYLE_ATTR, "1")
  el.textContent = buildHidingCSS()
  document.documentElement.appendChild(el)
}

function eject(): void {
  document.documentElement.querySelector(STYLE_SEL)?.remove()
}

function sync(): void {
  isQuizPage() ? inject() : eject()
}

function startNavWatch(): void {
  // Navigation API covers all navigation types (pushState, popState, etc.) in Chrome 102+
  const nav = (globalThis as any).navigation
  if (nav) {
    nav.addEventListener("navigate", (e: any) => {
      const path = new URL(e.destination.url).pathname
      path.startsWith("/quiz/") ? inject() : eject()
    })
    return
  }
  // Fallback for Firefox: popstate handles back/forward, interval catches pushState-based SPA nav
  window.addEventListener("popstate", () => sync())
  let lastHref = location.href
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href
      sync()
    }
  }, 200)
}

function init(): void {
  sync()
  startNavWatch()
}

if (document.documentElement) {
  init()
} else {
  const obs = new MutationObserver(() => {
    if (document.documentElement) {
      obs.disconnect()
      init()
    }
  })
  obs.observe(document, { childList: true })
}
