// AppLayout.tsx — the Nanalyt app shell (sidebar + top bar + status bar + content).
// Ported from design_handoff_nanalyt/source/system/nanalyt-shell.jsx, adapted to
// react-router: nav uses <navigate>, and per-route chrome (active/title/status/
// agentNote) is resolved from the current path (src/system/chrome.ts).
import { Fragment, useState, type ReactNode } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { NT, NI } from '../system/tokens'
import { NANALYT_NAV_GROUPS, NAV_SETTINGS, NANALYT_ACTIVITY } from '../system/data'
import { resolveChrome, type Status } from '../system/chrome'
import { useTheme } from '../system/theme'
import { AskNanalytHost } from './AskNanalyt'

// ── Sidebar ──
function NavSidebar({ active, agentNote }: { active: string; agentNote: string }) {
  const navigate = useNavigate()
  const navItem = (id: string, label: string, to: string, badge?: string) => {
    const isActive = id === active
    return (
      <div key={id} className="dv2-nav-item" onClick={() => { if (!isActive) navigate(to) }}
        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8.5px 11px', borderRadius: 8,
          background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
          color: isActive ? '#ffffff' : NT.inkDim, fontSize: 13, fontWeight: isActive ? 500 : 425, cursor: 'pointer' }}>
        <span style={{ color: isActive ? NT.greenBr : NT.inkDim, display: 'flex', flexShrink: 0 }}>{NI[id]}</span>
        <span style={{ flex: 1, letterSpacing: '-0.005em' }}>{label}</span>
        {badge && <span style={{ fontSize: 10, fontWeight: 500, color: isActive ? '#fff' : NT.inkDim, fontFamily: NT.mono }}>{badge}</span>}
      </div>
    )
  }
  return (
    <div style={{ width: 296, minWidth: 296, background: NT.ink, display: 'flex', flexDirection: 'column', fontFamily: NT.sans }}>
      <div style={{ padding: '24px 22px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 27, height: 27, background: NT.greenBr, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 10L6 2.5 10 10" stroke="#0c130b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Nanalyt</div>
            <div style={{ fontSize: 9.5, color: NT.inkDim, marginTop: 4 }}>Sleep supplements</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column' }}>
        {NANALYT_NAV_GROUPS.map((g, gi) => (
          <div key={gi}>
            {g.label && <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', padding: '16px 11px 6px' }}>{g.label}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {g.items.map((item) => navItem(item.id, item.label, item.to, item.badge))}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingBottom: 8 }}>
          {navItem(NAV_SETTINGS.id, NAV_SETTINGS.label, NAV_SETTINGS.to)}
        </div>
      </nav>
      <div style={{ margin: '0 12px 14px', padding: '13px 14px', background: NT.inkSoft, borderRadius: 12, cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <span className="pulse" style={{ width: 6, height: 6, background: NT.greenBr, borderRadius: '50%', display: 'block' }}></span>
          <span style={{ fontSize: 11.5, fontWeight: 550, color: '#fff' }}>Agent working</span>
        </div>
        <div style={{ fontSize: 10.5, color: NT.inkDim, lineHeight: 1.5 }}>{agentNote}</div>
      </div>
      <div style={{ padding: '15px 22px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(62,132,84,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: NT.greenBr, flexShrink: 0 }}>D</div>
        <div><div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>Dylan</div><div style={{ fontSize: 9.5, color: NT.inkDim }}>Free plan</div></div>
      </div>
    </div>
  )
}

// ── Top bar ──
function TopBar({ title, children }: { title: string; children?: ReactNode }) {
  const [bellOpen, setBellOpen] = useState(false)
  const { theme, toggle } = useTheme()
  return (
    <div style={{ height: 58, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 14, flexShrink: 0 }}>
      <span style={{ fontSize: 13.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{title}</span>
      {children}
      <div style={{ flex: 1 }}></div>
      <div onClick={() => window.dispatchEvent(new CustomEvent('nanalyt-chat-open'))} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 10, padding: '0 13px', height: 33, width: 380, cursor: 'pointer' }}>
        <span style={{ color: NT.dim, display: 'flex' }}>{NI.search}</span>
        <span style={{ flex: 1, fontSize: 12.5, color: NT.dim }}>Ask Nanalyt anything…</span>
        <span style={{ fontSize: 9.5, color: NT.dim, fontFamily: NT.mono }}>⌘K</span>
      </div>
      <button onClick={toggle} title="Toggle light/dark" style={{ background: 'transparent', border: 'none', color: NT.mid, display: 'flex', cursor: 'pointer', padding: 4, borderRadius: 6 }}>
        {theme === 'light' ? NI.moon : NI.sun}
      </button>
      <div style={{ position: 'relative' }}>
        <span onClick={() => setBellOpen(!bellOpen)} style={{ color: NT.mid, display: 'flex', position: 'relative', cursor: 'pointer', padding: 4, margin: -4 }}>{NI.bell}
          <span style={{ position: 'absolute', top: 2, right: 2, width: 5, height: 5, background: NT.greenBr, borderRadius: '50%', border: '1.5px solid var(--dv-page)' }}></span>
        </span>
        {bellOpen && <Fragment>
          <div onClick={() => setBellOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }}></div>
          <div className="dv2-tip" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: -8, width: 400, background: NT.surf, border: `1px solid ${NT.border}`, borderRadius: 16, boxShadow: '0 2px 6px rgba(20,24,15,0.05), 0 16px 48px rgba(20,24,15,0.14)', overflow: 'hidden', zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px 12px', borderBottom: `1px solid ${NT.borderS}` }}>
              <span style={{ fontSize: 13.5, fontWeight: 550, color: NT.text }}>Agent activity</span>
              <span style={{ fontSize: 10.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2px 9px', borderRadius: 10, marginLeft: 9 }}>2 new</span>
              <span className="dv2-link" style={{ marginLeft: 'auto', fontSize: 11, color: NT.dim, cursor: 'pointer' }}>Mark all read</span>
            </div>
            <div style={{ maxHeight: 330, overflowY: 'auto' }}>
              {NANALYT_ACTIVITY.map((g, gi) => (
                <div key={gi}>
                  <div style={{ fontSize: 10, fontWeight: 550, letterSpacing: '0.07em', textTransform: 'uppercase', color: NT.dim, padding: '12px 18px 6px' }}>{g.day}</div>
                  {g.items.map((it, i) => (
                    <div key={i} className="dv2-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '9px 18px', cursor: 'pointer' }}>
                      <span style={{ width: 26, height: 26, borderRadius: 8, background: it.bg, color: it.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 1 }}>{it.glyph}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: NT.text, lineHeight: 1.45 }}>{it.text}</div>
                        <div style={{ fontSize: 10.5, color: NT.dim, fontFamily: NT.mono, marginTop: 2 }}>{it.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: '11px 18px', borderTop: `1px solid ${NT.borderS}`, textAlign: 'center' }}>
              <span className="dv2-link" style={{ fontSize: 11.5, fontWeight: 500, color: NT.green, cursor: 'pointer' }}>View full activity log →</span>
            </div>
          </div>
        </Fragment>}
      </div>
      <div style={{ width: 27, height: 27, borderRadius: '50%', background: NT.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: NT.green, cursor: 'pointer' }}>D</div>
    </div>
  )
}

// ── Status bar ──
function StatusBar({ live, items, right }: Status) {
  return (
    <div style={{ height: 34, borderTop: `1px solid ${NT.borderS}`, display: 'flex', alignItems: 'center', gap: 20, padding: '0 44px', flexShrink: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: NT.dim, fontFamily: NT.mono, whiteSpace: 'nowrap', flexShrink: 0 }}>
        <span className="pulse" style={{ width: 5, height: 5, background: NT.greenBr, borderRadius: '50%', display: 'block' }}></span>
        {live}
      </span>
      {items.map((it, i) => <span key={i} style={{ fontSize: 10.5, color: NT.dim, fontFamily: NT.mono, whiteSpace: 'nowrap', flexShrink: 0 }}>{it}</span>)}
      <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.dim, fontFamily: NT.mono, whiteSpace: 'nowrap' }}>{right}</span>
    </div>
  )
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const chrome = resolveChrome(pathname)
  return (
    <div style={{ display: 'flex', width: '100%', minWidth: 1240, height: '100%', background: NT.page, fontFamily: NT.sans, overflow: 'hidden' }}>
      <NavSidebar active={chrome.active} agentNote={chrome.agentNote} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar title={chrome.title} />
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '14px 44px 60px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Outlet />
          </div>
        </div>
        <StatusBar {...chrome.status} />
      </div>
      <AskNanalytHost context={chrome.title} />
    </div>
  )
}
