// PerformanceProduct.tsx — pipeline product-detail view (Magnesium Glycinate Complex).
// Ported from design_handoff_nanalyt/source/Performance Detail.html (legacy standalone),
// rebuilt onto the shared shell: local color object C → --dv-* tokens + Geist.
// Renders content only; the shell is AppLayout.
import { useNavigate } from 'react-router-dom'
import { NT } from '../system/tokens'

const PD_BAR = 'rgba(92,184,119,0.32)' // light-green spend bars (was #c8ddd0)

// ── chart ──
const SPEND_DATA = [
  248, 268, 282, 295, 288, 312, 328, 318, 344, 358,
  350, 372, 388, 378, 398, 412, 408, 428, 442, 436,
  458, 468, 474, 488, 498, 508, 522, 512, 548, 582,
]
const ROAS_DATA = [
  3.0, 3.05, 3.0, 3.15, 3.1, 3.25, 3.2, 3.38, 3.35, 3.5,
  3.42, 3.58, 3.52, 3.7, 3.68, 3.82, 3.8, 3.92, 4.02, 4.12,
  4.1, 4.22, 4.32, 4.42, 4.52, 4.62, 4.82, 5.02, 5.22, 5.5,
]

function PerformanceChart() {
  const W = 800, H = 172
  const N = SPEND_DATA.length
  const slotW = W / N
  const barW = slotW * 0.5
  const barPad = (slotW - barW) / 2
  const maxSpend = Math.max(...SPEND_DATA)
  const minRoas = Math.min(...ROAS_DATA), maxRoas = Math.max(...ROAS_DATA)
  const roasRng = maxRoas - minRoas || 1

  const bars = SPEND_DATA.map((v, i) => ({
    x: i * slotW + barPad, w: barW,
    h: (v / maxSpend) * H * 0.86,
    y: H - (v / maxSpend) * H * 0.86,
  }))
  const roasPts = ROAS_DATA.map((v, i) => ({
    x: i * slotW + slotW / 2,
    y: H * 0.06 + (1 - (v - minRoas) / roasRng) * (H * 0.8),
  }))
  let path = `M ${roasPts[0].x} ${roasPts[0].y}`
  for (let i = 1; i < roasPts.length; i++) {
    const p = roasPts[i - 1], c = roasPts[i]
    const dx = (c.x - p.x) / 3
    path += ` C ${p.x + dx} ${p.y} ${c.x - dx} ${c.y} ${c.x} ${c.y}`
  }
  const gridYs = [0.25, 0.5, 0.75].map((f) => f * H)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', height: 180 }}>
      {gridYs.map((y, i) => (
        <line key={i} x1={0} y1={y} x2={W} y2={y} stroke="var(--dv-grid)" strokeWidth="0.8" strokeDasharray="3 5" />
      ))}
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={PD_BAR} rx="2" />
      ))}
      <path d={path} fill="none" stroke="var(--dv-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── pills ──
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    performing: { bg: NT.greenBg, color: NT.green, label: '▲ Performing' },
    stable: { bg: 'var(--dv-page)', color: NT.mid, label: 'Stable' },
    watch: { bg: 'rgba(168,116,42,0.13)', color: NT.yellow, label: 'Watch' },
  }
  const s = map[status] || map.stable
  return <span style={{ fontSize: 11, fontWeight: 500, background: s.bg, color: s.color, padding: '4px 11px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{s.label}</span>
}
function VerdictPill({ verdict }: { verdict: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    scaling: { bg: NT.greenBg, color: NT.green, label: '▲ SCALING' },
    stable: { bg: 'var(--dv-page)', color: NT.mid, label: 'STABLE' },
    watch: { bg: 'rgba(168,116,42,0.13)', color: NT.yellow, label: 'WATCH' },
    winddown: { bg: 'rgba(196,80,74,0.1)', color: NT.red, label: '▼ WIND DOWN' },
  }
  const s = map[verdict] || map.stable
  return <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.035em', background: s.bg, color: s.color, padding: '4px 9px', borderRadius: 4, whiteSpace: 'nowrap' }}>{s.label}</span>
}

const FORMAT_COLORS: Record<string, string> = { UGC: '#2d5c3a', STATIC: '#4a4740', VIDEO: '#6b45a8', PDP: '#1e5faa' }
function Thumb({ gradient, format, hasPlay }: { gradient: string; format: string; hasPlay?: boolean }) {
  return (
    <div style={{ width: 56, height: 56, borderRadius: 7, background: gradient, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 5, left: 5, fontSize: 8, fontWeight: 700, letterSpacing: '0.05em', background: FORMAT_COLORS[format] || 'rgba(0,0,0,0.55)', color: '#fff', padding: '2px 5px', borderRadius: 3, zIndex: 1, lineHeight: '13px' }}>{format}</span>
      {hasPlay && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.40)', border: '1px solid rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="7" height="8" viewBox="0 0 7 8" fill="white"><path d="M1 0.5l5.5 3.5L1 7.5V0.5z" /></svg>
          </div>
        </div>
      )}
    </div>
  )
}

const COL_GRID = '72px 1fr 76px 76px 76px 68px 68px 118px 48px'
type Creative = { id: number; gradient: string; format: string; hasPlay: boolean; name: string; winner: boolean; subline: string; days: string; spend: string; roas: string; cvr: string; ctr: string; verdict: string; winnerRow: boolean; isLast: boolean }
const CREATIVES: Creative[] = [
  { id: 1, gradient: 'linear-gradient(140deg,#f0a2c2 0%,#9b62bb 100%)', format: 'UGC', hasPlay: true, name: '"Couldn\'t shut my brain off"', winner: true, subline: 'Sleep-Anxiety Crossover · UGC', days: '22d', spend: '$6.2k', roas: '5.4×', cvr: '3.2%', ctr: '1.8%', verdict: 'scaling', winnerRow: true, isLast: false },
  { id: 2, gradient: 'linear-gradient(140deg,#d4c4a0 0%,#a88c60 100%)', format: 'STATIC', hasPlay: false, name: 'Lifestyle composition', winner: false, subline: 'Lifestyle & Wellness · Static', days: '18d', spend: '$3.4k', roas: '3.6×', cvr: '2.4%', ctr: '1.2%', verdict: 'stable', winnerRow: false, isLast: false },
  { id: 3, gradient: 'linear-gradient(140deg,#ab8acc 0%,#6540aa 100%)', format: 'VIDEO', hasPlay: true, name: 'Tried everything for sleep', winner: false, subline: 'Sleep-Anxiety Crossover · Video', days: '14d', spend: '$2.1k', roas: '2.8×', cvr: '1.9%', ctr: '0.9%', verdict: 'watch', winnerRow: false, isLast: false },
  { id: 4, gradient: 'linear-gradient(140deg,#a8cce8 0%,#5d8ec8 100%)', format: 'PDP', hasPlay: false, name: 'Next-day calm landing page', winner: false, subline: 'v1 · Sleep-Anxiety Crossover · PDP', days: '32d', spend: '—', roas: '—', cvr: '2.4%', ctr: '—', verdict: 'scaling', winnerRow: false, isLast: true },
]

function CreativeTable() {
  const HEADERS = ['CREATIVE', 'DAYS LIVE', 'SPEND', 'ROAS', 'CVR', 'CTR', 'VERDICT']
  const MV = ({ v }: { v: string }) => <span style={{ fontSize: 13, color: v === '—' ? NT.dim : NT.text, fontFamily: NT.mono, letterSpacing: '-0.01em' }}>{v}</span>
  return (
    <div style={{ background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: COL_GRID, alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${NT.border}` }}>
        <div></div>
        {HEADERS.map((h, i) => (
          <div key={h} style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: NT.dim, paddingLeft: i === 0 ? 12 : 0 }}>{h}</div>
        ))}
        <div></div>
      </div>
      {CREATIVES.map((row) => (
        <div key={row.id} className="dv2-row" style={{ display: 'grid', gridTemplateColumns: COL_GRID, alignItems: 'center', padding: '11px 16px',
          background: row.winnerRow ? 'var(--dv-row-top)' : 'transparent', borderBottom: row.isLast ? 'none' : `1px solid ${NT.borderS}`, cursor: 'pointer' }}>
          <Thumb gradient={row.gradient} format={row.format} hasPlay={row.hasPlay} />
          <div style={{ paddingLeft: 12, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: NT.text, letterSpacing: '-0.01em' }}>{row.name}</span>
              {row.winner && <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.05em', background: NT.greenBg, color: NT.green, padding: '2px 7px', borderRadius: 3, whiteSpace: 'nowrap' }}>WINNER</span>}
            </div>
            <div style={{ fontSize: 11, color: NT.dim }}>{row.subline}</div>
          </div>
          <MV v={row.days} />
          <MV v={row.spend} />
          <MV v={row.roas} />
          <MV v={row.cvr} />
          <MV v={row.ctr} />
          <div><VerdictPill verdict={row.verdict} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <span style={{ color: NT.dim, cursor: 'pointer', display: 'flex', opacity: 0.5 }}>
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="2.5" y1="1.5" x2="2.5" y2="10.5" /><line x1="8.5" y1="1.5" x2="8.5" y2="10.5" /></svg>
            </span>
            <span style={{ color: NT.dim, cursor: 'pointer', opacity: 0.5, fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1 }}>⋯</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PerformanceProduct() {
  const navigate = useNavigate()
  const CARD = { background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 10 }
  const DATE_LABELS = ['Apr 19', 'Apr 26', 'May 3', 'May 10', 'May 17']

  return (
    <div style={{ maxWidth: 980 }}>
      <span onClick={() => navigate('/performance')} className="dv2-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: NT.dim, cursor: 'pointer', marginBottom: 16, letterSpacing: '-0.01em' }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5.5H2M4.5 3L2 5.5 4.5 8" /></svg>
        <span>Back to Performance</span>
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Product header card */}
        <div style={{ ...CARD, display: 'flex', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: `1px solid ${NT.border}`, background: 'var(--dv-page)' }}>
              <img src="/uploads/IMG_3472.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="Magnesium Glycinate Complex" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: NT.dim, marginBottom: 5 }}>PRODUCT</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 500, color: NT.text, letterSpacing: '-0.025em', lineHeight: 1 }}>Magnesium Glycinate Complex</span>
                <StatusPill status="performing" />
              </div>
              <div style={{ fontSize: 11, color: NT.dim }}>In market · 1 PDP · 3 ads · last 30 days</div>
            </div>
          </div>
          <div style={{ width: 1, height: 48, background: NT.borderS, flexShrink: 0, margin: '0 28px' }}></div>
          <div style={{ display: 'flex', gap: 28, flexShrink: 0, alignItems: 'flex-start' }}>
            {[{ label: 'SPEND', value: '$12.4k' }, { label: 'BLENDED ROAS', value: '4.1×' }, { label: 'AVG CVR', value: '2.8%' }].map((m, i) => (
              <div key={i} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: NT.dim, marginBottom: 5 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 500, color: NT.text, fontFamily: NT.mono, letterSpacing: '-0.03em', lineHeight: 1 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance over time */}
        <div style={{ ...CARD, padding: '16px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: NT.text, letterSpacing: '-0.01em', marginRight: 14 }}>Performance over time</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 18, height: 2.5, background: 'var(--dv-green)', borderRadius: 2, flexShrink: 0 }}></div>
                <span style={{ fontSize: 11, color: NT.mid }}>ROAS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 11, background: PD_BAR, borderRadius: 2, flexShrink: 0 }}></div>
                <span style={{ fontSize: 11, color: NT.mid }}>Spend</span>
              </div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: NT.dim, fontFamily: NT.mono }}>Apr 19 – May 19</span>
          </div>
          <PerformanceChart />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9, paddingLeft: 1, paddingRight: 1 }}>
            {DATE_LABELS.map((d, i) => <span key={i} style={{ fontSize: 10, color: NT.dim, fontFamily: NT.mono }}>{d}</span>)}
          </div>
        </div>

        <CreativeTable />
      </div>
    </div>
  )
}
