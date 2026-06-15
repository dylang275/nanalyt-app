// HeroChart.tsx — the one shared interactive area/line chart.
// Ported from design_handoff_nanalyt/source/system/nanalyt-charts.jsx.
// Crosshair tooltip, agent-event markers, anomaly band, compare (ghost) line.
import { Fragment, useRef, useState } from 'react'
import { NT } from '../system/tokens'

export type ChartEvent = { i: number; glyph: string; title: string; detail: string }
export type ChartAnomaly = { i1: number; i2: number; title: string; sub: string }
export type ChartLegend = [string, string][]

export function HeroChart({
  vals, vals2, color, color2, fmt, legend, events = [], ghost = null, anomaly = null, uid = 'ntg1', h = 170, w = 980,
}: {
  vals: number[]
  vals2?: number[]
  color: string
  color2?: string
  fmt: (v: number) => string
  legend?: ChartLegend
  events?: ChartEvent[]
  ghost?: number[] | null
  anomaly?: ChartAnomaly | null
  uid?: string
  h?: number
  w?: number
}) {
  const [hi, setHi] = useState<number | null>(null)
  const [ann, setAnn] = useState<number | null>(null)
  const [annB, setAnnB] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const n = vals.length
  const all = [...vals, ...(vals2 || []), ...(ghost || [])]
  const mn = Math.min(...all), mx = Math.max(...all), rng = mx - mn || 1
  const usable = h * 0.86
  const norm = (v: number) => h - h * 0.04 - ((v - mn) / rng) * usable
  const mkPath = (arr: number[]) => {
    const pts = arr.map((v, i) => ({ x: (i / (n - 1)) * w, y: norm(v) }))
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], c = pts[i], dx = (c.x - p.x) / 3
      d += ` C ${(p.x + dx).toFixed(1)} ${p.y.toFixed(1)} ${(c.x - dx).toFixed(1)} ${c.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`
    }
    return { d, last: pts[pts.length - 1] }
  }
  const p1 = mkPath(vals)
  const p2 = vals2 ? mkPath(vals2) : null
  const pg = ghost ? mkPath(ghost) : null

  const onMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setHi(Math.round(frac * (n - 1)))
  }
  const dateFor = (i: number) => {
    const d = new Date(2026, 5, 9)
    d.setDate(d.getDate() - (n - 1 - i))
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const xPct = hi == null ? 0 : (hi / (n - 1)) * 100
  const flip = hi != null && hi > (n - 1) * 0.6

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setHi(null)} style={{ position: 'relative', cursor: 'crosshair' }}>
      <svg key={`${uid}-${n}-${Math.round(vals[n - 1])}`} width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', height: h }}>
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.16" />
            <stop offset="70%" stopColor={color} stopOpacity="0.02" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1={h * 0.5} x2={w} y2={h * 0.5} stroke="var(--dv-grid)" strokeWidth="1" />
        {anomaly && <Fragment>
          <rect x={(anomaly.i1 / (n - 1)) * w} y="0" width={((anomaly.i2 - anomaly.i1) / (n - 1)) * w} height={h} fill="var(--dv-red)" opacity="0.07" />
          <line x1={(anomaly.i1 / (n - 1)) * w} y1="0" x2={(anomaly.i1 / (n - 1)) * w} y2={h} stroke="var(--dv-red)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
          <line x1={(anomaly.i2 / (n - 1)) * w} y1="0" x2={(anomaly.i2 / (n - 1)) * w} y2={h} stroke="var(--dv-red)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
        </Fragment>}
        {pg && <path d={pg.d} fill="none" stroke="var(--dv-dim)" strokeWidth="1.6" strokeDasharray="4 5" strokeLinecap="round" opacity="0.75" />}
        <path className="dv2-fill-in" d={`${p1.d} L ${p1.last.x} ${h} L 0 ${h} Z`} fill={`url(#${uid})`} />
        {p2 && <path className="dv2-draw" pathLength="1" d={p2.d} fill="none" stroke={color2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
        <path className="dv2-draw" pathLength="1" d={p1.d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {hi == null && <Fragment>
          <line x1={p1.last.x} y1={p1.last.y} x2={p1.last.x} y2={h} stroke={color} strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
          <circle cx={p1.last.x} cy={p1.last.y} r="4" fill="var(--dv-surf)" stroke={color} strokeWidth="2.2" />
          {p2 && <circle cx={p2.last.x} cy={p2.last.y} r="3.2" fill="var(--dv-surf)" stroke={color2} strokeWidth="2" />}
        </Fragment>}
        {events.map((e, j) => <line key={'ev' + j} x1={(e.i / (n - 1)) * w} y1={norm(vals[e.i])} x2={(e.i / (n - 1)) * w} y2={h} stroke="var(--dv-grid-strong)" strokeWidth="1" strokeDasharray="2 4" />)}
      </svg>

      {events.length > 0 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {events.map((e, j) => (
            <div key={j} style={{ position: 'absolute', left: `${(e.i / (n - 1)) * 100}%`, bottom: -2, transform: 'translateX(-50%)', pointerEvents: 'auto' }}
              onMouseEnter={() => setAnn(j)} onMouseLeave={() => setAnn(null)}>
              <div style={{ width: 21, height: 21, borderRadius: '50%', background: ann === j ? 'var(--dv-btn-bg)' : 'var(--dv-surf)', color: ann === j ? 'var(--dv-btn-fg)' : NT.mid,
                border: `1.5px solid ${ann === j ? 'var(--dv-btn-bg)' : NT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, cursor: 'pointer', boxShadow: '0 2px 8px rgba(20,24,15,0.14)', transition: 'all 0.12s' }}>{e.glyph}</div>
            </div>
          ))}
          {ann != null && (
            <div className="dv2-tip" style={{ position: 'absolute', bottom: 26, left: `${(events[ann].i / (n - 1)) * 100}%`,
              transform: events[ann].i > (n - 1) * 0.6 ? 'translateX(-92%)' : 'translateX(-8%)',
              background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 12, padding: '11px 14px',
              boxShadow: '0 2px 6px rgba(20,24,15,0.05), 0 12px 36px rgba(20,24,15,0.14)', width: 232, pointerEvents: 'none', zIndex: 10 }}>
              <div style={{ fontSize: 10.5, color: 'var(--dv-dim)', fontFamily: NT.mono, marginBottom: 4 }}>{dateFor(events[ann].i)} · Agent action</div>
              <div style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--dv-text)', lineHeight: 1.4, marginBottom: 5 }}>{events[ann].title}</div>
              <div style={{ fontSize: 11.5, color: NT.greenBr, fontWeight: 500 }}>{events[ann].detail}</div>
            </div>
          )}
        </div>
      )}

      {hi != null && ann == null && !annB && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${xPct}%`, width: 1, background: 'var(--dv-grid-strong)' }}></div>
          <div style={{ position: 'absolute', left: `${xPct}%`, top: `${(norm(vals[hi]) / h) * 100}%`, width: 9, height: 9, borderRadius: '50%', background: 'var(--dv-surf)', border: `2.2px solid ${color}`, transform: 'translate(-50%,-50%)', boxShadow: '0 1px 4px rgba(20,24,15,0.18)' }}></div>
          {vals2 && <div style={{ position: 'absolute', left: `${xPct}%`, top: `${(norm(vals2[hi]) / h) * 100}%`, width: 8, height: 8, borderRadius: '50%', background: 'var(--dv-surf)', border: `2px solid ${color2}`, transform: 'translate(-50%,-50%)', boxShadow: '0 1px 4px rgba(20,24,15,0.18)' }}></div>}
          <div className="dv2-tip" style={{ position: 'absolute', top: 4, left: `${xPct}%`, transform: flip ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
            background: 'var(--dv-surf)', border: '1px solid var(--dv-border)', borderRadius: 10, padding: '9px 12px',
            boxShadow: '0 2px 6px rgba(20,24,15,0.05), 0 10px 32px rgba(20,24,15,0.10)', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 10.5, color: 'var(--dv-dim)', marginBottom: 5, fontFamily: NT.mono }}>{dateFor(hi)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 2.5, background: color, borderRadius: 2, display: 'block' }}></span>
              {legend && <span style={{ fontSize: 11, color: 'var(--dv-mid)' }}>{legend[0][0]}</span>}
              <span style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--dv-text)', fontFamily: NT.mono, fontVariantNumeric: 'tabular-nums' }}>{fmt(vals[hi])}</span>
            </div>
            {vals2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                <span style={{ width: 8, height: 2.5, background: color2, borderRadius: 2, display: 'block' }}></span>
                {legend && <span style={{ fontSize: 11, color: 'var(--dv-mid)' }}>{legend[1][0]}</span>}
                <span style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--dv-text)', fontFamily: NT.mono, fontVariantNumeric: 'tabular-nums' }}>{fmt(vals2[hi])}</span>
              </div>
            )}
            {ghost && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                <svg width="8" height="3" viewBox="0 0 8 3"><line x1="0" y1="1.5" x2="8" y2="1.5" stroke="var(--dv-dim)" strokeWidth="2" strokeDasharray="2 2" /></svg>
                <span style={{ fontSize: 11, color: 'var(--dv-mid)' }}>Prior</span>
                <span style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--dv-text)', fontFamily: NT.mono, fontVariantNumeric: 'tabular-nums' }}>{fmt(ghost[hi])}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {anomaly && (
        <div style={{ position: 'absolute', top: 2, left: `${(((anomaly.i1 + anomaly.i2) / 2) / (n - 1)) * 100}%`, transform: 'translateX(-50%)', zIndex: 8 }}
          onMouseEnter={() => setAnnB(true)} onMouseLeave={() => setAnnB(false)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--dv-surf)', border: '1px solid rgba(196,80,74,0.35)', borderRadius: 9, padding: '3px 9px', fontSize: 10, fontWeight: 550, color: 'var(--dv-red)', boxShadow: '0 2px 8px rgba(20,24,15,0.12)', cursor: 'default', whiteSpace: 'nowrap' }}>⚠ {anomaly.title}</span>
          {annB && (
            <div className="dv2-tip" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', width: 216, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 11, padding: '10px 13px', boxShadow: '0 2px 6px rgba(20,24,15,0.05), 0 12px 36px rgba(20,24,15,0.14)', zIndex: 20 }}>
              <div style={{ fontSize: 11.5, color: 'var(--dv-mid)', lineHeight: 1.5 }}>{anomaly.sub}</div>
              <div style={{ fontSize: 11, color: NT.green, fontWeight: 550, marginTop: 5, cursor: 'pointer' }}>See agent's analysis →</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
