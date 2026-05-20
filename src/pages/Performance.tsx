import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Data ────────────────────────────────────────────────────────────────────

type Verdict = 'performing' | 'stable' | 'watch'
type PipelineVerdict = 'validated' | 'testing' | 'wind-down' | 'killed'

type ActiveProduct = {
  slug: string
  name: string
  img: string
  status: string
  spend: string
  roas: string
  cvr: string
  verdict: Verdict
}

type PipelineProduct = {
  slug: string
  name: string
  gradient: string
  status: string
  spend: string
  roas: string
  cvr: string
  verdict: PipelineVerdict
  vsAvg: { delta: string; sign: 'pos' | 'neg' | 'flat' }
}

const ACTIVE_PRODUCTS: ActiveProduct[] = [
  {
    slug: 'magnesium-glycinate-complex',
    name: 'Magnesium Glycinate Complex',
    img: '/uploads/IMG_3472.jpg',
    status: '1 PDP · 3 ads',
    spend: '$12.4k',
    roas: '4.1×',
    cvr: '2.8%',
    verdict: 'performing',
  },
  {
    slug: 'zzzplex-sleep-support',
    name: 'ZzzPlex Sleep Support',
    img: '/uploads/IMG_3474.jpg',
    status: '1 PDP · 2 ads',
    spend: '$8.6k',
    roas: '3.4×',
    cvr: '2.1%',
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
    verdict: 'watch',
  },
]

const PIPELINE_PRODUCTS: PipelineProduct[] = [
  {
    slug: 'magnesium-ashwagandha-gummies',
    name: 'Magnesium + Ashwagandha Gummies',
    gradient: 'from-[#a7f3d0] to-[#34d399]',
    status: '1 PDP · 4 ads',
    spend: '$4.2k',
    roas: '4.6×',
    cvr: '3.1%',
    verdict: 'validated',
    vsAvg: { delta: '+21%', sign: 'pos' },
  },
  {
    slug: 'sleep-stress-tincture',
    name: 'Sleep + Stress Tincture',
    gradient: 'from-[#c4b5fd] to-[#8b5cf6]',
    status: '1 PDP · 3 ads',
    spend: '$2.1k',
    roas: '3.8×',
    cvr: '2.4%',
    verdict: 'testing',
    vsAvg: { delta: 'even', sign: 'flat' },
  },
  {
    slug: 'probiotic-calm-blend',
    name: 'Probiotic + Calm Blend',
    gradient: 'from-[#fecdd3] to-[#fb7185]',
    status: '1 PDP · 2 ads',
    spend: '$0.9k',
    roas: '2.3×',
    cvr: '1.6%',
    verdict: 'wind-down',
    vsAvg: { delta: '-40%', sign: 'neg' },
  },
]

// ─── Verdict pills ───────────────────────────────────────────────────────────

function ActivePill({ v }: { v: Verdict }) {
  if (v === 'performing') {
    return (
      <span className="text-[11px] font-medium bg-brand-bg text-brand px-2.5 py-[3px] rounded-[12px] flex items-center gap-1">
        <span className="text-[9px] leading-none">▲</span>
        Performing
      </span>
    )
  }
  if (v === 'stable') {
    return (
      <span className="text-[11px] font-medium bg-[#f0f1f3] text-ink px-2.5 py-[3px] rounded-[12px]">
        Stable
      </span>
    )
  }
  return (
    <span className="text-[11px] font-medium bg-[#fef3d7] text-[#92400e] px-2.5 py-[3px] rounded-[12px]">
      Watch
    </span>
  )
}

function PipelinePill({ v }: { v: PipelineVerdict }) {
  if (v === 'validated') {
    return (
      <span className="text-[11px] font-medium bg-brand-bg text-brand px-2.5 py-[3px] rounded-[12px] tracking-[0.03em]">
        VALIDATED
      </span>
    )
  }
  if (v === 'testing') {
    return (
      <span className="text-[11px] font-medium bg-[#f0f1f3] text-ink px-2.5 py-[3px] rounded-[12px] tracking-[0.03em]">
        TESTING
      </span>
    )
  }
  if (v === 'wind-down') {
    return (
      <span className="text-[11px] font-medium bg-[#fef3d7] text-[#92400e] px-2.5 py-[3px] rounded-[12px] tracking-[0.03em]">
        WIND DOWN
      </span>
    )
  }
  return (
    <span className="text-[11px] font-medium bg-[#fcebeb] text-[#791f1f] px-2.5 py-[3px] rounded-[12px] tracking-[0.03em]">
      KILLED
    </span>
  )
}

// ─── Stats row (Dashboard market-signals pattern) ────────────────────────────

function StatCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2">
      <div className="text-[10px] font-medium text-ink uppercase tracking-[0.04em]">{label}</div>
      <div className="text-[26px] font-medium text-ink leading-none">{value}</div>
    </div>
  )
}

function StatDivider() {
  return <div className="w-px h-9 bg-[#6b7280] self-center shrink-0" />
}

// ─── Cards ───────────────────────────────────────────────────────────────────

function MetricCol({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <div className="text-[10px] font-medium text-ink uppercase tracking-[0.03em] mb-0.5">{label}</div>
      <div className="text-[15px] font-medium text-ink leading-tight">{value}</div>
    </div>
  )
}

function ActiveCard({ p, onClick }: { p: ActiveProduct; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border-[0.5px] border-[#e5e7eb] rounded-[10px] px-[18px] py-5 cursor-pointer transition-colors hover:border-[#d1d5db] hover:bg-[#fafafa]"
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src={p.img}
          alt=""
          className="w-11 h-11 rounded-md object-cover shrink-0 border-[0.5px] border-[#e5e7eb]"
        />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-ink truncate">{p.name}</div>
          <div className="text-[11px] text-ink mt-0.5">{p.status}</div>
        </div>
      </div>

      <div className="flex items-start justify-between mb-4">
        <MetricCol label="SPEND" value={p.spend} />
        <MetricCol label="ROAS" value={p.roas} />
        <MetricCol label="CVR" value={p.cvr} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t-[0.5px] border-[#f0f1f3]">
        <ActivePill v={p.verdict} />
        <span className="text-[11px] font-medium text-ink cursor-pointer">View details →</span>
      </div>
    </div>
  )
}

function PipelineCard({ p, onClick }: { p: PipelineProduct; onClick: () => void }) {
  const deltaCls =
    p.vsAvg.sign === 'pos' ? 'text-brand' : p.vsAvg.sign === 'neg' ? 'text-[#791f1f]' : 'text-ink'
  return (
    <div
      onClick={onClick}
      className="bg-white border-[0.5px] border-[#e5e7eb] rounded-[10px] px-[18px] py-5 cursor-pointer transition-colors hover:border-[#d1d5db] hover:bg-[#fafafa]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 rounded-md shrink-0 bg-gradient-to-br ${p.gradient}`} />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-ink truncate">{p.name}</div>
          <div className="text-[11px] text-ink mt-0.5">{p.status}</div>
        </div>
        <span className="text-[9px] font-semibold tracking-[0.05em] uppercase text-ink bg-[#f0f1f3] px-1.5 py-px rounded shrink-0">
          PIPELINE
        </span>
      </div>

      <div className="flex items-start justify-between mb-4">
        <MetricCol label="SPEND" value={p.spend} />
        <MetricCol label="ROAS" value={p.roas} />
        <MetricCol label="CVR" value={p.cvr} />
      </div>

      <div className="pt-3 border-t-[0.5px] border-[#f0f1f3]">
        <div className="text-[10px] text-ink mb-2">
          vs catalog avg: <span className={`font-semibold ${deltaCls}`}>{p.vsAvg.delta}</span>
        </div>
        <div className="flex items-center justify-between">
          <PipelinePill v={p.verdict} />
          <span className="text-[11px] font-medium text-ink cursor-pointer">View details →</span>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

type Tab = 'active' | 'pipeline'

function Performance() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('active')

  return (
    <div className="font-sans">
      <div className="max-w-[1200px] mx-auto px-6 pt-5 pb-12">
        <div className="mb-[22px]">
          <div className="text-[22px] font-medium text-ink tracking-[-0.02em] mb-1">Performance</div>
          <div className="text-[13px] text-ink">Live creative across active and pipeline products</div>
        </div>

        <div className="border-b-[0.5px] border-line mb-[22px]">
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
                  className={`text-[13px] pb-3 cursor-pointer bg-transparent border-0 ${
                    sel
                      ? 'font-medium text-ink border-b-2 border-ink -mb-[0.5px]'
                      : 'font-normal text-ink'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-stretch gap-4 mb-[22px]">
          <StatCell label="ACTIVE CREATIVES" value="14" />
          <StatDivider />
          <StatCell label="TOTAL SPEND · 30D" value="$24.6k" />
          <StatDivider />
          <StatCell label="BLENDED ROAS" value="3.8×" />
          <StatDivider />
          <StatCell label="AVG CVR" value="2.4%" />
          <StatDivider />
          <StatCell label="PRODUCTS LIVE" value="3" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-ink">Products</span>
          <div className="flex gap-2 items-center">
            <select className="text-[12px] text-ink border-[0.5px] border-[#d1d5db] rounded-md px-2.5 py-[5px] bg-white outline-none cursor-pointer">
              <option>Sort: Spend ↓</option>
              <option>Sort: ROAS ↓</option>
              <option>Sort: CVR ↓</option>
              <option>Sort: Name</option>
            </select>
            <select className="text-[12px] text-ink border-[0.5px] border-[#d1d5db] rounded-md px-2.5 py-[5px] bg-white outline-none cursor-pointer">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {tab === 'active'
            ? ACTIVE_PRODUCTS.map(p => (
                <ActiveCard
                  key={p.slug}
                  p={p}
                  onClick={() => navigate(`/performance/${p.slug}`)}
                />
              ))
            : PIPELINE_PRODUCTS.map(p => (
                <PipelineCard
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
