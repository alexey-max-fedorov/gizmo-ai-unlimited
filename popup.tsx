import logoUrl from "data-base64:./assets/icon.png"
import "./style.css"

function Popup() {
  const openTab = (url: string) => {
    chrome.tabs.create({ url })
  }

  return (
    <div className="popup-root">
      <div className="popup-header">
        <img src={logoUrl} alt="Gizmo AI Unlimited Hearts" className="popup-logo" />
        <div>
          <h1 className="popup-title">Gizmo AI Unlimited</h1>
          <p className="popup-eyebrow">Hearts · v0.2.0</p>
        </div>
      </div>

      <div className="divider-gold" />

      <p className="main-hint">
        Bypasses the out-of-hearts modal on app.gizmo.ai/quiz.
      </p>

      <div className="action-stack">
        <button
          className="btn btn-primary btn-md"
          onClick={() => openTab("https://app.gizmo.ai/")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
          </svg>
          Open Gizmo
        </button>
        <button
          className="btn btn-outline btn-md"
          onClick={() =>
            openTab("https://github.com/alexey-max-fedorov/gizmo-ai-unlimited")
          }
        >
          View on GitHub
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Popup
