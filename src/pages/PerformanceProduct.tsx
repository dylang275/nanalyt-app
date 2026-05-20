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

type Kpi = { label: string; value: string; delta: string; deltaSign?: 'pos' | 'neg' }

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

// Active table (existing layout — unchanged)
const GRID_ADS_ACTIVE = 'grid grid-cols-[80px_1fr_80px_100px_80px_80px_80px_110px_60px] items-center px-[22px] py-3'

// Pipeline table grids (per reference HTML)
const GRID_PDP_PIPE = 'grid grid-cols-[68px_1fr_80px_80px_116px_42px] items-center px-4 gap-0'
const GRID_ADS_PIPE = 'grid grid-cols-[68px_1fr_68px_72px_68px_64px_60px_116px_42px] items-center px-4 gap-0'

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

// Gummies — copy + gradients + chart data per reference HTML
const GUMMIES_CREATIVES: CreativeRow[] = [
  {
    id: 'g0', format: 'PDP',
    bg: 'linear-gradient(140deg, #a8cce8, #5d8ec8)',
    name: 'Two birds, one gummy landing page',
    angle: 'v1 · Sleep & Stress Combo · PDP',
    daysLive: '32d', spend: '—', roas: '—', cvr: '2.8%', ctr: '—',
    verdict: 'scaling',
  },
  {
    id: 'g1', format: 'UGC',
    bg: 'linear-gradient(140deg, #f0a2c2, #9b62bb)',
    name: '"Two birds, one gummy"',
    angle: 'Sleep & Stress Combo · UGC',
    daysLive: '28d', spend: '$1.8k', roas: '5.2×', cvr: '3.4%', ctr: '1.9%',
    verdict: 'scaling', winner: true,
  },
  {
    id: 'g2', format: 'VIDEO',
    bg: 'linear-gradient(140deg, #c4aaec, #6540aa)',
    name: 'Why magnesium AND ashwagandha?',
    angle: 'Sleep & Stress Combo · Video',
    daysLive: '21d', spend: '$1.2k', roas: '4.8×', cvr: '3.0%', ctr: '1.6%',
    verdict: 'scaling',
  },
  {
    id: 'g3', format: 'STATIC',
    bg: 'linear-gradient(140deg, #d4c4a0, #a88c60)',
    name: 'The science of stress-sleep',
    angle: 'Sleep-Anxiety Crossover · Static',
    daysLive: '18d', spend: '$0.8k', roas: '3.9×', cvr: '2.7%', ctr: '1.2%',
    verdict: 'stable',
  },
  {
    id: 'g4', format: 'UGC',
    bg: 'linear-gradient(140deg, #a8d4bc, #3d7a58)',
    name: '"My new bedtime ritual"',
    angle: 'Lifestyle & Wellness · UGC',
    daysLive: '14d', spend: '$0.4k', roas: '2.4×', cvr: '1.8%', ctr: '0.9%',
    verdict: 'watch',
  },
]

const GUMMIES_BARS = [248, 268, 282, 295, 288, 312, 328, 318, 344, 358, 350, 372, 388, 378, 398, 412, 408, 428, 442, 436, 458, 468, 474, 488, 498, 508, 522, 512, 548, 582]
const GUMMIES_ROAS = [3.0, 3.05, 3.0, 3.15, 3.1, 3.25, 3.2, 3.38, 3.35, 3.5, 3.42, 3.58, 3.52, 3.7, 3.68, 3.82, 3.8, 3.92, 4.02, 4.12, 4.1, 4.22, 4.32, 4.42, 4.52, 4.62, 4.82, 5.02, 5.22, 5.5]

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
    gradient: 'from-[#d4e8c8] to-[#7aaa7a]',
    subline: 'In test · 1 PDP · 4 ads · last 30 days',
    spend: '$4.2k', roas: '4.6×', cvr: '3.1%',
    pipelineVerdict: 'validated',
    vsAvg: '+21%',
    kpis: [
      { label: 'Impressions', value: '481k', delta: '+18%', deltaSign: 'pos' },
      { label: 'CTR', value: '1.4%', delta: '+0.3', deltaSign: 'pos' },
      { label: 'ATCs', value: '1,240', delta: '+9%', deltaSign: 'pos' },
      { label: 'CPA', value: '$18.20', delta: '−$2.10', deltaSign: 'pos' },
    ],
    bars: GUMMIES_BARS,
    roasLine: GUMMIES_ROAS,
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
      { label: 'Impressions', value: '286k', delta: '+4%', deltaSign: 'pos' },
      { label: 'CTR', value: '1.1%', delta: '+0.1', deltaSign: 'pos' },
      { label: 'ATCs', value: '684', delta: '+2%', deltaSign: 'pos' },
      { label: 'CPA', value: '$22.40', delta: '+$0.30', deltaSign: 'neg' },
    ],
    bars: [128, 132, 136, 130, 142, 138, 148, 144, 152, 156, 150, 162, 158, 168, 164, 174, 170, 178, 176, 184, 180, 188, 186, 192, 190, 198, 196, 204, 202, 210],
    roasLine: [3.6, 3.7, 3.8, 3.7, 3.8, 3.9, 3.8, 3.7, 3.8, 3.9, 3.8, 3.9, 3.8, 3.7, 3.8, 3.9, 3.8, 3.7, 3.8, 3.8, 3.9, 3.8, 3.7, 3.8, 3.9, 3.8, 3.8, 3.9, 3.8, 3.9],
    creatives: [
      { id: 'tp', format: 'PDP', bg: 'linear-gradient(140deg, #EDE9FE, #C4B5FD)', name: 'Story-led tincture PDP', angle: 'v1 · Sleep-Anxiety · PDP', daysLive: '14d', spend: '—', roas: '—', cvr: '2.4%', ctr: '—', verdict: 'stable' },
      { id: 't1', format: 'UGC', bg: 'linear-gradient(140deg, #C4B5FD, #7C3AED)', name: 'Tincture morning routine', angle: 'Sleep-Anxiety · UGC', daysLive: '11d', spend: '$0.9k', roas: '4.0×', cvr: '2.6%', ctr: '1.3%', verdict: 'stable' },
      { id: 't2', format: 'STATIC', bg: 'linear-gradient(140deg, #DDD6FE, #A78BFA)', name: 'Dropper still life', angle: 'Lifestyle · Static', daysLive: '9d', spend: '$0.7k', roas: '3.6×', cvr: '2.2%', ctr: '1.0%', verdict: 'stable' },
      { id: 't3', format: 'VIDEO', bg: 'linear-gradient(140deg, #C4B5FD, #6D28D9)', name: 'Calm in 20 minutes', angle: 'Sleep-Anxiety · Video', daysLive: '7d', spend: '$0.5k', roas: '3.4×', cvr: '2.1%', ctr: '0.9%', verdict: 'stable' },
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
      { label: 'Impressions', value: '128k', delta: '-12%', deltaSign: 'neg' },
      { label: 'CTR', value: '0.8%', delta: '-0.2', deltaSign: 'neg' },
      { label: 'ATCs', value: '210', delta: '-18%', deltaSign: 'neg' },
      { label: 'CPA', value: '$34.80', delta: '+$5.20', deltaSign: 'neg' },
    ],
    bars: [138, 134, 132, 128, 126, 124, 120, 118, 116, 112, 110, 108, 104, 102, 100, 96, 94, 92, 88, 86, 82, 80, 78, 74, 72, 70, 66, 64, 62, 58],
    roasLine: [3.0, 2.9, 2.8, 2.9, 2.7, 2.6, 2.7, 2.6, 2.5, 2.4, 2.5, 2.4, 2.3, 2.2, 2.3, 2.2, 2.1, 2.2, 2.1, 2.2, 2.3, 2.3, 2.2, 2.1, 2.2, 2.1, 2.0, 2.1, 2.2, 2.3],
    creatives: [
      { id: 'pp', format: 'PDP', bg: 'linear-gradient(140deg, #FEE2E2, #FECDD3)', name: 'Gut-mind landing page', angle: 'v1 · Wellness · PDP', daysLive: '21d', spend: '—', roas: '—', cvr: '1.6%', ctr: '—', verdict: 'watch' },
      { id: 'p1', format: 'UGC', bg: 'linear-gradient(140deg, #FECDD3, #E11D48)', name: 'Gut-mind connection test', angle: 'Wellness · UGC', daysLive: '16d', spend: '$0.6k', roas: '2.5×', cvr: '1.8%', ctr: '0.9%', verdict: 'wind-down' },
      { id: 'p2', format: 'STATIC', bg: 'linear-gradient(140deg, #FEE2E2, #FB7185)', name: 'Bottle hero shot', angle: 'Wellness · Static', daysLive: '12d', spend: '$0.3k', roas: '2.1×', cvr: '1.4%', ctr: '0.7%', verdict: 'watch' },
    ],
  },
]

// ─── Active-page pills (existing) ───────────────────────────────────────────

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

const ROW_PILL_ACTIVE = 'inline-flex items-center gap-1 text-[10px] font-medium px-2 py-[2px] rounded-[10px] tracking-[0.03em]'

function ActiveRowPill({ v }: { v: RowVerdict }) {
  if (v === 'scaling') {
    return (
      <span className={`${ROW_PILL_ACTIVE} bg-[#EAF3DE] text-[#27500A]`}>
        <span className="text-[8px] leading-none">▲</span>SCALING
      </span>
    )
  }
  if (v === 'stable') return <span className={`${ROW_PILL_ACTIVE} bg-[#F0F1F3] text-[#4B5563]`}>STABLE</span>
  if (v === 'watch') return <span className={`${ROW_PILL_ACTIVE} bg-[#FEF3D7] text-[#92400E]`}>WATCH</span>
  return (
    <span className={`${ROW_PILL_ACTIVE} bg-[#FCEBEB] text-[#791F1F]`}>
      <span className="text-[8px] leading-none">▼</span>WIND DOWN
    </span>
  )
}

// ─── Pipeline-page pills (HTML reference) ───────────────────────────────────

function ValidatedPill({ v }: { v: PipelineVerdict }) {
  const base = 'text-[11px] font-semibold tracking-[0.01em] px-3 py-1 rounded-[20px] whitespace-nowrap'
  if (v === 'validated') return <span className={`${base} bg-brand text-white`}>VALIDATED</span>
  if (v === 'testing') return <span className={`${base} bg-surf-2 text-mid`}>TESTING</span>
  if (v === 'wind-down') return <span className={`${base} bg-warn-bg text-warn`}>WIND DOWN</span>
  return <span className={`${base} bg-danger-bg text-danger`}>KILLED</span>
}

function PipeRowPill({ v }: { v: RowVerdict }) {
  const base = 'text-[10px] font-semibold tracking-[0.04em] px-[9px] py-1 rounded-[4px] whitespace-nowrap inline-block'
  if (v === 'scaling') return <span className={`${base} bg-brand-bg text-brand`}>▲ SCALING</span>
  if (v === 'stable') return <span className={`${base} bg-surf-2 text-mid`}>STABLE</span>
  if (v === 'watch') return <span className={`${base} bg-warn-bg text-warn`}>WATCH</span>
  return <span className={`${base} bg-danger-bg text-danger`}>WIND DOWN</span>
}

// ─── Active-page chart (existing) ───────────────────────────────────────────

function smoothPathActive(vals: number[]) {
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

function ActiveChart({ bars, roasLine }: { bars: number[]; roasLine: number[] }) {
  const W = 800
  const H = 200
  const barW = 20
  const slotW = W / bars.length
  const maxBar = Math.max(...bars)
  const path = smoothPathActive(roasLine)

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

// ─── Pipeline-page chart (HTML reference: 800x148, 30pts, solid bars) ──────

function PipelineChart({ bars, roasLine }: { bars: number[]; roasLine: number[] }) {
  const W = 800
  const H = 148
  const slotW = W / bars.length
  const barW = slotW * 0.52
  const maxBar = Math.max(...bars)
  const minR = Math.min(...roasLine)
  const maxR = Math.max(...roasLine)
  const rngR = maxR - minR || 1

  const pts = roasLine.map((v, i) => ({
    x: i * slotW + slotW / 2,
    y: H * 0.06 + (1 - (v - minR) / rngR) * (H * 0.8),
  }))

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1]
    const c = pts[i]
    const dx = (c.x - p.x) / 3
    d += ` C ${(p.x + dx).toFixed(1)} ${p.y.toFixed(1)} ${(c.x - dx).toFixed(1)} ${c.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block" style={{ height: 148 }}>
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1="0" x2={W} y1={f * H} y2={f * H} stroke="#e0ddd8" strokeWidth="0.8" strokeDasharray="3 5" />
      ))}
      {bars.map((v, i) => {
        const bh = (v / maxBar) * H * 0.86
        const by = H - bh
        const x = i * slotW + (slotW - barW) / 2
        return <rect key={i} x={x.toFixed(1)} y={by.toFixed(1)} width={barW.toFixed(1)} height={bh.toFixed(1)} rx={2} fill="#c8ddd0" />
      })}
      <path d={d} fill="none" stroke="#2d5c3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Active-page atoms (existing) ───────────────────────────────────────────

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <div className="text-[10px] font-medium uppercase tracking-[0.03em] text-ink mb-1">{label}</div>
      <div className="text-[18px] font-medium text-ink leading-none">{value}</div>
    </div>
  )
}

function PlayOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[22px] h-[22px] rounded-full bg-black/40 border border-white/50 flex items-center justify-center text-white">
        <svg width="7" height="8" viewBox="0 0 7 8" fill="currentColor">
          <path d="M1 0.5l5.5 3.5L1 7.5V0.5z" />
        </svg>
      </div>
    </div>
  )
}

function ActiveCreativeThumb({ row }: { row: CreativeRow }) {
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

function ActiveActionIcons() {
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

// ─── Pipeline-page atoms (HTML reference) ───────────────────────────────────

const FMT_BG: Record<Format, string> = {
  UGC: '#2d5c3a',
  STATIC: '#4a4740',
  VIDEO: '#6b45a8',
  PDP: '#1e5faa',
}

function PipeFmtPill({ fmt }: { fmt: Format }) {
  return (
    <span
      className="absolute top-[5px] left-[5px] text-[8px] font-bold text-white px-[5px] py-[2px] rounded-[3px] leading-[12px] z-10"
      style={{ background: FMT_BG[fmt], letterSpacing: '0.05em' }}
    >
      {fmt}
    </span>
  )
}

function PipeCreativeThumb({ row }: { row: CreativeRow }) {
  return (
    <div className="relative w-14 h-14 rounded-[7px] overflow-hidden shrink-0" style={{ background: row.bg }}>
      <PipeFmtPill fmt={row.format} />
      {(row.format === 'UGC' || row.format === 'VIDEO') && <PlayOverlay />}
    </div>
  )
}

function PipeRowActions() {
  return (
    <div
      className="flex justify-end gap-2 transition-opacity"
      style={{ color: '#a09d98', opacity: 0.38 }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.opacity = '0.7')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.opacity = '0.38')}
    >
      <svg width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="2" y1="1" x2="2" y2="10" />
        <line x1="8" y1="1" x2="8" y2="10" />
      </svg>
      <span className="text-[14px] font-bold font-mono leading-none">⋯</span>
    </div>
  )
}

function PipeColHdr({ children, creative }: { children: ReactNode; creative?: boolean }) {
  return (
    <div
      className={`text-[9px] font-medium uppercase tracking-[0.06em] text-dim ${creative ? 'pl-3' : ''}`}
    >
      {children}
    </div>
  )
}

function PipeKpiTile({ label, value, delta, deltaSign }: Kpi) {
  const deltaColor = deltaSign === 'neg' ? 'text-danger' : 'text-brand'
  return (
    <div className="bg-white border border-line rounded-[10px] px-3.5 py-[11px] flex-1 flex flex-col justify-center">
      <div className="text-[9px] font-semibold uppercase tracking-[0.07em] text-dim mb-1.5">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-[17px] font-medium text-ink font-mono leading-none tracking-[-0.02em]">{value}</span>
        <span className={`text-[11px] font-medium font-mono ${deltaColor}`}>{delta}</span>
      </div>
    </div>
  )
}

function PipeProductBottleIcon({ gradient }: { gradient: string }) {
  // Stylized supplement bottle: gradient bg + lid + label band
  const [from, to] = gradient.match(/from-\[(#[a-f0-9]+)\] to-\[(#[a-f0-9]+)\]/i)?.slice(1) ?? ['#d4e8c8', '#7aaa7a']
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="prodGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" fill="url(#prodGrad)" />
      <ellipse cx="32" cy="28" rx="14" ry="14" fill="rgba(255,255,255,0.35)" />
      <ellipse cx="32" cy="27" rx="9" ry="9" fill="rgba(255,255,255,0.55)" />
      <rect x="20" y="43" width="24" height="4" rx="2" fill="rgba(255,255,255,0.45)" />
    </svg>
  )
}

// ─── Active-page render (unchanged) ─────────────────────────────────────────

function ActiveDetail({ product }: { product: ProductDetail }) {
  return (
    <>
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
        <ActiveChart bars={product.bars} roasLine={product.roasLine} />
        <div className="flex justify-between mt-1.5 px-5">
          {DATES.map(d => (
            <span key={d} className="text-[10px] text-ink">{d}</span>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className={`${GRID_ADS_ACTIVE} border-b-[0.5px] border-[#F0F1F3]`}>
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
            className={`${GRID_ADS_ACTIVE} ${i === arr.length - 1 ? '' : 'border-b-[0.5px] border-[#F0F1F3]'} transition-colors hover:bg-[#fafafa]`}
            style={row.winner ? { background: '#F0F9F4' } : undefined}
          >
            <ActiveCreativeThumb row={row} />
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
            <div><ActiveRowPill v={row.verdict} /></div>
            <ActiveActionIcons />
          </div>
        ))}
      </Card>
    </>
  )
}

// ─── Pipeline-page render (HTML reference) ──────────────────────────────────

function PipelineDetail({ product }: { product: ProductDetail }) {
  const pdpRows = product.creatives.filter(c => c.format === 'PDP')
  const adRows = product.creatives.filter(c => c.format !== 'PDP')
  const showPromote = product.pipelineVerdict === 'validated'
  const deltaCls =
    product.vsAvg && product.vsAvg.startsWith('-') ? 'text-danger' : 'text-brand'

  return (
    <>
      {/* Pipeline product header */}
      <section
        className="rounded-[10px] px-[22px] py-5 flex items-center gap-0"
        style={{ background: '#eef6f1', border: '1px solid #c2d4c8' }}
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className="w-16 h-16 rounded-[10px] overflow-hidden shrink-0 mt-px"
            style={{ border: '2px solid #c2d4c8', boxShadow: '0 2px 12px rgba(45,92,58,0.12)' }}
          >
            <PipeProductBottleIcon gradient={product.gradient ?? 'from-[#d4e8c8] to-[#7aaa7a]'} />
          </div>
          <div className="pt-px">
            <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-brand opacity-70 mb-[5px]">
              Pipeline Product
            </p>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-[18px] font-medium text-ink tracking-[-0.025em] leading-none">
                {product.name}
              </h1>
              {product.pipelineVerdict && <ValidatedPill v={product.pipelineVerdict} />}
            </div>
            <p className="text-[11px] text-mid mb-[7px]">{product.subline}</p>
            {product.vsAvg && (
              <p className="text-[12px] text-mid">
                vs catalog avg ROAS: <strong className={`font-semibold ${deltaCls}`}>{product.vsAvg}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3.5 shrink-0">
          <div className="flex">
            {[
              { label: 'Spend', value: product.spend },
              { label: 'Blended ROAS', value: product.roas },
              { label: 'Avg CVR', value: product.cvr },
            ].map((k, i) => (
              <div
                key={k.label}
                className="text-right pl-[26px]"
                style={i > 0 ? { borderLeft: '1px solid #c2d4c8', marginLeft: 26 } : undefined}
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-brand opacity-[0.65] mb-[5px]">
                  {k.label}
                </p>
                <p className="text-[22px] font-medium text-ink font-mono leading-none tracking-[-0.035em]">
                  {k.value}
                </p>
              </div>
            ))}
          </div>
          {showPromote && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-brand text-white border-0 rounded-[7px] px-4 py-2 text-[12px] font-medium tracking-[-0.01em] whitespace-nowrap cursor-pointer hover:opacity-90"
            >
              Promote to catalog
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Chart + KPI sidebar */}
      <div className="grid grid-cols-[1fr_196px] gap-3.5">
        <section className="bg-white border border-line rounded-[10px] px-5 pt-4 pb-[13px]">
          <div className="flex items-center mb-4">
            <span className="text-[13px] font-medium text-ink tracking-[-0.01em] mr-3.5">Performance over time</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-mid">
                <span className="block w-4 rounded-[2px] shrink-0" style={{ height: 2.5, background: '#2d5c3a' }} />
                ROAS
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-mid">
                <span className="block w-3 h-2.5 rounded-[2px] shrink-0" style={{ background: '#c8ddd0' }} />
                Spend
              </span>
            </div>
            <span className="ml-auto text-[11px] text-dim font-mono">{DATE_RANGE}</span>
          </div>
          <PipelineChart bars={product.bars} roasLine={product.roasLine} />
          <div className="flex justify-between mt-[9px]">
            {DATES.map(d => (
              <span key={d} className="text-[10px] text-dim font-mono">{d}</span>
            ))}
          </div>
        </section>

        <aside className="flex flex-col gap-2.5">
          {product.kpis?.map(k => (
            <PipeKpiTile key={k.label} {...k} />
          ))}
        </aside>
      </div>

      {/* Creatives table */}
      <section className="bg-white border border-line rounded-[10px] overflow-hidden">
        {/* PRODUCT PAGE section */}
        <div className="px-4 pt-[11px] pb-[9px] border-b border-line flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-mid">Product page</span>
          <span className="text-[10px] font-semibold text-dim font-mono">· {pdpRows.length}</span>
        </div>

        {/* PDP column headers */}
        <div className={`${GRID_PDP_PIPE} pt-2 pb-2 border-b border-line-soft`}>
          <div />
          <PipeColHdr creative>Page</PipeColHdr>
          <PipeColHdr>Days Live</PipeColHdr>
          <PipeColHdr>CVR</PipeColHdr>
          <PipeColHdr>Verdict</PipeColHdr>
          <div />
        </div>

        {/* PDP rows */}
        {pdpRows.map(row => (
          <div
            key={row.id}
            className={`${GRID_PDP_PIPE} pt-[11px] pb-[11px] border-b border-line cursor-pointer transition-colors hover:bg-black/[0.02]`}
          >
            <PipeCreativeThumb row={row} />
            <div className="pl-3 min-w-0">
              <div className="flex items-center gap-[7px] mb-0.5 flex-wrap">
                <span className="text-[13px] font-medium text-ink">{row.name}</span>
              </div>
              <span className="text-[11px] text-dim">{row.angle}</span>
            </div>
            <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.daysLive}</span>
            <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.cvr}</span>
            <PipeRowPill v={row.verdict} />
            <PipeRowActions />
          </div>
        ))}

        {/* ADS section */}
        <div className="px-4 pt-[11px] pb-[9px] border-b border-line border-t border-t-line flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-mid">Ads</span>
          <span className="text-[10px] font-semibold text-dim font-mono">· {adRows.length}</span>
          <span className="text-[11px] text-dim ml-0.5">Sending traffic to the page above:</span>
        </div>

        {/* Ads column headers */}
        <div className={`${GRID_ADS_PIPE} pt-2 pb-2 border-b border-line-soft`}>
          <div />
          <PipeColHdr creative>Creative</PipeColHdr>
          <PipeColHdr>Days Live</PipeColHdr>
          <PipeColHdr>Spend</PipeColHdr>
          <PipeColHdr>ROAS</PipeColHdr>
          <PipeColHdr>CVR</PipeColHdr>
          <PipeColHdr>CTR</PipeColHdr>
          <PipeColHdr>Verdict</PipeColHdr>
          <div />
        </div>

        {/* Ad rows */}
        {adRows.map((row, i, arr) => {
          const last = i === arr.length - 1
          return (
            <div
              key={row.id}
              className={`${GRID_ADS_PIPE} pt-[11px] pb-[11px] ${last ? '' : 'border-b border-line-soft'} cursor-pointer transition-colors`}
              style={row.winner ? { background: '#eef6f1' } : undefined}
              onMouseEnter={e => {
                if (row.winner) (e.currentTarget as HTMLDivElement).style.background = '#e6f3ec'
                else (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.02)'
              }}
              onMouseLeave={e => {
                if (row.winner) (e.currentTarget as HTMLDivElement).style.background = '#eef6f1'
                else (e.currentTarget as HTMLDivElement).style.background = ''
              }}
            >
              <PipeCreativeThumb row={row} />
              <div className="pl-3 min-w-0">
                <div className="flex items-center gap-[7px] mb-0.5 flex-wrap">
                  <span className="text-[13px] font-medium text-ink">{row.name}</span>
                  {row.winner && (
                    <span className="text-[9px] font-semibold tracking-[0.05em] bg-brand-bg text-brand px-[7px] py-[2px] rounded-[3px]">
                      WINNER
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-dim">{row.angle}</span>
              </div>
              <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.daysLive}</span>
              <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.spend}</span>
              <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.roas}</span>
              <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.cvr}</span>
              <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.ctr}</span>
              <PipeRowPill v={row.verdict} />
              <PipeRowActions />
            </div>
          )
        })}
      </section>
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

  if (product.kind === 'pipeline') {
    return (
      <div className="font-sans bg-white min-h-full">
        <div className="max-w-[1020px] px-6 pt-5 pb-16">
          <a
            onClick={() => navigate('/performance')}
            className="inline-flex items-center gap-[5px] text-[11px] text-dim tracking-[-0.01em] no-underline cursor-pointer mb-1 hover:text-ink"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5.5H2M4.5 3L2 5.5 4.5 8" />
            </svg>
            <span>Back to Performance</span>
          </a>
          <div className="flex flex-col gap-3.5 mt-1">
            <PipelineDetail product={product} />
          </div>
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
        <ActiveDetail product={product} />
      </div>
    </div>
  )
}

export default PerformanceProduct
