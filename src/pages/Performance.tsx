import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Data ────────────────────────────────────────────────────────────────────

type Verdict = 'performing' | 'stable' | 'watch'
type PipelineVerdict = 'validated' | 'testing' | 'wind-down' | 'killed'

type Product = {
  slug: string
  name: string
  img?: string
  gradient?: string
  status: string
  spend: string
  roas: string
  cvr: string
  pipeline: boolean
  verdict: Verdict | PipelineVerdict
}

const ACTIVE_PRODUCTS: Product[] = [
  {
    slug: 'zzzplex-sleep-support',
    name: 'ZzzPlex Sleep Support',
    img: '/uploads/IMG_3474.jpg',
    status: '1 PDP · 2 ads',
    spend: '$8.6k',
    roas: '3.4×',
    cvr: '2.1%',
    pipeline: false,
    verdict: 'stable',
  },
  {
    slug: 'ashwagandha-plus',
    name: 'ASHWAGANDHA+',
    img: '/uploads/IMG_3476.jpg',
    status: 'No PDP · 1 ad',
    spend: '$3.6k',
    roas: '2.1×',
    cvr: '1.4%',
    pipeline: false,
    verdict: 'watch',
  },
  {
    slug: 'vitamin-d3-k2-complex',
    name: 'Vitamin D3 + K2 Complex',
    img: '/uploads/Screenshot 2026-05-11 at 9.01.38 PM.png',
    status: '1 PDP · 1 ad',
    spend: '$4.2k',
    roas: '2.9×',
    cvr: '1.9%',
    pipeline: false,
    verdict: 'stable',
  },
]

const PIPELINE_PRODUCTS: Product[] = [
  {
    slug: 'magnesium-ashwagandha-gummies',
    name: 'Magnesium + Ashwagandha Tablets',
    img: '/uploads/IMG_3505.jpg',
    status: '1 PDP · 4 ads',
    spend: '$4.2k',
    roas: '4.6×',
    cvr: '3.1%',
    pipeline: true,
    verdict: 'validated',
  },
]

// ─── Pills ───────────────────────────────────────────────────────────────────

const PILL_BASE =
  'text-[11px] font-medium px-2.5 py-[3px] rounded-[12px] inline-flex items-center gap-1'

function StatusPill({ v }: { v: Verdict | PipelineVerdict }) {
  if (v === 'performing') {
    return (
      <span className={`${PILL_BASE} bg-[#EAF3DE] text-[#27500A]`}>
        <span className="text-[9px] leading-none">▲</span>
        Performing
      </span>
    )
  }
  if (v === 'stable') {
    return <span className={`${PILL_BASE} bg-[#F0F1F3] text-[#4B5563]`}>Stable</span>
  }
  if (v === 'watch') {
    return <span className={`${PILL_BASE} bg-[#FEF3D7] text-[#92400E]`}>Watch</span>
  }
  if (v === 'validated') {
    return (
      <span className={`${PILL_BASE} bg-[#EAF3DE] text-[#27500A] tracking-[0.03em]`}>
        VALIDATED
      </span>
    )
  }
  if (v === 'testing') {
    return (
      <span className={`${PILL_BASE} bg-[#F0F1F3] text-[#4B5563] tracking-[0.03em]`}>
        TESTING
      </span>
    )
  }
  if (v === 'wind-down') {
    return (
      <span className={`${PILL_BASE} bg-[#FEF3D7] text-[#92400E] tracking-[0.03em]`}>
        WIND DOWN
      </span>
    )
  }
  return (
    <span className={`${PILL_BASE} bg-[#FCEBEB] text-[#791F1F] tracking-[0.03em]`}>
      KILLED
    </span>
  )
}

// ─── Stats row ───────────────────────────────────────────────────────────────

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-7 flex flex-col">
      <div className="text-[10px] font-medium uppercase tracking-[0.04em] text-ink mb-1">
        {label}
      </div>
      <div className="text-[22px] font-medium text-ink leading-none">{value}</div>
    </div>
  )
}

function StatDivider() {
  return <div className="w-[0.5px] h-10 bg-[#E5E7EB] self-center shrink-0" />
}

// ─── Card ────────────────────────────────────────────────────────────────────

function MetricCol({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.03em] text-ink mb-0.5">
        {label}
      </div>
      <div className="text-[17px] font-medium text-ink leading-tight">{value}</div>
    </div>
  )
}

function ProductCard({ p, onClick }: { p: Product; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border-[0.5px] border-[#e5e7eb] rounded-[10px] px-[20px] py-[22px] cursor-pointer transition-colors hover:border-[#d1d5db] hover:bg-[#fafafa]"
    >
      <div className="flex items-center gap-3 mb-[18px]">
        {p.img ? (
          <img
            src={p.img}
            alt=""
            className="w-[52px] h-[52px] rounded-lg object-cover shrink-0 border-[0.5px] border-[#e5e7eb]"
          />
        ) : (
          <div className={`w-[52px] h-[52px] rounded-lg shrink-0 bg-gradient-to-br ${p.gradient}`} />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-ink truncate">{p.name}</div>
          <div className="text-[11px] text-ink mt-0.5">{p.status}</div>
        </div>
        {p.pipeline && (
          <span
            className="text-[8px] font-medium tracking-[0.05em] uppercase text-white px-1.5 py-px rounded shrink-0"
            style={{ background: 'rgba(15, 30, 60, 0.9)' }}
          >
            PIPELINE
          </span>
        )}
      </div>

      <div className="flex items-start justify-between mb-[18px]">
        <MetricCol label="SPEND" value={p.spend} />
        <MetricCol label="ROAS" value={p.roas} />
        <MetricCol label="CVR" value={p.cvr} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t-[0.5px] border-[#F0F1F3]">
        <StatusPill v={p.verdict} />
        <span className="text-[11px] font-medium text-ink cursor-pointer">View details →</span>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

type Tab = 'active' | 'pipeline'

function Performance() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('active')
  const products = tab === 'active' ? ACTIVE_PRODUCTS : PIPELINE_PRODUCTS

  return (
    <div className="font-sans">
      <div className="max-w-[1200px] mx-auto px-6 pt-5 pb-12">
        {/* Header */}
        <div className="mb-[22px]">
          <div className="text-[22px] font-medium text-ink tracking-[-0.02em] mb-1">Performance</div>
          <div className="text-[13px] text-ink">Live creative across active and pipeline products</div>
        </div>

        {/* Sub-tabs */}
        <div className="border-b-[0.5px] border-[#E5E7EB] mb-[22px]">
          <div className="flex gap-7">
            {([
              { id: 'active', label: 'Active products' },
              { id: 'pipeline', label: 'Pipeline products' },
            ] as { id: Tab; label: string }[]).map(t => {
              const sel = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`text-[13px] pb-3 cursor-pointer bg-transparent border-0 text-ink ${
                    sel ? 'font-medium border-b-2 border-ink -mb-[0.5px]' : 'font-normal'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[10px] px-[18px] py-[22px] mb-[22px]">
          <div className="flex items-stretch">
            <StatCell label="ACTIVE CREATIVES" value="11" />
            <StatDivider />
            <StatCell label="TOTAL SPEND · 30D" value="$16.4k" />
            <StatDivider />
            <StatCell label="BLENDED ROAS" value="3.2×" />
            <StatDivider />
            <StatCell label="AVG CVR" value="2.0%" />
            <StatDivider />
            <StatCell label="PRODUCTS LIVE" value="3" />
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-[14px]">
          <span className="text-[14px] font-medium text-ink">Products</span>
          <div className="flex gap-2 items-center">
            <select className="text-[12px] text-ink border-[0.5px] border-[#D1D5DB] rounded-md py-[5px] px-2.5 bg-white outline-none cursor-pointer">
              <option>Sort: Spend ↓</option>
              <option>Sort: ROAS ↓</option>
              <option>Sort: CVR ↓</option>
              <option>Sort: Name</option>
            </select>
            <select className="text-[12px] text-ink border-[0.5px] border-[#D1D5DB] rounded-md py-[5px] px-2.5 bg-white outline-none cursor-pointer">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {products.map(p => (
            <ProductCard
              key={p.slug}
              p={p}
              onClick={() => navigate(`/performance/${p.slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Performance
