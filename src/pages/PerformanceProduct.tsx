import { useNavigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'

// ─── Types & data ────────────────────────────────────────────────────────────

type ActiveVerdict = 'performing' | 'stable' | 'watch'
type PipelineVerdict = 'validated' | 'testing' | 'wind-down' | 'killed'
type RowVerdict = 'scaling' | 'stable' | 'watch' | 'wind-down'
type Format = 'UGC' | 'STATIC' | 'VIDEO' | 'PDP'

type CreativeRow = {
  id: string
  format: Format
  gradient: string
  name: string
  angle: string
  daysLive: string
  spend: string
  roas: string
  cvr: string
  ctr: string
  verdict: RowVerdict
  winner?: boolean
}

type ProductDetail = {
  slug: string
  name: string
  kind: 'active' | 'pipeline'
  img?: string
  gradient?: string
  subline: string
  spend: string
  roas: string
  cvr: string
  activeVerdict?: ActiveVerdict
  pipelineVerdict?: PipelineVerdict
  vsAvg?: { label: string; delta: string; sign: 'pos' | 'neg' | 'flat' }
  bars: number[]
  roasLine: number[]
  creatives: CreativeRow[]
}

const DATES = ['Apr 19', 'Apr 26', 'May 3', 'May 10', 'May 17']
const DATE_RANGE = 'Apr 19 – May 19'

const MAG_CREATIVES: CreativeRow[] = [
  {
    id: 'm1',
    format: 'UGC',
    gradient: 'from-[#fecdd3] to-[#fb7185]',
    name: "Couldn't shut my brain off",
    angle: 'Sleep-Anxiety Crossover · UGC',
    daysLive: '22d',
    spend: '$6.2k',
    roas: '5.4×',
    cvr: '3.2%',
    ctr: '1.8%',
    verdict: 'scaling',
    winner: true,
  },
  {
    id: 'm2',
    format: 'STATIC',
    gradient: 'from-[#fde68a] to-[#f59e0b]',
    name: 'Lifestyle composition',
    angle: 'Lifestyle & Wellness · Static',
    daysLive: '18d',
    spend: '$3.4k',
    roas: '3.6×',
    cvr: '2.4%',
    ctr: '1.2%',
    verdict: 'stable',
  },
  {
    id: 'm3',
    format: 'VIDEO',
    gradient: 'from-[#c4b5fd] to-[#8b5cf6]',
    name: 'Tried everything for sleep',
    angle: 'Sleep-Anxiety Crossover · Video',
    daysLive: '14d',
    spend: '$2.1k',
    roas: '2.8×',
    cvr: '1.9%',
    ctr: '0.9%',
    verdict: 'watch',
  },
  {
    id: 'm4',
    format: 'PDP',
    gradient: 'from-[#dbeafe] to-[#bfdbfe]',
    name: 'Next-day calm landing page',
    angle: 'v1 · Sleep-Anxiety Crossover · PDP',
    daysLive: '32d',
    spend: '—',
    roas: '—',
    cvr: '2.4%',
    ctr: '—',
    verdict: 'scaling',
  },
]

const PRODUCTS: ProductDetail[] = [
  {
    slug: 'magnesium-glycinate-complex',
    name: 'Magnesium Glycinate Complex',
    kind: 'active',
    img: '/uploads/IMG_3472.jpg',
    subline: 'In market · 1 PDP · 3 ads · last 30 days',
    spend: '$12.4k',
    roas: '4.1×',
    cvr: '2.8%',
    activeVerdict: 'performing',
    bars: [32, 38, 45, 52, 48, 58, 64, 60, 72, 78, 85, 80, 92, 98, 105, 112, 108, 118, 124, 130, 128, 138],
    roasLine: [3.0, 2.9, 3.1, 3.2, 3.3, 3.4, 3.5, 3.5, 3.7, 3.8, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.7, 4.9, 5.0, 5.2, 5.4, 5.5],
    creatives: MAG_CREATIVES,
  },
  {
    slug: 'zzzplex-sleep-support',
    name: 'ZzzPlex Sleep Support',
    kind: 'active',
    img: '/uploads/IMG_3474.jpg',
    subline: 'In market · 1 PDP · 2 ads · last 30 days',
    spend: '$8.6k',
    roas: '3.4×',
    cvr: '2.1%',
    activeVerdict: 'stable',
    bars: [55, 58, 62, 60, 65, 68, 72, 75, 78, 76, 82, 80, 85, 88, 84, 90, 92, 89, 94, 96, 92, 98],
    roasLine: [3.2, 3.1, 3.3, 3.4, 3.5, 3.4, 3.5, 3.3, 3.4, 3.5, 3.6, 3.5, 3.4, 3.5, 3.4, 3.5, 3.4, 3.5, 3.4, 3.4, 3.5, 3.4],
    creatives: [
      {
        id: 'z1', format: 'STATIC', gradient: 'from-[#dbeafe] to-[#1e3a8a]',
        name: 'Restful nights, sharper mornings', angle: 'Sleep quality · Static',
        daysLive: '21d', spend: '$5.1k', roas: '3.6×', cvr: '2.3%', ctr: '1.4%',
        verdict: 'stable',
      },
      {
        id: 'z2', format: 'UGC', gradient: 'from-[#bfdbfe] to-[#3b82f6]',
        name: 'Creator review walkthrough', angle: 'Sleep quality · UGC',
        daysLive: '16d', spend: '$3.5k', roas: '3.2×', cvr: '1.9%', ctr: '1.1%',
        verdict: 'stable',
      },
      {
        id: 'z3', format: 'PDP', gradient: 'from-[#e0e7ff] to-[#a5b4fc]',
        name: 'Sleep quality landing page', angle: 'v1 · Sleep quality · PDP',
        daysLive: '28d', spend: '—', roas: '—', cvr: '2.1%', ctr: '—',
        verdict: 'stable',
      },
    ],
  },
  {
    slug: 'ashwagandha-plus',
    name: 'ASHWAGANDHA+',
    kind: 'active',
    img: '/uploads/IMG_3476.jpg',
    subline: 'In market · No PDP · 1 ad · last 30 days',
    spend: '$3.6k',
    roas: '2.1×',
    cvr: '1.4%',
    activeVerdict: 'watch',
    bars: [42, 46, 48, 52, 50, 54, 56, 52, 58, 54, 56, 50, 48, 52, 54, 50, 48, 52, 50, 46, 48, 44],
    roasLine: [2.8, 2.7, 2.6, 2.7, 2.6, 2.5, 2.4, 2.5, 2.4, 2.3, 2.4, 2.3, 2.2, 2.3, 2.2, 2.1, 2.2, 2.1, 2.0, 2.1, 2.0, 2.1],
    creatives: [
      {
        id: 'a1', format: 'UGC', gradient: 'from-[#fde68a] to-[#d97706]',
        name: 'Stress-sleep angle test', angle: 'Stress-Sleep · UGC',
        daysLive: '12d', spend: '$3.6k', roas: '2.1×', cvr: '1.4%', ctr: '0.8%',
        verdict: 'watch',
      },
    ],
  },
  {
    slug: 'magnesium-ashwagandha-gummies',
    name: 'Magnesium + Ashwagandha Gummies',
    kind: 'pipeline',
    gradient: 'from-[#a7f3d0] to-[#34d399]',
    subline: 'Pipeline · 1 PDP · 4 ads · last 30 days',
    spend: '$4.2k',
    roas: '4.6×',
    cvr: '3.1%',
    pipelineVerdict: 'validated',
    vsAvg: { label: 'vs catalog avg ROAS', delta: '+21%', sign: 'pos' },
    bars: [22, 26, 32, 28, 36, 42, 38, 46, 52, 58, 54, 62, 68, 72, 78, 74, 82, 88, 92, 96, 98, 104],
    roasLine: [3.2, 3.4, 3.5, 3.6, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9],
    creatives: [
      {
        id: 'g1', format: 'UGC', gradient: 'from-[#a7f3d0] to-[#10b981]',
        name: 'Switched from pills to gummies', angle: 'Sleep-Anxiety Crossover · UGC',
        daysLive: '14d', spend: '$1.8k', roas: '5.1×', cvr: '3.4%', ctr: '1.9%',
        verdict: 'scaling', winner: true,
      },
      {
        id: 'g2', format: 'STATIC', gradient: 'from-[#fde68a] to-[#65a30d]',
        name: 'Flavor-forward composition', angle: 'Lifestyle · Static',
        daysLive: '10d', spend: '$0.9k', roas: '4.2×', cvr: '2.9%', ctr: '1.3%',
        verdict: 'scaling',
      },
      {
        id: 'g3', format: 'VIDEO', gradient: 'from-[#bbf7d0] to-[#16a34a]',
        name: 'Ingredient explainer', angle: 'Sleep-Anxiety Crossover · Video',
        daysLive: '8d', spend: '$0.7k', roas: '3.8×', cvr: '2.6%', ctr: '1.1%',
        verdict: 'stable',
      },
      {
        id: 'g4', format: 'PDP', gradient: 'from-[#d1fae5] to-[#6ee7b7]',
        name: 'Hero-led gummies PDP', angle: 'v1 · Sleep-Anxiety · PDP',
        daysLive: '18d', spend: '—', roas: '—', cvr: '3.1%', ctr: '—',
        verdict: 'scaling',
      },
    ],
  },
  {
    slug: 'sleep-stress-tincture',
    name: 'Sleep + Stress Tincture',
    kind: 'pipeline',
    gradient: 'from-[#c4b5fd] to-[#8b5cf6]',
    subline: 'Pipeline · 1 PDP · 3 ads · last 30 days',
    spend: '$2.1k',
    roas: '3.8×',
    cvr: '2.4%',
    pipelineVerdict: 'testing',
    vsAvg: { label: 'vs catalog avg ROAS', delta: 'even', sign: 'flat' },
    bars: [28, 32, 30, 34, 38, 36, 42, 40, 38, 44, 42, 46, 44, 48, 46, 50, 48, 52, 50, 54, 52, 56],
    roasLine: [3.6, 3.7, 3.8, 3.7, 3.8, 3.9, 3.8, 3.7, 3.8, 3.9, 3.8, 3.9, 3.8, 3.7, 3.8, 3.9, 3.8, 3.7, 3.8, 3.8, 3.9, 3.8],
    creatives: [
      {
        id: 't1', format: 'UGC', gradient: 'from-[#c4b5fd] to-[#7c3aed]',
        name: 'Tincture morning routine', angle: 'Sleep-Anxiety · UGC',
        daysLive: '11d', spend: '$0.9k', roas: '4.0×', cvr: '2.6%', ctr: '1.3%',
        verdict: 'stable',
      },
      {
        id: 't2', format: 'STATIC', gradient: 'from-[#ddd6fe] to-[#a78bfa]',
        name: 'Dropper still life', angle: 'Lifestyle · Static',
        daysLive: '9d', spend: '$0.7k', roas: '3.6×', cvr: '2.2%', ctr: '1.0%',
        verdict: 'stable',
      },
      {
        id: 't3', format: 'PDP', gradient: 'from-[#ede9fe] to-[#c4b5fd]',
        name: 'Story-led tincture PDP', angle: 'v1 · Sleep-Anxiety · PDP',
        daysLive: '14d', spend: '—', roas: '—', cvr: '2.4%', ctr: '—',
        verdict: 'stable',
      },
    ],
  },
  {
    slug: 'probiotic-calm-blend',
    name: 'Probiotic + Calm Blend',
    kind: 'pipeline',
    gradient: 'from-[#fecdd3] to-[#fb7185]',
    subline: 'Pipeline · 1 PDP · 2 ads · last 30 days',
    spend: '$0.9k',
    roas: '2.3×',
    cvr: '1.6%',
    pipelineVerdict: 'wind-down',
    vsAvg: { label: 'vs catalog avg ROAS', delta: '-40%', sign: 'neg' },
    bars: [38, 36, 40, 34, 38, 32, 36, 30, 32, 28, 30, 26, 28, 24, 26, 22, 24, 20, 22, 18, 20, 16],
    roasLine: [3.0, 2.9, 2.8, 2.9, 2.7, 2.6, 2.7, 2.6, 2.5, 2.4, 2.5, 2.4, 2.3, 2.2, 2.3, 2.2, 2.1, 2.2, 2.1, 2.2, 2.3, 2.3],
    creatives: [
      {
        id: 'p1', format: 'UGC', gradient: 'from-[#fecdd3] to-[#e11d48]',
        name: 'Gut-mind connection test', angle: 'Wellness · UGC',
        daysLive: '16d', spend: '$0.6k', roas: '2.5×', cvr: '1.8%', ctr: '0.9%',
        verdict: 'wind-down',
      },
      {
        id: 'p2', format: 'STATIC', gradient: 'from-[#fee2e2] to-[#fb7185]',
        name: 'Bottle hero shot', angle: 'Wellness · Static',
        daysLive: '12d', spend: '$0.3k', roas: '2.1×', cvr: '1.4%', ctr: '0.7%',
        verdict: 'watch',
      },
    ],
  },
]

// ─── Pills ───────────────────────────────────────────────────────────────────

function ActiveStatusPill({ v }: { v: ActiveVerdict }) {
  if (v === 'performing') {
    return (
      <span className="text-[11px] font-medium bg-brand-bg text-brand px-2.5 py-[3px] rounded-[12px] flex items-center gap-1">
        <span className="text-[9px] leading-none">▲</span>
        Performing
      </span>
    )
  }
  if (v === 'stable') {
    return <span className="text-[11px] font-medium bg-[#f0f1f3] text-ink px-2.5 py-[3px] rounded-[12px]">Stable</span>
  }
  return <span className="text-[11px] font-medium bg-[#fef3d7] text-[#92400e] px-2.5 py-[3px] rounded-[12px]">Watch</span>
}

function PipelineStatusPill({ v }: { v: PipelineVerdict }) {
  const cls = 'text-[11px] font-medium px-2.5 py-[3px] rounded-[12px] tracking-[0.03em]'
  if (v === 'validated') return <span className={`${cls} bg-brand-bg text-brand`}>VALIDATED</span>
  if (v === 'testing') return <span className={`${cls} bg-[#f0f1f3] text-ink`}>TESTING</span>
  if (v === 'wind-down') return <span className={`${cls} bg-[#fef3d7] text-[#92400e]`}>WIND DOWN</span>
  return <span className={`${cls} bg-[#fcebeb] text-[#791f1f]`}>KILLED</span>
}

function RowPill({ v }: { v: RowVerdict }) {
  const cls = 'text-[10px] font-medium px-2 py-[2px] rounded-[10px] tracking-[0.03em] inline-flex items-center gap-1'
  if (v === 'scaling') {
    return (
      <span className={`${cls} bg-brand-bg text-brand`}>
        <span className="text-[8px] leading-none">▲</span>
        SCALING
      </span>
    )
  }
  if (v === 'stable') return <span className={`${cls} bg-[#f0f1f3] text-ink`}>STABLE</span>
  if (v === 'watch') return <span className={`${cls} bg-[#fef3d7] text-[#92400e]`}>WATCH</span>
  return (
    <span className={`${cls} bg-[#fcebeb] text-[#791f1f]`}>
      <span className="text-[8px] leading-none">▼</span>
      WIND DOWN
    </span>
  )
}

// ─── Chart helpers ───────────────────────────────────────────────────────────

function smoothPath(vals: number[], W: number, H: number, mn: number, mx: number) {
  const rng = mx - mn || 1
  const norm = (v: number) => H - ((v - mn) / rng) * (H * 0.74) - H * 0.13
  const coords = vals.map((v, i) => ({ x: 14 + (i / (vals.length - 1)) * (W - 28), y: norm(v) }))
  let d = `M ${coords[0].x} ${coords[0].y}`
  for (let i = 1; i < coords.length; i++) {
    const p = coords[i - 1]
    const c = coords[i]
    d += ` C ${p.x + (c.x - p.x) / 3} ${p.y} ${c.x - (c.x - p.x) / 3} ${c.y} ${c.x} ${c.y}`
  }
  return d
}

function PerformanceChart({ bars, roasLine }: { bars: number[]; roasLine: number[] }) {
  const W = 800
  const H = 200
  const barW = 22
  const innerL = 14
  const innerR = 14
  const slotW = (W - innerL - innerR) / bars.length
  const maxBar = Math.max(...bars)
  const mnRoas = Math.min(...roasLine)
  const mxRoas = Math.max(...roasLine)
  const path = smoothPath(roasLine, W, H, mnRoas, mxRoas)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block" style={{ height: 180 }}>
      {[40, 100, 160].map(y => (
        <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#f0f1f3" strokeWidth="0.5" strokeDasharray="2 2" />
      ))}
      {bars.map((b, i) => {
        const h = (b / maxBar) * (H * 0.78)
        const x = innerL + i * slotW + (slotW - barW) / 2
        const y = H - h
        return <rect key={i} x={x} y={y} width={barW} height={h} rx={2} fill="#2d5c3a" opacity={0.18} />
      })}
      <path d={path} fill="none" stroke="#2d5c3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Layout atoms ────────────────────────────────────────────────────────────

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <div className="text-[10px] font-medium text-ink uppercase tracking-[0.03em] mb-1">{label}</div>
      <div className="text-[18px] font-medium text-ink leading-none">{value}</div>
    </div>
  )
}

function FormatBadge({ fmt }: { fmt: Format }) {
  return (
    <span className="absolute top-1 left-1 text-[8px] font-medium tracking-[0.03em] bg-[#0f1e3c]/90 text-white px-[5px] py-px rounded-[3px]">
      {fmt}
    </span>
  )
}

function PlayOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-5 h-5 rounded-full bg-black/40 border border-white/60 flex items-center justify-center text-white">
        <svg width="7" height="9" viewBox="0 0 7 9" fill="currentColor">
          <path d="M0.5 0.5l5.5 4-5.5 4V0.5z" />
        </svg>
      </div>
    </div>
  )
}

function CreativeThumb({ row }: { row: CreativeRow }) {
  return (
    <div className={`relative w-14 h-14 rounded-md overflow-hidden bg-gradient-to-br ${row.gradient}`}>
      <FormatBadge fmt={row.format} />
      {(row.format === 'UGC' || row.format === 'VIDEO') && <PlayOverlay />}
    </div>
  )
}

// ─── Card wrappers ───────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border-[0.5px] border-[#e5e7eb] rounded-[10px] ${className}`}>
      {children}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

function PerformanceProduct() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const product = PRODUCTS.find(p => p.slug === slug)

  if (!product) {
    return (
      <div className="font-sans">
        <div className="max-w-[1200px] mx-auto px-6 pt-5 pb-12">
          <button
            onClick={() => navigate('/performance')}
            className="text-[12px] font-medium text-ink bg-transparent border-0 cursor-pointer hover:opacity-70 mb-[18px]"
          >
            ← Back to Performance
          </button>
          <Card className="px-6 py-12 flex items-center justify-center">
            <div className="text-[13px] text-ink">Product not found · <span className="font-mono">{slug}</span></div>
          </Card>
        </div>
      </div>
    )
  }

  const isPipeline = product.kind === 'pipeline'
  const deltaCls =
    product.vsAvg?.sign === 'pos'
      ? 'text-brand'
      : product.vsAvg?.sign === 'neg'
        ? 'text-[#791f1f]'
        : 'text-ink'

  return (
    <div className="font-sans">
      <div className="max-w-[1200px] mx-auto px-6 pt-5 pb-12">
        <button
          onClick={() => navigate('/performance')}
          className="text-[12px] font-medium text-ink bg-transparent border-0 cursor-pointer hover:opacity-70 mb-[18px]"
        >
          ← Back to Performance
        </button>

        {/* Product header card */}
        <Card className="px-6 py-[22px] mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {product.img ? (
              <img
                src={product.img}
                alt=""
                className="w-12 h-12 rounded-lg object-cover shrink-0 border-[0.5px] border-[#e5e7eb]"
              />
            ) : (
              <div className={`w-12 h-12 rounded-lg shrink-0 bg-gradient-to-br ${product.gradient}`} />
            )}
            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink mb-1">
                {isPipeline ? 'PIPELINE PRODUCT' : 'PRODUCT'}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="text-[20px] font-medium text-ink leading-none">{product.name}</div>
                {product.activeVerdict && <ActiveStatusPill v={product.activeVerdict} />}
                {product.pipelineVerdict && <PipelineStatusPill v={product.pipelineVerdict} />}
              </div>
              <div className="text-[12px] text-ink mt-1">
                {product.subline}
                {product.vsAvg && (
                  <>
                    {' · '}
                    {product.vsAvg.label}:{' '}
                    <span className={`font-semibold ${deltaCls}`}>{product.vsAvg.delta}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-7 shrink-0">
            <HeaderMetric label="SPEND" value={product.spend} />
            <HeaderMetric label="BLENDED ROAS" value={product.roas} />
            <HeaderMetric label="AVG CVR" value={product.cvr} />
          </div>
        </Card>

        {/* Chart card */}
        <Card className="px-[22px] py-5 mb-3.5">
          <div className="flex items-center justify-between mb-[18px]">
            <div className="flex items-center gap-[18px]">
              <span className="text-[14px] font-semibold text-ink">Performance over time</span>
              <div className="flex items-center gap-3.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-[2px] bg-brand block" />
                  <span className="text-[11px] text-ink">ROAS</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 block" style={{ backgroundColor: 'rgba(45,92,58,0.18)' }} />
                  <span className="text-[11px] text-ink">Spend</span>
                </span>
              </div>
            </div>
            <span className="text-[11px] text-ink">{DATE_RANGE}</span>
          </div>

          <PerformanceChart bars={product.bars} roasLine={product.roasLine} />

          <div className="flex justify-between mt-1.5 px-5">
            {DATES.map(d => (
              <span key={d} className="text-[10px] text-ink">{d}</span>
            ))}
          </div>
        </Card>

        {/* Creative table card */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_80px_100px_80px_80px_80px_110px_60px] gap-2 px-[22px] py-3 border-b-[0.5px] border-[#e5e7eb]">
            <div />
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CREATIVE</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">DAYS LIVE</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">SPEND</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">ROAS</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CVR</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CTR</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">VERDICT</div>
            <div />
          </div>

          {product.creatives.map((row, i) => {
            const last = i === product.creatives.length - 1
            return (
              <div
                key={row.id}
                className={`grid grid-cols-[80px_1fr_80px_100px_80px_80px_80px_110px_60px] gap-2 px-[22px] py-3 items-center transition-colors hover:bg-[#fafafa] ${
                  row.winner ? 'bg-brand-bg' : ''
                } ${last ? '' : 'border-b-[0.5px] border-[#f0f1f3]'}`}
              >
                <CreativeThumb row={row} />
                <div className="pl-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-ink">{row.name}</span>
                    {row.winner && (
                      <span className="text-[9px] font-medium tracking-[0.03em] bg-brand text-white px-1.5 py-px rounded-[8px]">
                        WINNER
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-ink mt-0.5">{row.angle}</div>
                </div>
                <div className="text-[12px] text-ink">{row.daysLive}</div>
                <div className="text-[12px] font-medium text-ink">{row.spend}</div>
                <div className="text-[12px] font-medium text-ink">{row.roas}</div>
                <div className="text-[12px] text-ink">{row.cvr}</div>
                <div className="text-[12px] text-ink">{row.ctr}</div>
                <div>
                  <RowPill v={row.verdict} />
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[14px] text-ink cursor-pointer leading-none px-1 hover:opacity-70">⏸</span>
                  <span className="text-[14px] text-ink cursor-pointer leading-none px-1 hover:opacity-70">⋯</span>
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}

export default PerformanceProduct
