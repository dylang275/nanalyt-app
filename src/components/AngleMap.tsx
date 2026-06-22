// AngleMap.tsx — "Angle map" modal for the Research Analysis page.
// Expands the Positioning angles card into the competitive-whitespace / gap analysis.
// Ported from design_handoff_nanalyt/handoff_angle_map/angle-map.jsx (pixel-identical).
// Interactive: click a row to refocus the evidence pane, check up to 3 angles, Use selected → Studio.
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT } from '../system/tokens'

const AMM_SANS = NT.sans
const AMM_MONO = NT.mono
const AMM_PROD_IMG = '/uploads/Screenshot 2026-05-11 at 9.00.15 PM.png'

type AmmAd = { img: string; who: string; fmt: string; meta: string }
type AmmAngle = {
  name: string; score: number; buyer: number; ad: number; gap: number; adShare: number
  type: 'Underserved' | 'Emerging' | 'Contested' | 'Saturated'
  trend: string; d30: string; vel: string; longevity: string; sources: number; signal: string; color: string
  plats: string[]; why: string; ads: AmmAd[]
  youtube: { n: number; pos: number; vids: string[] }
  quotes: [string, string][]
}

const AMM_ANGLES: AmmAngle[] = [
  { name: 'Cognitive health', score: 87.3, buyer: 43, ad: 0, gap: 43, adShare: 0, type: 'Underserved', trend: 'Rising', d30: '+9', vel: '+3.2×', longevity: '—', sources: 3, signal: 'High', color: 'var(--dv-s2)',
    plats: ['Amazon', 'YouTube', 'Reddit'],
    why: 'Cognitive health is what buyers ask for most, yet no competitor advertises it directly. A clean first-mover lane.',
    ads: [],
    youtube: { n: 10, pos: 80, vids: ['The BEST and WORST forms of magnesium for focus', 'Magnesium L-Threonate for memory — does it work?'] },
    quotes: [
      ['Took this for mental clarity and the difference at work was night and day.', 'amazon review · 5★'],
      ['Bought it for focus during study sessions, noticed sharper recall within a week.', 'amazon review · 5★'],
      ['The only magnesium that actually crosses into the brain — that’s why I take it.', 'reddit · r/Nootropics'],
    ] },
  { name: 'Sleep quality', score: 72.1, buyer: 38, ad: 12, gap: 26, adShare: 17, type: 'Emerging', trend: 'Rising', d30: '+6', vel: '+2.1×', longevity: '14d', sources: 4, signal: 'High', color: 'var(--dv-s3)',
    plats: ['Amazon', 'TikTok', 'Reddit'],
    why: 'Strong buyer demand with only light ad coverage — competitors are testing it but haven’t locked it down.',
    ads: [
      { img: '/uploads/Screenshot 2026-05-13 at 10.48.48 AM.png', who: 'OLLY', fmt: 'Static', meta: 'Sleep · 50ct' },
      { img: '/uploads/IMG_3495.PNG', who: 'BioEmblem', fmt: 'TikTok UGC', meta: 'Creator · 0:18' },
    ],
    youtube: { n: 7, pos: 74, vids: ['Magnesium before bed — my honest 30-day test', 'Why magnesium helps you sleep (the science)'] },
    quotes: [
      ['Falling asleep faster and staying asleep — first supplement that’s done that for me.', 'amazon review · 5★'],
      ['Calmer at night, no groggy morning. Replaced my melatonin entirely.', 'amazon review · 4★'],
    ] },
  { name: 'Stress relief', score: 58.4, buyer: 31, ad: 14, gap: 17, adShare: 20, type: 'Emerging', trend: 'Rising', d30: '+4', vel: '+1.6×', longevity: '11d', sources: 3, signal: 'Medium', color: 'var(--dv-s4)',
    plats: ['Amazon', 'TikTok'],
    why: 'Buyers connect magnesium to calm; a handful of advertisers are starting to claim it.',
    ads: [
      { img: '/uploads/Screenshot 2026-05-13 at 10.48.22 AM.png', who: 'OLLY', fmt: 'Static', meta: 'Goodbye Stress · 42ct' },
      { img: '/uploads/IMG_3497.PNG', who: 'viralshopdealz', fmt: 'TikTok UGC', meta: 'Creator · 0:24' },
    ],
    youtube: { n: 5, pos: 68, vids: ['Magnesium for anxiety — what I noticed', 'Calm in a bottle? Testing magnesium glycinate'] },
    quotes: [
      ['Noticeably less on-edge during a stressful month at work.', 'amazon review · 5★'],
      ['Takes the edge off without making me drowsy.', 'amazon review · 4★'],
    ] },
  { name: 'Clinical / science', score: 44.2, buyer: 22, ad: 18, gap: 4, adShare: 26, type: 'Contested', trend: 'Stable', d30: '+1', vel: '+0.4×', longevity: '22d', sources: 2, signal: 'Medium', color: 'var(--dv-s5)',
    plats: ['YouTube', 'Google'],
    why: 'Demand and ad coverage are roughly matched — an evidence-led claim several brands already make.',
    ads: [
      { img: '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png', who: 'BioEmblem', fmt: 'Static', meta: 'Triple Complex' },
      { img: '/uploads/IMG_3497.PNG', who: 'viralshopdealz', fmt: 'TikTok UGC', meta: '“2 weeks” · 0:24' },
    ],
    youtube: { n: 6, pos: 71, vids: ['The clinical research on magnesium L-threonate', 'Pharmacist reviews magnesium forms'] },
    quotes: [
      ['Bought it because of the published cognition study — the science sold me.', 'amazon review · 5★'],
      ['Appreciate that this form is actually backed by trials.', 'amazon review · 4★'],
    ] },
  { name: 'Value & dosage', score: 24.5, buyer: 14, ad: 26, gap: -12, adShare: 37, type: 'Saturated', trend: 'Stable', d30: '-2', vel: '-0.3×', longevity: '31d', sources: 2, signal: 'Low', color: '#c9d6cb',
    plats: ['Amazon', 'Google'],
    why: 'More ads chase price and dosage than buyers care about — a crowded, discount-led race to avoid.',
    ads: [
      { img: '/uploads/IMG_3495.PNG', who: 'BioEmblem', fmt: 'TikTok UGC', meta: 'High absorption' },
      { img: '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png', who: 'BioEmblem', fmt: 'Static', meta: '300mg · value' },
    ],
    youtube: { n: 4, pos: 60, vids: ['Cheapest magnesium that actually works?', 'Cost per dose breakdown — magnesium brands'] },
    quotes: [
      ['Good price per serving compared to the others I tried.', 'amazon review · 4★'],
      ['Big bottle, lasts months — decent value.', 'amazon review · 3★'],
    ] },
]

const AMM_TYPE: Record<string, { fg: string; bg: string; br?: boolean; dot: string }> = {
  Underserved: { fg: NT.green, bg: NT.greenBg, dot: 'var(--dv-green-br)' },
  Emerging: { fg: NT.green, bg: NT.greenBg, dot: 'var(--dv-green-br)' },
  Contested: { fg: NT.text, bg: 'var(--dv-page)', br: true, dot: NT.yellow },
  Saturated: { fg: NT.text, bg: 'var(--dv-page)', br: true, dot: NT.red },
}

function AmmTypePill({ t }: { t: string }) {
  const s = AMM_TYPE[t]
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 550, color: s.fg, background: s.bg, border: s.br ? `1px solid ${NT.borderS}` : 'none', padding: '2.5px 9px', borderRadius: 9, whiteSpace: 'nowrap' }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, display: 'inline-block' }}></span>{t}</span>
}

function AmmGap({ g, big }: { g: number; big?: boolean }) {
  const pos = g > 0
  return <span style={{ fontSize: big ? 16 : 12.5, fontWeight: 600, color: pos ? NT.green : NT.red, fontFamily: AMM_MONO }}>{pos ? '+' : ''}{g}pp</span>
}

const AMM_TBL_GRID = '20px minmax(0,1fr) 120px 42px 36px 46px 96px 42px'

function AmmMetric({ v, tone }: { v: string; tone?: 'pos' | 'neg' | null }) {
  const c = v === '—' ? NT.text : tone === 'pos' ? NT.green : tone === 'neg' ? NT.red : NT.text
  return <span style={{ fontSize: 11, fontWeight: 550, color: c, fontFamily: AMM_MONO }}>{v}</span>
}

function AmmBarMini({ buyer, ad }: { buyer: number; ad: number }) {
  const rows: [string, number, string, number][] = [['Buy', buyer, 'var(--dv-green-br)', 1], ['Ads', ad, NT.text, 0.5]]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {rows.map(([l, v, c, o]) => (
        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 8, fontWeight: 600, color: NT.text, width: 20, flexShrink: 0, letterSpacing: '0.02em' }}>{l}</span>
          <div style={{ flex: 1, height: 5, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${v}%`, height: '100%', background: c, opacity: o, borderRadius: 3 }}></div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 550, color: NT.text, fontFamily: AMM_MONO, width: 24, textAlign: 'right' }}>{v}%</span>
        </div>
      ))}
    </div>
  )
}

function AmmCheck({ on }: { on: boolean }) {
  return (
    <span style={{ width: 19, height: 19, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: on ? 'var(--dv-btn-bg)' : 'var(--dv-surf)', border: on ? 'none' : `1.5px solid ${NT.border}` }}>
      {on && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="var(--dv-btn-fg)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5l2.5 2.5 4.5-5" /></svg>}
    </span>
  )
}

function AmmBand({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 24px', background: 'var(--dv-page)', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}` }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: NT.text, letterSpacing: '0.05em' }}>{children}</span>
      {right && <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.text }}>{right}</span>}
    </div>
  )
}

function AmmDonutBig() {
  // Canvas is wider/taller than the donut (r=92) so the leader-line labels have
  // clearance to render larger without clipping the edges or crowding the band below.
  const W = 448, H = 340, cx = 224, cy = 146, stroke = 40, r = 92
  const C = 2 * Math.PI * r, GAP = 3
  const segs = AMM_ANGLES.filter((a) => a.adShare > 0)
  const polar = (R: number, pct: number): [number, number] => { const t = (pct / 100) * 2 * Math.PI; return [cx + R * Math.sin(t), cy - R * Math.cos(t)] }
  let off = 0, cum = 0
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', margin: '0 auto 2px', maxWidth: '100%' }}>
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--dv-page)" strokeWidth={stroke} />
        {segs.map((a, i) => {
          const len = (a.adShare / 100) * C - GAP
          const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={a.color} strokeWidth={stroke} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} />
          off += (a.adShare / 100) * C; return el
        })}
      </g>
      <text x={cx} y={cy - 10} textAnchor="middle" fontFamily={AMM_MONO} fontSize="44" fontWeight="600" fill="var(--dv-text)" letterSpacing="-2">4/5</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontFamily={AMM_SANS} fontSize="12.5" fontWeight="500" fill="var(--dv-text)">angles advertised</text>
      <text x={cx} y={cy + 31} textAnchor="middle" fontFamily={AMM_SANS} fontSize="11.5" fontWeight="600" fill="var(--dv-green)">1 lane wide open</text>
      {segs.map((a, i) => {
        const mid = cum + a.adShare / 2; cum += a.adShare
        const [ix, iy] = polar(r, mid)
        const [ox, oy] = polar(r + stroke / 2, mid)
        const [ex, ey] = polar(r + stroke / 2 + 15, mid)
        const side = ix >= cx ? 1 : -1
        const isBottom = Math.abs(mid - 50) < 10
        const tx = isBottom ? cx : ex + side * 4
        const anchor = isBottom ? 'middle' : (side > 0 ? 'start' : 'end')
        return (
          <g key={i}>
            <text x={ix} y={iy} textAnchor="middle" dominantBaseline="central" fontFamily={AMM_MONO} fontSize="14" fontWeight="600" fill="#fff">{a.adShare}%</text>
            <polyline points={`${ox},${oy} ${ex},${ey} ${isBottom ? ex : tx},${ey}`} fill="none" stroke="var(--dv-border)" strokeWidth="1" />
            <text x={tx} y={isBottom ? ey + 14 : ey - 7} textAnchor={anchor} dominantBaseline="central" fontFamily={AMM_SANS} fontSize="14.5" fontWeight="550" fill="var(--dv-text)">{a.name}</text>
            <text x={tx} y={isBottom ? ey + 30 : ey + 10} textAnchor={anchor} dominantBaseline="central" fontFamily={AMM_MONO} fontSize="12.5" fontWeight="500" fill="var(--dv-text)">{a.buyer}% buyers</text>
          </g>
        )
      })}
    </svg>
  )
}

function AmmCreatives({ a }: { a: AmmAngle }) {
  if (!a.ads || a.ads.length === 0) {
    return (
      <>
        <AmmBand right="0 live">COMPETITOR CREATIVES</AmmBand>
        <div style={{ padding: '14px 24px 16px' }}>
          <div style={{ border: `1.5px dashed ${NT.green}`, background: NT.greenBg, borderRadius: 12, padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, fontWeight: 600, color: NT.green }}>+</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: NT.text, marginBottom: 3 }}>No competitor is running this angle</div>
              <div style={{ fontSize: 11.5, color: NT.text, lineHeight: 1.5 }}>Zero ads use {a.name.toLowerCase()} — your creative would be the first in the category to claim it.</div>
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <AmmBand right={`${a.ad}% of competitor ads`}>COMPETITOR CREATIVES</AmmBand>
      <div style={{ padding: '13px 24px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
        {a.ads.map((ad, i) => (
          <div key={i} className="dv2-card-h" style={{ border: `1px solid ${NT.borderS}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: 'var(--dv-surf)' }}>
            <div style={{ position: 'relative', height: 150, background: 'var(--dv-page)' }}>
              <img src={ad.img} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={`${ad.who} ad`} />
              <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, fontWeight: 600, color: '#fff', background: 'rgba(16,24,15,0.62)', padding: '2.5px 8px', borderRadius: 7 }}>{ad.fmt}</span>
            </div>
            <div style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: NT.text }}>{ad.who}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: NT.text, fontFamily: AMM_MONO }}>{ad.meta}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function AmmEvidence({ a }: { a: AmmAngle }) {
  const tiles: [string, string | number][] = [['Opportunity', a.score], ['Ads', `${a.ad}%`], ['Buyers', `${a.buyer}%`], ['Signal', a.signal]]
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '15px 24px 12px' }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: NT.text, letterSpacing: '-0.015em' }}>{a.name}</span>
        <AmmTypePill t={a.type} />
        <span style={{ marginLeft: 'auto' }}><AmmGap g={a.gap} big /></span>
      </div>
      <div style={{ display: 'flex', gap: 9, padding: '0 24px 13px' }}>
        {tiles.map(([l, v], i) => (
          <div key={i} style={{ flex: 1, border: `1px solid ${NT.borderS}`, borderRadius: 11, padding: '9px 12px' }}>
            <div style={{ fontSize: 9.5, color: NT.text, marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: NT.text, fontFamily: AMM_MONO, letterSpacing: '-0.02em', lineHeight: 1 }}>{v}</div>
          </div>
        ))}
      </div>
      <AmmBand>WHY THIS IS A GAP</AmmBand>
      <div style={{ padding: '13px 24px 14px' }}>
        <div style={{ borderLeft: `3px solid ${a.gap > 0 ? 'var(--dv-green-br)' : NT.red}`, background: a.gap > 0 ? NT.greenBg : 'var(--dv-page)', borderRadius: '0 12px 12px 0', padding: '13px 17px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: NT.text, lineHeight: 1.45, marginBottom: 10 }}>{a.why}</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 550, color: NT.green, background: 'var(--dv-surf)', padding: '3px 9px', borderRadius: 9 }}>{a.buyer}% buyer mentions</span>
            <span style={{ fontSize: 10, fontWeight: 550, color: NT.text, background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, padding: '3px 9px', borderRadius: 9 }}>{a.ad}% ad adoption</span>
            <span style={{ fontSize: 10, fontWeight: 550, color: a.gap > 0 ? NT.green : NT.red, background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, padding: '3px 9px', borderRadius: 9, fontFamily: AMM_MONO }}>{a.gap > 0 ? '+' : ''}{a.gap}pp gap</span>
          </div>
        </div>
      </div>
      <AmmCreatives a={a} />
      <AmmBand right={`Signal · ${a.signal}`}>ORGANIC SIGNALS</AmmBand>
      <div style={{ padding: '12px 24px 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <span style={{ width: 22, height: 18, borderRadius: 6, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 600, color: NT.text }}>Y</span>
          <span style={{ fontSize: 12, fontWeight: 550, color: NT.text }}>YouTube</span>
          <span style={{ fontSize: 10.5, color: NT.text, fontFamily: AMM_MONO }}>{a.youtube.n} videos</span>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 550, color: NT.green, fontFamily: AMM_MONO }}>{a.youtube.pos}% positive</span>
        </div>
        {a.youtube.vids.map((v, i) => <div key={i} style={{ borderLeft: '3px solid var(--dv-green-br)', background: 'var(--dv-page)', borderRadius: '0 9px 9px 0', padding: '8px 13px', marginBottom: 7, fontSize: 11.5, color: NT.text }}>{v}</div>)}
        <div style={{ padding: '2px 0 12px' }}><span className="dv2-link" style={{ fontSize: 11, fontWeight: 500, color: NT.green, cursor: 'pointer' }}>Organic demand signal · see all {a.youtube.n} →</span></div>
      </div>
      <AmmBand right={`${a.sources} sources`}>KEY EVIDENCE</AmmBand>
      <div>
        {a.quotes.map((q, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '12px 24px', borderBottom: i < a.quotes.length - 1 ? `1px solid ${NT.borderS}` : 'none' }}>
            <span style={{ fontSize: 12.5, color: NT.text, lineHeight: 1.5 }}>"{q[0]}"</span>
            <span style={{ fontSize: 10, color: NT.text, fontFamily: AMM_MONO }}>{q[1]}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── the modal ─────────────────────────────────────────────────────────────────
export default function AngleMap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [focusIdx, setFocusIdx] = useState(0)
  const [selected, setSelected] = useState<Set<number>>(() => new Set([0]))
  useEffect(() => {
    if (!open) return
    setFocusIdx(0)
    setSelected(new Set([0]))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null

  const toggle = (i: number) => setSelected((prev) => {
    const n = new Set(prev)
    if (n.has(i)) n.delete(i); else if (n.size < 3) n.add(i)
    return n
  })
  const selList = [...selected]
  const focus = AMM_ANGLES[focusIdx]

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(16,24,15,0.34)', fontFamily: AMM_SANS, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ammFade 0.16s ease' }}>
      <style>{'@keyframes ammFade { from { opacity:0; } to { opacity:1; } } @keyframes ammPop { from { transform:translateY(10px) scale(0.99); opacity:0.4; } to { transform:none; opacity:1; } }'}</style>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 1280, maxWidth: 'calc(100vw - 48px)', height: 820, maxHeight: 'calc(100vh - 48px)', background: 'var(--dv-surf)', borderRadius: 18, boxShadow: '0 32px 80px rgba(16,24,15,0.34)', overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'ammPop 0.22s cubic-bezier(0.2,0.8,0.3,1)' }}>
        {/* title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '16px 24px 14px', borderBottom: `1px solid ${NT.borderS}`, flexShrink: 0 }}>
          <img src={AMM_PROD_IMG} style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'cover', border: `1px solid ${NT.borderS}` }} alt="Magnesium L-Threonate" />
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 600, color: NT.green, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>Angle map</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: NT.text, letterSpacing: '-0.015em' }}>Magnesium L-Threonate</span>
              <span style={{ fontSize: 11, color: NT.text, fontFamily: AMM_MONO }}>4 competitors · 5 angles · updated Jun 10</span>
            </div>
          </div>
          <span onClick={onClose} style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: 8, border: `1px solid ${NT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: NT.text, fontSize: 12 }}>✕</span>
        </div>
        {/* body */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', flex: 1, minHeight: 0 }}>
          <div style={{ borderRight: `1px solid ${NT.borderS}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '16px 22px 8px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: NT.text, letterSpacing: '0.05em', marginBottom: 3 }}>AD COVERAGE BY ANGLE</div>
              <div style={{ fontSize: 11, color: NT.text }}>where the 4 competitors concentrate their ads</div>
            </div>
            <AmmDonutBig />
            <div style={{ display: 'grid', gridTemplateColumns: AMM_TBL_GRID, gap: 10, padding: '8px 22px', background: 'var(--dv-page)', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}` }}>
              {['', 'Angle', 'Presence', 'Longev.', '30D', 'Vel.', 'Type', 'Gap'].map((c, i) => <div key={i} style={{ fontSize: 9, fontWeight: 600, color: NT.text, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{c}</div>)}
            </div>
            {AMM_ANGLES.map((a, i) => {
              const isFocus = i === focusIdx
              const isSel = selected.has(i)
              return (
                <div key={a.name} className="dv2-row" onClick={() => setFocusIdx(i)} style={{ display: 'grid', gridTemplateColumns: AMM_TBL_GRID, gap: 10, alignItems: 'center', padding: '12px 22px', borderBottom: `1px solid ${NT.borderS}`, cursor: 'pointer', background: isFocus ? 'var(--dv-row-top)' : 'transparent', borderLeft: isFocus ? '3px solid var(--dv-green-br)' : '3px solid transparent' }}>
                  <span onClick={(e) => { e.stopPropagation(); toggle(i) }} style={{ display: 'flex' }}><AmmCheck on={isSel} /></span>
                  <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: a.adShare > 0 ? a.color : 'transparent', border: a.adShare > 0 ? 'none' : `1.5px dashed ${NT.red}`, flexShrink: 0 }}></span>
                    <span style={{ fontSize: 12.5, fontWeight: isFocus ? 600 : 550, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
                  </div>
                  <AmmBarMini buyer={a.buyer} ad={a.ad} />
                  <AmmMetric v={a.longevity} />
                  <AmmMetric v={a.d30} tone={a.d30[0] === '+' ? 'pos' : a.d30[0] === '-' ? 'neg' : null} />
                  <AmmMetric v={a.vel} tone={a.vel[0] === '+' ? 'pos' : a.vel[0] === '-' ? 'neg' : null} />
                  <AmmTypePill t={a.type} />
                  <AmmGap g={a.gap} />
                </div>
              )
            })}
          </div>
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <AmmEvidence a={focus} />
          </div>
        </div>
        {/* slots footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderTop: `1px solid ${NT.borderS}`, background: 'var(--dv-surf)', flexShrink: 0 }}>
          <span style={{ fontSize: 11.5, fontWeight: 550, color: NT.text }}>Selected angles</span>
          <div style={{ display: 'flex', gap: 7 }}>
            {[0, 1, 2].map((slot) => {
              const idx = selList[slot]
              const filled = idx !== undefined
              return (
                <div key={slot} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 11px 4px 7px', borderRadius: 9, border: `1px solid ${filled ? 'var(--dv-green-br)' : NT.borderS}`, background: filled ? NT.greenBg : 'var(--dv-surf)' }}>
                  <span style={{ width: 16, height: 16, borderRadius: 5, background: filled ? 'var(--dv-green-br)' : 'var(--dv-page)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600 }}>{slot + 1}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.text, fontFamily: filled ? AMM_SANS : AMM_MONO }}>{filled ? AMM_ANGLES[idx].name : 'empty'}</span>
                </div>
              )
            })}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.text, fontFamily: AMM_MONO }}>{selected.size} of 3</span>
          <button className="dv2-btn-p" onClick={() => { if (selected.size) { onClose(); navigate('/studio') } }} style={{ background: selected.size ? 'var(--dv-btn-bg)' : 'var(--dv-page)', color: selected.size ? 'var(--dv-btn-fg)' : NT.text, border: selected.size ? 'none' : `1px solid ${NT.border}`, padding: '8px 16px', borderRadius: 9, fontSize: 11.5, fontWeight: 500, fontFamily: AMM_SANS, cursor: selected.size ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>Use selected angles →</button>
        </div>
      </div>
    </div>
  )
}
