import logoUrl from "data-base64:./assets/icon.png"
import "./style.css"

function Popup() {
  return (
    <div className="popup-root">
      <div className="popup-header">
        <img src={logoUrl} alt="Gizmo AI Unlimited Hearts" className="popup-logo" />
        <div>
          <h1 className="popup-title">Gizmo AI Unlimited Hearts</h1>
          <p className="popup-eyebrow">v0.1.0 · open source</p>
        </div>
      </div>

      <div className="divider" />

      <p className="status">
        Active on <strong>app.gizmo.ai/quiz/*</strong>. Hides the
        out-of-hearts modal so you can keep practicing without limits.
      </p>

      <a
        className="link"
        href="https://github.com/"
        target="_blank"
        rel="noreferrer"
      >
        View source on GitHub →
      </a>

      <p className="footer">
        MPL-2.0 · Cosmetic filter only — no remote code, no tracking.
      </p>
    </div>
  )
}

export default Popup
