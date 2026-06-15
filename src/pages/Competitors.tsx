// Competitors.tsx — competitor watchlist (Direction A).
// Ported from design_handoff_nanalyt/source/competitors-page.jsx.
// Renders content only; the shell is AppLayout.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT, ntCard } from '../system/tokens'
import { StatSpark } from '../components/primitives'

type Comp = {
  id: string; name: string; shortName?: string; shade: string; img: string
  ads: number; last: string; share: number[]; shareNow: string; delta: string; deltaPos: boolean | null
}

const CP_COMPS: Comp[] = [
  { id: 'olly', name: 'Olly', shade: 'var(--dv-s1)', img: '/uploads/Screenshot 2026-05-11 at 10.35.38 PM.png', ads: 31, last: '3h ago', share: [25, 28, 31, 33, 30], shareNow: '30%', delta: '+5 pts', deltaPos: true },
  { id: 'beam', name: 'Beam', shade: 'var(--dv-s2)', img: '/uploads/Screenshot 2026-05-11 at 10.34.39 PM.png', ads: 18, last: '1d ago', share: [22, 21, 22, 23, 22], shareNow: '22%', delta: 'stable', deltaPos: null },
  { id: 'moon', name: 'Moon Juice', shade: 'var(--dv-s3)', img: '/uploads/Screenshot 2026-05-11 at 10.38.42 PM.png', ads: 14, last: '2d ago', share: [20, 20, 19, 18, 19], shareNow: '19%', delta: '−1 pt', deltaPos: false },
  { id: 'ritual', name: 'Ritual', shade: 'var(--dv-s4)', img: '/uploads/Screenshot 2026-05-11 at 10.39.26 PM.png', ads: 12, last: '3d ago', share: [18, 17, 16, 15, 16], shareNow: '16%', delta: '−2 pts', deltaPos: false },
  { id: 'pure', name: 'Pure Encapsulations', shortName: 'Pure Enc.', shade: 'var(--dv-s5)', img: '/uploads/Screenshot 2026-05-11 at 10.40.07 PM.png', ads: 9, last: '2d ago', share: [15, 14, 12, 11, 13], shareNow: '13%', delta: '+2 pts', deltaPos: true },
]

const CP_WEEKS = ['May 12', 'May 19', 'May 26', 'Jun 2', 'Jun 9']

const CP_SIGNALS = [
  { text: '3 of your 5 competitors entered the “sleep-anxiety crossover” angle in the last 14 days.', conf: 'High', date: 'Jun 2' },
  { text: 'UGC share of new creative is up 18 pts across the category this month.', conf: 'Medium', date: 'May 29' },
  { text: 'Nobody is running a “next-day calm” angle except you — your differentiator is holding.', conf: 'High', date: 'May 24' },
]

function CpConf({ conf }: { conf: string }) {
  const m: Record<string, { bg: string; fg: string }> = { High: { bg: NT.greenBg, fg: NT.green }, Medium: { bg: 'rgba(168,116,42,0.13)', fg: NT.yellow }, Low: { bg: NT.page, fg: NT.dim } }
  const s = m[conf]
  return <span style={{ fontSize: 10, fontWeight: 550, background: s.bg, color: s.fg, padding: '2.5px 9px', borderRadius: 9, whiteSpace: 'nowrap' }}>{conf} confidence</span>
}

// multi-line share chart; `hi` highlights one competitor, dims the rest
function CpShareChart({ hi, W = 1000, H = 230, labelW = 148 }: { hi: string | null; W?: number; H?: number; labelW?: number }) {
  const plotW = W - labelW
  const norm = (v: number) => H - ((v - 10) / 25) * H * 0.92 - H * 0.04
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', height: H }}>
        {[0.25, 0.5, 0.75].map((f, i) => <line key={i} x1="0" y1={f * H} x2={plotW} y2={f * H} stroke="var(--dv-grid)" strokeWidth="1" />)}
        {CP_COMPS.map((c, ci) => {
          const pts = c.share.map((v, i) => ({ x: (i / (c.share.length - 1)) * plotW, y: norm(v) }))
          let dd = `M ${pts[0].x} ${pts[0].y.toFixed(1)}`
          for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i], dx = (q.x - p.x) / 3; dd += ` C ${(p.x + dx).toFixed(1)} ${p.y.toFixed(1)} ${(q.x - dx).toFixed(1)} ${q.y.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}` }
          const last = pts[pts.length - 1]
          const lead = hi ? hi === c.id : ci === 0
          const dim = hi && hi !== c.id
          return (
            <g key={c.id} style={{ transition: 'opacity 0.15s' }} opacity={dim ? 0.22 : lead ? 1 : 0.85}>
              <path className="dv2-draw" pathLength="1" d={dd} fill="none" stroke={c.shade} strokeWidth={lead ? 2.4 : 1.7} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={last.x} cy={last.y} r={lead ? 4 : 3} fill="var(--dv-surf)" stroke={c.shade} strokeWidth="2" />
            </g>
          )
        })}
      </svg>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: labelW - 14, pointerEvents: 'none' }}>
        {CP_COMPS.map((c, ci) => {
          const lead = hi ? hi === c.id : ci === 0
          const dim = hi && hi !== c.id
          return (
            <div key={c.id} style={{ position: 'absolute', top: `${(norm(c.share[4]) / H) * 100}%`, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', opacity: dim ? 0.35 : 1, transition: 'opacity 0.15s' }}>
              <span style={{ fontSize: 11, fontWeight: lead ? 550 : 475, color: lead ? NT.text : NT.mid }}>{c.shortName || c.name}</span>
              <span style={{ fontSize: 10.5, color: NT.dim, fontFamily: NT.mono }}>{c.shareNow}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Competitors() {
  const navigate = useNavigate()
  const [hi, setHi] = useState<string | null>(null)

  return (
    <>
      {/* ── Title row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 2px 0' }}>
        <div>
          <span style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Watchlist</span>
          <span style={{ fontSize: 11.5, color: NT.dim, marginLeft: 9 }}>5 of 5 monitored · all sources synced</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 9 }}>
          <button className="dv2-btn-g" style={{ background: 'var(--dv-surf)', color: NT.mid, border: `1px solid ${NT.border}`, padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>All categories</button>
          <button className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer' }}>+ Add competitor</button>
        </div>
      </div>

      {/* ── Share-of-activity hero chart ── */}
      <div style={{ ...ntCard, padding: '20px 24px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 13.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em' }}>Share of category ad activity</span>
          <span style={{ fontSize: 11, color: NT.dim }}>across your 5 monitored competitors</span>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.dim, fontFamily: NT.mono }}>weekly · last 5 weeks</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 28, fontWeight: 550, color: NT.text, letterSpacing: '-0.04em', lineHeight: 1 }}>Olly 30%</span>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: NT.greenBr }}>+5 pts · this week's mover</span>
        </div>
        <CpShareChart hi={hi} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingRight: 148 }}>
          {CP_WEEKS.map((w) => <span key={w} style={{ fontSize: 10, color: NT.dim, fontFamily: NT.mono }}>{w}</span>)}
        </div>
      </div>

      {/* ── Competitor cards (hover highlights the line above) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {CP_COMPS.map((c) => (
          <div key={c.id} className="dv2-card-h" onMouseEnter={() => setHi(c.id)} onMouseLeave={() => setHi(null)}
            onClick={() => navigate('/competitors/' + c.id)}
            style={{ ...ntCard, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: 84, overflow: 'hidden' }}>
              <img src={c.img} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={c.name} />
            </div>
            <div style={{ padding: '12px 14px 13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.shortName || c.name}</span>
                <span className="pulse" style={{ width: 5, height: 5, background: NT.greenBr, borderRadius: '50%', flexShrink: 0 }}></span>
              </div>
              <div style={{ fontSize: 10.5, color: NT.dim, marginBottom: 9 }}>{c.ads} live ads · {c.last}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <StatSpark data={c.share} color={c.shade} w={44} h={15} />
                <span style={{ fontSize: 12, fontWeight: 550, color: NT.text, fontFamily: NT.mono }}>{c.shareNow}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: c.deltaPos === true ? NT.greenBr : c.deltaPos === false ? NT.red : NT.dim }}>{c.delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Cross-competitor signals ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '6px 2px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
            <span style={{ fontSize: 14, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Cross-competitor signals</span>
            <span style={{ fontSize: 11, color: NT.dim }}>patterns the agent detected across your watchlist</span>
          </div>
          <span className="dv2-link" onClick={() => navigate('/findings')} style={{ fontSize: 11.5, color: NT.dim, cursor: 'pointer' }}>View all findings →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {CP_SIGNALS.map((s, i) => (
            <div key={i} className="dv2-card-h" onClick={() => navigate('/findings/' + (i === 0 ? 3 : i === 1 ? 5 : 1))} style={{ ...ntCard, padding: '16px 19px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div style={{ fontSize: 12.5, color: NT.text, lineHeight: 1.5, flex: 1 }}>{s.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CpConf conf={s.conf} />
                <span style={{ fontSize: 10.5, color: NT.dim, fontFamily: NT.mono }}>since {s.date}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: NT.green }}>Open finding →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
