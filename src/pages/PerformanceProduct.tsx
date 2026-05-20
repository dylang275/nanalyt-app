import { useNavigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type ActiveVerdict = 'performing' | 'stable' | 'watch'
type PipelineVerdict = 'validated' | 'testing' | 'wind-down' | 'killed'
type RowVerdict = 'scaling' | 'stable' | 'watch' | 'wind-down'
type Format = 'UGC' | 'STATIC' | 'VIDEO' | 'PDP'

type CreativeRow = {
  id: string
  format: Format
  bg: string
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

type Kpi = { label: string; value: string; delta: string }

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
  vsAvg?: string
  kpis?: Kpi[]
  bars: number[]
  roasLine: number[]
  creatives: CreativeRow[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DATES = ['Apr 19', 'Apr 26', 'May 3', 'May 10', 'May 17']
const DATE_RANGE = 'Apr 19 – May 19'

const GRID_ADS = 'grid grid-cols-[80px_1fr_80px_100px_80px_80px_80px_110px_60px] items-center px-[22px] py-3'
const GRID_PDP = 'grid grid-cols-[80px_1fr_80px_80px_110px_60px] items-center px-[22px] py-3'

// ─── Demo data ───────────────────────────────────────────────────────────────

const MAG_CREATIVES: CreativeRow[] = [
  {
    id: 'm1', format: 'UGC',
    bg: 'linear-gradient(135deg, #E5C9D5, #B96F8E)',
    name: "Couldn't shut my brain off",
    angle: 'Sleep-Anxiety Crossover · UGC',
    daysLive: '22d', spend: '$6.2k', roas: '5.4×', cvr: '3.2%', ctr: '1.8%',
    verdict: 'scaling', winner: true,
  },
  {
    id: 'm2', format: 'STATIC',
    bg: 'linear-gradient(135deg, #E5E2C9, #B9B26F)',
    name: 'Lifestyle composition',
    angle: 'Lifestyle & Wellness · Static',
    daysLive: '18d', spend: '$3.4k', roas: '3.6×', cvr: '2.4%', ctr: '1.2%',
    verdict: 'stable',
  },
  {
    id: 'm3', format: 'VIDEO',
    bg: 'linear-gradient(135deg, #D5C9E5, #8E6FB9)',
    name: 'Tried everything for sleep',
    angle: 'Sleep-Anxiety Crossover · Video',
    daysLive: '14d', spend: '$2.1k', roas: '2.8×', cvr: '1.9%', ctr: '0.9%',
    verdict: 'watch',
  },
  {
    id: 'm4', format: 'PDP',
    bg: 'linear-gradient(135deg, #F0F4F8, #D9E2EC)',
    name: 'Next-day calm landing page',
    angle: 'v1 · Sleep-Anxiety Crossover · PDP',
    daysLive: '32d', spend: '—', roas: '—', cvr: '2.4%', ctr: '—',
    verdict: 'scaling',
  },
]

const GUMMIES_CREATIVES: CreativeRow[] = [
  {
    id: 'g0', format: 'PDP',
    bg: 'linear-gradient(135deg, #C8DCF0, #6B8FBF)',
    name: 'Two birds, one gummy landing page',
    angle: 'v1 · Sleep & Stress Combo · PDP',
    daysLive: '32d', spend: '—', roas: '—', cvr: '2.8%', ctr: '—',
    verdict: 'scaling',
  },
  {
    id: 'g1', format: 'UGC',
    bg: 'linear-gradient(135deg, #E5BFD5, #8E6FB9)',
    name: '"Two birds, one gummy"',
    angle: 'Sleep & Stress Combo · UGC',
    daysLive: '28d', spend: '$1.8k', roas: '5.2×', cvr: '3.4%', ctr: '1.9%',
    verdict: 'scaling', winner: true,
  },
  {
    id: 'g2', format: 'VIDEO',
    bg: 'linear-gradient(135deg, #C9B9E5, #7C5BBF)',
    name: 'Why magnesium AND ashwagandha?',
    angle: 'Sleep & Stress Combo · Video',
    daysLive: '21d', spend: '$1.2k', roas: '4.8×', cvr: '3.0%', ctr: '1.6%',
    verdict: 'scaling',
  },
  {
    id: 'g3', format: 'STATIC',
    bg: 'linear-gradient(135deg, #DDD3B5, #B89F6A)',
    name: 'The science of stress-sleep',
    angle: 'Sleep-Anxiety Crossover · Static',
    daysLive: '18d', spend: '$0.8k', roas: '3.9×', cvr: '2.7%', ctr: '1.2%',
    verdict: 'stable',
  },
  {
    id: 'g4', format: 'UGC',
    bg: 'linear-gradient(135deg, #BFD9B9, #6FAA80)',
    name: 'Routine reset',
    angle: 'Sleep & Stress Combo · UGC',
    daysLive: '14d', spend: '$0.4k', roas: '3.4×', cvr: '2.4%', ctr: '1.0%',
    verdict: 'stable',
  },
]

const PRODUCTS: ProductDetail[] = [
  {
    slug: 'magnesium-glycinate-complex',
    name: 'Magnesium Glycinate Complex',
    kind: 'active',
    img: '/uploads/IMG_3472.jpg',
    subline: 'In market · 1 PDP · 3 ads · last 30 days',
    spend: '$12.4k', roas: '4.1×', cvr: '2.8%',
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
    spend: '$8.6k', roas: '3.4×', cvr: '2.1%',
    activeVerdict: 'stable',
    bars: [55, 58, 62, 60, 65, 68, 72, 75, 78, 76, 82, 80, 85, 88, 84, 90, 92, 89, 94, 96, 92, 98],
    roasLine: [3.2, 3.1, 3.3, 3.4, 3.5, 3.4, 3.5, 3.3, 3.4, 3.5, 3.6, 3.5, 3.4, 3.5, 3.4, 3.5, 3.4, 3.5, 3.4, 3.4, 3.5, 3.4],
    creatives: [
      { id: 'z1', format: 'STATIC', bg: 'linear-gradient(135deg, #DBEAFE, #1E3A8A)', name: 'Restful nights, sharper mornings', angle: 'Sleep quality · Static', daysLive: '21d', spend: '$5.1k', roas: '3.6×', cvr: '2.3%', ctr: '1.4%', verdict: 'stable' },
      { id: 'z2', format: 'UGC', bg: 'linear-gradient(135deg, #BFDBFE, #3B82F6)', name: 'Creator review walkthrough', angle: 'Sleep quality · UGC', daysLive: '16d', spend: '$3.5k', roas: '3.2×', cvr: '1.9%', ctr: '1.1%', verdict: 'stable' },
      { id: 'z3', format: 'PDP', bg: 'linear-gradient(135deg, #E0E7FF, #A5B4FC)', name: 'Sleep quality landing page', angle: 'v1 · Sleep quality · PDP', daysLive: '28d', spend: '—', roas: '—', cvr: '2.1%', ctr: '—', verdict: 'stable' },
    ],
  },
  {
    slug: 'ashwagandha-plus',
    name: 'ASHWAGANDHA+',
    kind: 'active',
    img: '/uploads/IMG_3476.jpg',
    subline: 'In market · No PDP · 1 ad · last 30 days',
    spend: '$3.6k', roas: '2.1×', cvr: '1.4%',
    activeVerdict: 'watch',
    bars: [42, 46, 48, 52, 50, 54, 56, 52, 58, 54, 56, 50, 48, 52, 54, 50, 48, 52, 50, 46, 48, 44],
    roasLine: [2.8, 2.7, 2.6, 2.7, 2.6, 2.5, 2.4, 2.5, 2.4, 2.3, 2.4, 2.3, 2.2, 2.3, 2.2, 2.1, 2.2, 2.1, 2.0, 2.1, 2.0, 2.1],
    creatives: [
      { id: 'a1', format: 'UGC', bg: 'linear-gradient(135deg, #FDE68A, #D97706)', name: 'Stress-sleep angle test', angle: 'Stress-Sleep · UGC', daysLive: '12d', spend: '$3.6k', roas: '2.1×', cvr: '1.4%', ctr: '0.8%', verdict: 'watch' },
    ],
  },
  {
    slug: 'magnesium-ashwagandha-gummies',
    name: 'Magnesium + Ashwagandha Gummies',
    kind: 'pipeline',
    gradient: 'from-[#a7f3d0] to-[#34d399]',
    subline: 'In test · 1 PDP · 4 ads · last 30 days',
    spend: '$4.2k', roas: '4.6×', cvr: '3.1%',
    pipelineVerdict: 'validated',
    vsAvg: '+21%',
    kpis: [
      { label: 'IMPRESSIONS', value: '481k', delta: '+18%' },
      { label: 'CTR', value: '1.4%', delta: '+0.3' },
      { label: 'ATCs', value: '1,240', delta: '+9%' },
      { label: 'CPA', value: '$18.20', delta: '-$2.10' },
    ],
    bars: [22, 26, 32, 28, 36, 42, 38, 46, 52, 58, 54, 62, 68, 72, 78, 74, 82, 88, 92, 96, 98, 104],
    roasLine: [3.2, 3.4, 3.5, 3.6, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9],
    creatives: GUMMIES_CREATIVES,
  },
  {
    slug: 'sleep-stress-tincture',
    name: 'Sleep + Stress Tincture',
    kind: 'pipeline',
    gradient: 'from-[#c4b5fd] to-[#8b5cf6]',
    subline: 'In test · 1 PDP · 3 ads · last 30 days',
    spend: '$2.1k', roas: '3.8×', cvr: '2.4%',
    pipelineVerdict: 'testing',
    vsAvg: 'even',
    kpis: [
      { label: 'IMPRESSIONS', value: '286k', delta: '+4%' },
      { label: 'CTR', value: '1.1%', delta: '+0.1' },
      { label: 'ATCs', value: '684', delta: '+2%' },
      { label: 'CPA', value: '$22.40', delta: '+$0.30' },
    ],
    bars: [28, 32, 30, 34, 38, 36, 42, 40, 38, 44, 42, 46, 44, 48, 46, 50, 48, 52, 50, 54, 52, 56],
    roasLine: [3.6, 3.7, 3.8, 3.7, 3.8, 3.9, 3.8, 3.7, 3.8, 3.9, 3.8, 3.9, 3.8, 3.7, 3.8, 3.9, 3.8, 3.7, 3.8, 3.8, 3.9, 3.8],
    creatives: [
      { id: 'tp', format: 'PDP', bg: 'linear-gradient(135deg, #EDE9FE, #C4B5FD)', name: 'Story-led tincture PDP', angle: 'v1 · Sleep-Anxiety · PDP', daysLive: '14d', spend: '—', roas: '—', cvr: '2.4%', ctr: '—', verdict: 'stable' },
      { id: 't1', format: 'UGC', bg: 'linear-gradient(135deg, #C4B5FD, #7C3AED)', name: 'Tincture morning routine', angle: 'Sleep-Anxiety · UGC', daysLive: '11d', spend: '$0.9k', roas: '4.0×', cvr: '2.6%', ctr: '1.3%', verdict: 'stable' },
      { id: 't2', format: 'STATIC', bg: 'linear-gradient(135deg, #DDD6FE, #A78BFA)', name: 'Dropper still life', angle: 'Lifestyle · Static', daysLive: '9d', spend: '$0.7k', roas: '3.6×', cvr: '2.2%', ctr: '1.0%', verdict: 'stable' },
      { id: 't3', format: 'VIDEO', bg: 'linear-gradient(135deg, #C4B5FD, #6D28D9)', name: 'Calm in 20 minutes', angle: 'Sleep-Anxiety · Video', daysLive: '7d', spend: '$0.5k', roas: '3.4×', cvr: '2.1%', ctr: '0.9%', verdict: 'stable' },
    ],
  },
  {
    slug: 'probiotic-calm-blend',
    name: 'Probiotic + Calm Blend',
    kind: 'pipeline',
    gradient: 'from-[#fecdd3] to-[#fb7185]',
    subline: 'In test · 1 PDP · 2 ads · last 30 days',
    spend: '$0.9k', roas: '2.3×', cvr: '1.6%',
    pipelineVerdict: 'wind-down',
    vsAvg: '-40%',
    kpis: [
      { label: 'IMPRESSIONS', value: '128k', delta: '-12%' },
      { label: 'CTR', value: '0.8%', delta: '-0.2' },
      { label: 'ATCs', value: '210', delta: '-18%' },
      { label: 'CPA', value: '$34.80', delta: '+$5.20' },
    ],
    bars: [38, 36, 40, 34, 38, 32, 36, 30, 32, 28, 30, 26, 28, 24, 26, 22, 24, 20, 22, 18, 20, 16],
    roasLine: [3.0, 2.9, 2.8, 2.9, 2.7, 2.6, 2.7, 2.6, 2.5, 2.4, 2.5, 2.4, 2.3, 2.2, 2.3, 2.2, 2.1, 2.2, 2.1, 2.2, 2.3, 2.3],
    creatives: [
      { id: 'pp', format: 'PDP', bg: 'linear-gradient(135deg, #FEE2E2, #FECDD3)', name: 'Gut-mind landing page', angle: 'v1 · Wellness · PDP', daysLive: '21d', spend: '—', roas: '—', cvr: '1.6%', ctr: '—', verdict: 'watch' },
      { id: 'p1', format: 'UGC', bg: 'linear-gradient(135deg, #FECDD3, #E11D48)', name: 'Gut-mind connection test', angle: 'Wellness · UGC', daysLive: '16d', spend: '$0.6k', roas: '2.5×', cvr: '1.8%', ctr: '0.9%', verdict: 'wind-down' },
      { id: 'p2', format: 'STATIC', bg: 'linear-gradient(135deg, #FEE2E2, #FB7185)', name: 'Bottle hero shot', angle: 'Wellness · Static', daysLive: '12d', spend: '$0.3k', roas: '2.1×', cvr: '1.4%', ctr: '0.7%', verdict: 'watch' },
    ],
  },
]

// ─── Pills ───────────────────────────────────────────────────────────────────

const HEADER_PILL = 'text-[11px] font-medium px-2.5 py-[3px] rounded-[12px] inline-flex items-center gap-1'

function ActiveStatusPill({ v }: { v: ActiveVerdict }) {
  if (v === 'performing') {
    return (
      <span className={`${HEADER_PILL} bg-[#EAF3DE] text-[#27500A]`}>
        <span className="text-[9px] leading-none">▲</span>Performing
      </span>
    )
  }
  if (v === 'stable') return <span className={`${HEADER_PILL} bg-[#F0F1F3] text-[#4B5563]`}>Stable</span>
  return <span className={`${HEADER_PILL} bg-[#FEF3D7] text-[#92400E]`}>Watch</span>
}

function PipelineSolidPill({ v }: { v: PipelineVerdict }) {
  const base = `${HEADER_PILL} tracking-[0.03em] text-white`
  if (v === 'validated') return <span className={base} style={{ background: '#1D9E75' }}>VALIDATED</span>
  if (v === 'testing') return <span className={`${HEADER_PILL} tracking-[0.03em] bg-[#F0F1F3] text-[#4B5563]`}>TESTING</span>
  if (v === 'wind-down') return <span className={`${HEADER_PILL} tracking-[0.03em] bg-[#FEF3D7] text-[#92400E]`}>WIND DOWN</span>
  return <span className={`${HEADER_PILL} tracking-[0.03em] bg-[#FCEBEB] text-[#791F1F]`}>KILLED</span>
}

const ROW_PILL = 'inline-flex items-center gap-1 text-[10px] font-medium px-2 py-[2px] rounded-[10px] tracking-[0.03em]'

function RowPill({ v }: { v: RowVerdict }) {
  if (v === 'scaling') {
    return (
      <span className={`${ROW_PILL} bg-[#EAF3DE] text-[#27500A]`}>
        <span className="text-[8px] leading-none">▲</span>SCALING
      </span>
    )
  }
  if (v === 'stable') return <span className={`${ROW_PILL} bg-[#F0F1F3] text-[#4B5563]`}>STABLE</span>
  if (v === 'watch') return <span className={`${ROW_PILL} bg-[#FEF3D7] text-[#92400E]`}>WATCH</span>
  return (
    <span className={`${ROW_PILL} bg-[#FCEBEB] text-[#791F1F]`}>
      <span className="text-[8px] leading-none">▼</span>WIND DOWN
    </span>
  )
}

// ─── Chart ───────────────────────────────────────────────────────────────────

function smoothPath(vals: number[]) {
  const mn = Math.min(...vals)
  const mx = Math.max(...vals)
  const rng = mx - mn || 1
  const W = 800
  const slotW = W / vals.length
  const norm = (v: number) => 115 - ((v - mn) / rng) * 75
  const coords = vals.map((v, i) => ({ x: slotW / 2 + i * slotW, y: norm(v) }))
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
  const barW = 20
  const slotW = W / bars.length
  const maxBar = Math.max(...bars)
  const path = smoothPath(roasLine)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block" style={{ height: 180 }}>
      {[40, 100, 160].map(y => (
        <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#F0F1F3" strokeWidth="0.5" strokeDasharray="2 2" />
      ))}
      {bars.map((b, i) => {
        const h = (b / maxBar) * (H * 0.78)
        const x = i * slotW + (slotW - barW) / 2
        const y = H - h
        return <rect key={i} x={x} y={y} width={barW} height={h} rx={2} fill="rgba(29, 120, 73, 0.18)" />
      })}
      <path d={path} fill="none" stroke="#1F4D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Atoms ───────────────────────────────────────────────────────────────────

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <div className="text-[10px] font-medium uppercase tracking-[0.03em] text-ink mb-1">{label}</div>
      <div className="text-[18px] font-medium text-ink leading-none">{value}</div>
    </div>
  )
}

function KpiTile({ label, value, delta }: Kpi) {
  return (
    <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] px-3.5 py-3">
      <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink mb-1.5">{label}</div>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-[18px] font-medium text-ink leading-none">{value}</span>
        <span className="text-[11px] font-medium text-[#27500A]">{delta}</span>
      </div>
    </div>
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
    <div className="relative w-14 h-14 rounded-md overflow-hidden" style={{ background: row.bg }}>
      <span
        className="absolute top-[3px] left-[3px] text-[8px] font-medium text-white px-[5px] py-px rounded-[3px]"
        style={{ background: 'rgba(15, 30, 60, 0.9)' }}
      >
        {row.format}
      </span>
      {(row.format === 'UGC' || row.format === 'VIDEO') && <PlayOverlay />}
    </div>
  )
}

function ActionIcons() {
  return (
    <div className="flex justify-end gap-1">
      <span className="text-[14px] text-ink cursor-pointer leading-none">⏸</span>
      <span className="text-[14px] text-ink cursor-pointer leading-none">⋯</span>
    </div>
  )
}

function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] ${className}`} style={style}>
      {children}
    </div>
  )
}

// ─── Active product detail ──────────────────────────────────────────────────

function ActiveDetail({ product }: { product: ProductDetail }) {
  return (
    <>
      {/* Product header card */}
      <Card className="px-6 py-[22px] mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {product.img ? (
            <img src={product.img} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border-[0.5px] border-[#E5E7EB]" />
          ) : (
            <div className={`w-12 h-12 rounded-lg shrink-0 bg-gradient-to-br ${product.gradient}`} />
          )}
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink mb-1">PRODUCT</div>
            <div className="flex items-center gap-2.5">
              <div className="text-[20px] font-medium text-ink leading-none">{product.name}</div>
              {product.activeVerdict && <ActiveStatusPill v={product.activeVerdict} />}
            </div>
            <div className="text-[12px] text-ink mt-1">{product.subline}</div>
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
            <span className="text-[14px] font-medium text-ink">Performance over time</span>
            <div className="flex items-center gap-3.5">
              <span className="flex items-center gap-1.5">
                <span className="block" style={{ width: 12, height: 2, background: '#1F4D2D' }} />
                <span className="text-[11px] text-ink">ROAS</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="block" style={{ width: 12, height: 8, background: 'rgba(29, 120, 73, 0.2)' }} />
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
        <div className={`${GRID_ADS} border-b-[0.5px] border-[#F0F1F3]`}>
          <span />
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CREATIVE</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">DAYS LIVE</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">SPEND</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">ROAS</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CVR</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CTR</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">VERDICT</span>
          <span />
        </div>
        {product.creatives.map((row, i, arr) => (
          <div
            key={row.id}
            className={`${GRID_ADS} ${i === arr.length - 1 ? '' : 'border-b-[0.5px] border-[#F0F1F3]'} transition-colors hover:bg-[#fafafa]`}
            style={row.winner ? { background: '#F0F9F4' } : undefined}
          >
            <CreativeThumb row={row} />
            <div className="pl-1 min-w-0">
              <p className="m-0 flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[13px] font-medium text-ink">{row.name}</span>
                {row.winner && (
                  <span className="text-[9px] font-medium tracking-[0.03em] text-white px-1.5 py-px rounded-[8px]" style={{ background: '#1D9E75' }}>
                    WINNER
                  </span>
                )}
              </p>
              <p className="m-0 text-[11px] text-ink mt-0.5">{row.angle}</p>
            </div>
            <span className="text-[12px] text-ink">{row.daysLive}</span>
            <span className="text-[12px] font-medium text-ink">{row.spend}</span>
            <span className="text-[12px] font-medium text-ink">{row.roas}</span>
            <span className="text-[12px] text-ink">{row.cvr}</span>
            <span className="text-[12px] text-ink">{row.ctr}</span>
            <div><RowPill v={row.verdict} /></div>
            <ActionIcons />
          </div>
        ))}
      </Card>
    </>
  )
}

// ─── Pipeline product detail ─────────────────────────────────────────────────

function PipelineDetail({ product }: { product: ProductDetail }) {
  const pdpRows = product.creatives.filter(c => c.format === 'PDP')
  const adRows = product.creatives.filter(c => c.format !== 'PDP')
  const promotable = product.pipelineVerdict === 'validated'

  return (
    <>
      {/* Pipeline header card — green tint */}
      <Card className="px-6 py-[22px] mb-3.5 flex items-start justify-between" style={{ background: '#F0F9F4' }}>
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {product.img ? (
            <img src={product.img} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border-[0.5px] border-[#E5E7EB]" />
          ) : (
            <div className={`w-12 h-12 rounded-lg shrink-0 bg-gradient-to-br ${product.gradient}`} />
          )}
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink mb-1">PIPELINE PRODUCT</div>
            <div className="flex items-center gap-2.5">
              <div className="text-[20px] font-medium text-ink leading-none">{product.name}</div>
              {product.pipelineVerdict && <PipelineSolidPill v={product.pipelineVerdict} />}
            </div>
            <div className="text-[12px] text-ink mt-1">{product.subline}</div>
            {product.vsAvg && (
              <div className="text-[12px] text-ink mt-0.5">
                vs catalog avg ROAS:{' '}
                <span className="font-semibold" style={{ color: '#27500A' }}>{product.vsAvg}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex items-center gap-7">
            <HeaderMetric label="SPEND" value={product.spend} />
            <HeaderMetric label="BLENDED ROAS" value={product.roas} />
            <HeaderMetric label="AVG CVR" value={product.cvr} />
          </div>
          {promotable && (
            <button className="bg-brand text-white text-[12px] font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 flex items-center gap-1.5 border-0">
              Promote to catalog
              <span>→</span>
            </button>
          )}
        </div>
      </Card>

      {/* Chart card + KPI panel */}
      <div className="grid grid-cols-[1fr_180px] gap-3.5 mb-3.5">
        <Card className="px-[22px] py-5">
          <div className="flex items-center justify-between mb-[18px]">
            <div className="flex items-center gap-[18px]">
              <span className="text-[14px] font-medium text-ink">Performance over time</span>
              <div className="flex items-center gap-3.5">
                <span className="flex items-center gap-1.5">
                  <span className="block" style={{ width: 12, height: 2, background: '#1F4D2D' }} />
                  <span className="text-[11px] text-ink">ROAS</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="block" style={{ width: 12, height: 8, background: 'rgba(29, 120, 73, 0.2)' }} />
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

        <div className="flex flex-col gap-2.5">
          {product.kpis?.map(k => (
            <KpiTile key={k.label} label={k.label} value={k.value} delta={k.delta} />
          ))}
        </div>
      </div>

      {/* Table card — PRODUCT PAGE section then ADS section */}
      <Card className="overflow-hidden">
        {/* PRODUCT PAGE section header (no border) */}
        <div className="px-[22px] pt-4 pb-2 flex items-baseline gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">
            PRODUCT PAGE · {pdpRows.length}
          </span>
        </div>

        {/* PDP column labels */}
        <div className={`${GRID_PDP} border-b-[0.5px] border-[#F0F1F3]`}>
          <span />
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">PAGE</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">DAYS LIVE</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CVR</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">VERDICT</span>
          <span />
        </div>

        {/* PDP data row(s) — no border below; extra spacing handled via ADS pt-5 */}
        {pdpRows.map(row => (
          <div key={row.id} className={`${GRID_PDP} transition-colors hover:bg-[#fafafa]`}>
            <CreativeThumb row={row} />
            <div className="pl-1 min-w-0">
              <p className="m-0 text-[13px] font-medium text-ink">{row.name}</p>
              <p className="m-0 text-[11px] text-ink mt-0.5">{row.angle}</p>
            </div>
            <span className="text-[12px] text-ink">{row.daysLive}</span>
            <span className="text-[12px] text-ink">{row.cvr}</span>
            <div><RowPill v={row.verdict} /></div>
            <ActionIcons />
          </div>
        ))}

        {/* ADS section header (no border, extra top space for section separation) */}
        <div className="px-[22px] pt-5 pb-2 flex items-baseline gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">
            ADS · {adRows.length}
          </span>
          <span className="text-[11px] text-ink">Sending traffic to the page above:</span>
        </div>

        {/* Ads column labels */}
        <div className={`${GRID_ADS} border-b-[0.5px] border-[#F0F1F3]`}>
          <span />
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CREATIVE</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">DAYS LIVE</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">SPEND</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">ROAS</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CVR</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">CTR</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink">VERDICT</span>
          <span />
        </div>

        {/* Ad rows */}
        {adRows.map((row, i, arr) => (
          <div
            key={row.id}
            className={`${GRID_ADS} ${i === arr.length - 1 ? '' : 'border-b-[0.5px] border-[#F0F1F3]'} transition-colors hover:bg-[#fafafa]`}
            style={row.winner ? { background: '#F0F9F4' } : undefined}
          >
            <CreativeThumb row={row} />
            <div className="pl-1 min-w-0">
              <p className="m-0 flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[13px] font-medium text-ink">{row.name}</span>
                {row.winner && (
                  <span className="text-[9px] font-medium tracking-[0.03em] text-white px-1.5 py-px rounded-[8px]" style={{ background: '#1D9E75' }}>
                    WINNER
                  </span>
                )}
              </p>
              <p className="m-0 text-[11px] text-ink mt-0.5">{row.angle}</p>
            </div>
            <span className="text-[12px] text-ink">{row.daysLive}</span>
            <span className="text-[12px] font-medium text-ink">{row.spend}</span>
            <span className="text-[12px] font-medium text-ink">{row.roas}</span>
            <span className="text-[12px] text-ink">{row.cvr}</span>
            <span className="text-[12px] text-ink">{row.ctr}</span>
            <div><RowPill v={row.verdict} /></div>
            <ActionIcons />
          </div>
        ))}
      </Card>
    </>
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

  return (
    <div className="font-sans">
      <div className="max-w-[1200px] mx-auto px-6 pt-5 pb-12">
        <button
          onClick={() => navigate('/performance')}
          className="text-[12px] font-medium text-ink bg-transparent border-0 cursor-pointer hover:opacity-70 mb-[18px]"
        >
          ← Back to Performance
        </button>

        {product.kind === 'pipeline' ? (
          <PipelineDetail product={product} />
        ) : (
          <ActiveDetail product={product} />
        )}
      </div>
    </div>
  )
}

export default PerformanceProduct
