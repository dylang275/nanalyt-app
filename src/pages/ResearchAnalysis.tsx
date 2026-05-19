import { useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Data ────────────────────────────────────────────────────────────────────

const SIGNAL_TABS = ['Amazon reviews', 'Buyer intent', 'Ad saturation', 'Keywords'] as const
type SignalTab = (typeof SIGNAL_TABS)[number]

const SIGNAL_DATA: Record<SignalTab, number[]> = {
  'Amazon reviews': [0, 0.5, 1, 1.5, 1.8, 2.1, 1.4, 2.3, 2.8, 3.2, 3, 3.5],
  'Buyer intent': [10, 12, 11, 14, 16, 15, 18, 20, 22, 24, 23, 26],
  'Ad saturation': [2, 2, 3, 3, 4, 4, 3, 5, 6, 7, 6, 8],
  Keywords: [30, 32, 35, 38, 36, 40, 42, 45, 44, 48, 50, 52],
}

const KPI_STRIP = [
  { label: 'SCORE', value: '79', sub: 'Strong', accent: true },
  { label: 'SENTIMENT', value: 'Positive', sub: 'Amazon · Reddit · YouTube' },
  { label: 'MARGIN', value: '~41%', sub: '$18–$24 sourcing' },
  { label: 'AD SATURATION', value: 'Low', sub: '8% sponsored density' },
  { label: 'PLATFORMS', value: '6', sub: 'Amazon · TikTok · Reddit · YouTube · Meta · Google' },
]

const SCORE_BREAKDOWN: [string, number, number][] = [
  ['Angle Quality', 17.9, 30],
  ['Signal Volume', 8.5, 10],
  ['Reddit Engagement', 9.8, 12],
  ['Platform Presence', 10.5, 10],
  ['Sales Momentum', 0.0, 8],
  ['YouTube Engagement', 4.2, 10],
]

type KeyFinding = {
  type: 'DEMAND' | 'COMPETITION' | 'POSITIONING'
  src: string
  val: string
  unit: string
  sub: string
  chips: string[]
  insight: string
  link: string
}

const KEY_FINDINGS: KeyFinding[] = [
  {
    type: 'DEMAND',
    src: 'Amazon',
    val: '+3.2',
    unit: '/wk',
    sub: 'new organic searches/week',
    chips: ['84 Reddit mentions', '8% ad density'],
    insight: 'Ads will find a warm, ready audience.',
    link: 'View demand signals',
  },
  {
    type: 'COMPETITION',
    src: 'Meta · Google',
    val: '4',
    unit: ' advertisers',
    sub: 'unique advertisers across paid channels',
    chips: ['12 active ads', 'Low saturation'],
    insight: 'Enter before crowding begins.',
    link: 'View ad saturation',
  },
  {
    type: 'POSITIONING',
    src: 'Amazon · Reddit',
    val: '42pt',
    unit: ' gap',
    sub: 'buyer mentions vs 0% ad adoption',
    chips: ['42% buyer mentions', '0% ad adoption'],
    insight: 'First-mover angle — 2–3× lower CPCs.',
    link: 'View angle gap',
  },
]

const ANGLES = [
  { name: 'Cognitive Health', score: 87.3, trend: 'Rising', pct: 87, color: '#1a3d26' },
  { name: 'Sleep Quality', score: 72.1, trend: 'Rising', pct: 72, color: '#2d5c3a' },
  { name: 'Stress Relief', score: 58.4, trend: 'Rising', pct: 58, color: '#3e7a4f' },
  { name: 'Clinical/Science', score: 44.2, trend: 'Stable', pct: 44, color: '#5a9e6a' },
  { name: 'Value & Dosage', score: 24.5, trend: 'Stable', pct: 24, color: '#85be90' },
]

type EconRow = { src: string; ret: string; cpc: string; margin: string; marginColor: string; verdict: 'Viable' | 'Marginal' }
const ECON_ROWS: EconRow[] = [
  { src: '$18', ret: '$39.99', cpc: '$2.80', margin: '41%', marginColor: '#2d5c3a', verdict: 'Viable' },
  { src: '$22', ret: '$39.99', cpc: '$2.80', margin: '32%', marginColor: '#2d5c3a', verdict: 'Viable' },
  { src: '$26', ret: '$39.99', cpc: '$2.80', margin: '23%', marginColor: '#d97706', verdict: 'Viable' },
  { src: '$30', ret: '$39.99', cpc: '$2.80', margin: '13%', marginColor: '#dc2626', verdict: 'Marginal' },
]

const SOURCES = [
  { abbr: 'A', name: 'Amazon Reviews', detail: 'Data collected · 84 mentions', isGoogle: false },
  { abbr: 'T', name: 'TikTok Ads', detail: 'Data collected · 12 ads', isGoogle: false },
  { abbr: 'R', name: 'Reddit', detail: 'Data collected · 84 posts', isGoogle: false },
  { abbr: 'Y', name: 'YouTube', detail: 'Data collected · 11 videos', isGoogle: false },
  { abbr: 'G', name: 'Google', detail: 'Data collected · search trends', isGoogle: true },
  { abbr: 'M', name: 'Meta Ads', detail: 'Data collected · 8 ads', isGoogle: false },
]

// ─── Atoms ───────────────────────────────────────────────────────────────────

function ArrowR() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" />
    </svg>
  )
}

function TrendChart({ vals, color = '#2d5c3a', h = 120 }: { vals: number[]; color?: string; h?: number }) {
  const W = 500
  const mn = Math.min(...vals) * 0.8
  const mx = Math.max(...vals) * 1.1
  const rng = mx - mn || 1
  const coords = vals.map((v, i) => ({
    x: (i / (vals.length - 1)) * (W - 4) + 2,
    y: h - ((v - mn) / rng) * (h - 16) - 8,
  }))
  let d = `M ${coords[0].x} ${coords[0].y}`
  for (let i = 1; i < coords.length; i++) {
    const p = coords[i - 1]
    const c = coords[i]
    d += ` C ${p.x + (c.x - p.x) / 3} ${p.y} ${c.x - (c.x - p.x) / 3} ${c.y} ${c.x} ${c.y}`
  }
  const uid = `tc${color.replace(/[^a-z0-9]/gi, '')}`
  const last = coords[coords.length - 1]
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${h}`} className="block" style={{ height: h }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1="0" y1={h * f} x2={W} y2={h * f} stroke="#e8e5e0" strokeWidth="0.5" />
      ))}
      <path d={`${d} L ${last.x} ${h} L ${coords[0].x} ${h} Z`} fill={`url(#${uid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="3.5" fill={color} />
    </svg>
  )
}

const CARD_CLS = 'bg-surf border-[0.5px] border-[#e2deda] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)]'

// ─── Page ────────────────────────────────────────────────────────────────────

function ResearchAnalysis() {
  const [signalTab, setSignalTab] = useState<SignalTab>('Amazon reviews')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="font-sans">
      <div className="px-7 pt-4">
        <div className="text-[11px] text-ink mb-3 flex items-center gap-1">
          <button
            onClick={() => navigate('/research')}
            className="bg-transparent border-0 text-ink cursor-pointer text-[11px] flex items-center gap-1 p-0 hover:opacity-70"
          >
            ← Research
          </button>
        </div>

        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-lg overflow-hidden border-[0.5px] border-line shrink-0 bg-surf-2">
              <img
                src="/uploads/Screenshot 2026-05-11 at 9.00.15 PM.png"
                alt=""
                className="w-full h-full object-cover block"
              />
            </div>
            <div>
              <div className="text-[20px] font-medium text-ink tracking-[-0.02em] mb-1">Magnesium L-Threonate</div>
              <div className="text-[11px] text-ink">
                Amazon · TikTok · Reddit · YouTube · Meta · Google · $29–$48 ·{' '}
                <span className="text-brand font-medium cursor-pointer">From: Magnesium sleep supplements</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center mt-1">
            <span className="text-[10px] font-bold tracking-[0.05em] uppercase bg-brand-bg text-brand px-2.5 py-1 rounded">
              RESEARCHED
            </span>
            {['Preview PDP', 'Campaign Package'].map(b => (
              <button
                key={b}
                className="text-[12px] text-ink bg-surf border-[0.5px] border-line rounded-md px-3 py-1.5 cursor-pointer hover:bg-line-soft"
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-0">
          <div className="px-4 py-2 text-[12px] font-medium text-ink border-b-2 border-brand -mb-px cursor-pointer">
            Overview
          </div>
        </div>
      </div>

      <div className="px-12 pt-6 pb-12 flex flex-col gap-7">
        <div className={`${CARD_CLS} overflow-hidden`}>
          <div className="grid grid-cols-5">
            {KPI_STRIP.map((k, i) => (
              <div key={i} className={`px-4 py-3.5 ${i < 4 ? 'border-r-[0.5px] border-line' : ''}`}>
                <div className="text-[9px] font-semibold tracking-[0.06em] uppercase text-ink mb-2">{k.label}</div>
                <div
                  className={`font-medium leading-none mb-1.5 tracking-[-0.02em] ${
                    i === 0 ? 'text-[28px] font-mono' : i === 1 ? 'text-[20px]' : 'text-[22px] font-mono'
                  } ${k.accent ? 'text-brand' : 'text-ink'}`}
                >
                  {k.value}
                </div>
                <div className="text-[10px] text-ink leading-[1.4]">{k.sub}</div>
              </div>
            ))}
          </div>
          <div className="border-t-[0.5px] border-line px-4 py-3">
            <div className="text-[9px] font-semibold tracking-[0.06em] uppercase text-ink mb-2.5">
              Score breakdown · 79/100
            </div>
            <div className="flex flex-col gap-[7px]">
              {SCORE_BREAKDOWN.map(([label, s, m], i) => {
                const ratio = s / m
                const barColor = ratio > 0.7 ? '#2d5c3a' : ratio > 0.4 ? '#d97706' : '#dc2626'
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-ink min-w-[130px] shrink-0">{label}</span>
                    <div className="flex-1 h-1 bg-line rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm"
                        style={{ width: `${Math.min(100, ratio * 100)}%`, background: barColor }}
                      />
                    </div>
                    <span className="text-[10px] text-ink font-mono min-w-[36px] text-right">
                      {s}/{m}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-between px-4 py-3 border-[0.5px] border-[#e2deda] rounded-lg bg-surf`}>
          <div className="text-[12px] text-ink">
            <strong className="font-semibold">Next step:</strong> Add to pipeline and generate a campaign package to start validation testing
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="text-[12px] font-medium text-white bg-brand border-0 rounded-md px-3.5 py-1.5 cursor-pointer hover:opacity-90">
              Add to pipeline
            </button>
            <button className="text-[12px] text-ink bg-surf border-[0.5px] border-line rounded-md px-3 py-1.5 cursor-pointer hover:bg-line-soft">
              Campaign package
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-medium text-ink">Key Findings</div>
            <span className="text-[11px] text-brand cursor-pointer flex items-center gap-1">
              Show all (8) <ArrowR />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {KEY_FINDINGS.map(f => (
              <div key={f.type} className={`${CARD_CLS} px-3.5 py-3.5 flex flex-col gap-2.5`}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-[0.07em] uppercase text-ink">{f.type}</span>
                  <span className="text-[10px] text-ink">{f.src}</span>
                </div>
                <div>
                  <span className="text-[22px] font-medium text-ink font-mono tracking-[-0.03em]">{f.val}</span>
                  <span className="text-[13px] text-ink">{f.unit}</span>
                  <div className="text-[11px] text-ink mt-[3px]">{f.sub}</div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {f.chips.map(ch => (
                    <span key={ch} className="text-[10px] text-ink bg-surf-2 px-[7px] py-[2px] rounded-[10px]">
                      {ch}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-brand bg-brand-bg px-2.5 py-[7px] rounded-[5px] leading-[1.4]">
                  {f.insight}
                </div>
                <button className="text-[11px] text-ink bg-transparent border-0 cursor-pointer flex items-center gap-1 p-0 mt-auto hover:opacity-70">
                  {f.link} <ArrowR />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-4">
          <div className={`${CARD_CLS} p-4`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[13px] font-medium text-ink mb-px">Signal trends</div>
                <div className="text-[11px] text-ink">Cross-platform signals composing product score</div>
              </div>
              <div className="flex gap-0.5 flex-wrap justify-end">
                {SIGNAL_TABS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSignalTab(t)}
                    className={`text-[10px] px-2 py-[3px] border-[0.5px] rounded cursor-pointer transition-all ${
                      signalTab === t
                        ? 'font-medium border-brand bg-brand-bg text-brand'
                        : 'font-normal border-line bg-transparent text-ink'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <TrendChart vals={SIGNAL_DATA[signalTab]} h={110} />
            <div className="flex justify-between mt-1 mb-3">
              {['Mar 10', 'Mar 17', 'Mar 24', 'Mar 31', 'Apr 7'].map((d, i) => (
                <span key={i} className="text-[9px] text-ink font-mono">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-4 border-t-[0.5px] border-line pt-3 gap-4">
              {[
                { l: 'CURRENT', v: '3/wk', c: undefined },
                { l: '30-DAY HIGH', v: '3/wk peak', c: undefined },
                { l: '30-DAY LOW', v: '0/wk low', c: undefined },
                { l: 'TREND', v: '↑ +3.2×', c: 'text-brand' },
              ].map(s => (
                <div key={s.l}>
                  <div className="text-[9px] font-semibold tracking-[0.05em] uppercase text-ink mb-[3px]">{s.l}</div>
                  <div className={`text-[12px] font-medium font-mono ${s.c ?? 'text-ink'}`}>{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pl-2.5 border-l-[2.5px] border-brand text-[11px] text-ink leading-[1.6]">
              Weekly search volume climbing — 3.2× YoY growth vs 0 five weeks ago. Organic demand accelerating.
            </div>
            <button className="mt-2.5 text-[11px] text-ink bg-transparent border-0 cursor-pointer flex items-center gap-1 p-0 hover:opacity-70">
              View Amazon reviews <ArrowR />
            </button>
          </div>

          <div className={`${CARD_CLS} p-4`}>
            <div className="flex items-center justify-between mb-3.5">
              <div className="text-[13px] font-medium text-ink">Positioning angles</div>
              <button className="text-[11px] text-brand bg-transparent border-0 cursor-pointer">Expand</button>
            </div>
            {ANGLES.map(a => (
              <div key={a.name} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-[7px]">
                    <div className="w-[9px] h-[9px] rounded-sm shrink-0" style={{ background: a.color }} />
                    <span className="text-[12px] font-medium text-ink">{a.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-mono text-ink">{a.score}</span>
                    <span className="text-[10px] text-brand">↑ {a.trend}</span>
                  </div>
                </div>
                <div className="h-1 bg-line rounded-sm overflow-hidden">
                  <div className="h-full rounded-sm" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
              </div>
            ))}
            <div className="mt-3.5 text-[11px] text-ink leading-[1.5]">
              All angles classified as Gap or Winner from ad copy. Click an angle to open the narrative map.
            </div>
          </div>
        </div>

        <div>
          <div className="mb-1.5">
            <div className="text-[14px] font-medium text-ink mb-0.5">Economics — pre-test</div>
            <div className="text-[11px] text-ink">Scenario table based on market pricing data</div>
          </div>
          <div className={`${CARD_CLS} overflow-hidden`}>
            <div className="grid grid-cols-5 bg-brand px-4 py-2 border-b-[0.5px] border-line">
              {['SOURCING', 'RETAIL', 'EST. CPC', 'MARGIN', 'VERDICT'].map(h => (
                <div key={h} className="text-[9px] font-semibold tracking-[0.06em] text-white/85">{h}</div>
              ))}
            </div>
            {ECON_ROWS.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-5 px-4 py-2.5 border-t-[0.5px] border-line-soft items-center first:border-t-0"
              >
                <span className="text-[13px] text-ink">{r.src}</span>
                <span className="text-[13px] text-ink">{r.ret}</span>
                <span className="text-[13px] text-ink">{r.cpc}</span>
                <span className="text-[13px] font-medium" style={{ color: r.marginColor }}>{r.margin}</span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: r.verdict === 'Viable' ? '#2d5c3a' : '#dc2626' }}
                >
                  ✓ {r.verdict}
                </span>
              </div>
            ))}
            <div className="px-4 py-2.5 bg-[#f9fcf9] border-t-[0.5px] border-line">
              <span className="text-[11px] text-ink">
                △ CPC is estimated. Figures will update automatically with real ad spend data once a validation test is run.
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="text-[14px] font-medium text-ink">Sources</div>
            <span className="text-[11px] text-ink">6 active</span>
          </div>
          <div className="flex flex-col border-[0.5px] border-[#e2deda] rounded-lg overflow-hidden bg-surf">
            {SOURCES.map((s, i) => (
              <div
                key={s.abbr}
                onClick={() => {
                  if (s.isGoogle) setDrawerOpen(true)
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 ${i > 0 ? 'border-t-[0.5px] border-line' : ''} ${
                  s.isGoogle ? 'cursor-pointer hover:bg-surf-2' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-md bg-surf-2 border-[0.5px] border-line flex items-center justify-center text-[11px] font-bold text-ink shrink-0">
                  {s.abbr}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-ink">{s.name}</div>
                  <div className="text-[11px] text-ink">{s.detail}</div>
                </div>
                <span className="text-[10px] font-bold tracking-[0.05em] text-brand">STRONG</span>
                <span className="text-ink flex">
                  <ArrowR />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GoogleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

export default ResearchAnalysis

// ─── Google Source Drawer ────────────────────────────────────────────────────

const SIGNAL_BREAKDOWN_ROWS = [
  { label: 'Search trend positive or stable (30d & 90d)', value: '+0.08% (30d) · +0.24% (90d)', threshold: '30d ≥ 0% · 90d ≥ −2%', passed: true },
  { label: 'Informational + commercial intent on SERP', value: 'SERP: Mixed-commercial', threshold: 'COMMERCIAL or MIXED', passed: true },
  { label: 'Non-big-box seller count above threshold', value: '5 of 6 results non-big-box', threshold: '≥ 5 non-big-box', passed: true },
  { label: 'Healthy price distribution', value: '$28–$48 spread · stable 60d', threshold: 'spread > $8 or stable', passed: true },
  { label: 'Keyword volume across multiple intent tiers', value: '2 tiers with volume · 18k/mo total', threshold: '≥ 2 tiers with volume', passed: true },
]

const AT_A_GLANCE = [
  { label: 'TREND 30D SLOPE', value: '+0.08%', sub: '↑ cat. median: 0.04%', subColor: '#2d5c3a' },
  { label: 'KEYWORD VOLUME', value: '18k/mo', sub: '↑ cat. median: 14k/mo', subColor: '#2d5c3a' },
  { label: 'NON-BIG-BOX SELLERS', value: '5', sub: '↓ cat. median: 6', subColor: '#d97706' },
  { label: 'SHOPPING SELLER COUNT', value: '11', sub: '↓ cat. median: 13', subColor: '#d97706' },
  { label: 'PRICE SPREAD', value: '$28–$48', sub: '↓ cat. median: $31 spread', subColor: '#d97706' },
]

type KeywordRow = { kw: string; vol: number; cpc: string; comp: 'High' | 'Medium' | 'Low' }
const KW_COGNITIVE: KeywordRow[] = [
  { kw: 'magnesium l threonate', vol: 4200, cpc: '$1.42', comp: 'Medium' },
  { kw: 'magtein', vol: 2800, cpc: '$1.18', comp: 'Low' },
  { kw: 'magnesium for brain', vol: 1650, cpc: '$1.94', comp: 'Medium' },
  { kw: 'magnesium threonate cognitive', vol: 890, cpc: '$2.30', comp: 'Medium' },
]
const KW_SLEEP: KeywordRow[] = [
  { kw: 'magnesium l threonate sleep', vol: 3900, cpc: '$1.61', comp: 'Medium' },
  { kw: 'magnesium threonate for sleep', vol: 2200, cpc: '$1.83', comp: 'Low' },
  { kw: 'magtein sleep', vol: 1400, cpc: '$1.44', comp: 'Low' },
]
const KW_CATEGORY: KeywordRow[] = [
  { kw: 'best magnesium for memory', vol: 1290, cpc: '$2.18', comp: 'High' },
]

const SERP_KPIS = [
  { label: 'SHOPPING ADS', val: '8', sub: '8 ads on sampled SERP', valColor: '#111110' },
  { label: 'SEARCH ADS', val: '2', sub: '2 ads on sampled SERP', valColor: '#111110' },
  { label: 'BIG-BOX DOMINANCE', val: '0%', sub: 'below 50% threshold', valColor: '#2d5c3a' },
  { label: 'NON-BIG-BOX SELLERS', val: '5 of 6', sub: 'based on top 10 domains', valColor: '#2d5c3a' },
]

type SerpRow = [string, string, 'Big-box' | 'Non-big-box']
const SERP_ROWS: SerpRow[] = [
  ['purerawz.com', 'Organic', 'Non-big-box'],
  ['amazon.com', 'Organic', 'Big-box'],
  ['nootropicsdepot.com', 'Organic', 'Non-big-box'],
  ['jarrow.com', 'Organic', 'Non-big-box'],
  ['iherb.com', 'Organic', 'Non-big-box'],
  ['swansonvitamins.com', 'Organic', 'Non-big-box'],
]

type ShopRow = [string, string, string, string, 'Running' | '—']
const SHOP_ROWS: ShopRow[] = [
  ['amazon.com', '$34.95', 'Free', '4,280', 'Running'],
  ['iherb.com', '$32.40', 'Free', '1,840', 'Running'],
  ['purerawz.com', '$38.00', 'Free', '620', 'Running'],
  ['nootropicsdepot.com', '$28.00', 'Free', '3,100', '—'],
  ['jarrow.com', '$31.50', 'Free', '890', 'Running'],
  ['swansonvitamins.com', '$29.99', 'Free', '445', '—'],
  ['vitacost.com', '$33.20', 'Free', '312', '—'],
  ['wellnessresources.com', '$48.00', 'Varies', '156', '—'],
]

function GoogleLogo() {
  return (
    <div className="w-9 h-9 rounded-lg bg-white border border-line flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
      </svg>
    </div>
  )
}

function MiniBarChart() {
  const vals = [2, 1, 2, 1, 3, 2, 1, 2, 3, 2, 1, 2, 3, 4, 3, 2, 3, 2, 3, 4, 5, 4, 3, 5, 4, 3, 4, 5, 6, 8]
  const max = Math.max(...vals)
  return (
    <div>
      <div className="flex items-end gap-0.5 h-14">
        {vals.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm min-w-[4px]"
            style={{
              background: i === vals.length - 1 ? '#2d5c3a' : '#2d5c3a40',
              height: `${(v / max) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-ink font-mono">Apr 15</span>
        <span className="text-[10px] text-ink font-mono">May 14</span>
      </div>
    </div>
  )
}

function SignalRow({ label, value, threshold, passed = true }: {
  label: string
  value?: string
  threshold?: string
  passed?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b-[0.5px] border-line-soft last:border-b-0">
      <div
        className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
        style={{ background: passed ? '#2d5c3a' : '#dc2626' }}
      >
        {passed ? (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l2.5 2.5 5.5-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1l6 6M7 1L1 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <span className="text-[13px] font-medium text-ink flex-1 leading-[1.3]">{label}</span>
      <div className="flex items-baseline gap-1.5 shrink-0">
        {value && <span className="text-[12px] font-mono font-semibold text-ink">{value}</span>}
        {threshold && <span className="text-[11px] text-ink">· threshold {threshold}</span>}
      </div>
    </div>
  )
}

function DrawerKpiTile({ label, value, sub, subColor, last }: {
  label: string
  value: string
  sub?: string
  subColor?: string
  last?: boolean
}) {
  return (
    <div className={`flex-1 px-3.5 py-3 min-w-0 ${last ? '' : 'border-r-[0.5px] border-line'}`}>
      <div className="text-[9px] font-semibold tracking-[0.07em] uppercase text-ink mb-1.5">{label}</div>
      <div className="text-[20px] font-medium text-ink font-mono tracking-[-0.03em] leading-none mb-1">{value}</div>
      {sub && (
        <div className="text-[10px]" style={{ color: subColor ?? '#2d5c3a' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function KeywordTable({ title, total, rows }: { title: string; total: string; rows: KeywordRow[] }) {
  const compColor: Record<KeywordRow['comp'], string> = { High: '#dc2626', Medium: '#d97706', Low: '#2d5c3a' }
  return (
    <div className="bg-surf border-[0.5px] border-[#e2deda] rounded-lg overflow-hidden mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-brand border-b-[0.5px] border-line">
        <span className="text-[11px] font-bold tracking-[0.04em] uppercase text-white">{title}</span>
        <span className="text-[11px] text-white/75">{total}</span>
      </div>
      <div className="grid grid-cols-[1fr_80px_64px_90px] px-3.5 py-1.5 border-b-[0.5px] border-line-soft">
        {['KEYWORD', 'VOLUME', 'CPC', 'COMPETITION'].map((h, i) => (
          <div
            key={i}
            className={`text-[9px] font-semibold tracking-[0.06em] text-ink ${i > 0 ? 'text-right' : 'text-left'}`}
          >
            {h}
          </div>
        ))}
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_80px_64px_90px] px-3.5 py-2 border-t-[0.5px] border-[#f5f4f2] items-center first:border-t-0"
        >
          <span className="text-[12px] text-ink">{r.kw}</span>
          <span className="text-[12px] text-ink font-mono text-right">{r.vol.toLocaleString()}</span>
          <span className="text-[12px] text-ink font-mono text-right">{r.cpc}</span>
          <span className="text-[12px] font-medium text-right" style={{ color: compColor[r.comp] }}>{r.comp}</span>
        </div>
      ))}
    </div>
  )
}

function PillTag({ children }: { children: ReactNode }) {
  return (
    <span className="text-[12px] text-ink bg-surf-2 border-[0.5px] border-[#e2deda] rounded-[20px] px-3 py-1">
      {children}
    </span>
  )
}

function OverviewTabContent() {
  return (
    <div className="px-6 pt-6 pb-16 flex flex-col gap-7">
      <div>
        <div className="text-base font-medium text-ink mb-4">Signal Breakdown</div>
        <div className="bg-surf border-[0.5px] border-[#e2deda] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {SIGNAL_BREAKDOWN_ROWS.map((r, i) => (
            <SignalRow key={i} label={r.label} value={r.value} threshold={r.threshold} passed={r.passed} />
          ))}
        </div>
        <div className="mt-3 pl-3.5 border-l-[2.5px] border-brand text-[13px] text-ink leading-[1.7]">
          Search interest is stable with a slight positive slope month-over-month. SERP page 1 shows a mix of informational and commercial results — confirming accessible market with intent. Prices across sellers span $28–$48 with no compression trend, confirming healthy margins. Demand exists across 2 intent tiers (18k/mo combined) with healthy distribution. This is real search demand with room for a new entrant.
        </div>
      </div>

      <div>
        <div className="text-[14px] font-medium text-ink mb-3">At a glance</div>
        <div className="bg-surf border-[0.5px] border-[#e2deda] rounded-lg overflow-hidden flex shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {AT_A_GLANCE.map((k, i) => (
            <DrawerKpiTile
              key={k.label}
              label={k.label}
              value={k.value}
              sub={k.sub}
              subColor={k.subColor}
              last={i === AT_A_GLANCE.length - 1}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="bg-surf border-[0.5px] border-[#e2deda] rounded-lg p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="text-[9px] font-semibold tracking-[0.08em] uppercase text-ink mb-2">Search Interest Trend</div>
          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-[20px] font-medium text-ink tracking-[-0.02em]">Up 0.08% over 30 days</span>
            <span className="text-[11px] text-brand bg-brand-bg px-2 py-0.5 rounded-[10px]">sustained 90d</span>
          </div>
          <div className="text-[12px] text-ink mb-4">stable positive trajectory — not a one-month spike</div>
          <MiniBarChart />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="text-[15px] font-medium text-ink">1. Keywords</div>
          <PillTag>18k/mo total · 2 tiers active</PillTag>
        </div>
        <div className="mb-4">
          <div className="text-[9px] font-semibold tracking-[0.07em] uppercase text-ink mb-2">Volume fragmentation across buckets</div>
          <div className="flex h-3 rounded-[3px] overflow-hidden gap-0.5 mb-2">
            <div style={{ flex: 52, background: '#1a3d26' }} className="rounded-[3px]" />
            <div style={{ flex: 41, background: '#2d5c3a' }} className="rounded-[3px]" />
            <div style={{ flex: 7, background: '#85be90' }} className="rounded-[3px]" />
          </div>
          <div className="flex gap-4">
            {[
              { c: '#1a3d26', l: 'Cognitive BOF 52%' },
              { c: '#2d5c3a', l: 'Sleep BOF 41%' },
              { c: '#85be90', l: 'Category BOF 7%' },
            ].map(f => (
              <div key={f.l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: f.c }} />
                <span className="text-[11px] text-ink">{f.l}</span>
              </div>
            ))}
          </div>
        </div>
        <KeywordTable title="Cognitive BOF" total="9k/mo · 4 keywords" rows={KW_COGNITIVE} />
        <KeywordTable title="Sleep BOF" total="7.5k/mo · 3 keywords" rows={KW_SLEEP} />
        <KeywordTable title="Category BOF" total="1.3k/mo · 1 keyword" rows={KW_CATEGORY} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="text-[15px] font-medium text-ink">2. SERP Composition</div>
          <PillTag>Sampled: "magnesium l threonate"</PillTag>
        </div>
        <div className="grid grid-cols-4 gap-2.5 mb-3.5">
          {SERP_KPIS.map(k => (
            <div key={k.label} className="bg-surf border-[0.5px] border-[#e2deda] rounded-lg px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="text-[9px] font-semibold tracking-[0.06em] uppercase text-ink mb-1.5">{k.label}</div>
              <div className="text-[18px] font-medium font-mono tracking-[-0.02em] mb-1" style={{ color: k.valColor }}>
                {k.val}
              </div>
              <div className="text-[11px] text-ink">{k.sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-surf border-[0.5px] border-[#e2deda] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[32px_minmax(0,1fr)_90px_100px_60px] px-3.5 py-[7px] bg-brand border-b-[0.5px] border-white/15">
            {['#', 'DOMAIN', 'TYPE', 'BIG-BOX', ''].map((h, i) => (
              <div key={i} className="text-[9px] font-bold tracking-[0.06em] text-white/85">{h}</div>
            ))}
          </div>
          {SERP_ROWS.map(([d, t, bb], i) => (
            <div
              key={d}
              className="grid grid-cols-[32px_minmax(0,1fr)_90px_100px_60px] px-3.5 py-2 border-t-[0.5px] border-[#f5f4f2] items-center first:border-t-0"
            >
              <span className="text-[11px] text-ink font-mono">{i + 1}</span>
              <span className="text-[12px] text-ink">{d}</span>
              <span className="text-[11px] text-ink bg-surf-2 px-[7px] py-0.5 rounded-[3px] w-fit">{t}</span>
              <span
                className="text-[12px] font-medium"
                style={{ color: bb === 'Non-big-box' ? '#2d5c3a' : '#111110' }}
              >
                {bb}
              </span>
              <span className="text-[11px] text-brand cursor-pointer">View →</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 px-3.5 py-2.5 bg-surf-2 rounded-md text-[12px] text-ink leading-[1.6]">
          <strong className="font-semibold">Interpretation:</strong> 5 of 6 top results are non-big-box — market accessible to new entrants. Big-box dominance at 0% is well below the 50% warning threshold. Shopping ads present confirm commercial intent.
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="text-[15px] font-medium text-ink">3. Shopping Sellers</div>
          <PillTag>11 sellers · $28–$48 spread</PillTag>
        </div>
        <div className="bg-surf border-[0.5px] border-[#e2deda] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[minmax(0,1fr)_80px_80px_80px_90px_50px] px-3.5 py-[7px] bg-brand border-b-[0.5px] border-white/15">
            {['SELLER', 'PRICE', 'SHIPPING', 'REVIEWS', 'SHOPPING AD', ''].map((h, i) => (
              <div key={i} className="text-[9px] font-bold tracking-[0.06em] text-white/85">{h}</div>
            ))}
          </div>
          {SHOP_ROWS.map(([s, p, sh, rv, ad], i) => (
            <div
              key={s}
              className="grid grid-cols-[minmax(0,1fr)_80px_80px_80px_90px_50px] px-3.5 py-2 border-t-[0.5px] border-[#f5f4f2] items-center first:border-t-0"
            >
              <span className="text-[12px] text-ink">{s}</span>
              <span className="text-[12px] text-ink font-mono">{p}</span>
              <span className="text-[12px] text-ink">{sh}</span>
              <span className="text-[12px] text-ink font-mono">{parseInt(rv.replace(',', '')).toLocaleString()}</span>
              {ad === 'Running' ? (
                <span className="text-[11px] text-brand bg-brand-bg px-2 py-0.5 rounded-[3px] font-medium w-fit">
                  Running
                </span>
              ) : (
                <span className="text-[12px] text-ink">—</span>
              )}
              <span className="text-[11px] text-brand cursor-pointer">Visit →</span>
            </div>
          ))}
          <div className="px-3.5 py-2 border-t-[0.5px] border-line-soft text-[11px] text-brand cursor-pointer">+ 3 more →</div>
        </div>
        <div className="mt-2.5 px-3.5 py-2.5 bg-surf-2 rounded-md text-[12px] text-ink leading-[1.6]">
          <strong className="font-semibold">Price stability (last 60 days):</strong> Stable. Price range has held. No compression trend detected. Margin environment looks durable.
        </div>
      </div>
    </div>
  )
}

const X_SOURCES = ['TikTok', 'Amazon', 'Reddit', 'YouTube', 'Meta'] as const
type XSource = (typeof X_SOURCES)[number]
const X_SOURCE_META: Record<XSource, string> = {
  TikTok: '12 ads · 4 advertisers',
  Amazon: '84 reviews · 4.4★',
  Reddit: '29 posts · 3 subs',
  YouTube: '11 videos · 89k views',
  Meta: '8 ads · 1 page',
}

type AgreementState = 'Agree' | 'Differ' | 'Coverage gap'
type XRow = {
  signal: string
  vals: Record<XSource, [string, string]>
  google: string
  googleSub: string
  agreement: AgreementState
}
const X_ROWS: XRow[] = [
  {
    signal: 'Top angle',
    vals: {
      TikTok: ['Cognitive', '4 of 4 ads'],
      Amazon: ['Cognitive', '71 of 84 reviews'],
      Reddit: ['Sleep', '22 of 29 posts'],
      YouTube: ['Cognitive', '9 of 11 videos'],
      Meta: ['Cognitive', '7 of 8 ads'],
    },
    google: 'Cognitive',
    googleSub: 'Cognitive BOF: 52%',
    agreement: 'Agree',
  },
  {
    signal: 'Top objection',
    vals: {
      TikTok: ['—', 'not in ads'],
      Amazon: ['Taste', '14 mentions'],
      Reddit: ['Price', '8 posts'],
      YouTube: ['—', 'no data'],
      Meta: ['—', 'not in ads'],
    },
    google: '—',
    googleSub: 'not in SERP text',
    agreement: 'Coverage gap',
  },
  {
    signal: 'Demand direction',
    vals: {
      TikTok: ['Active', '12 active ads'],
      Amazon: ['Strong', '+84 rev/wk'],
      Reddit: ['Active', '29 in 30d'],
      YouTube: ['Moderate', 'view:sub 0.2x'],
      Meta: ['Active', '8 active ads'],
    },
    google: 'Active',
    googleSub: '18k/mo',
    agreement: 'Agree',
  },
  {
    signal: 'Sentiment',
    vals: {
      TikTok: ['—', 'not in ads'],
      Amazon: ['Positive', '4.4★ avg'],
      Reddit: ['Positive', 'pos/neg 3.4:1'],
      YouTube: ['Positive', 'positive comments'],
      Meta: ['—', 'not in ads'],
    },
    google: 'Pending',
    googleSub: 'Re-research to classify',
    agreement: 'Differ',
  },
]

function AgreementPill({ state }: { state: AgreementState }) {
  if (state === 'Agree') {
    return <span className="text-[10px] font-semibold text-brand bg-brand-bg px-2 py-0.5 rounded-[3px]">Agree</span>
  }
  if (state === 'Differ') {
    return <span className="text-[10px] font-semibold text-[#d97706] bg-warn-bg px-2 py-0.5 rounded-[3px]">Differ</span>
  }
  return <span className="text-[10px] font-semibold text-ink bg-surf-2 px-2 py-0.5 rounded-[3px]">Coverage gap</span>
}

function CrossSourceTabContent() {
  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <div className="text-base font-medium text-ink mb-1">Google vs. other sources</div>
        <div className="text-[12px] text-ink">How Google's signal compares to what TikTok, Amazon, Reddit, YouTube, Meta say about this product.</div>
      </div>

      <div className="flex gap-2">
        {X_SOURCES.map(s => (
          <div key={s} className="flex-1 border-[0.5px] border-[#e2deda] rounded-[7px] px-3 py-2.5 bg-surf">
            <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-ink mb-1">{s}</div>
            <div className="text-[11px] text-ink">{X_SOURCE_META[s]}</div>
          </div>
        ))}
        <div className="flex-1 border-[1.5px] border-brand rounded-[7px] px-3 py-2.5 bg-brand-bg">
          <div className="text-[10px] font-bold tracking-[0.05em] uppercase text-brand mb-1">GOOGLE · FOCAL</div>
          <div className="text-[11px] text-brand">7 kw · 18k/mo</div>
        </div>
      </div>

      <div className="bg-surf border-[0.5px] border-[#e2deda] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-[110px_repeat(5,1fr)_110px_80px] px-3.5 py-2 bg-brand border-b-[0.5px] border-line">
          {['SIGNAL', ...X_SOURCES, 'GOOGLE', 'AGREEMENT'].map((h, i) => (
            <div
              key={i}
              className={`text-[9px] font-bold tracking-[0.06em] ${i === 6 ? 'text-[#a8d4b4]' : 'text-white/75'}`}
            >
              {h}
            </div>
          ))}
        </div>
        {X_ROWS.map((row, ri) => (
          <div
            key={ri}
            className="grid grid-cols-[110px_repeat(5,1fr)_110px_80px] px-3.5 py-3 border-t-[0.5px] border-line-soft items-start first:border-t-0"
          >
            <div className="text-[12px] font-medium text-ink">{row.signal}</div>
            {X_SOURCES.map(s => {
              const [v, sub] = row.vals[s]
              return (
                <div key={s}>
                  <div
                    className="text-[12px] font-medium mb-0.5"
                    style={{ color: v === '—' ? '#111110' : '#2d5c3a' }}
                  >
                    {v}
                  </div>
                  <div className="text-[10px] text-ink leading-[1.3]">{sub}</div>
                </div>
              )
            })}
            <div className="border-l-2 border-brand pl-2">
              <div
                className="text-[12px] font-medium mb-0.5"
                style={{
                  color: row.google === 'Pending' ? '#d97706' : row.google === '—' ? '#111110' : '#2d5c3a',
                }}
              >
                {row.google}
              </div>
              <div className="text-[10px] text-ink leading-[1.3]">{row.googleSub}</div>
            </div>
            <div>
              <AgreementPill state={row.agreement} />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-surf-2 rounded-[7px] text-[12px] text-ink leading-[1.65]">
        <strong className="font-semibold">Agreement:</strong> "Agree" = sources point the same direction. "Differ" = sources disagree. "Coverage gap" = not enough sources have data on this signal to evaluate agreement.
      </div>
    </div>
  )
}

function GoogleDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'Overview' | 'Cross-source'>('Overview')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[200] bg-black/[0.18] transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 z-[201] w-[720px] max-w-[100vw] bg-canvas border-l border-line flex flex-col shadow-drawer transition-transform duration-200 ease-out font-sans ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-5 pt-4 shrink-0 bg-surf border-b-[0.5px] border-line">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <GoogleLogo />
              <div>
                <div className="flex items-center gap-2.5 mb-[3px]">
                  <span className="text-[18px] font-medium text-ink tracking-[-0.02em]">Google</span>
                  <span className="text-[12px] font-semibold text-brand bg-brand-bg px-2.5 py-0.5 rounded-[10px]">
                    Strong · 5/5 criteria
                  </span>
                </div>
                <div className="text-[11px] text-ink">Magnesium L-Threonate · sleep supplements · Updated May 14, 2026</div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button className="text-[12px] text-ink bg-surf border-[0.5px] border-[#e2deda] rounded-[7px] px-3 py-1.5 cursor-pointer flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-line-soft">
                Switch source
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 4l3 3 3-3" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-[7px] bg-surf border-[0.5px] border-[#e2deda] cursor-pointer flex items-center justify-center text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-line-soft"
                aria-label="Close"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l7 7M9 2L2 9" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-0">
            {(['Overview', 'Cross-source'] as const).map(t => (
              <div
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-[12px] cursor-pointer -mb-px border-b-2 transition-all ${
                  tab === t ? 'font-medium text-ink border-brand' : 'font-normal text-ink border-transparent'
                }`}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {tab === 'Overview' && <OverviewTabContent />}
          {tab === 'Cross-source' && <CrossSourceTabContent />}
        </div>

        <div className="px-5 py-3 border-t-[0.5px] border-line flex gap-2.5 justify-end shrink-0 bg-surf">
          <button
            onClick={onClose}
            className="text-[12px] text-ink bg-surf border-[0.5px] border-[#e2deda] rounded-[7px] px-4 py-1.5 cursor-pointer hover:bg-line-soft"
          >
            Close
          </button>
          <button className="text-[12px] font-medium text-white bg-brand border-0 rounded-[7px] px-4 py-1.5 cursor-pointer hover:opacity-90">
            View full evidence packet →
          </button>
        </div>
      </div>
    </>
  )
}
