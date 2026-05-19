import { useState, useMemo, useRef, useEffect, type ReactNode } from 'react'

// ─── Types & data ────────────────────────────────────────────────────────────

type ProductState = 'In Market' | 'Testing' | 'Researching' | 'Suggested'
type AdSat = 'Low' | 'Mod' | 'High'

type Product = {
  id: number
  name: string
  sku: string
  state: ProductState
  platforms: string
  price: string
  rev: string
  margin: string
  score: number
  sentiment: string
  adSat: AdSat
  adCount: number
  findings: number
  spark: number[]
  sparkPos: boolean
  imgIdx: number
}

const PRODUCT_IMAGES = [
  '/uploads/IMG_3472.jpg',
  '/uploads/IMG_3474.jpg',
  '/uploads/Screenshot 2026-05-11 at 9.01.38 PM.png',
  '/uploads/IMG_3476.jpg',
  '/uploads/Screenshot 2026-05-11 at 9.01.01 PM.png',
  '/uploads/Screenshot 2026-05-11 at 9.00.15 PM.png',
  '/uploads/Screenshot 2026-05-11 at 9.02.37 PM.png',
]

const ALL_PRODUCTS: Product[] = [
  { id: 1, name: 'Magnesium Glycinate Complex', sku: 'MAG-GLY-120', state: 'In Market', platforms: 'Meta · TikTok · Amazon · Reddit', price: '$34.99', rev: '$18,420', margin: '38.4%', score: 84, sentiment: 'Positive', adSat: 'Mod', adCount: 20, findings: 2, spark: [60, 65, 70, 72, 78, 82, 84], sparkPos: true, imgIdx: 0 },
  { id: 2, name: 'ZzzPlex Sleep Support', sku: 'ZZZ-SLP-60', state: 'In Market', platforms: 'Meta · Google · Amazon', price: '$28.99', rev: '$11,340', margin: '31.2%', score: 71, sentiment: 'Neutral', adSat: 'High', adCount: 34, findings: 1, spark: [75, 72, 68, 65, 69, 71, 71], sparkPos: false, imgIdx: 1 },
  { id: 3, name: 'Vitamin D3 + K2 Complex', sku: 'VIT-D3K2-90', state: 'In Market', platforms: 'Amazon · Google', price: '$22.99', rev: '$7,840', margin: '42.1%', score: 68, sentiment: 'Positive', adSat: 'Low', adCount: 8, findings: 0, spark: [50, 52, 55, 58, 60, 65, 68], sparkPos: true, imgIdx: 2 },
  { id: 4, name: 'ASHWAGANDHA+', sku: 'ASH-PLUS-60', state: 'Testing', platforms: 'Meta · TikTok', price: '$29.99', rev: '—', margin: '36.8%', score: 63, sentiment: 'Positive', adSat: 'Low', adCount: 4, findings: 0, spark: [40, 45, 52, 58, 60, 61, 63], sparkPos: true, imgIdx: 3 },
  { id: 5, name: 'Mag + Ashwagandha Gummies', sku: 'MAG-ASH-60', state: 'Researching', platforms: 'Meta · Shopify · TikTok', price: '$32.99', rev: '—', margin: '33.5%', score: 77, sentiment: 'Positive', adSat: 'Low', adCount: 6, findings: 1, spark: [50, 55, 60, 65, 70, 74, 77], sparkPos: true, imgIdx: 4 },
  { id: 6, name: 'Magnesium L-Threonate', sku: 'MAG-LT-60', state: 'Suggested', platforms: 'Reddit · Amazon · Google', price: '$39.99', rev: '—', margin: '41.2%', score: 79, sentiment: 'Positive', adSat: 'Low', adCount: 3, findings: 2, spark: [50, 55, 60, 65, 70, 75, 79], sparkPos: true, imgIdx: 5 },
  { id: 7, name: 'Glycine + Magnesium Stack', sku: 'GLY-MAG-90', state: 'Suggested', platforms: 'Amazon · Reddit', price: '$31.99', rev: '—', margin: '38.9%', score: 61, sentiment: 'Neutral', adSat: 'Low', adCount: 2, findings: 0, spark: [30, 35, 40, 45, 50, 55, 61], sparkPos: true, imgIdx: 6 },
]

const PLATFORM_DOT: Record<string, string> = {
  Meta: '#1877f2',
  TikTok: '#010101',
  Amazon: '#ff9900',
  Reddit: '#ff4500',
  Google: '#4285f4',
  Shopify: '#96bf48',
  YouTube: '#ff0000',
}

const STATE_LABEL: Record<ProductState, string> = {
  'In Market': 'IN MARKET',
  Testing: 'TESTING',
  Researching: 'RESEARCHING',
  Suggested: 'SUGGESTED',
}
const STATE_COLOR: Record<ProductState, string> = {
  'In Market': '#2d5c3a',
  Testing: '#2563eb',
  Researching: '#a16207',
  Suggested: '#a09d98',
}

const STATE_OPTIONS: ('All' | ProductState)[] = ['All', 'Suggested', 'Researching', 'Testing', 'In Market']
const SORT_OPTIONS = ['Score', 'Revenue', 'Findings'] as const
type Sort = (typeof SORT_OPTIONS)[number]

// ─── Atoms ───────────────────────────────────────────────────────────────────

function Spark({ data, color, w = 60, h = 20 }: { data: number[]; color: string; w?: number; h?: number }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const rng = max - min || 1
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / rng) * (h - 4) - 2}`)
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function ChevDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3.5 3.5L9 4" />
    </svg>
  )
}

function Dropdown({ label, value, options, onChange }: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer select-none hover:bg-line-soft"
      >
        <span className="text-[11px] text-dim">{label}:</span>
        <span className="text-[11px] text-ink font-medium">{value}</span>
        <span className="text-mid"><ChevDown /></span>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 bg-surf rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.1)] z-50 min-w-[180px] overflow-hidden">
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`px-3.5 py-2 text-[12px] cursor-pointer hover:bg-surf-2 ${
                opt === value ? 'text-ink font-medium bg-surf-2' : 'text-mid'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Table ───────────────────────────────────────────────────────────────────

const GRID_COLS = 'grid-cols-[52px_minmax(0,1fr)_90px_84px_84px_84px_80px_120px_36px]'
const HEADER_ALIGN = ['', '', 'text-center', 'text-center', 'text-center', 'text-center', 'text-center', '', '']

function TableHeader() {
  const labels = ['', 'PRODUCT', 'SCORE', 'REVENUE', 'MARGIN', 'AD SAT.', 'TREND', 'STAGE', '']
  return (
    <div className={`grid ${GRID_COLS} gap-4 px-6 py-2.5 border-b border-line-soft bg-surf rounded-t-[10px]`}>
      {labels.map((h, i) => (
        <div key={i} className={`text-[9px] font-bold tracking-[0.08em] text-dim ${HEADER_ALIGN[i]}`}>
          {h}
        </div>
      ))}
    </div>
  )
}

function ProductRow({ product, last }: { product: Product; last: boolean }) {
  const { name, state, platforms, price, rev, margin, score, adSat, adCount, findings, spark, sparkPos, imgIdx } = product
  const scoreColor = score >= 75 ? '#1d6b3a' : score >= 55 ? '#a16207' : '#dc2626'
  const adSatColor = adSat === 'Low' ? '#2d5c3a' : adSat === 'High' ? '#dc2626' : '#a16207'
  const stateColor = STATE_COLOR[state]
  const platList = platforms.split(' · ').slice(0, 5)

  return (
    <div className={`group grid ${GRID_COLS} gap-4 items-center px-6 py-3.5 cursor-pointer hover:bg-black/[0.02] ${last ? '' : 'border-b border-line-soft'}`}>
      <div className="w-11 h-11 rounded-lg overflow-hidden border border-line shrink-0">
        <img src={PRODUCT_IMAGES[imgIdx % PRODUCT_IMAGES.length]} alt="" className="w-full h-full object-cover block" />
      </div>

      <div className="min-w-0">
        <div className="text-[14px] font-medium text-ink mb-[3px] truncate">{name}</div>
        <div className="text-[11px] text-dim mb-[5px]">
          {platList.map((p, i) => (
            <span key={p}>
              <span className="inline-flex items-center gap-[3px]">
                <span className="w-[5px] h-[5px] rounded-full inline-block shrink-0 align-middle" style={{ background: PLATFORM_DOT[p] || '#a09d98' }} />
                <span className="text-dim">{p}</span>
              </span>
              {i < platList.length - 1 && <span className="text-line-soft mx-1">·</span>}
            </span>
          ))}
          <span className="text-dim mx-1.5">·</span>
          <span className="text-dim">{price}</span>
        </div>
        {findings > 0 && (
          <span className="text-[10px] font-semibold bg-brand-bg text-brand px-[7px] py-px rounded-[3px]">
            {findings} finding{findings > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="text-center">
        <div className="text-[22px] font-semibold font-mono tracking-[-0.03em] leading-none" style={{ color: scoreColor }}>{score}</div>
      </div>

      <div className="text-center">
        <div className={`text-[13px] font-medium font-mono tabular-nums ${rev === '—' ? 'text-dim' : 'text-ink'}`}>{rev}</div>
        {rev !== '—' && <div className="text-[10px] text-dim mt-px">30d</div>}
      </div>

      <div className="text-center">
        <div className="text-[12px] font-mono text-ink font-medium">{margin}</div>
        <div className="text-[10px] text-dim mt-px">margin</div>
      </div>

      <div className="text-center">
        <div className="text-[12px] font-medium" style={{ color: adSatColor }}>{adSat}</div>
        <div className="text-[10px] text-dim font-mono mt-px">{adCount}</div>
      </div>

      <div className="flex justify-center">
        <Spark data={spark} color={sparkPos ? '#2d7a4f' : '#dc2626'} w={60} h={20} />
      </div>

      <div className="flex items-center gap-1 cursor-pointer">
        <span className="text-[10px] font-bold tracking-[0.06em] whitespace-nowrap" style={{ color: stateColor }}>{STATE_LABEL[state]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={stateColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 5h6M6 3l2 2-2 2" />
        </svg>
      </div>

      <div className="flex justify-center">
        <span
          onClick={e => e.stopPropagation()}
          className="text-dim cursor-pointer flex p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
            <circle cx="6.5" cy="2.5" r="1.1" />
            <circle cx="6.5" cy="6.5" r="1.1" />
            <circle cx="6.5" cy="10.5" r="1.1" />
          </svg>
        </span>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

function ActiveProducts() {
  const [stateFilter, setStateFilter] = useState<'All' | ProductState>('All')
  const [sort, setSort] = useState<Sort>('Score')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS
    if (stateFilter !== 'All') list = list.filter(p => p.state === stateFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    if (sort === 'Score') list = [...list].sort((a, b) => b.score - a.score)
    else if (sort === 'Revenue') {
      const num = (v: string) => (v === '—' ? 0 : parseInt(v.replace(/\D/g, '')))
      list = [...list].sort((a, b) => num(b.rev) - num(a.rev))
    } else if (sort === 'Findings') {
      list = [...list].sort((a, b) => b.findings - a.findings)
    }
    return list
  }, [stateFilter, sort, search])

  const stateLabel = (s: 'All' | ProductState) => {
    const count = s === 'All' ? ALL_PRODUCTS.length : ALL_PRODUCTS.filter(p => p.state === s).length
    return `${s} (${count})`
  }
  const stateValue = stateLabel(stateFilter)

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="px-6 pt-5 pb-4 flex items-center justify-between shrink-0">
        <div>
          <div className="text-[20px] font-medium text-ink tracking-[-0.025em]">Active Products</div>
          <div className="text-[12px] text-dim mt-[3px]">{ALL_PRODUCTS.length} products tracked</div>
        </div>
        <button className="flex items-center gap-1.5 bg-brand text-white border-0 rounded-md px-3.5 py-[7px] text-[12px] font-medium cursor-pointer hover:opacity-90">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5.5 1v9M1 5.5h9" />
          </svg>
          Add product
        </button>
      </div>

      <div className="px-6 pb-3 flex items-center gap-2.5 shrink-0">
        <Dropdown
          label="State"
          value={stateValue}
          options={STATE_OPTIONS.map(stateLabel)}
          onChange={v => {
            const raw = v.split(' (')[0]
            setStateFilter(raw as 'All' | ProductState)
          }}
        />
        <Dropdown
          label="Sort"
          value={sort}
          options={[...SORT_OPTIONS]}
          onChange={v => setSort(v as Sort)}
        />
        <div className="ml-auto flex items-center gap-1.5 bg-surf border border-line rounded-md px-2.5 py-[5px] w-[240px]">
          <span className="text-dim flex">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="5.5" cy="5.5" r="3.5" />
              <path d="M8.5 8.5L11 11" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="border-0 bg-transparent outline-none text-[11px] text-ink w-full placeholder:text-dim"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-8">
        <div className="bg-surf rounded-[10px] shadow-lift overflow-hidden">
          <TableHeader />
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-dim text-[13px]">No products match your filters.</div>
          ) : (
            filtered.map((p, i) => (
              <ProductRow key={p.id} product={p} last={i === filtered.length - 1} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ActiveProducts
