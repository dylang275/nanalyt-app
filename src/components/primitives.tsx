// primitives.tsx — shared UI primitives.
// Ported from design_handoff_nanalyt/source/system/nanalyt-shell.jsx.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NT, NI } from '../system/tokens'
import { NANALYT_PRODUCTS } from '../system/data'

// ── Chip / ChipD — inline mono pill ──
export function Chip({ children, tone }: { children: ReactNode; tone?: 'red' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78em', fontWeight: 550,
      fontFamily: NT.mono, color: tone === 'red' ? NT.red : NT.green,
      background: tone === 'red' ? 'rgba(196,80,74,0.12)' : NT.greenBg,
      padding: '1px 9px', borderRadius: 9, verticalAlign: 'baseline', whiteSpace: 'nowrap', margin: '0 2px' }}>{children}</span>
  )
}

// dark-surface chip (for the agent brief)
export function ChipD({ children, tone }: { children: ReactNode; tone?: 'red' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78em', fontWeight: 550,
      fontFamily: NT.mono, color: tone === 'red' ? '#e0918c' : '#7ac292',
      background: tone === 'red' ? 'rgba(224,145,140,0.13)' : 'rgba(92,184,119,0.15)',
      padding: '1px 9px', borderRadius: 9, verticalAlign: 'baseline', whiteSpace: 'nowrap', margin: '0 2px' }}>{children}</span>
  )
}

// ── Peek — hover product card for inline product mentions ──
export function Peek({ pid, children }: { pid: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const p = NANALYT_PRODUCTS[pid]
  if (!p) return <span>{children}</span>
  return (
    <span style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span style={{ fontWeight: 550, borderBottom: `1.5px dotted ${NT.greenBr}`, cursor: 'pointer' }}>{children}</span>
      {open && (
        <span className="dv2-tip" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 264, background: NT.surf, border: `1px solid ${NT.border}`, borderRadius: 14, boxShadow: '0 2px 6px rgba(20,24,15,0.05), 0 16px 48px rgba(20,24,15,0.14)', overflow: 'hidden', zIndex: 120, display: 'block' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 15px 11px' }}>
            <img src={p.img} style={{ width: 38, height: 38, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0, display: 'block' }}>
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 550, color: NT.text }}>{p.name}</span>
              <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em', color: NT.green, background: NT.greenBg, padding: '2px 8px', borderRadius: 8, display: 'inline-block', marginTop: 3 }}>{p.state}</span>
            </span>
          </span>
          <span style={{ display: 'flex', borderTop: `1px solid ${NT.borderS}` }}>
            {p.stats.map(([l, v], i) => (
              <span key={i} style={{ flex: 1, padding: '10px 0 11px', textAlign: 'center', borderLeft: i > 0 ? `1px solid ${NT.borderS}` : 'none', display: 'block' }}>
                <span style={{ display: 'block', fontSize: 9.5, color: NT.dim, marginBottom: 3 }}>{l}</span>
                <span style={{ display: 'block', fontSize: 13.5, fontWeight: 550, color: NT.text, fontFamily: NT.mono }}>{v}</span>
              </span>
            ))}
          </span>
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 15px', borderTop: `1px solid ${NT.borderS}` }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: NT.green, cursor: 'pointer' }}>Open product →</span>
            <span style={{ fontSize: 10, color: NT.dim, fontFamily: NT.mono }}>{p.ads}</span>
          </span>
        </span>
      )}
    </span>
  )
}

// ── StatSpark — tiny filled sparkline ──
export function StatSpark({ data, color, w = 60, h = 22 }: { data: number[]; color: string; w?: number; h?: number }) {
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h - ((v - mn) / rng) * (h - 5) - 2.5).toFixed(1)}`).join(' ')
  const uid = 'ntss' + color.replace(/[^a-z0-9]/gi, '')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', flexShrink: 0 }}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.18" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${uid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── StatCard — KPI tile ──
export function StatCard({ label, value, sub, subTone, spark, foot, footLink }: {
  label: ReactNode; value: ReactNode; sub?: ReactNode; subTone?: 'pos' | 'neg'
  spark?: number[]; foot?: ReactNode; footLink?: ReactNode
}) {
  const toneC = subTone === 'pos' ? NT.greenBr : subTone === 'neg' ? NT.red : NT.dim
  return (
    <div className="dv2-card-h" style={{ flex: 1, background: NT.surf, borderRadius: 14, boxShadow: NT.shadow, border: `1px solid ${NT.borderS}`, padding: '16px 19px', position: 'relative', overflow: 'hidden', cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 12, color: NT.mid, marginBottom: 9 }}>{label}</div>
          <div style={{ fontSize: 23, fontWeight: 550, color: NT.text, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>{value}</div>
          <div style={{ fontSize: 11.5, color: toneC, fontWeight: 450 }}>{sub}</div>
        </div>
        {spark && <div style={{ marginTop: 18 }}><StatSpark data={spark} color={subTone === 'neg' ? NT.red : NT.greenBr} /></div>}
      </div>
      {foot && (
        <div className="dv2-stat-foot" style={{ background: NT.surf, borderTop: `1px solid ${NT.borderS}`, padding: '8px 19px 9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 10.5, color: NT.dim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{foot}</span>
          <span className="dv2-link" style={{ fontSize: 11, fontWeight: 500, color: NT.green, cursor: 'pointer', whiteSpace: 'nowrap' }}>{footLink}</span>
        </div>
      )}
    </div>
  )
}

// ── MetricSelect — chart metric dropdown ──
export type MetricOption = { id: string; label: string; group?: string }
const NT_RANGE_LABEL: Record<string, string> = { '7D': 'last 7 days', '1M': 'last 30 days', '3M': 'last 90 days' }

export function MetricSelect<T extends MetricOption>({ options, metric, setMetric, range }: {
  options: T[]; metric: T; setMetric: (m: T) => void; range?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  const groups = [...new Set(options.map((m) => m.group))]
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 7,
        background: 'transparent', border: 'none', padding: '2px 4px', margin: '-2px -4px',
        fontSize: 13, color: NT.mid, fontFamily: NT.sans, cursor: 'pointer', borderRadius: 6 }}>
        <span>{metric.label}{range ? <span> · <span style={{ color: NT.dim }}>{NT_RANGE_LABEL[range]}</span></span> : null}</span>
        <span style={{ display: 'flex', color: NT.dim }}>{NI.chevD}</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: -6, zIndex: 50, width: 264,
          background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 12,
          boxShadow: '0 4px 12px rgba(20,24,15,0.06), 0 16px 48px rgba(20,24,15,0.12)', padding: '6px', overflow: 'hidden' }}>
          {groups.map((g) => (
            <div key={g}>
              {groups.length > 1 && <div style={{ fontSize: 10, fontWeight: 550, color: NT.dim, padding: '8px 10px 4px', letterSpacing: '0.02em' }}>{g}</div>}
              {options.filter((m) => m.group === g).map((m) => (
                <div key={m.id} onClick={() => { setMetric(m); setOpen(false) }}
                  className="dv2-menu-item"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7.5px 10px', borderRadius: 8,
                    fontSize: 12.5, color: NT.text, cursor: 'pointer',
                    background: m.id === metric.id ? NT.page : 'transparent', fontWeight: m.id === metric.id ? 500 : 425 }}>
                  <span style={{ flex: 1 }}>{m.label}</span>
                  {m.id === metric.id && <span style={{ display: 'flex', color: NT.greenBr }}>{NI.check}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
