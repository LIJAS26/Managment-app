import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

export function BrandMark() {
  return (
    <Link className="brand" to="/" aria-label="Northstar home">
      <span className="brand-mark">n</span>
      <span>northstar</span>
    </Link>
  )
}

export default function AuthShell({ children, mode }) {
  return (
    <main className="auth-page min-h-screen">
      <section className="auth-form-side">
        <div className="auth-topbar"><BrandMark /><ThemeToggle /></div>
        <div className="auth-form-wrap">{children}</div>
        <p className="auth-footer">© 2026 Northstar, Inc. <a href="#privacy">Privacy</a> <a href="#terms">Terms</a></p>
      </section>
      <aside className={`auth-art auth-art-${mode}`}>
        <div className="art-topline"><span>MEMBER SPACE</span><span className="art-live"><i /> OPEN FOR YOU</span></div>
        <div className="art-copy">
          <p className="eyebrow">A LITTLE MORE YOU</p>
          <h2>Make room for<br />what matters.</h2>
          <p>Your space to focus, find your rhythm, and make progress that feels like yours.</p>
        </div>
        <div className="art-card">
          <div className="art-card-head"><span>YOUR WEEK, AT A GLANCE</span><span>↗</span></div>
          <div className="art-chart">
            {[34, 52, 42, 75, 58, 90, 68, 100, 79, 63, 86, 70].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="art-card-foot"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div>
        </div>
        <div className="art-bottom"><span>BUILT FOR YOUR NEXT CHAPTER</span><span>01 — 03</span></div>
      </aside>
    </main>
  )
}
