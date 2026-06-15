// Dashboard.tsx — operator morning briefing.
// Ported from design_handoff_nanalyt/source/dashboard-page.jsx.
// Renders content only; the shell is AppLayout.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT, NI, ntCard } from '../system/tokens'
import { ntSeries } from '../system/data'
import { ChipD, Peek, StatSpark, StatCard, MetricSelect } from '../components/primitives'
import { HeroChart, type ChartEvent, type ChartLegend } from '../components/HeroChart'

// ── Page data ──
type CatMetric = {
  id: string; group: string; label: string
  hero: Record<string, [string, string]>; neg?: boolean
  fmt: (v: number) => string
  mk: (n: number) => number[]; mkP: (n: number) => number[]; color: string
}
const DP_CAT_METRICS: CatMetric[] = [
  { id: 'sentiment', group: 'Category', label: 'Category sentiment',
    hero: { '7D': ['70 pts', '↑ 1.8'], '1M': ['70 pts', '↑ 4.2'], '3M': ['70 pts', '↑ 9.6'] },
    fmt: (v) => Math.round(v) + ' pts',
    mk: (n) => ntSeries(n, 61, 0.14, 2.2, 11, 5), mkP: (n) => ntSeries(n, 57, 0.10, 2.0, 11, 9), color: 'var(--dv-blue)' },
  { id: 'entrants', group: 'Category', label: 'New market entrants',
    hero: { '7D': ['3', '+2 this week'], '1M': ['9', '+4 vs prior'], '3M': ['21', '+8 vs prior'] }, neg: true,
    fmt: (v) => String(Math.round(v)),
    mk: (n) => ntSeries(n, 0.8, 1.6, 1.1, 5.5, 11), mkP: (n) => ntSeries(n, 0.6, 1.2, 1.0, 5.5, 4), color: 'var(--dv-green-br)' },
]

const DP_PROD_LEGEND: ChartLegend = [['Revenue', 'var(--dv-blue)'], ['Ad spend', 'var(--dv-green-br)']]
type ProdEvent = { d: number; glyph: string; title: string; detail: string }
type ProdMetric = {
  id: string; group: string; label: string; dual: boolean
  hero: Record<string, [string, string]>; neg?: boolean; flat?: boolean
  fmt: (v: number) => string
  mk: (n: number) => number[]; mk2: (n: number) => number[]; mkP: (n: number) => number[]
  events?: ProdEvent[]; anomaly?: { d1: number; d2: number; title: string; sub: string }
  legend: ChartLegend; color: string; color2: string
}
const DP_PROD_METRICS: ProdMetric[] = [
  { id: 'mag', group: 'Products', label: 'Magnesium Glycinate', dual: true,
    hero: { '7D': ['$5.1k/wk', '↑ 9%'], '1M': ['$18.4k/wk', '↑ 23%'], '3M': ['$18.4k/wk', '↑ 61%'] },
    fmt: (v) => '$' + Math.round(v),
    mk: (n) => ntSeries(n, 720, 0.85, 190, 8.5, 2), mk2: (n) => ntSeries(n, 215, 0.5, 48, 8.5, 7), mkP: (n) => ntSeries(n, 610, 0.5, 160, 8.5, 9),
    events: [
      { d: 24, glyph: '⚑', title: 'Flagged creative fatigue on static ad', detail: 'Frequency hit 4.2 · alerted you' },
      { d: 14, glyph: '✎', title: 'Drafted 2 replacement creatives', detail: 'You approved · live 13 days' },
      { d: 6, glyph: '▲', title: 'Recommended +40% budget on UGC', detail: 'ROAS +0.8 since you approved' },
    ],
    legend: DP_PROD_LEGEND, color: 'var(--dv-blue)', color2: 'var(--dv-green-br)' },
  { id: 'zzz', group: 'Products', label: 'ZzzPlex Sleep', dual: true,
    hero: { '7D': ['$2.6k/wk', '↓ 4%'], '1M': ['$11.2k/wk', '↓ 8%'], '3M': ['$11.2k/wk', '↓ 14%'] }, neg: true,
    fmt: (v) => '$' + Math.round(v),
    mk: (n) => ntSeries(n, 640, -0.28, 130, 8.5, 6), mk2: (n) => ntSeries(n, 235, -0.08, 38, 8.5, 9), mkP: (n) => ntSeries(n, 700, -0.10, 120, 8.5, 3),
    events: [{ d: 9, glyph: '⚑', title: 'Flagged rising CPA', detail: 'Drafted 2 replacements for your review' }],
    anomaly: { d1: 9, d2: 5, title: 'Spend spike · Jun 2–6', sub: 'CPA rose 34% in this window — likely creative fatigue. The agent drafted 2 replacement creatives.' },
    legend: DP_PROD_LEGEND, color: 'var(--dv-blue)', color2: 'var(--dv-green-br)' },
  { id: 'ash', group: 'Products', label: 'ASHWAGANDHA+', dual: true,
    hero: { '7D': ['$0.3k/wk', 'Testing'], '1M': ['$0.8k/wk', 'Testing'], '3M': ['$0.8k/wk', 'Testing'] }, flat: true,
    fmt: (v) => '$' + Math.round(v),
    mk: (n) => ntSeries(n, 60, 2.4, 28, 8.5, 4), mk2: (n) => ntSeries(n, 42, 1.1, 11, 8.5, 5), mkP: (n) => ntSeries(n, 25, 1.8, 14, 8.5, 8),
    events: [{ d: 17, glyph: '✎', title: 'Started validation test', detail: '4 ads · 1 PDP live' }],
    legend: DP_PROD_LEGEND, color: 'var(--dv-blue)', color2: 'var(--dv-green-br)' },
]

const DP_RANGES: Record<string, number> = { '7D': 7, '1M': 30, '3M': 90 }
const DP_DATES: Record<string, string[]> = {
  '7D': ['Jun 3', 'Jun 4', 'Jun 5', 'Jun 6', 'Jun 7', 'Jun 8', 'Jun 9'],
  '1M': ['May 11', 'May 18', 'May 25', 'Jun 1', 'Jun 9'],
  '3M': ['Mar 11', 'Apr 1', 'Apr 22', 'May 13', 'Jun 9'],
}

type Attention = { tone: 'warn' | 'risk' | 'ok'; icon: string; action: string; pre: string; prodId: string | null; prodLabel: string; time: string }
const DP_ATTENTION: Attention[] = [
  { tone: 'warn', icon: 'tests', action: 'Review', pre: 'Test concluded · ', prodId: 'mag', prodLabel: 'Magnesium Glycinate Complex', time: '1h' },
  { tone: 'risk', icon: 'studio', action: 'Fix ad', pre: 'Rejected ad on Meta · ', prodId: 'zzz', prodLabel: 'ZzzPlex UGC variant', time: '4h' },
  { tone: 'ok', icon: 'findings', action: 'Open', pre: 'Campaign brief approved · ', prodId: 'ash', prodLabel: 'ASHWAGANDHA+', time: '1d' },
  { tone: 'warn', icon: 'products', action: 'View', pre: 'Low stock signal · Vitamin D3 + K2 Complex', prodId: null, prodLabel: '', time: '2d' },
]

const DP_TOPADS = [
  { format: 'Static', product: 'Magnesium Glycinate', img: '/uploads/IMG_3472.jpg', roas: '4.2×', delta: '+0.3', pos: true, cpa: '$22.40', spend: '$2.1k/wk' },
  { format: 'Video', product: 'ZzzPlex Sleep Support', img: '/uploads/IMG_3474.jpg', roas: '3.1×', delta: '−0.4', pos: false, cpa: '$38.20', spend: '$1.6k/wk' },
  { format: 'UGC', product: 'ASHWAGANDHA+', img: '/uploads/IMG_3476.jpg', roas: '2.8×', delta: '+0.6', pos: true, cpa: '$28.10', spend: '$0.3k/wk' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [catMetric, setCatMetric] = useState<CatMetric>(DP_CAT_METRICS[0])
  const [prodMetric, setProdMetric] = useState<ProdMetric>(DP_PROD_METRICS[0])
  const [range, setRange] = useState('1M')
  const [compare, setCompare] = useState(false)

  const n = DP_RANGES[range]
  const catVals = catMetric.mk(n)
  const prodVals = prodMetric.mk(n)
  const prodSpend = prodMetric.mk2(n)
  const [catVal, catDelta] = catMetric.hero[range]
  const [prodVal, prodDelta] = prodMetric.hero[range]
  const prodEvents: ChartEvent[] = (prodMetric.events || []).map((e) => ({ glyph: e.glyph, title: e.title, detail: e.detail, i: (n - 1) - e.d })).filter((e) => e.i >= 2 && e.i <= n - 3)
  const catGhost = compare && catMetric.mkP ? catMetric.mkP(n) : null
  const prodGhost = compare && prodMetric.mkP ? prodMetric.mkP(n) : null
  const prodAnomaly = (() => {
    const a = prodMetric.anomaly
    if (!a) return null
    const i1 = (n - 1) - a.d1, i2 = (n - 1) - a.d2
    if (i1 < 1 || i2 > n - 2) return null
    return { i1, i2, title: a.title, sub: a.sub }
  })()
  const deltaColorFor = (m: CatMetric | ProdMetric, d: string) => ('flat' in m && m.flat) ? NT.dim : d.startsWith('↓') ? NT.red : m.id === 'entrants' ? NT.red : NT.greenBr
  const toneDot: Record<string, string> = { warn: NT.yellow, risk: NT.red, ok: NT.greenBr }
  const card = ntCard

  return (
    <>
      {/* Agent brief — daily narrative (dark) */}
      <div style={{ background: 'linear-gradient(120deg, #10180f 0%, #16241a 70%, #1a2f1f 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(16,24,15,0.18)', padding: '22px 28px 20px', position: 'relative', overflow: 'hidden', marginTop: 8 }}>
        <div style={{ position: 'absolute', top: -110, right: -60, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,184,119,0.16) 0%, rgba(92,184,119,0) 70%)', pointerEvents: 'none' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, position: 'relative' }}>
          <div style={{ width: 24, height: 24, background: 'rgba(92,184,119,0.18)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="pulse" style={{ width: 6, height: 6, background: '#5cb877', borderRadius: '50%', display: 'block' }}></span>
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 550, color: '#ffffff', whiteSpace: 'nowrap' }}>Your agent · Daily brief</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: NT.mono, whiteSpace: 'nowrap' }}>Tue Jun 9, 6:00 AM</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span className="pulse" style={{ width: 5, height: 5, background: '#5cb877', borderRadius: '50%', display: 'block' }}></span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>Live · synced 2 min ago</span>
            </span>
            <span style={{ fontSize: 11, color: '#7ac292', fontWeight: 550, cursor: 'pointer', whiteSpace: 'nowrap' }}>Full week review →</span>
          </span>
        </div>

        <div style={{ fontSize: 17.5, fontWeight: 450, color: '#ffffff', lineHeight: 1.62, letterSpacing: '-0.012em', maxWidth: 830, marginBottom: 16, position: 'relative' }}>
          Good afternoon, Dylan. Revenue is tracking <ChipD>↑ 12.4%</ChipD> this week, led by Magnesium
          Glycinate's "next-day calm" angle <ChipD>5.2× ROAS</ChipD>. One thing needs you: ZzzPlex CPA
          climbed to <ChipD tone="red">$38.20</ChipD> on creative fatigue — I've drafted two replacement
          creatives and queued a fresh angle test for your review.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <button className="dv2-btn-p" style={{ background: '#ffffff', color: '#10180f', border: 'none', padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 550, fontFamily: NT.sans, cursor: 'pointer' }}>Review 2 creatives</button>
          <button style={{ background: 'transparent', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.18)', padding: '8px 15px', borderRadius: 10, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>Approve angle test</button>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'rgba(255,255,255,0.85)' }}>3 actions queued</span>
        </div>
      </div>

      {/* Trends header — shared range control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 2px -8px' }}>
        <span style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Trends</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div onClick={() => setCompare(!compare)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: compare ? NT.greenBg : 'var(--dv-surf)', border: `1px solid ${compare ? 'rgba(62,132,84,0.35)' : NT.borderS}`, borderRadius: 9, padding: '5.5px 12px', cursor: 'pointer', boxShadow: compare ? 'none' : NT.shadow }}>
            {compare && <svg width="10" height="10" viewBox="0 0 11 11" fill="none" stroke="var(--dv-green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6l3 3 5-5.5" /></svg>}
            <span style={{ fontSize: 11.5, fontWeight: 550, color: compare ? NT.green : NT.mid }}>Compare</span>
          </div>
          <div style={{ display: 'flex', background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, borderRadius: 9, padding: 2, boxShadow: NT.shadow }}>
            {Object.keys(DP_RANGES).map((r) => (
              <span key={r} onClick={() => setRange(r)} style={{ padding: '4px 11px', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontWeight: range === r ? 550 : 425,
                background: range === r ? NT.page : 'transparent', color: range === r ? NT.text : NT.dim, transition: 'all 0.12s' }}>{r}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Trends charts — category (60%) + products (40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
        <div style={{ ...card, padding: '22px 26px 18px' }}>
          <div style={{ marginBottom: 12 }}>
            <MetricSelect options={DP_CAT_METRICS} metric={catMetric} setMetric={setCatMetric} range={range} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 11, marginBottom: 16 }}>
            <span key={catVal} className="dv2-num-in" style={{ fontSize: 32, fontWeight: 550, color: NT.text, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{catVal}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: deltaColorFor(catMetric, catDelta) }}>{catDelta}</span>
            {compare && <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: NT.dim }}><svg width="16" height="4" viewBox="0 0 16 4"><line x1="0" y1="2" x2="16" y2="2" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" /></svg>Prior</span>}
          </div>
          <div style={{ margin: '0 -4px' }}>
            <HeroChart vals={catVals} color={catMetric.color} fmt={catMetric.fmt} ghost={catGhost} uid="dpgCat" h={200} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9, padding: '0 2px' }}>
            {DP_DATES[range].map((d) => <span key={d} style={{ fontSize: 10, color: NT.dim, fontFamily: NT.mono }}>{d}</span>)}
          </div>
        </div>

        <div style={{ ...card, padding: '22px 26px 18px' }}>
          <div style={{ marginBottom: 12 }}>
            <MetricSelect options={DP_PROD_METRICS} metric={prodMetric} setMetric={setProdMetric} range={range} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 11, marginBottom: 16 }}>
            <span key={prodVal} className="dv2-num-in" style={{ fontSize: 32, fontWeight: 550, color: NT.text, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{prodVal}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: deltaColorFor(prodMetric, prodDelta) }}>{prodDelta}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
              {DP_PROD_LEGEND.map(([l, c], i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: NT.mid }}>
                  <span style={{ width: 12, height: 2.5, background: c, borderRadius: 2, display: 'block' }}></span>{l}
                </span>
              ))}
              {compare && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: NT.dim }}><svg width="14" height="4" viewBox="0 0 14 4"><line x1="0" y1="2" x2="14" y2="2" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" /></svg>Prior</span>}
            </span>
          </div>
          <div style={{ margin: '0 -4px' }}>
            <HeroChart vals={prodVals} vals2={prodSpend} color={prodMetric.color} color2={prodMetric.color2} fmt={prodMetric.fmt} legend={prodMetric.legend} events={prodEvents} ghost={prodGhost} anomaly={prodAnomaly} uid="dpgProd" h={200} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9, padding: '0 2px' }}>
            {[DP_DATES[range][0], DP_DATES[range][DP_DATES[range].length - 1]].map((d) =>
              <span key={d} style={{ fontSize: 10, color: NT.dim, fontFamily: NT.mono }}>{d}</span>)}
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display: 'flex', gap: 14 }}>
        <StatCard label="Findings this week" value="14" sub="+5 vs prior week" subTone="pos" spark={[6, 7, 5, 9, 11, 10, 14]} foot="8 competitor · 6 category" footLink="View findings →" />
        <StatCard label="Biggest risk" value="$38.20" sub="ZzzPlex CPA · fatigue" subTone="neg" spark={[24, 25, 27, 28, 31, 35, 38]} foot="2 fixes drafted for review" footLink="Review fixes →" />
        <StatCard label="Opportunity" value="+4.1×" sub="search demand · 60d" subTone="pos" spark={[12, 14, 16, 19, 25, 32, 41]} foot="Mag + ashwagandha gummies" footLink="View finding →" />
        <StatCard label="Active tests" value="3" sub="2 concluded last 7d" spark={[2, 2, 3, 3, 2, 3, 3]} foot="Mag angle · Ash validation" footLink="Open tests →" />
      </div>

      {/* Lead finding + attention */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 14 }}>
        <div style={{ ...card, padding: '22px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '3px 11px', borderRadius: 12 }}>New product</span>
            <span style={{ fontSize: 11, color: NT.dim }}>Found yesterday · highest impact</span>
            <span onClick={() => navigate('/findings')} className="dv2-link" style={{ marginLeft: 'auto', fontSize: 11.5, color: NT.dim, cursor: 'pointer' }}>View all findings</span>
          </div>
          <div onClick={() => navigate('/findings/5')} style={{ fontSize: 17, fontWeight: 550, color: NT.text, lineHeight: 1.45, letterSpacing: '-0.018em', marginBottom: 16, maxWidth: 520, cursor: 'pointer' }}>
            Add magnesium + ashwagandha gummies to your catalog — fits your existing buyer.
          </div>
          <div style={{ display: 'flex', gap: 28, marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, color: NT.dim, marginBottom: 3 }}>Early entrants</div>
              <div style={{ fontSize: 13.5, fontWeight: 550, color: NT.text }}>3 in last 17d</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: NT.dim, marginBottom: 3 }}>Demand trend</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 550, color: NT.text }}>+4.1× search</span>
                <StatSpark data={[12, 14, 13, 18, 22, 28, 41]} color={NT.greenBr} />
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9, background: NT.page, borderRadius: 10, padding: '7px 13px' }}>
              <img src="/uploads/IMG_3476.jpg" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: NT.text }}>Mag + Ashwagandha Gummies</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <button onClick={() => navigate('/findings?action=gummies')} className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '8.5px 18px', borderRadius: 10, fontSize: 12.5, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer' }}>Take action</button>
            <button className="dv2-btn-g" style={{ background: 'var(--dv-surf)', color: NT.mid, border: `1px solid ${NT.border}`, padding: '8.5px 16px', borderRadius: 10, fontSize: 12.5, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>Dismiss</button>
          </div>
        </div>

        <div style={{ ...card, padding: '20px 24px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em' }}>Needs attention</span>
            <span className="dv2-link" style={{ fontSize: 11.5, color: NT.dim, cursor: 'pointer' }}>View all</span>
          </div>
          {DP_ATTENTION.map((a, i) => {
            const toneBg: Record<string, string> = { warn: 'rgba(168,116,42,0.13)', risk: 'rgba(196,80,74,0.11)', ok: 'var(--dv-green-bg)' }
            return (
              <div key={i} className="dv2-row" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderTop: i > 0 ? `1px solid ${NT.borderS}` : 'none', cursor: 'pointer' }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: toneBg[a.tone], color: toneDot[a.tone], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{NI[a.icon]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 475, color: NT.text, lineHeight: 1.4 }}>{a.pre}{a.prodId ? <Peek pid={a.prodId}>{a.prodLabel}</Peek> : null}</div>
                </div>
                <span className="dv2-att-act" style={{ fontSize: 10.5, fontWeight: 550, color: NT.text, background: NT.page, border: `1px solid ${NT.border}`, borderRadius: 7, padding: '3px 10px', flexShrink: 0, whiteSpace: 'nowrap' }}>{a.action}</span>
                <span style={{ fontSize: 10.5, color: NT.dim, fontFamily: NT.mono, flexShrink: 0 }}>{a.time}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top performing ads */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '6px 2px 12px' }}>
          <span style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Top performing ads</span>
          <span className="dv2-link" style={{ fontSize: 11.5, color: NT.dim, cursor: 'pointer' }}>View all</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {DP_TOPADS.map((ad, i) => (
            <div key={i} className="dv2-card-h" style={{ ...card, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                <img src={ad.img} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(16,24,15,0.78)', color: '#fff', fontSize: 10, fontWeight: 500, letterSpacing: '0.02em', padding: '3px 10px', borderRadius: 12, backdropFilter: 'blur(4px)' }}>{ad.format}</span>
              </div>
              <div style={{ padding: '16px 18px 17px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em', marginBottom: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ad.product}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                    <span style={{ fontSize: 22, fontWeight: 550, color: NT.text, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{ad.roas}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: ad.pos ? NT.greenBr : NT.red }}>{ad.delta}</span>
                    <span style={{ fontSize: 10.5, color: NT.dim }}>ROAS</span>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: NT.dim, marginBottom: 2 }}>CPA</div>
                      <div style={{ fontSize: 12.5, fontWeight: 525, color: NT.text, fontVariantNumeric: 'tabular-nums' }}>{ad.cpa}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: NT.dim, marginBottom: 2 }}>Spend</div>
                      <div style={{ fontSize: 12.5, fontWeight: 525, color: NT.text, fontVariantNumeric: 'tabular-nums' }}>{ad.spend}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
