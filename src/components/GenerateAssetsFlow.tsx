// GenerateAssetsFlow.tsx — "Take action → Generate assets" modal.
// Ported from handoff_generate_modal/generate-assets-modal.jsx: a single centered modal with two
// in-place states — config (winning angle + asset checklist) → live generation (progress + steps
// → done with "Review in Studio →"). Opened from a finding's "Take action".
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT } from '../system/tokens'

const GA_SANS = NT.sans
const GA_MONO = NT.mono

type GaAsset = { id: string; fmt: string; name: string; badge: string | null; desc: string; runLabel: string }

const GA_ASSETS: GaAsset[] = [
  { id: 'pdp', fmt: 'PDP', name: 'Product page', badge: 'Hero-led',
    desc: 'Full product page with Sleep-Anxiety Crossover positioning, headline, sub-headline, ingredient breakdown, and Subscribe & Save block · 1 variant',
    runLabel: 'Product page · 1 variant' },
  { id: 'ugc1', fmt: 'UGC', name: 'UGC creative variant 1', badge: 'Recommended',
    desc: '9:16 vertical · Talking head with text overlays · “Couldn’t shut my brain off” hook · 15 seconds',
    runLabel: 'UGC variant 1 · 9:16' },
  { id: 'video', fmt: 'Video', name: 'Animated video creative', badge: null,
    desc: '15s · Animated explainer with product · “Tried everything for sleep” hook · 9:16 vertical',
    runLabel: 'Animated video · 15s' },
  { id: 'static', fmt: 'Static', name: 'Static image creative', badge: null,
    desc: '1:1 square · Designed image · Lifestyle composition with product and headline',
    runLabel: 'Static image · 1:1' },
  { id: 'ugc2', fmt: 'UGC', name: 'UGC creative variant 2', badge: null,
    desc: '9:16 vertical · Talking head · Alternative hook for A/B testing · 15 seconds',
    runLabel: 'UGC variant 2 · 9:16' },
]

const DEFAULT_PRODUCT = 'Magnesium + Ashwagandha Gummies'
const DEFAULT_ANGLE = 'Sleep-Anxiety Crossover'
const DEFAULT_ANGLE_META = 'Validated by 3 competitors · Avg 18d longevity · 28% of category spend'

function GaCheck({ on }: { on: boolean }) {
  return (
    <span style={{ width: 19, height: 19, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: on ? 'var(--dv-btn-bg)' : 'var(--dv-surf)', border: on ? 'none' : `1.5px solid ${NT.border}`, transition: 'all 0.12s' }}>
      {on && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="var(--dv-btn-fg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.3 2.3L9.5 3.5" /></svg>}
    </span>
  )
}

function GaFmtPill({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: NT.text, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, padding: '2.5px 7px', borderRadius: 7, fontFamily: GA_MONO, flexShrink: 0 }}>{children}</span>
}

// ── generation (loading) state ──
// Real generation takes ~3–5 minutes; the simulated run mirrors that, driven off elapsed wall-clock.
function GaRunState({ assets, product, onClose }: { assets: GaAsset[]; product: string; onClose: () => void }) {
  const navigate = useNavigate()
  const [pct, setPct] = useState(0)
  const [sec, setSec] = useState(0)
  const doneRef = useRef(false)
  const durRef = useRef(15000) // 15s demo run
  useEffect(() => {
    const t0 = Date.now()
    const t = setInterval(() => {
      const el = Date.now() - t0
      setSec(Math.floor(el / 1000))
      const n = Math.min(100, (el / durRef.current) * 100)
      setPct(n)
      if (n >= 100 && !doneRef.current) { doneRef.current = true; clearInterval(t) }
    }, 250)
    return () => clearInterval(t)
  }, [])
  const done = pct >= 100
  const mm = Math.floor(sec / 60), ss = String(sec % 60).padStart(2, '0')
  const per = 100 / assets.length
  const eta = Math.max(0, Math.ceil(durRef.current / 1000) - sec)
  return (
    <Fragment>
      <div style={{ padding: '22px 26px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
          {done
            ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.5" fill="var(--dv-green-bg)" /><path d="M4.7 8l2.3 2.3 4.3-4.6" stroke="var(--dv-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            : <span className="pulse" style={{ width: 7, height: 7, background: 'var(--dv-green-br)', borderRadius: '50%', display: 'block' }}></span>}
          <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: NT.green }}>{done ? 'Assets ready' : 'Generating assets'}</span>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.text, fontFamily: GA_MONO }}>{mm}:{ss}{done ? '' : ` · ${Math.round(pct)}%`}</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: NT.text, letterSpacing: '-0.018em', lineHeight: 1.3 }}>
          {done ? `${assets.length} assets ready for review` : `Launch ${product}`}
        </div>
      </div>
      {!done && (
        <div style={{ height: 3, background: 'var(--dv-page)', margin: '0 26px' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--dv-green-br)', borderRadius: 2, transition: 'width 0.25s linear' }}></div>
        </div>
      )}
      <div style={{ padding: '14px 26px 4px' }}>
        {assets.map((a, i) => {
          const start = i * per, end = (i + 1) * per
          const stepDone = pct >= end - 0.5
          const active = !stepDone && pct >= start
          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderBottom: i < assets.length - 1 ? `1px solid ${NT.borderS}` : 'none', opacity: stepDone || active ? 1 : 0.5, transition: 'opacity 0.2s' }}>
              {stepDone ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.5" fill="var(--dv-green-bg)" /><path d="M4.7 8l2.3 2.3 4.3-4.6" stroke="var(--dv-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : active ? (
                <span className="pulse" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--dv-green-br)', display: 'block', margin: 2, flexShrink: 0 }}></span>
              ) : (
                <span style={{ width: 10, height: 10, borderRadius: '50%', border: `1.5px solid ${NT.borderS}`, display: 'block', margin: 2, flexShrink: 0 }}></span>
              )}
              <GaFmtPill>{a.fmt}</GaFmtPill>
              <span style={{ fontSize: 12.5, fontWeight: active ? 600 : 525, color: NT.text, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.runLabel}</span>
              <span style={{ fontSize: 10.5, color: NT.text, fontFamily: GA_MONO, whiteSpace: 'nowrap' }}>{stepDone ? 'done' : active ? 'generating…' : 'queued'}</span>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 26px 18px', borderTop: `1px solid ${NT.borderS}`, marginTop: 8 }}>
        <span style={{ fontSize: 11, color: NT.text }}>{done ? 'Saved to Studio · ready when you are' : <>ETA <span style={{ fontWeight: 600, fontFamily: GA_MONO }}>~{eta}s</span> · you can navigate while we work</>}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 9 }}>
          {done ? (
            <Fragment>
              <button onClick={onClose} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '8px 15px', borderRadius: 9, fontSize: 12, fontWeight: 450, fontFamily: GA_SANS, cursor: 'pointer' }}>Close</button>
              <button onClick={() => { onClose(); navigate('/studio') }} className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '8px 17px', borderRadius: 9, fontSize: 12, fontWeight: 550, fontFamily: GA_SANS, cursor: 'pointer' }}>Review in Studio →</button>
            </Fragment>
          ) : (
            <button onClick={onClose} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '8px 15px', borderRadius: 9, fontSize: 12, fontWeight: 450, fontFamily: GA_SANS, cursor: 'pointer' }}>Cancel</button>
          )}
        </span>
      </div>
    </Fragment>
  )
}

// ── config state ──
function GaConfigState({ product, angle, angleMeta, onClose, onGenerate }: {
  product: string; angle: string; angleMeta: string; onClose: () => void; onGenerate: (assets: GaAsset[]) => void
}) {
  const [sel, setSel] = useState<Record<string, boolean>>(() => { const o: Record<string, boolean> = {}; GA_ASSETS.forEach((a) => (o[a.id] = true)); return o })
  const count = GA_ASSETS.filter((a) => sel[a.id]).length
  const setAll = (v: boolean) => setSel(() => { const o: Record<string, boolean> = {}; GA_ASSETS.forEach((a) => (o[a.id] = v)); return o })
  return (
    <Fragment>
      <div style={{ padding: '22px 26px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: NT.green }}>Generate assets</span>
            <div style={{ fontSize: 20, fontWeight: 600, color: NT.text, letterSpacing: '-0.018em', lineHeight: 1.3, margin: '7px 0 7px' }}>Launch {product}</div>
            <div style={{ fontSize: 12.5, color: NT.text, lineHeight: 1.55, maxWidth: 480 }}>We’ll generate a product page and a creative package targeting the winning angle from your finding. Review and adjust before we start.</div>
          </div>
          <span onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${NT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: NT.text, fontSize: 12, flexShrink: 0 }}>✕</span>
        </div>
      </div>

      {/* winning angle */}
      <div style={{ margin: '16px 26px 0', background: NT.greenBg, border: `1px solid ${NT.borderS}`, borderRadius: 12, padding: '13px 16px' }}>
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: NT.green }}>Winning angle</span>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: NT.text, margin: '5px 0 4px', letterSpacing: '-0.01em' }}>{angle}</div>
        <div style={{ fontSize: 11, color: NT.text, fontFamily: GA_MONO }}>{angleMeta}</div>
      </div>

      {/* asset list */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '18px 26px 10px' }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: NT.text }}>Assets to generate</span>
        <span style={{ fontSize: 11.5, color: NT.text, fontFamily: GA_MONO, marginLeft: 8 }}>{count}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <span onClick={() => setAll(true)} className="dv2-link" style={{ fontSize: 11, fontWeight: 500, color: NT.green, cursor: 'pointer' }}>Select all</span>
          <span onClick={() => setAll(false)} className="dv2-link" style={{ fontSize: 11, fontWeight: 500, color: NT.text, cursor: 'pointer' }}>Deselect all</span>
        </span>
      </div>
      <div style={{ padding: '0 26px', display: 'flex', flexDirection: 'column', gap: 9, maxHeight: 328, overflowY: 'auto' }}>
        {GA_ASSETS.map((a) => {
          const on = sel[a.id]
          return (
            <div key={a.id} onClick={() => setSel((p) => ({ ...p, [a.id]: !p[a.id] }))} className="dv2-card-h"
              style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--dv-surf)', border: `1px solid ${on ? NT.border : NT.borderS}`, borderRadius: 12, padding: '13px 15px', cursor: 'pointer' }}>
              <div style={{ paddingTop: 1 }}><GaCheck on={on} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                  <GaFmtPill>{a.fmt}</GaFmtPill>
                  <span style={{ fontSize: 13, fontWeight: 600, color: NT.text }}>{a.name}</span>
                  {a.badge && <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: NT.green, background: NT.greenBg, padding: '2px 8px', borderRadius: 7 }}>{a.badge}</span>}
                </div>
                <div style={{ fontSize: 11.5, color: NT.text, lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 26px 18px', borderTop: `1px solid ${NT.borderS}`, marginTop: 16 }}>
        <span style={{ fontSize: 11, color: NT.text }}>Estimated <span style={{ fontWeight: 600 }}>15 seconds</span> · You can navigate while we work</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 9 }}>
          <button onClick={onClose} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '8px 16px', borderRadius: 9, fontSize: 12, fontWeight: 450, fontFamily: GA_SANS, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => count > 0 && onGenerate(GA_ASSETS.filter((a) => sel[a.id]))} disabled={count === 0} className="dv2-btn-p"
            style={{ background: count > 0 ? 'var(--dv-btn-bg)' : 'var(--dv-page)', color: count > 0 ? 'var(--dv-btn-fg)' : NT.text, border: 'none', padding: '8px 18px', borderRadius: 9, fontSize: 12, fontWeight: 550, fontFamily: GA_SANS, cursor: count > 0 ? 'pointer' : 'default', opacity: count > 0 ? 1 : 0.6 }}>
            Generate {count} asset{count === 1 ? '' : 's'} →
          </button>
        </span>
      </div>
    </Fragment>
  )
}

// ── modal wrapper ──
export function GenerateAssetsModal({ open, onClose, product = DEFAULT_PRODUCT, angle = DEFAULT_ANGLE, angleMeta = DEFAULT_ANGLE_META }: {
  open: boolean; onClose: () => void; product?: string; angle?: string; angleMeta?: string
}) {
  const [running, setRunning] = useState<GaAsset[] | null>(null) // null = config, else selected assets
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  useEffect(() => { if (!open) setRunning(null) }, [open])
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, fontFamily: GA_SANS, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} className="ap-drawer-wrap" style={{ position: 'absolute', inset: 0, background: 'rgba(16,24,15,0.32)' }}></div>
      <div onClick={(e) => e.stopPropagation()} className="ga-pop" style={{ position: 'relative', width: 588, maxWidth: '100%', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, borderRadius: 18, boxShadow: '0 24px 64px rgba(16,24,15,0.28)' }}>
        {running
          ? <GaRunState assets={running} product={product} onClose={onClose} />
          : <GaConfigState product={product} angle={angle} angleMeta={angleMeta} onClose={onClose} onGenerate={(a) => setRunning(a)} />}
      </div>
    </div>
  )
}
