import { useState } from 'react'
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
                  if (s.isGoogle) {
                    // Pass 2 will open the Google source drawer
                  }
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
    </div>
  )
}

export default ResearchAnalysis
