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
  kpis: Kpi[]
  bars: number[]
  roasLine: number[]
  creatives: CreativeRow[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DATES = ['Apr 19', 'Apr 26', 'May 3', 'May 10', 'May 17']
const DATE_RANGE = 'Apr 19 – May 19'

const GRID_PDP = 'grid grid-cols-[68px_1fr_80px_80px_116px_42px] items-center pl-4 pr-6 gap-0'
const GRID_ADS = 'grid grid-cols-[68px_1fr_68px_72px_68px_64px_60px_116px_42px] items-center pl-4 pr-6 gap-0'

// ─── Demo data ───────────────────────────────────────────────────────────────

const MAG_CREATIVES: CreativeRow[] = [
  {
    id: 'm0', format: 'PDP',
    bg: 'linear-gradient(140deg, #F0F4F8, #B8C7D6)',
    name: 'Next-day calm landing page',
    angle: 'v1 · Sleep-Anxiety Crossover · PDP',
    daysLive: '32d', spend: '—', roas: '—', cvr: '2.4%', ctr: '—',
    verdict: 'scaling',
  },
  {
    id: 'm1', format: 'UGC',
    bg: 'linear-gradient(140deg, #E5C9D5, #B96F8E)',
    name: "Couldn't shut my brain off",
    angle: 'Sleep-Anxiety Crossover · UGC',
    daysLive: '22d', spend: '$6.2k', roas: '5.4×', cvr: '3.2%', ctr: '1.8%',
    verdict: 'scaling', winner: true,
  },
  {
    id: 'm2', format: 'STATIC',
    bg: 'linear-gradient(140deg, #E5E2C9, #B9B26F)',
    name: 'Lifestyle composition',
    angle: 'Lifestyle & Wellness · Static',
    daysLive: '18d', spend: '$3.4k', roas: '3.6×', cvr: '2.4%', ctr: '1.2%',
    verdict: 'stable',
  },
  {
    id: 'm3', format: 'VIDEO',
    bg: 'linear-gradient(140deg, #D5C9E5, #8E6FB9)',
    name: 'Tried everything for sleep',
    angle: 'Sleep-Anxiety Crossover · Video',
    daysLive: '14d', spend: '$2.1k', roas: '2.8×', cvr: '1.9%', ctr: '0.9%',
    verdict: 'watch',
  },
]

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
    kpis: [
      { label: 'Impressions', value: '520k', delta: '+14%', deltaSign: 'pos' },
      { label: 'CTR', value: '1.6%', delta: '+0.3', deltaSign: 'pos' },
      { label: 'ATCs', value: '1,520', delta: '+12%', deltaSign: 'pos' },
      { label: 'CPA', value: '$16.40', delta: '−$1.40', deltaSign: 'pos' },
    ],
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
    kpis: [
      { label: 'Impressions', value: '348k', delta: '+2%', deltaSign: 'pos' },
      { label: 'CTR', value: '1.1%', delta: '+0.1', deltaSign: 'pos' },
      { label: 'ATCs', value: '720', delta: '+1%', deltaSign: 'pos' },
      { label: 'CPA', value: '$19.20', delta: '+$0.30', deltaSign: 'neg' },
    ],
    bars: [55, 58, 62, 60, 65, 68, 72, 75, 78, 76, 82, 80, 85, 88, 84, 90, 92, 89, 94, 96, 92, 98],
    roasLine: [3.2, 3.1, 3.3, 3.4, 3.5, 3.4, 3.5, 3.3, 3.4, 3.5, 3.6, 3.5, 3.4, 3.5, 3.4, 3.5, 3.4, 3.5, 3.4, 3.4, 3.5, 3.4],
    creatives: [
      { id: 'z0', format: 'PDP', bg: 'linear-gradient(140deg, #E0E7FF, #8B9DCC)', name: 'Sleep quality landing page', angle: 'v1 · Sleep quality · PDP', daysLive: '28d', spend: '—', roas: '—', cvr: '2.1%', ctr: '—', verdict: 'stable' },
      { id: 'z1', format: 'STATIC', bg: 'linear-gradient(140deg, #DBEAFE, #1E3A8A)', name: 'Restful nights, sharper mornings', angle: 'Sleep quality · Static', daysLive: '21d', spend: '$5.1k', roas: '3.6×', cvr: '2.3%', ctr: '1.4%', verdict: 'stable' },
      { id: 'z2', format: 'UGC', bg: 'linear-gradient(140deg, #BFDBFE, #3B82F6)', name: 'Creator review walkthrough', angle: 'Sleep quality · UGC', daysLive: '16d', spend: '$3.5k', roas: '3.2×', cvr: '1.9%', ctr: '1.1%', verdict: 'stable' },
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
    kpis: [
      { label: 'Impressions', value: '142k', delta: '-6%', deltaSign: 'neg' },
      { label: 'CTR', value: '0.8%', delta: '-0.2', deltaSign: 'neg' },
      { label: 'ATCs', value: '248', delta: '-10%', deltaSign: 'neg' },
      { label: 'CPA', value: '$28.40', delta: '+$3.80', deltaSign: 'neg' },
    ],
    bars: [42, 46, 48, 52, 50, 54, 56, 52, 58, 54, 56, 50, 48, 52, 54, 50, 48, 52, 50, 46, 48, 44],
    roasLine: [2.8, 2.7, 2.6, 2.7, 2.6, 2.5, 2.4, 2.5, 2.4, 2.3, 2.4, 2.3, 2.2, 2.3, 2.2, 2.1, 2.2, 2.1, 2.0, 2.1, 2.0, 2.1],
    creatives: [
      { id: 'a1', format: 'UGC', bg: 'linear-gradient(140deg, #FDE68A, #D97706)', name: 'Stress-sleep angle test', angle: 'Stress-Sleep · UGC', daysLive: '12d', spend: '$3.6k', roas: '2.1×', cvr: '1.4%', ctr: '0.8%', verdict: 'watch' },
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

// ─── Pills ───────────────────────────────────────────────────────────────────

const HEADER_PILL_BASE = 'text-[11px] font-semibold tracking-[0.01em] px-3 py-1 rounded-[20px] whitespace-nowrap'

function ValidatedPill({ v }: { v: PipelineVerdict }) {
  if (v === 'validated') return <span className={`${HEADER_PILL_BASE} bg-brand text-white`}>VALIDATED</span>
  if (v === 'testing') return <span className={`${HEADER_PILL_BASE} bg-surf-2 text-ink`}>TESTING</span>
  if (v === 'wind-down') return <span className={`${HEADER_PILL_BASE} bg-warn-bg text-warn`}>WIND DOWN</span>
  return <span className={`${HEADER_PILL_BASE} bg-danger-bg text-danger`}>KILLED</span>
}

function ActivePill({ v }: { v: ActiveVerdict }) {
  if (v === 'performing') return <span className={`${HEADER_PILL_BASE} bg-brand-bg text-brand`}>PERFORMING</span>
  if (v === 'stable') return <span className={`${HEADER_PILL_BASE} bg-surf-2 text-ink`}>STABLE</span>
  return <span className={`${HEADER_PILL_BASE} bg-warn-bg text-warn`}>WATCH</span>
}

const ROW_PILL_BASE = 'text-[10px] font-semibold tracking-[0.04em] px-[9px] py-1 rounded-[4px] whitespace-nowrap inline-block'

function RowPill({ v }: { v: RowVerdict }) {
  if (v === 'scaling') return <span className={`${ROW_PILL_BASE} bg-brand-bg text-brand`}>▲ SCALING</span>
  if (v === 'stable') return <span className={`${ROW_PILL_BASE} bg-surf-2 text-ink`}>STABLE</span>
  if (v === 'watch') return <span className={`${ROW_PILL_BASE} bg-warn-bg text-warn`}>WATCH</span>
  return <span className={`${ROW_PILL_BASE} bg-danger-bg text-danger`}>WIND DOWN</span>
}

// ─── Chart ───────────────────────────────────────────────────────────────────

function PerformanceChart({ bars, roasLine }: { bars: number[]; roasLine: number[] }) {
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

// ─── Atoms ───────────────────────────────────────────────────────────────────

const FMT_BG: Record<Format, string> = {
  UGC: '#2d5c3a',
  STATIC: '#4a4740',
  VIDEO: '#6b45a8',
  PDP: '#1e5faa',
}

function FmtPill({ fmt }: { fmt: Format }) {
  return (
    <span
      className="absolute top-[5px] left-[5px] text-[8px] font-bold text-white px-[5px] py-[2px] rounded-[3px] leading-[12px] z-10"
      style={{ background: FMT_BG[fmt], letterSpacing: '0.05em' }}
    >
      {fmt}
    </span>
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

function CreativeThumb({ row }: { row: CreativeRow }) {
  return (
    <div className="relative w-14 h-14 rounded-[7px] overflow-hidden shrink-0" style={{ background: row.bg }}>
      <FmtPill fmt={row.format} />
      {(row.format === 'UGC' || row.format === 'VIDEO') && <PlayOverlay />}
    </div>
  )
}

function RowActions() {
  return (
    <div
      className="flex justify-end gap-1.5 text-ink transition-opacity"
      style={{ opacity: 0.38 }}
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

function ColHdr({ children, creative }: { children: ReactNode; creative?: boolean }) {
  return (
    <div className={`text-[9px] font-medium uppercase tracking-[0.06em] text-ink ${creative ? 'pl-3' : ''}`}>
      {children}
    </div>
  )
}

// ─── Product detail (handles both active + pipeline) ────────────────────────

function ProductDetail({ product }: { product: ProductDetail }) {
  const isPipeline = product.kind === 'pipeline'
  const showPromote = product.pipelineVerdict === 'validated'
  const pdpRows = product.creatives.filter(c => c.format === 'PDP')
  const adRows = product.creatives.filter(c => c.format !== 'PDP')
  const deltaCls = product.vsAvg && product.vsAvg.startsWith('-') ? 'text-danger' : 'text-brand'

  return (
    <>
      {/* Product header */}
      <section className="bg-white border border-line rounded-[10px] px-[22px] py-5 flex items-center gap-0">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {product.img ? (
            <img
              src={product.img}
              alt=""
              className="w-16 h-16 rounded-[10px] object-cover shrink-0 mt-px border border-line"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-[10px] overflow-hidden shrink-0 mt-px border border-line"
              style={{ background: 'linear-gradient(140deg, #f0ede8, #c8c1b5)' }}
            />
          )}
          <div className="pt-px">
            <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-brand opacity-70 mb-[5px]">
              {isPipeline ? 'Pipeline Product' : 'Product'}
            </p>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-[18px] font-medium text-ink tracking-[-0.025em] leading-none">{product.name}</h1>
              {isPipeline && product.pipelineVerdict && <ValidatedPill v={product.pipelineVerdict} />}
              {!isPipeline && product.activeVerdict && <ActivePill v={product.activeVerdict} />}
            </div>
            <p className="text-[11px] text-ink mb-[7px]">{product.subline}</p>
            {product.vsAvg && (
              <p className="text-[12px] text-ink">
                vs catalog avg ROAS: <strong className={`font-semibold ${deltaCls}`}>{product.vsAvg}</strong>
              </p>
            )}
          </div>
        </div>

        <div className={`flex shrink-0 ${showPromote ? 'flex-col items-end gap-3.5' : 'items-center'}`}>
          <div className="flex">
            {[
              { label: 'Spend', value: product.spend },
              { label: 'Blended ROAS', value: product.roas },
              { label: 'Avg CVR', value: product.cvr },
            ].map((k, i) => (
              <div
                key={k.label}
                className="text-right pl-[26px]"
                style={i > 0 ? { borderLeft: '1px solid #e8e5e0', marginLeft: 26 } : undefined}
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
              <span className="flex items-center gap-1.5 text-[11px] text-ink">
                <span className="block w-4 rounded-[2px] shrink-0" style={{ height: 2.5, background: '#2d5c3a' }} />
                ROAS
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-ink">
                <span className="block w-3 h-2.5 rounded-[2px] shrink-0" style={{ background: '#c8ddd0' }} />
                Spend
              </span>
            </div>
            <span className="ml-auto text-[11px] text-ink font-mono">{DATE_RANGE}</span>
          </div>
          <PerformanceChart bars={product.bars} roasLine={product.roasLine} />
          <div className="flex justify-between mt-[9px]">
            {DATES.map(d => (
              <span key={d} className="text-[10px] text-ink font-mono">{d}</span>
            ))}
          </div>
        </section>

        <aside className="bg-white border border-line rounded-[10px] overflow-hidden flex flex-col">
          {product.kpis.map((k, i) => (
            <div
              key={k.label}
              className={`px-3.5 py-[11px] flex-1 flex flex-col justify-center ${i > 0 ? 'border-t-[0.5px] border-line' : ''}`}
            >
              <div className="text-[9px] font-semibold uppercase tracking-[0.07em] text-ink mb-1.5">{k.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[17px] font-medium text-ink font-mono leading-none tracking-[-0.02em]">{k.value}</span>
                <span className={`text-[11px] font-medium font-mono ${k.deltaSign === 'neg' ? 'text-danger' : 'text-brand'}`}>{k.delta}</span>
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* Creatives table */}
      <section className="bg-white border border-line rounded-[10px] overflow-hidden">
        {pdpRows.length > 0 && (
          <>
            <div className="px-4 pt-[11px] pb-[9px] flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink">Product page</span>
              <span className="text-[10px] font-semibold text-ink font-mono">· {pdpRows.length}</span>
            </div>
            {pdpRows.map(row => (
              <div
                key={row.id}
                className={`${GRID_PDP} pt-[11px] pb-[11px] border-b border-line cursor-pointer transition-colors hover:bg-black/[0.02]`}
              >
                <CreativeThumb row={row} />
                <div className="pl-3 min-w-0">
                  <div className="flex items-center gap-[7px] mb-0.5 flex-wrap">
                    <span className="text-[13px] font-medium text-ink">{row.name}</span>
                  </div>
                  <span className="text-[11px] text-ink">{row.angle}</span>
                </div>
                <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.daysLive}</span>
                <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.cvr}</span>
                <RowPill v={row.verdict} />
                <RowActions />
              </div>
            ))}
          </>
        )}

        {adRows.length > 0 && (
          <>
            <div className="px-4 pt-[11px] pb-[9px] flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink">Ads</span>
              <span className="text-[10px] font-semibold text-ink font-mono">· {adRows.length}</span>
              <span className="text-[11px] text-ink ml-0.5">Sending traffic to the page above:</span>
            </div>
            <div className={`${GRID_ADS} pt-2 pb-2 border-b border-line-soft`}>
              <div />
              <ColHdr creative>Creative</ColHdr>
              <ColHdr>Days Live</ColHdr>
              <ColHdr>Spend</ColHdr>
              <ColHdr>ROAS</ColHdr>
              <ColHdr>CVR</ColHdr>
              <ColHdr>CTR</ColHdr>
              <ColHdr>Verdict</ColHdr>
              <div />
            </div>
            {adRows.map((row, i, arr) => {
              const last = i === arr.length - 1
              return (
                <div
                  key={row.id}
                  className={`${GRID_ADS} pt-[11px] pb-[11px] ${last ? '' : 'border-b border-line-soft'} cursor-pointer transition-colors hover:bg-black/[0.02]`}
                >
                  <CreativeThumb row={row} />
                  <div className="pl-3 min-w-0">
                    <div className="flex items-center gap-[7px] mb-0.5 flex-wrap">
                      <span className="text-[13px] font-medium text-ink">{row.name}</span>
                      {row.winner && (
                        <span className="text-[9px] font-semibold tracking-[0.05em] bg-brand-bg text-brand px-[7px] py-[2px] rounded-[3px]">
                          WINNER
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-ink">{row.angle}</span>
                  </div>
                  <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.daysLive}</span>
                  <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.spend}</span>
                  <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.roas}</span>
                  <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.cvr}</span>
                  <span className="text-[13px] text-ink font-mono tracking-[-0.01em]">{row.ctr}</span>
                  <RowPill v={row.verdict} />
                  <RowActions />
                </div>
              )
            })}
          </>
        )}
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
          <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] px-6 py-12 flex items-center justify-center">
            <div className="text-[13px] text-ink">Product not found · <span className="font-mono">{slug}</span></div>
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
        <div className="flex flex-col gap-3.5">
          <ProductDetail product={product} />
        </div>
      </div>
    </div>
  )
}

export default PerformanceProduct
