import { useState, type ReactNode } from 'react'

// ─── Types & data ────────────────────────────────────────────────────────────

type ActivityLevel = 'High' | 'Medium' | 'Low'
type MoveType = 'up' | 'plus' | 'x'
type Move = { text: string; time: string; type: MoveType }
type AngleCoverage = 'MISSING' | 'YOU RUN IT'
type Angle = {
  name: string
  share: number
  longevity: number
  trend: string
  trendPos: boolean | null
  coverage: AngleCoverage
}

type Competitor = {
  id: number
  name: string
  initials: string
  heroImg: string
  heroGrad: string
  tagline: string
  activityLevel: ActivityLevel
  activeAds: number
  activeAngles: number
  adsLast30: number
  productsActive: number
  topProduct: { name: string; ads: number; spendShare: number }
  recentMoves: Move[]
  angles: Angle[]
}

const COMPETITORS: Competitor[] = [
  {
    id: 1, name: 'Olly', initials: 'OL',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.35.38 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(232,99,26,0.82) 0%, rgba(210,80,10,0.6) 100%)',
    tagline: 'Mass-market supplements · TikTok-heavy',
    activityLevel: 'High', activeAds: 31, activeAngles: 7, adsLast30: 62, productsActive: 12,
    topProduct: { name: 'Goodbye Stress Gummies', ads: 19, spendShare: 42 },
    recentMoves: [
      { text: 'Launched 3 new UGC video ads · nighttime recovery angle', time: '3h ago', type: 'up' },
      { text: 'Creator collab campaign live · 8 new ads', time: '1d ago', type: 'up' },
    ],
    angles: [
      { name: 'Sleep-Anxiety Crossover', share: 28, longevity: 18, trend: '+12', trendPos: true, coverage: 'MISSING' },
      { name: 'Lifestyle & Wellness', share: 26, longevity: 14, trend: '+3', trendPos: true, coverage: 'YOU RUN IT' },
      { name: 'Performance & Recovery', share: 24, longevity: 10, trend: '-2', trendPos: false, coverage: 'YOU RUN IT' },
      { name: 'Price & Value', share: 22, longevity: 8, trend: '+1', trendPos: null, coverage: 'YOU RUN IT' },
    ],
  },
  {
    id: 2, name: 'Beam', initials: 'BM',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.34.39 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(20,22,48,0.85) 0%, rgba(30,40,80,0.65) 100%)',
    tagline: 'Science-backed sleep · Dream Powder',
    activityLevel: 'Medium', activeAds: 18, activeAngles: 4, adsLast30: 31, productsActive: 5,
    topProduct: { name: 'Dream Powder', ads: 11, spendShare: 61 },
    recentMoves: [
      { text: 'Launched 2 static ads · sleep-anxiety crossover', time: '1d ago', type: 'up' },
      { text: 'Paused 3 underperforming video ads', time: '3d ago', type: 'x' },
    ],
    angles: [
      { name: 'Sleep-Anxiety Crossover', share: 31, longevity: 28, trend: '+8', trendPos: true, coverage: 'MISSING' },
      { name: 'Science & Ingredients', share: 29, longevity: 22, trend: '+2', trendPos: true, coverage: 'MISSING' },
      { name: 'Performance & Recovery', share: 24, longevity: 11, trend: '-3', trendPos: false, coverage: 'YOU RUN IT' },
      { name: 'Price & Value', share: 16, longevity: 7, trend: '-5', trendPos: false, coverage: 'YOU RUN IT' },
    ],
  },
  {
    id: 3, name: 'Moon Juice', initials: 'MJ',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.38.42 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(100,60,110,0.82) 0%, rgba(140,90,140,0.6) 100%)',
    tagline: 'Adaptogen wellness · Magnesi-Om',
    activityLevel: 'Medium', activeAds: 14, activeAngles: 3, adsLast30: 24, productsActive: 6,
    topProduct: { name: 'Magnesi-Om', ads: 8, spendShare: 54 },
    recentMoves: [
      { text: 'Refreshed static creative · Magnesi-Om lifestyle angle', time: '2d ago', type: 'up' },
      { text: 'Founder feature launch · new UGC-style static', time: '4d ago', type: 'plus' },
    ],
    angles: [
      { name: 'Lifestyle & Wellness', share: 44, longevity: 26, trend: '+4', trendPos: true, coverage: 'YOU RUN IT' },
      { name: 'Science & Ingredients', share: 32, longevity: 19, trend: '+2', trendPos: true, coverage: 'MISSING' },
      { name: 'Sleep-Anxiety Crossover', share: 24, longevity: 11, trend: '+8', trendPos: true, coverage: 'MISSING' },
    ],
  },
  {
    id: 4, name: 'Ritual', initials: 'RT',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.39.26 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(80,100,80,0.82) 0%, rgba(110,130,100,0.6) 100%)',
    tagline: 'Transparent formulas · Magnesium+',
    activityLevel: 'Medium', activeAds: 12, activeAngles: 3, adsLast30: 18, productsActive: 4,
    topProduct: { name: 'Magnesium+', ads: 7, spendShare: 58 },
    recentMoves: [
      { text: 'Launched clean static product ads · transparency angle', time: '3d ago', type: 'up' },
      { text: 'New transparency-focused creative · ingredient callout', time: '5d ago', type: 'up' },
    ],
    angles: [
      { name: 'Science & Ingredients', share: 48, longevity: 32, trend: '+3', trendPos: true, coverage: 'MISSING' },
      { name: 'Clean Label', share: 34, longevity: 24, trend: '+1', trendPos: true, coverage: 'MISSING' },
      { name: 'Lifestyle & Wellness', share: 18, longevity: 9, trend: '-2', trendPos: false, coverage: 'YOU RUN IT' },
    ],
  },
  {
    id: 5, name: 'Pure Enc.', initials: 'PE',
    heroImg: '/uploads/Screenshot 2026-05-11 at 10.40.07 PM.png',
    heroGrad: 'linear-gradient(90deg, rgba(10,50,140,0.85) 0%, rgba(20,80,180,0.6) 100%)',
    tagline: 'Practitioner-grade · Magnesium Glycinate',
    activityLevel: 'Low', activeAds: 9, activeAngles: 2, adsLast30: 14, productsActive: 4,
    topProduct: { name: 'Magnesium Glycinate', ads: 5, spendShare: 54 },
    recentMoves: [
      { text: 'Clinical messaging refresh · practitioner focus', time: '2d ago', type: 'up' },
      { text: 'Mag Glycinate Chelated relisted with new creative', time: '5d ago', type: 'plus' },
    ],
    angles: [
      { name: 'Science & Ingredients', share: 52, longevity: 41, trend: '+4', trendPos: true, coverage: 'MISSING' },
      { name: 'Clean Label', share: 31, longevity: 28, trend: '+2', trendPos: true, coverage: 'MISSING' },
      { name: 'Performance & Recovery', share: 17, longevity: 8, trend: '-6', trendPos: false, coverage: 'YOU RUN IT' },
    ],
  },
]

type ShareSeries = { name: string; shade: string; values: number[]; lastPeriod: string }
const SHARE_SERIES: ShareSeries[] = [
  { name: 'Olly', shade: '#1a3d26', values: [25, 28, 31, 33, 30], lastPeriod: '25%' },
  { name: 'Beam', shade: '#2d5c3a', values: [22, 21, 22, 23, 22], lastPeriod: '22%' },
  { name: 'Moon Juice', shade: '#3e7a4f', values: [20, 20, 19, 18, 19], lastPeriod: '20%' },
  { name: 'Ritual', shade: '#5a9e6a', values: [18, 17, 16, 15, 16], lastPeriod: '18%' },
  { name: 'Pure Enc.', shade: '#85be90', values: [15, 14, 12, 11, 13], lastPeriod: '15%' },
]

// ─── Profile-page product data (shared across all competitors for demo) ──────

type ProductPick = {
  id: string
  name: string
  img: string
  imgBg: string
  competesWith?: string
  activeAds: number
  spendPct: string
  angles: number
}

const COMPETING_PRODUCTS: ProductPick[] = [
  { id: 'goodbye-stress', name: 'Goodbye Stress Gummies', img: '/uploads/Screenshot 2026-05-13 at 10.48.22 AM.png', imgBg: '#5fb8c4', competesWith: 'Magnesium Glycinate Complex', activeAds: 19, spendPct: '42%', angles: 4 },
  { id: 'sleep-gummies', name: 'Sleep Gummies', img: '/uploads/Screenshot 2026-05-13 at 10.48.48 AM.png', imgBg: '#7c5cbf', competesWith: 'ZzzPlex Sleep Support', activeAds: 14, spendPct: '31%', angles: 3 },
]

const TOP_PRODUCTS: ProductPick[] = [
  { id: 'pms-care', name: 'PMS Care Gummies', img: '/uploads/Screenshot 2026-05-13 at 10.49.59 AM.png', imgBg: '#d4547a', activeAds: 9, spendPct: '16%', angles: 2 },
  { id: 'probiotic', name: 'Big 10 Probiotic', img: '/uploads/Screenshot 2026-05-13 at 10.50.43 AM.png', imgBg: '#6ab87a', activeAds: 5, spendPct: '7%', angles: 2 },
  { id: 'energy-focus', name: 'Extra Strength Daily Energy', img: '/uploads/Screenshot 2026-05-13 at 10.51.27 AM.png', imgBg: '#e8b84b', activeAds: 4, spendPct: '4%', angles: 1 },
]

// ─── Atoms ───────────────────────────────────────────────────────────────────

function ArrowR() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" />
    </svg>
  )
}

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

// ─── Share of activity chart ─────────────────────────────────────────────────

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
    comp.activityLevel === 'High' ? 'text-brand' : comp.activityLevel === 'Medium' ? 'text-warn' : 'text-dim'

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
            <ArrowR />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Watchlist view ──────────────────────────────────────────────────────────

function WatchlistView({ onOpen }: { onOpen: (c: Competitor) => void }) {
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
          <CompetitorCard key={comp.id} comp={comp} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}

// ─── Profile: shared atoms ───────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-ink mb-3">{children}</div>
  )
}

function ProductPickerCard({ product, showCompetes, onSelect }: {
  product: ProductPick
  showCompetes: boolean
  onSelect: (p: ProductPick) => void
}) {
  return (
    <div
      onClick={() => onSelect(product)}
      className="flex items-stretch rounded-lg overflow-hidden cursor-pointer bg-surf shadow-lift transition-shadow hover:shadow-card-hover"
    >
      <div className="w-20 shrink-0 relative overflow-hidden" style={{ background: product.imgBg }}>
        <img src={product.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
      </div>
      <div className="flex-1 px-3.5 py-3 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[14px] font-medium text-ink mb-1">{product.name}</div>
            <div className="min-h-[20px]">
              {showCompetes && product.competesWith && (
                <span className="text-[10px] text-brand bg-brand-bg px-[7px] py-px rounded-[3px] font-semibold">
                  vs {product.competesWith}
                </span>
              )}
            </div>
          </div>
          <div className="text-dim flex shrink-0 mt-0.5">
            <ArrowR />
          </div>
        </div>
        <div className="flex gap-5">
          {[
            { label: 'ADS', val: String(product.activeAds) },
            { label: 'SPEND', val: product.spendPct },
            { label: 'ANGLES', val: String(product.angles) },
          ].map(m => (
            <div key={m.label}>
              <div className="text-[9px] font-semibold tracking-[0.05em] uppercase text-dim mb-0.5">{m.label}</div>
              <div className="text-[14px] font-medium text-ink font-mono">{m.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Comparison tab ──────────────────────────────────────────────────────────

const COMP_PRODUCTS = ['Sleep Gummies', 'Goodbye Stress Gummies', 'PMS Care Gummies']
const YOUR_PRODUCTS = ['ZzzPlex Sleep Support', 'Magnesium Glycinate Complex', 'ASHWAGANDHA+']

type CompareAngle = { name: string; state: 'GAP' | 'BOTH RUN' | 'YOUR EDGE'; compPct: number; yourPct: number }
const COMPARE_ANGLES: CompareAngle[] = [
  { name: 'Sleep-Anxiety Crossover', state: 'GAP', compPct: 28, yourPct: 0 },
  { name: 'Lifestyle & Wellness', state: 'BOTH RUN', compPct: 26, yourPct: 18 },
  { name: 'Performance & Recovery', state: 'BOTH RUN', compPct: 24, yourPct: 42 },
  { name: 'Clinical Dosage / Science', state: 'YOUR EDGE', compPct: 0, yourPct: 40 },
]

function MetricTile({ label, compVal, yourVal, compName }: { label: string; compVal: string; yourVal: string; compName: string }) {
  return (
    <div className="flex-1 bg-surf rounded-lg shadow-lift px-3.5 py-3">
      <div className="text-[9px] font-semibold tracking-[0.05em] uppercase text-dim mb-2.5">{label}</div>
      <div className="flex items-end gap-2.5">
        <div className="text-center">
          <div className="text-[18px] font-medium text-ink font-mono tracking-[-0.03em] leading-none mb-[3px]">{compVal}</div>
          <div className="text-[10px] text-dim">{compName}</div>
        </div>
        <div className="text-[11px] text-dim pb-3.5">vs</div>
        <div className="text-center">
          <div className="text-[18px] font-medium text-ink font-mono tracking-[-0.03em] leading-none mb-[3px]">{yourVal}</div>
          <div className="text-[10px] text-dim">You</div>
        </div>
      </div>
    </div>
  )
}

function AnglePill({ state }: { state: CompareAngle['state'] }) {
  const cls =
    state === 'GAP'
      ? 'bg-danger-bg text-[#991b1b]'
      : state === 'BOTH RUN'
      ? 'bg-brand-bg text-brand'
      : 'bg-info-bg text-[#1e40af]'
  return (
    <span className={`text-[9px] font-semibold tracking-[0.04em] uppercase px-[7px] py-[2px] rounded whitespace-nowrap shrink-0 ${cls}`}>
      {state}
    </span>
  )
}

function ShareBar({ pct }: { pct: number }) {
  return (
    <div className="flex-1 h-[5px] bg-brand/10 rounded-[3px] overflow-hidden">
      <div className="h-full bg-brand rounded-[3px]" style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  )
}

function FormatBar({ ugc, stat, vid, label }: { ugc: number; stat: number; vid: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] text-mid min-w-[30px] shrink-0">{label}</span>
      <div className="flex-1 flex h-[14px] rounded-[3px] overflow-hidden gap-px">
        <div style={{ flex: ugc, background: '#1a3d26' }} className="flex items-center justify-center">
          <span className="text-[9px] font-semibold text-white">{ugc}%</span>
        </div>
        <div style={{ flex: stat, background: '#2d5c3a' }} className="flex items-center justify-center">
          <span className="text-[9px] font-semibold text-white">{stat}%</span>
        </div>
        <div style={{ flex: vid, background: '#85be90' }} className="flex items-center justify-center">
          <span className="text-[9px] font-semibold text-brand">{vid}%</span>
        </div>
      </div>
    </div>
  )
}

function ComparisonTab({ comp }: { comp: Competitor }) {
  const [mode, setMode] = useState<'product' | 'brand'>('product')
  const [compProduct, setCompProduct] = useState('Sleep Gummies')
  const [yourProduct, setYourProduct] = useState('ZzzPlex Sleep Support')

  const fundamentals = [
    { l: 'Price per serving', c: '$0.47', y: '$0.47' },
    { l: 'Format', c: 'Gummy', y: 'Capsule' },
    { l: 'Primary active', c: '3mg melatonin', y: '400mg Mg glycinate', yBold: true },
    { l: 'Certifications', c: 'NSF, Vegan', y: 'NSF, USP, GMP, Vegan', yBold: true },
    { l: 'Distribution', c: 'Retail + DTC', y: 'DTC only' },
    { l: 'Subscribe discount', c: '15%', y: '10%' },
  ]

  const pdpCards = [
    {
      label: `${comp.name.toUpperCase()} ${compProduct.toUpperCase()}`,
      rows: [
        { l: 'Hero claim', v: '"Restful sleep for a brighter tomorrow"' },
        { l: 'Buyer language', v: 'Stress relief, calm, mood balance, gentle' },
        { l: 'Tone', v: 'Playful, accessible, mass-market wellness' },
      ],
    },
    {
      label: `YOUR ${yourProduct.toUpperCase()}`,
      rows: [
        { l: 'Hero claim', v: '"Clinical magnesium glycinate for deep, restorative sleep"' },
        { l: 'Buyer language', v: 'Clinical, evidence-based, glycinate form, dosage' },
        { l: 'Tone', v: 'Clinical, evidence-led, science-forward' },
      ],
    },
  ]

  const nextMoves: { n: number; text: ReactNode }[] = [
    { n: 1, text: <>Generate PDP variant and creative for <strong className="font-semibold">Sleep-Anxiety Crossover angle</strong>. Currently a complete gap; {comp.name} is validating it heavily.</> },
    { n: 2, text: <>Increase UGC creative production to ~2/week minimum. You're undersupplying UGC (30% vs {comp.name}'s <strong className="font-semibold">60%</strong>) and overweight on static.</> },
    { n: 3, text: <>Defend your <strong className="font-semibold">Clinical Dosage moat</strong>. {comp.name} doesn't compete here. Push this further in PDP and creative.</> },
  ]

  return (
    <div className="font-sans flex flex-col gap-7">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-[12px] text-dim">Compare</span>
        <div className="flex bg-surf-2 rounded-md p-0.5 gap-px">
          {(['product', 'brand'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-[12px] px-3 py-1 border-0 rounded-[5px] cursor-pointer transition-all ${
                mode === m
                  ? 'bg-brand text-white font-medium shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'bg-transparent text-dim font-normal'
              }`}
            >
              {m === 'product' ? 'Product vs Product' : 'Brand vs Brand'}
            </button>
          ))}
        </div>
        {mode === 'product' && (
          <>
            <span className="text-[11px] text-dim">{comp.name}</span>
            <select
              value={compProduct}
              onChange={e => setCompProduct(e.target.value)}
              className="text-[12px] text-ink border-[0.5px] border-line rounded-md px-2.5 py-1 bg-surf cursor-pointer outline-none"
            >
              {COMP_PRODUCTS.map(p => <option key={p}>{p}</option>)}
            </select>
            <span className="text-[11px] text-dim">You</span>
            <select
              value={yourProduct}
              onChange={e => setYourProduct(e.target.value)}
              className="text-[12px] text-ink border-[0.5px] border-line rounded-md px-2.5 py-1 bg-surf cursor-pointer outline-none"
            >
              {YOUR_PRODUCTS.map(p => <option key={p}>{p}</option>)}
            </select>
          </>
        )}
        {mode === 'brand' && (
          <span className="text-[12px] text-mid">{comp.name} vs Your brand</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: comp.name.toUpperCase(), name: compProduct, detail: '$14 · 60 gummies · 3mg melatonin', img: '/uploads/Screenshot 2026-05-13 at 10.48.48 AM.png', bg: '#7c5cbf' },
          { label: 'YOUR PRODUCT', name: yourProduct, detail: '$28 · 60 capsules · 400mg magnesium', img: '/uploads/IMG_3474.jpg', bg: '#2563eb' },
        ].map((p, i) => (
          <div key={i} className="bg-surf rounded-lg shadow-lift px-4 py-3.5 flex items-center gap-3">
            <div className="w-[52px] h-[52px] rounded-[7px] overflow-hidden shrink-0" style={{ background: p.bg }}>
              <img src={p.img} alt="" className="w-full h-full object-cover opacity-80" />
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-[0.05em] uppercase text-dim mb-1">{p.label}</div>
              <div className="text-[14px] font-medium text-ink mb-[3px]">{p.name}</div>
              <div className="text-[11px] text-dim">{p.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-bg border border-brand-dim rounded-lg px-4 py-3.5">
        <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-brand mb-2">Nanalyt's Read</div>
        <div className="text-[13px] text-ink leading-[1.55]">
          {comp.name} outspends you 2.8× on {compProduct} and dominates the <strong className="font-semibold">sleep-anxiety crossover angle</strong>, which you don't currently address. Your product wins on dosage (400mg vs 3mg) and clinical positioning, but {comp.name} captures the broader emotional audience through UGC at scale.
        </div>
      </div>

      <div>
        <SectionLabel>Product Fundamentals</SectionLabel>
        <div className="bg-surf rounded-lg shadow-lift overflow-hidden">
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] bg-brand px-4 py-2">
            <div />
            {[
              mode === 'product' ? compProduct.toUpperCase() : comp.name.toUpperCase(),
              mode === 'product' ? yourProduct.toUpperCase() : 'YOUR BRAND',
            ].map((h, i) => (
              <div key={i} className="text-[10px] font-semibold tracking-[0.04em] text-white/85">{h}</div>
            ))}
          </div>
          {fundamentals.map((row, i) => (
            <div key={i} className={`grid grid-cols-[1fr_1.2fr_1.2fr] px-4 py-2.5 items-center ${i > 0 ? 'border-t border-line-soft' : ''}`}>
              <span className="text-[12px] text-mid">{row.l}</span>
              <span className="text-[13px] text-ink">{row.c}</span>
              <span className={`text-[13px] text-ink ${row.yBold ? 'font-semibold' : ''}`}>{row.y}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Ad Strategy</SectionLabel>
        <div className="flex gap-2.5 mb-3">
          <MetricTile label="ACTIVE ADS" compVal="31" yourVal="6" compName={comp.name} />
          <MetricTile label="AVG AD LONGEVITY" compVal="14d" yourVal="21d" compName={comp.name} />
          <MetricTile label="CREATIVE REFRESH" compVal="2/wk" yourVal="0.5/wk" compName={comp.name} />
        </div>
        <div className="bg-surf rounded-lg shadow-lift px-4 py-3.5">
          <div className="text-[10px] font-semibold tracking-[0.05em] uppercase text-dim mb-3">Format Mix</div>
          <div className="flex flex-col gap-2.5">
            <FormatBar ugc={60} stat={28} vid={12} label={comp.name} />
            <FormatBar ugc={30} stat={55} vid={15} label="You" />
            <div className="flex gap-3.5 mt-1">
              {[{ c: '#1a3d26', l: 'UGC' }, { c: '#2d5c3a', l: 'Static' }, { c: '#85be90', l: 'Video' }].map(f => (
                <div key={f.l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm" style={{ background: f.c }} />
                  <span className="text-[10px] text-dim">{f.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Angle Coverage</SectionLabel>
        <div>
          {COMPARE_ANGLES.map((a, i) => (
            <div key={i} className={`py-3 ${i > 0 ? 'border-t border-line-soft' : ''}`}>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[13px] font-medium text-ink flex-1">{a.name}</span>
                <AnglePill state={a.state} />
                <span className="text-[12px] text-mid shrink-0">
                  {comp.name}: <strong className={a.yourPct > a.compPct ? 'text-dim' : 'text-ink'}>{a.compPct}%</strong>
                  {' · '}
                  You: <strong className={a.yourPct >= a.compPct ? 'text-ink' : a.yourPct === 0 ? 'text-dim' : 'text-ink'}>{a.yourPct}%</strong>
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {[{ l: comp.name, p: a.compPct }, { l: 'You', p: a.yourPct }].map((b, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-[10px] text-dim min-w-[40px]">{b.l}</span>
                    <ShareBar pct={b.p} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>PDP Positioning</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {pdpCards.map((card, i) => (
            <div key={i} className="bg-surf rounded-lg shadow-lift px-4 py-3.5">
              <div className="text-[10px] font-semibold tracking-[0.05em] uppercase text-dim mb-3">{card.label}</div>
              {card.rows.map((row, j) => (
                <div key={j} className={j < card.rows.length - 1 ? 'mb-2.5' : ''}>
                  <div className="text-[10px] font-semibold tracking-[0.04em] uppercase text-dim mb-[3px]">{row.l}</div>
                  <div className="text-[12px] text-ink leading-[1.5]">{row.v}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Performance Signals</SectionLabel>
        <div className="flex gap-2.5">
          <MetricTile label="REVIEW VELOCITY" compVal="142/wk" yourVal="38/wk" compName={comp.name} />
          <MetricTile label="AVG STAR RATING" compVal="4.3" yourVal="4.7" compName={comp.name} />
          <MetricTile label="SEARCH TREND 90D" compVal="▲ +24%" yourVal="▲ +8%" compName={comp.name} />
        </div>
      </div>

      <div>
        <SectionLabel>Recommended Next Moves</SectionLabel>
        <div className="flex flex-col gap-2.5">
          {nextMoves.map(item => (
            <div key={item.n} className="flex items-start gap-3.5 bg-surf rounded-lg shadow-lift px-4 py-3">
              <span className="text-[13px] font-medium text-brand min-w-[18px] shrink-0 pt-px">{item.n}</span>
              <span className="text-[13px] text-ink leading-[1.55] flex-1">{item.text}</span>
              <button className="text-[11px] text-mid bg-surf border-[0.5px] border-line rounded-md px-2.5 py-1 cursor-pointer shrink-0 transition-colors hover:bg-brand hover:text-white hover:border-brand">
                Generate →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Angle reads (rich content keyed by angle name) ──────────────────────────

type AngleRead = {
  perf: string
  coverageText: string
  pdpText: string
  rec: string
  positioning: string
  corePromise: string
}

const ANGLE_READS: Record<string, AngleRead> = {
  'Sleep-Anxiety Crossover': {
    perf: 'Strong — 34d median longevity, 34% of budget, growing trend',
    coverageText: '0 of your 6 active ads address this angle',
    pdpText: "Doesn't address this angle on Magnesium Glycinate Complex",
    rec: 'Generate PDP variant and creative against this angle. Validated by Olly, Beam, and Moon Juice.',
    positioning: 'Connects sleep quality with daytime anxiety reduction — buyers see the product as a tool for both nighttime rest and morning calm, not just a sleep aid.',
    corePromise: 'The angle that meets buyers where stress and sleep blur together.',
  },
  'Science & Ingredients': {
    perf: 'Strong — 22d median longevity, 29% of budget, stable trend',
    coverageText: '0 of your 6 active ads address this angle',
    pdpText: 'Not mentioned on Magnesium Glycinate Complex PDP',
    rec: 'Run a static creative addressing ingredient quality. Beam has held this angle for 22+ days.',
    positioning: 'Leads with formulation specifics, dosage, and clinical sourcing — appeals to buyers researching ingredients before purchase.',
    corePromise: 'The receipts behind the claim.',
  },
  'Performance & Recovery': {
    perf: 'Declining — 11d median longevity, 18% of budget, -4 pts in 30d',
    coverageText: '3 of your 6 active ads run this angle',
    pdpText: 'Addressed on Magnesium Glycinate Complex PDP',
    rec: "You're running this but it's declining for competitors. Consider refreshing creative before fatigue sets in.",
    positioning: 'Frames the product as a performance and recovery tool for active buyers — gym, training, athletic context.',
    corePromise: 'Recover smarter, perform tomorrow.',
  },
  'Lifestyle & Wellness': {
    perf: 'Stable — 14d median longevity, 26% of budget, flat trend',
    coverageText: '2 of your 6 active ads run this angle',
    pdpText: 'Lightly addressed on Magnesium Glycinate Complex PDP',
    rec: 'Stable angle for competitors. Your coverage is adequate — no immediate action needed.',
    positioning: 'Soft lifestyle storytelling — wellness rituals, morning routines, aspirational imagery rather than specific claims.',
    corePromise: 'A small ritual for a better life.',
  },
  'Price & Value': {
    perf: 'Declining — 7d median longevity, 15% of budget, -5 pts in 30d',
    coverageText: '1 of your 6 active ads runs this angle',
    pdpText: 'Addressed on Magnesium Glycinate Complex PDP',
    rec: 'Declining across all competitors — high saturation. Consider pulling spend from this angle.',
    positioning: 'Discount-led, cost-per-serving emphasis, subscribe-and-save messaging. Race-to-the-bottom dynamics.',
    corePromise: 'More for less.',
  },
  'Clean Label': {
    perf: 'Strong — 28d median longevity, 31% of budget, growing',
    coverageText: '0 of your 6 active ads address this angle',
    pdpText: 'Not addressed on Magnesium Glycinate Complex PDP',
    rec: 'Clean label resonates with your buyer. Generate a static creative emphasizing ingredient transparency.',
    positioning: 'Transparency-first messaging — no fillers, no artificial sweeteners, traceable sourcing. Appeals to ingredient-conscious buyers.',
    corePromise: 'Nothing you can\'t pronounce.',
  },
}

const EXAMPLE_ADS = [
  { format: 'STATIC', img: '/uploads/Screenshot 2026-05-13 at 10.15.26 PM.png', title: 'Next-day calm · Product lifestyle', sub: 'Static · 1:1', hasPlay: false },
  { format: 'UGC', img: '/uploads/IMG_3486.jpg', title: 'Sleep anxiety · Creator review', sub: 'UGC · 9:16', hasPlay: true },
  { format: 'VIDEO', img: '/uploads/IMG_3488.jpg', title: 'Ingredient story · Science angle', sub: 'Video · 9:16', hasPlay: true },
]

function ExampleAds() {
  return (
    <div className="flex gap-4">
      {EXAMPLE_ADS.map((ad, j) => (
        <div key={j} className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="aspect-[9/14] rounded-lg overflow-hidden relative bg-[#111]">
            <img src={ad.img} alt="" className="absolute inset-0 w-full h-full object-cover block" />
            <div className="absolute inset-0 bg-black/[0.18]" />
            <span className="absolute top-2.5 left-2.5 text-[9px] font-bold tracking-[0.05em] bg-black/55 text-white px-2 py-[3px] rounded-[3px]">
              {ad.format}
            </span>
            {ad.hasPlay && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-black/40 border-[1.5px] border-white/60 flex items-center justify-center">
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
                    <path d="M2 1l11 7L2 15V1z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="text-[12px] font-medium text-ink mb-px">{ad.title}</div>
            <div className="text-[10px] text-dim">{ad.sub} · 18d running</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Angle selector + angle detail views ─────────────────────────────────────

function ProfileHero({
  comp,
  onCompetitorsClick,
  onCompNameClick,
  showCompName,
}: {
  comp: Competitor
  onCompetitorsClick: () => void
  onCompNameClick?: () => void
  showCompName?: boolean
}) {
  return (
    <div className="relative h-[70px] overflow-hidden shrink-0">
      <img
        src={comp.heroImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 30%' }}
      />
      <div className="absolute inset-0" style={{ background: comp.heroGrad }} />
      <div className="absolute inset-0 px-6 flex items-center">
        <div>
          <div className="text-[10px] text-white/60 mb-[3px]">
            <button onClick={onCompetitorsClick} className="bg-transparent border-0 text-white/65 cursor-pointer text-[10px] p-0 hover:text-white">
              Competitors
            </button>
            <span className="mx-1 text-white/35">/</span>
            {showCompName && onCompNameClick ? (
              <button onClick={onCompNameClick} className="bg-transparent border-0 text-white/65 cursor-pointer text-[10px] p-0 hover:text-white">
                {comp.name}
              </button>
            ) : (
              <span className="text-white/90">{comp.name}</span>
            )}
          </div>
          <div className="text-[14px] font-medium text-white">{comp.name}</div>
        </div>
      </div>
    </div>
  )
}

function ProductContextStrip({
  product,
  onAllProducts,
  onSwitchProduct,
}: {
  product: ProductPick
  onAllProducts: () => void
  onSwitchProduct: () => void
}) {
  return (
    <div className="px-6 py-2.5 flex items-center gap-2.5 shrink-0">
      <button onClick={onAllProducts} className="text-[11px] text-mid bg-transparent border-0 cursor-pointer p-0 hover:text-ink">
        ← All products
      </button>
      <span className="text-line">·</span>
      <div className="w-6 h-6 rounded shrink-0 overflow-hidden" style={{ background: product.imgBg }}>
        <img src={product.img} alt="" className="w-full h-full object-cover opacity-85" />
      </div>
      <span className="text-[12px] font-medium text-ink">{product.name}</span>
      {product.competesWith && (
        <span className="text-[11px] text-dim">
          · vs <strong className="text-ink font-medium">{product.competesWith}</strong>
        </span>
      )}
      <button
        onClick={onSwitchProduct}
        className="ml-auto text-[11px] text-mid bg-transparent border-[0.5px] border-line rounded-md px-2.5 py-1 cursor-pointer hover:bg-line-soft"
      >
        Switch product
      </button>
    </div>
  )
}

function AngleSelectorView({
  comp,
  product,
  onBackToProfile,
  onBackToProducts,
  onSelectAngle,
}: {
  comp: Competitor
  product: ProductPick
  onBackToProfile: () => void
  onBackToProducts: () => void
  onSelectAngle: (a: Angle) => void
}) {
  return (
    <div className="flex flex-col h-full font-sans">
      <ProfileHero comp={comp} onCompetitorsClick={onBackToProfile} />
      <ProductContextStrip product={product} onAllProducts={onBackToProducts} onSwitchProduct={onBackToProducts} />
      <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5">
        <div className="text-[15px] font-medium text-ink mb-1">Choose an angle to analyze</div>
        <div className="text-[12px] text-mid mb-5">Select an angle to see how {comp.name} is using it and what it means for your ads.</div>
        <div className="flex flex-col gap-2">
          {comp.angles.map((angle, i) => (
            <div
              key={i}
              onClick={() => onSelectAngle(angle)}
              className="flex items-center gap-3.5 px-4 py-3.5 bg-surf rounded-lg shadow-lift cursor-pointer transition-shadow hover:shadow-card-hover"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-ink mb-1">{angle.name}</div>
                <div className="flex gap-4">
                  <span className="text-[11px] text-mid">
                    <strong className="text-ink">{angle.share}%</strong> share
                  </span>
                  <span className="text-[11px] text-mid">
                    <strong className="text-ink">{angle.longevity}d</strong> avg
                  </span>
                  <span className={`text-[11px] font-semibold ${angle.trendPos ? 'text-brand' : 'text-danger'}`}>
                    {angle.trendPos ? '▲' : '▼'} {angle.trend}
                  </span>
                </div>
              </div>
              <span
                className={`text-[9px] font-bold tracking-[0.05em] uppercase px-2 py-[3px] rounded-[3px] shrink-0 ${
                  angle.coverage === 'MISSING' ? 'bg-alert-bg text-alert' : 'bg-brand-bg text-brand'
                }`}
              >
                {angle.coverage === 'MISSING' ? 'Missing' : 'You run it'}
              </span>
              <span className="text-dim shrink-0">
                <ArrowR />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AngleDetailView({
  comp,
  product,
  angle,
  onBackToProfile,
  onBackToProducts,
  onSelectAngle,
}: {
  comp: Competitor
  product: ProductPick
  angle: Angle
  onBackToProfile: () => void
  onBackToProducts: () => void
  onSelectAngle: (a: Angle) => void
}) {
  const isMissing = angle.coverage === 'MISSING'
  const read = ANGLE_READS[angle.name]

  return (
    <div className="flex flex-col h-full font-sans">
      <ProfileHero
        comp={comp}
        onCompetitorsClick={onBackToProfile}
        onCompNameClick={onBackToProducts}
        showCompName
      />
      <ProductContextStrip product={product} onAllProducts={onBackToProducts} onSwitchProduct={onBackToProducts} />

      <div className="flex-1 grid grid-cols-[190px_1fr] overflow-hidden min-h-0">
        <div className="border-r-[0.5px] border-line px-2.5 py-3.5 flex flex-col gap-0.5 overflow-y-auto">
          <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-dim mb-2 pl-1.5">Angles</div>
          {comp.angles.map((an, i) => {
            const isSelected = an.name === angle.name
            return (
              <button
                key={i}
                onClick={() => onSelectAngle(an)}
                className={`w-full text-left px-2.5 py-2 rounded-md border-0 cursor-pointer transition-colors ${
                  isSelected ? 'bg-surf-2' : 'bg-transparent hover:bg-surf-2'
                }`}
              >
                <div className={`text-[12px] mb-1 leading-[1.3] ${isSelected ? 'font-medium text-ink' : 'font-normal text-mid'}`}>
                  {an.name}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold tracking-[0.04em] uppercase px-1.5 py-px rounded-[3px] ${
                    an.coverage === 'MISSING' ? 'bg-alert-bg text-alert' : 'bg-brand-bg text-brand'
                  }`}>
                    {an.coverage === 'MISSING' ? 'Missing' : 'You run it'}
                  </span>
                  <span className={`text-[10px] font-semibold font-mono ${an.trendPos ? 'text-brand' : 'text-danger'}`}>
                    {an.trendPos ? '+' : ''}{an.trend}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="overflow-y-auto px-8 py-7">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-dim mb-1.5">Angle</div>
              <div className="text-[20px] font-medium text-ink tracking-[-0.02em] leading-[1.15] max-w-[300px]">{angle.name}</div>
            </div>
            <span
              className={`text-[9px] font-bold tracking-[0.05em] uppercase px-2.5 py-1 rounded shrink-0 mt-1 ${
                isMissing ? 'bg-alert-bg text-alert' : 'bg-brand-bg text-brand'
              }`}
            >
              {isMissing ? 'Missing from your ads' : 'You also run this'}
            </span>
          </div>

          <div className="flex gap-0 mb-8">
            {[
              { l: 'Share of budget', v: `${angle.share}%`, sub: 'of their creative spend' },
              { l: 'Avg longevity', v: `${angle.longevity}d`, sub: 'median days running' },
              { l: '30d momentum', v: (angle.trendPos ? '+' : '') + angle.trend, sub: 'share point change', positive: angle.trendPos },
            ].map((m, i) => (
              <div key={i} className={`flex-1 ${i < 2 ? 'pr-6 mr-6 border-r-[0.5px] border-line' : ''}`}>
                <div className="text-[10px] font-medium tracking-[0.04em] uppercase text-dim mb-1.5">{m.l}</div>
                <div
                  className={`text-[26px] font-medium font-mono tracking-[-0.04em] leading-none mb-1 ${
                    m.positive === false ? 'text-danger' : m.positive === true ? 'text-brand' : 'text-ink'
                  }`}
                >
                  {m.v}
                </div>
                <div className="text-[11px] text-dim">{m.sub}</div>
              </div>
            ))}
          </div>

          <div className="mb-7">
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-ink mb-3">What this angle is</div>
            <div className="text-[14px] italic text-ink leading-[1.65] mb-3 tracking-[-0.01em]">
              "{read?.corePromise || 'A positioning angle their buyers are responding to.'}"
            </div>
            <div className="text-[13px] text-mid leading-[1.7]">
              {read?.positioning || 'This angle connects with buyers at a key moment in their decision process. Competitors are validating it with sustained spend.'}
            </div>
          </div>

          <div className="mb-7">
            <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-dim mb-3.5">What it means for you</div>
            {[
              { l: 'Their performance', v: read?.perf || 'Strong — sustained spend, growing share, above-average longevity.' },
              { l: 'Your coverage', v: read?.coverageText || '0 of your active ads address this angle.' },
              { l: 'PDP support', v: read?.pdpText || 'Not addressed on your current product page.' },
              { l: 'Recommendation', v: read?.rec || 'Generate creative and a PDP variant to test this angle.' },
            ].map((row, j) => (
              <div key={j} className="grid grid-cols-[120px_1fr] gap-4 pt-2.5">
                <span className="text-[10px] font-semibold tracking-[0.05em] uppercase text-dim pt-0.5">{row.l}</span>
                <span className="text-[13px] text-ink leading-[1.65]">{row.v}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-7">
            {['Generate PDP →', 'Generate creative →'].map(btn => (
              <button
                key={btn}
                className="text-[12px] text-mid bg-transparent border-[0.5px] border-line rounded-md px-4 py-1.5 cursor-pointer transition-colors hover:bg-brand hover:text-white hover:border-brand"
              >
                {btn}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-dim mb-3.5">Example ads in this angle</div>
          <ExampleAds />
        </div>
      </div>
    </div>
  )
}

// ─── Profile page ────────────────────────────────────────────────────────────

function ProfilePage({ comp, onBack }: { comp: Competitor; onBack: () => void }) {
  const [subTab, setSubTab] = useState<'Creatives & Angles' | 'Comparison'>('Creatives & Angles')
  const [selectedProduct, setSelectedProduct] = useState<ProductPick | null>(null)
  const [selectedAngle, setSelectedAngle] = useState<Angle | null>(null)
  const SUB_TABS: typeof subTab[] = ['Creatives & Angles', 'Comparison']

  if (selectedProduct && selectedAngle) {
    return (
      <AngleDetailView
        comp={comp}
        product={selectedProduct}
        angle={selectedAngle}
        onBackToProfile={() => {
          setSelectedProduct(null)
          setSelectedAngle(null)
          onBack()
        }}
        onBackToProducts={() => {
          setSelectedProduct(null)
          setSelectedAngle(null)
        }}
        onSelectAngle={setSelectedAngle}
      />
    )
  }

  if (selectedProduct) {
    return (
      <AngleSelectorView
        comp={comp}
        product={selectedProduct}
        onBackToProfile={() => {
          setSelectedProduct(null)
          onBack()
        }}
        onBackToProducts={() => setSelectedProduct(null)}
        onSelectAngle={setSelectedAngle}
      />
    )
  }

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="relative h-[70px] overflow-hidden shrink-0">
        <img src={comp.heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
        <div className="absolute inset-0" style={{ background: comp.heroGrad }} />
        <div className="absolute inset-0 px-6 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-white/60 mb-1">
              <button onClick={onBack} className="bg-transparent border-0 text-white/65 cursor-pointer text-[11px] p-0 hover:text-white">
                Competitors
              </button>
              <span className="mx-1.5 text-white/35">/</span>
              <span className="text-white/90">{comp.name}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[7px] bg-white/95 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-ink">{comp.initials}</span>
              </div>
              <div>
                <div className="text-base font-semibold text-white tracking-[-0.01em]">{comp.name}</div>
                <div className="text-[11px] text-white/80 mt-px">{comp.tagline}</div>
              </div>
            </div>
          </div>
          <button className="text-[11px] text-white/90 bg-transparent border border-white/35 rounded-md px-3 py-1 cursor-pointer hover:bg-white/10">
            Pause monitoring
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-6 py-3.5 flex gap-0">
          {[
            { label: 'ACTIVE CREATIVES', value: String(comp.activeAds), small: false },
            { label: 'ADS LAST 30D', value: String(comp.adsLast30), small: false },
            { label: 'PRODUCTS ACTIVE', value: String(comp.productsActive), small: false },
            { label: 'ACTIVITY LEVEL', value: comp.activityLevel, small: true },
          ].map((kpi, i) => (
            <div key={i} className={`flex-1 ${i < 3 ? 'border-r-[0.5px] border-line' : ''} ${i < 3 ? 'pr-4 mr-4' : ''}`}>
              <div className="text-[9px] font-semibold tracking-[0.05em] uppercase text-dim mb-1">{kpi.label}</div>
              <div className={`font-medium text-ink ${kpi.small ? 'text-[15px]' : 'text-[20px]'}`}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="px-6 pt-3 pb-4">
          <div className="inline-flex bg-surf-2 rounded-[7px] p-[3px] gap-0.5">
            {SUB_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-3.5 py-1 border-0 rounded-[5px] text-[12px] cursor-pointer transition-all ${
                  subTab === tab
                    ? 'bg-brand text-white font-medium shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                    : 'bg-transparent text-dim font-normal'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-12">
          {subTab === 'Creatives & Angles' && (
            <div>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-base font-medium text-ink tracking-[-0.01em] mb-1">Choose a product to analyze</div>
                  <div className="text-[12px] text-mid">See how {comp.name} is marketing their key products.</div>
                </div>
                <button className="text-[11px] text-white bg-brand border-0 rounded-md px-3 py-1.5 cursor-pointer whitespace-nowrap mt-0.5 hover:opacity-90">
                  + Add competing product
                </button>
              </div>

              <div className="mb-6">
                <div className="text-[11px] font-medium tracking-[0.04em] uppercase text-dim mb-2.5">Competing Products</div>
                <div className="flex flex-col gap-2.5">
                  {COMPETING_PRODUCTS.map(p => <ProductPickerCard key={p.id} product={p} showCompetes onSelect={setSelectedProduct} />)}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-medium tracking-[0.04em] uppercase text-dim mb-2.5">Top Products</div>
                <div className="flex flex-col gap-2.5">
                  {TOP_PRODUCTS.map(p => <ProductPickerCard key={p.id} product={p} showCompetes={false} onSelect={setSelectedProduct} />)}
                </div>
              </div>
            </div>
          )}
          {subTab === 'Comparison' && <ComparisonTab comp={comp} />}
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

function Competitors() {
  const [selected, setSelected] = useState<Competitor | null>(null)

  if (selected) {
    return <ProfilePage comp={selected} onBack={() => setSelected(null)} />
  }
  return <WatchlistView onOpen={setSelected} />
}

export default Competitors
