import { useState, type ReactNode } from 'react'

// ─── Types & data ────────────────────────────────────────────────────────────

type ActivityLevel = 'High' | 'Medium' | 'Low'
type MoveType = 'up' | 'plus' | 'x'

type Move = { text: string; time: string; type: MoveType }

type Competitor = {
  id: number
  name: string
  heroImg: string
  heroGrad: string
  tagline: string
  activityLevel: ActivityLevel
  activeAds: number
  activeAngles: number
  topProduct: { name: string; ads: number; spendShare: number }
  recentMoves: Move[]
}

const COMPETITORS: Competitor[] = [
  {
    id: 1,
    name: 'Olly',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.35.38 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(232,99,26,0.82) 0%, rgba(210,80,10,0.6) 100%)',
    tagline: 'Mass-market supplements · TikTok-heavy',
    activityLevel: 'High',
    activeAds: 31,
    activeAngles: 7,
    topProduct: { name: 'Goodbye Stress Gummies', ads: 19, spendShare: 42 },
    recentMoves: [
      { text: 'Launched 3 new UGC video ads · nighttime recovery angle', time: '3h ago', type: 'up' },
      { text: 'Creator collab campaign live · 8 new ads', time: '1d ago', type: 'up' },
    ],
  },
  {
    id: 2,
    name: 'Beam',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.34.39 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(20,22,48,0.85) 0%, rgba(30,40,80,0.65) 100%)',
    tagline: 'Science-backed sleep · Dream Powder',
    activityLevel: 'Medium',
    activeAds: 18,
    activeAngles: 4,
    topProduct: { name: 'Dream Powder', ads: 11, spendShare: 61 },
    recentMoves: [
      { text: 'Launched 2 static ads · sleep-anxiety crossover', time: '1d ago', type: 'up' },
      { text: 'Paused 3 underperforming video ads', time: '3d ago', type: 'x' },
    ],
  },
  {
    id: 3,
    name: 'Moon Juice',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.38.42 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(100,60,110,0.82) 0%, rgba(140,90,140,0.6) 100%)',
    tagline: 'Adaptogen wellness · Magnesi-Om',
    activityLevel: 'Medium',
    activeAds: 14,
    activeAngles: 3,
    topProduct: { name: 'Magnesi-Om', ads: 8, spendShare: 54 },
    recentMoves: [
      { text: 'Refreshed static creative · Magnesi-Om lifestyle angle', time: '2d ago', type: 'up' },
      { text: 'Founder feature launch · new UGC-style static', time: '4d ago', type: 'plus' },
    ],
  },
  {
    id: 4,
    name: 'Ritual',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.39.26 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(80,100,80,0.82) 0%, rgba(110,130,100,0.6) 100%)',
    tagline: 'Transparent formulas · Magnesium+',
    activityLevel: 'Medium',
    activeAds: 12,
    activeAngles: 3,
    topProduct: { name: 'Magnesium+', ads: 7, spendShare: 58 },
    recentMoves: [
      { text: 'Launched clean static product ads · transparency angle', time: '3d ago', type: 'up' },
      { text: 'New transparency-focused creative · ingredient callout', time: '5d ago', type: 'up' },
    ],
  },
  {
    id: 5,
    name: 'Pure Enc.',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.40.07 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(10,50,140,0.85) 0%, rgba(20,80,180,0.6) 100%)',
    tagline: 'Practitioner-grade · Magnesium Glycinate',
    activityLevel: 'Low',
    activeAds: 9,
    activeAngles: 2,
    topProduct: { name: 'Magnesium Glycinate', ads: 5, spendShare: 54 },
    recentMoves: [
      { text: 'Clinical messaging refresh · practitioner focus', time: '2d ago', type: 'up' },
      { text: 'Mag Glycinate Chelated relisted with new creative', time: '5d ago', type: 'plus' },
    ],
  },
]

type ShareSeries = {
  name: string
  shade: string
  values: number[]
  lastPeriod: string
}

const SHARE_SERIES: ShareSeries[] = [
  { name: 'Olly', shade: '#1a3d26', values: [25, 28, 31, 33, 30], lastPeriod: '25%' },
  { name: 'Beam', shade: '#2d5c3a', values: [22, 21, 22, 23, 22], lastPeriod: '22%' },
  { name: 'Moon Juice', shade: '#3e7a4f', values: [20, 20, 19, 18, 19], lastPeriod: '20%' },
  { name: 'Ritual', shade: '#5a9e6a', values: [18, 17, 16, 15, 16], lastPeriod: '18%' },
  { name: 'Pure Enc.', shade: '#85be90', values: [15, 14, 12, 11, 13], lastPeriod: '15%' },
]

// ─── Share of activity chart ─────────────────────────────────────────────────

function GridAreaSpark({ vals, color, h = 100 }: { vals: number[]; color: string; h?: number }) {
  const W = 400
  const mn = Math.min(...vals) * 0.85
  const mx = Math.max(...vals) * 1.12
  const rng = mx - mn || 1
  const coords = vals.map((v, i) => ({
    x: (i / (vals.length - 1)) * (W - 4) + 2,
    y: h - ((v - mn) / rng) * (h - 12) - 6,
  }))
  let d = `M ${coords[0].x} ${coords[0].y}`
  for (let i = 1; i < coords.length; i++) {
    const p = coords[i - 1]
    const cv = coords[i]
    d += ` C ${p.x + (cv.x - p.x) / 3} ${p.y} ${cv.x - (cv.x - p.x) / 3} ${cv.y} ${cv.x} ${cv.y}`
  }
  const uid = `gcs${color.replace(/[^a-z0-9]/gi, '')}`
  const gridYs = [0.25, 0.5, 0.75].map(f => f * h)
  const gridXs = [0.33, 0.67].map(f => f * W)
  const lp = coords[coords.length - 1]
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${h}`} className="block" style={{ height: h }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {gridYs.map((y, i) => (
        <line key={`hy${i}`} x1="0" y1={y} x2={W} y2={y} stroke="#e0ddd8" strokeWidth="0.8" strokeDasharray="4 4" />
      ))}
      {gridXs.map((x, i) => (
        <line key={`vx${i}`} x1={x} y1="0" x2={x} y2={h} stroke="#e0ddd8" strokeWidth="0.8" strokeDasharray="4 4" />
      ))}
      <path d={`${d} L ${lp.x} ${h} L ${coords[0].x} ${h} Z`} fill={`url(#${uid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShareOfActivityChart() {
  const deltaNum = (s: ShareSeries) => s.values[s.values.length - 1] - s.values[0]
  const deltaStr = (s: ShareSeries) => {
    const d = deltaNum(s)
    return (d > 0 ? '+' : '') + d + '%'
  }
  const deltaCls = (s: ShareSeries) => {
    const d = deltaNum(s)
    if (d > 0) return 'text-brand bg-brand-bg'
    if (d < 0) return 'text-danger bg-danger-bg'
    return 'text-dim bg-surf-2'
  }

  return (
    <div className="font-sans mb-10">
      <div className="flex items-center gap-2.5 mb-7">
        <span className="text-[13px] font-medium text-ink tracking-[-0.01em]">Share of activity</span>
        <span className="text-[11px] text-mid bg-surf border border-line rounded-[20px] px-2.5 py-[2px] whitespace-nowrap">
          Weekly ad activity
        </span>
        <span className="text-[11px] text-dim ml-auto">Apr 15 – May 13</span>
      </div>

      <div className="grid grid-cols-3 gap-0">
        {SHARE_SERIES.map((s, i) => {
          const last = s.values[s.values.length - 1]
          const showRight = (i + 1) % 3 !== 0 && i < SHARE_SERIES.length - 1
          const pl = i % 3 !== 0 ? 'pl-7' : ''
          const pr = showRight ? 'pr-7' : ''
          const pt = i >= 3 ? 'pt-7' : ''
          return (
            <div key={s.name} className={`pb-6 relative ${pl} ${pr} ${pt}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-semibold text-ink">{s.name}</span>
                <span className={`text-[11px] font-semibold font-mono px-1.5 py-px rounded-[10px] ${deltaCls(s)}`}>
                  {deltaStr(s)}
                </span>
              </div>
              <div className="text-[30px] font-medium text-ink font-mono tracking-[-0.04em] leading-none mb-0.5">
                {last}%
              </div>
              <div className="text-[11px] text-dim mb-4">{s.lastPeriod} last period</div>
              <div className="relative">
                <GridAreaSpark vals={s.values} color={s.shade} h={100} />
                {showRight && <div className="absolute top-0 -right-7 w-px h-full bg-line" />}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-dim font-mono">Apr 15</span>
                <span className="text-[10px] text-dim font-mono">May 13</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-[12px] text-mid mt-4 leading-[1.6]">
        <strong className="text-ink font-semibold">Olly's share climbed from 25% → 33%</strong> over the last 4 weeks.{' '}
        <strong className="text-ink font-semibold">Pure Encapsulations slipped from 15% → 11%</strong>.
      </div>
    </div>
  )
}

// ─── Competitor card ─────────────────────────────────────────────────────────

function MoveIcon({ type }: { type: MoveType }) {
  if (type === 'up') return <span className="text-[13px] text-brand font-bold leading-none">↑</span>
  if (type === 'plus') return <span className="text-[13px] text-mid font-bold leading-none">+</span>
  return <span className="text-[13px] text-danger font-bold leading-none">×</span>
}

function CompetitorCard({ comp, onOpen }: { comp: Competitor; onOpen: (c: Competitor) => void }) {
  const actLevelCls =
    comp.activityLevel === 'High'
      ? 'text-brand'
      : comp.activityLevel === 'Medium'
      ? 'text-warn'
      : 'text-dim'

  return (
    <div
      onClick={() => onOpen(comp)}
      className="bg-surf rounded-[10px] shadow-lift overflow-hidden flex flex-col cursor-pointer transition-shadow hover:shadow-card-hover font-sans"
    >
      <div className="relative w-full pb-[32%] overflow-hidden shrink-0">
        <img
          src={comp.heroImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover block"
          style={{ objectPosition: 'center top' }}
        />
        <div className="absolute inset-0" style={{ background: comp.heroGrad }} />
        <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 flex items-end justify-between">
          <div>
            <div className="text-[13px] font-semibold text-white tracking-[-0.01em] leading-[1.1]">{comp.name}</div>
            <div className="text-[9px] text-white/85 mt-px">{comp.tagline}</div>
          </div>
          <span className="text-[10px] font-medium text-white/95 bg-white/[0.18] border border-white/25 px-2.5 py-[3px] rounded-[20px] whitespace-nowrap">
            {comp.activityLevel} activity
          </span>
        </div>
      </div>

      <div className="px-3 py-2.5 flex flex-col gap-2.5 flex-1">
        <div className="flex gap-6">
          {[
            { label: 'ACTIVE ADS', value: String(comp.activeAds) },
            { label: 'ACTIVE ANGLES', value: String(comp.activeAngles) },
          ].map(m => (
            <div key={m.label}>
              <div className="text-[10px] font-medium tracking-[0.03em] uppercase text-dim mb-[3px]">{m.label}</div>
              <div className={`text-[14px] font-medium ${m.label === 'ACTIVE ADS' ? actLevelCls : 'text-ink'}`}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[10px] font-medium tracking-[0.03em] uppercase text-dim mb-1.5">Top Product</div>
          <div className="flex items-center gap-2 bg-surf-2 rounded-md px-2 py-[7px]">
            <div className="w-7 h-7 rounded shrink-0 overflow-hidden bg-white border-[0.5px] border-line">
              <img src={comp.heroImg} alt="" className="w-full h-full object-cover block" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-medium text-ink truncate">{comp.topProduct.name}</div>
              <div className="text-[10px] text-dim mt-px">
                {comp.topProduct.ads} active ads · {comp.topProduct.spendShare}% of their spend
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto border-[0.5px] border-line rounded-md px-2 py-[7px]">
          <div className="text-[10px] font-medium tracking-[0.03em] uppercase text-dim mb-2">Recent Moves</div>
          {comp.recentMoves.slice(0, 2).map((a, i) => {
            const parts = a.text.split(' · ')
            return (
              <div
                key={i}
                className={`grid grid-cols-[14px_36px_1fr] gap-1.5 items-baseline ${i === 0 ? 'mb-1.5' : ''}`}
              >
                <span className="flex items-center justify-center">
                  <MoveIcon type={a.type} />
                </span>
                <span className="text-[10px] text-dim font-mono">{a.time}</span>
                <span className="text-[11px] text-ink leading-[1.4]">
                  {parts.map((part, pi) => (
                    <span key={pi}>
                      {pi > 0 && ' · '}
                      {pi === 0 ? <strong className="font-semibold">{part}</strong> : part}
                    </span>
                  ))}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={e => {
              e.stopPropagation()
              onOpen(comp)
            }}
            className="bg-brand text-white border-0 rounded-md px-3 py-1 text-[12px] font-medium cursor-pointer flex items-center gap-1 hover:opacity-90"
          >
            Open profile
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

function Competitors(): ReactNode {
  const [, setSelected] = useState<Competitor | null>(null)

  return (
    <div className="px-6 pt-5 pb-12 font-sans">
      <div className="mb-5">
        <div className="text-[20px] font-medium text-ink tracking-[-0.025em]">Competitors</div>
      </div>

      <ShareOfActivityChart />

      <div className="flex items-center justify-between mb-3.5 mt-2">
        <span className="text-[14px] font-semibold text-ink">Tracked competitors</span>
        <button className="bg-transparent text-brand border border-brand-dim rounded-[20px] px-3 py-1 text-[11px] font-medium cursor-pointer hover:bg-brand-bg">
          + Add competitor
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 items-stretch">
        {COMPETITORS.map(comp => (
          <CompetitorCard key={comp.id} comp={comp} onOpen={setSelected} />
        ))}
      </div>
    </div>
  )
}

export default Competitors
