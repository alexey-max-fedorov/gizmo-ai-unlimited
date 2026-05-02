import type { PlasmoCSConfig } from "plasmo"
import { buildHidingCSS, HEARTS_MODAL_SELECTORS } from "../lib/filter-rules"

export const config: PlasmoCSConfig = {
  matches: ["https://app.gizmo.ai/*"],
  run_at: "document_start"
}

const STYLE_ATTR = "data-gizmo-hearts-style"
const STYLE_SEL = `style[${STYLE_ATTR}]`

let modalObserver: MutationObserver | null = null

function hideMatchingNodes(root: Node): void {
  if (!(root instanceof Element)) return
  for (const sel of HEARTS_MODAL_SELECTORS) {
    const el = root.matches(sel) ? root : root.querySelector(sel)
    if (el instanceof HTMLElement) el.style.setProperty("display", "none", "important")
  }
}

function startModalObserver(): void {
  if (modalObserver) return
  modalObserver = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        hideMatchingNodes(node)
      }
    }
  })
  modalObserver.observe(document.body ?? document.documentElement, {
    childList: true,
    subtree: true
  })
}

function stopModalObserver(): void {
  modalObserver?.disconnect()
  modalObserver = null
}

function isQuizPage(): boolean {
  return window.location.pathname.startsWith("/quiz/")
}

function inject(): void {
  if (document.documentElement.querySelector(STYLE_SEL)) return
  const el = document.createElement("style")
  el.setAttribute(STYLE_ATTR, "1")
  el.textContent = buildHidingCSS()
  document.documentElement.appendChild(el)
  startModalObserver()
}

function eject(): void {
  document.documentElement.querySelector(STYLE_SEL)?.remove()
  stopModalObserver()
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
