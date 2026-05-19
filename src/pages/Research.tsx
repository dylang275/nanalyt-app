import { useState, useEffect, useRef } from 'react'

// ─── Data ────────────────────────────────────────────────────────────────────

const TABS = ['Category', 'Product', 'Import URL'] as const
type Tab = (typeof TABS)[number]

const PLACEHOLDERS: Record<Tab, string> = {
  Category: 'Category or niche (e.g. magnesium sleep supplements)',
  Product: 'Product name or ASIN',
  'Import URL': 'Paste a URL (olly.com, amazon.com/dp/…)',
}

const SOURCE_LIST = ['Amazon Reviews', 'TikTok Ads', 'Meta Ads', 'YouTube', 'Reddit', 'Google'] as const
type Source = (typeof SOURCE_LIST)[number]
const SOURCE_ABBR: Record<Source, string> = {
  'Amazon Reviews': 'A',
  'TikTok Ads': 'T',
  'Meta Ads': 'M',
  YouTube: 'Y',
  Reddit: 'R',
  Google: 'G',
}

const QUICK_START = [
  { icon: '⊕', label: 'Category scan', sub: 'Find winning products with low competition in a category' },
  { icon: '◈', label: 'Competitor deep-dive', sub: 'Analyze a specific product or brand by URL' },
  { icon: '⊞', label: 'Market comparison', sub: 'Compare top products across a category side by side' },
  { icon: '◉', label: 'Buyer segments', sub: 'Find underserved buyer segments in your niche' },
]

const RECENT = [
  { q: 'Magnesium sleep supplements', type: 'Category', found: 6, pipeline: 3, time: '2h ago' },
  { q: 'Melatonin gummies 5mg', type: 'Product', found: 4, pipeline: 2, time: 'Yesterday' },
  { q: 'Ashwagandha stress relief', type: 'Category', found: 8, pipeline: 5, time: '2d ago' },
  { q: 'olly.com/products/sleep-gummies', type: 'URL', found: 1, pipeline: 1, time: '3d ago' },
]

const STEP_TEMPLATES = (q: string) => [
  { label: `Scanning Amazon Reviews for "${q}"`, result: '8 active campaigns' },
  { label: `Scanning TikTok Ads for "${q}"`, result: '320 relevant threads' },
  { label: `Scanning Meta Ads for "${q}"`, result: '14 competitor ads found' },
  { label: `Scanning YouTube content for "${q}"`, result: '11 review videos' },
  { label: `Scanning Reddit for "${q}"`, result: '29 community threads' },
  { label: `Scanning Google Trends for "${q}"`, result: '+3.2× search growth' },
  { label: 'Analyzing buyer language patterns…', result: '63 key phrases extracted' },
  { label: 'Identifying angle opportunities…', result: '4 angle gaps found' },
]

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowR() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h8M8 4l3 3-3 3" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 3h10l-4 4v4l-2-1V7l-4-4z" />
    </svg>
  )
}

function ChevDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 3 3-3" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 2l7 7M9 2L2 9" />
    </svg>
  )
}

function CheckCircle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" fill="#e4ede7" stroke="#2d5c3a" strokeWidth="1" />
      <path d="M4 7l2.5 2.5 4-4" stroke="#2d5c3a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SpinningRing() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
      <circle cx="7" cy="7" r="5.5" stroke="#e8e5e0" strokeWidth="1.5" />
      <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="#2d5c3a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Search state ────────────────────────────────────────────────────────────

type Step = { label: string; result: string }
type SearchState = {
  query: string
  steps: Step[]
  completed: number[]
  current: number
  pct: number
  done: boolean
  elapsed: number
}

// ─── Page ────────────────────────────────────────────────────────────────────

function Research() {
  const [tab, setTab] = useState<Tab>('Category')
  const [query, setQuery] = useState('')
  const [showSources, setShowSources] = useState(false)
  const [sources, setSources] = useState<Record<Source, boolean>>(() => {
    const init = {} as Record<Source, boolean>
    SOURCE_LIST.forEach(s => (init[s] = true))
    return init
  })
  const [searching, setSearching] = useState(false)
  const [searchState, setSearchState] = useState<SearchState | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef(0)

  const enabledSources = SOURCE_LIST.filter(s => sources[s])
  const enabledCount = enabledSources.length

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startSearch = () => {
    if (!query.trim()) return
    const steps = STEP_TEMPLATES(query).filter((_, i) => i < enabledCount + 2)
    elapsedRef.current = 0
    setSearching(true)
    setSearchState({ query, steps, completed: [], current: 0, pct: 0, done: false, elapsed: 0 })

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1
      setSearchState(prev => {
        if (!prev) return prev
        const newPct = Math.min(100, prev.pct + (Math.random() * 2.5 + 1))
        const stepDone = newPct > ((prev.current + 1) / prev.steps.length) * 95 && prev.current < prev.steps.length
        const newCompleted = stepDone ? [...prev.completed, prev.current] : prev.completed
        const newCurrent = stepDone ? prev.current + 1 : prev.current
        const done = newPct >= 100
        if (done && timerRef.current) clearInterval(timerRef.current)
        return {
          ...prev,
          pct: Math.round(newPct),
          completed: newCompleted,
          current: Math.min(newCurrent, prev.steps.length),
          done,
          elapsed: elapsedRef.current,
        }
      })
    }, 180)
  }

  const minutes = searchState ? Math.floor(searchState.elapsed / 5) : 0
  const seconds = searchState ? String((searchState.elapsed % 5) * 12).padStart(2, '0') : '00'

  return (
    <div
      className="max-w-[960px] mx-auto px-16 pt-7 pb-16 font-sans"
      onClick={() => setShowSources(false)}
    >
      <div className="mb-6">
        <div className="text-[20px] font-medium text-ink tracking-[-0.02em] mb-1">Research</div>
        <div className="text-[12px] text-ink">Discover products, analyze categories, or import a URL</div>
      </div>

      <div className="bg-surf border-[0.5px] border-[#e5e7eb] rounded-[10px] mb-7 relative overflow-visible shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex border-b-[0.5px] border-line">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => {
                if (!searching) setTab(t)
              }}
              className={`px-4 py-2.5 text-[12px] bg-transparent cursor-pointer -mb-[1px] border-b-2 transition-all ${
                tab === t ? 'text-ink font-medium border-ink' : 'text-ink font-normal border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {!searching && (
          <div className="px-4 pt-4 pb-3.5">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') startSearch()
              }}
              placeholder={PLACEHOLDERS[tab]}
              className="w-full text-[14px] text-ink bg-transparent border-0 outline-none mb-3 placeholder:text-ink/40"
            />
            <div className="flex items-center justify-between">
              <div className="relative">
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setShowSources(v => !v)
                  }}
                  className="flex items-center gap-1.5 text-[11px] text-ink bg-surf-2 border-[0.5px] border-line rounded-md px-2.5 py-1 cursor-pointer"
                >
                  <FilterIcon />
                  {enabledCount} sources
                  <ChevDown />
                </button>
                {showSources && (
                  <div
                    onClick={e => e.stopPropagation()}
                    className="absolute top-[calc(100%+6px)] left-0 bg-surf border-[0.5px] border-[#e5e7eb] rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.1)] z-50 min-w-[220px] overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-3.5 py-2.5 border-b-[0.5px] border-line">
                      <span className="text-[10px] font-bold tracking-[0.07em] uppercase text-ink">Filter by source</span>
                      <button
                        onClick={() => {
                          const all = {} as Record<Source, boolean>
                          SOURCE_LIST.forEach(s => (all[s] = true))
                          setSources(all)
                        }}
                        className="text-[11px] text-ink bg-transparent border-0 cursor-pointer font-medium hover:opacity-70"
                      >
                        Select all
                      </button>
                    </div>
                    {SOURCE_LIST.map((s, i) => (
                      <div
                        key={s}
                        onClick={() => setSources(prev => ({ ...prev, [s]: !prev[s] }))}
                        className={`flex items-center gap-2.5 px-3.5 py-2 cursor-pointer hover:bg-surf-2 ${
                          i < SOURCE_LIST.length - 1 ? 'border-b-[0.5px] border-line-soft' : ''
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
                            sources[s] ? 'bg-brand border-brand' : 'bg-transparent border-line'
                          }`}
                        >
                          {sources[s] && (
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                              <path d="M1 3.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[12px] text-ink">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={startSearch}
                disabled={!query.trim()}
                className={`w-8 h-8 rounded-[7px] border-0 flex items-center justify-center transition-all ${
                  query.trim()
                    ? 'bg-ink text-white cursor-pointer hover:opacity-90'
                    : 'bg-surf-2 text-ink/30 cursor-default'
                }`}
              >
                <ArrowR />
              </button>
            </div>
          </div>
        )}

        {searching && searchState && (
          <div className="px-[18px] py-4">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[13px] font-medium text-ink">{searchState.query}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-[3px]">
                  {enabledSources.map(s => (
                    <div
                      key={s}
                      className="w-5 h-5 rounded border border-line bg-surf-2 flex items-center justify-center text-[9px] font-bold text-ink"
                    >
                      {SOURCE_ABBR[s]}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 ml-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: searchState.done ? '#2d5c3a' : '#f59e0b' }}
                  />
                  <span className="text-[11px] text-ink font-mono">
                    {minutes}:{seconds}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-3.5">
              {searchState.steps.map((step, i) => {
                const isCompleted = searchState.completed.includes(i)
                const isCurrent = searchState.current === i && !searchState.done
                if (i > searchState.current && !isCompleted) return null
                return (
                  <div key={i} className="flex items-center gap-2">
                    {isCompleted ? <CheckCircle /> : isCurrent ? <SpinningRing /> : null}
                    <span className={`text-[12px] leading-[1.3] ${isCompleted ? 'text-brand' : 'text-ink'}`}>
                      {isCompleted ? step.result : step.label + (isCurrent ? '…' : '')}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className={`flex items-center gap-2.5 ${searchState.done ? 'mb-3.5' : ''}`}>
              <div className="flex-1 h-1 bg-line rounded-sm overflow-hidden">
                <div
                  className="h-full bg-brand rounded-sm transition-[width] duration-[180ms] ease-out"
                  style={{ width: `${searchState.pct}%` }}
                />
              </div>
              <span className="text-[11px] text-ink font-mono shrink-0 min-w-[32px] text-right">
                {searchState.pct}%
              </span>
            </div>

            {searchState.done && (
              <div className="flex justify-end pt-3.5">
                <button
                  onClick={() => console.log('Navigate to research analysis for:', searchState.query)}
                  className="text-[13px] font-medium text-white bg-brand border-0 rounded-md px-4 py-2 cursor-pointer hover:opacity-90"
                >
                  View analysis →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-ink mb-3.5">Quick Start</div>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_START.map((q, i) => (
            <div
              key={i}
              className="bg-surf border-[0.5px] border-[#e5e7eb] rounded-lg p-4 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            >
              <div className="text-[20px] mb-3 leading-none">{q.icon}</div>
              <div className="text-[13px] font-medium text-ink mb-1.5 leading-[1.3]">{q.label}</div>
              <div className="text-[11px] text-ink leading-[1.55]">{q.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[14px] font-medium text-ink mb-3.5">Recent research</div>
        <div className="bg-surf border-[0.5px] border-[#e5e7eb] rounded-[10px]">
          <div className="grid grid-cols-[120px_minmax(0,1fr)_90px_200px] gap-3 px-[18px] py-3 border-b-[0.5px] border-[#f0f1f3] items-center">
            <div className="text-[10px] font-medium tracking-[0.04em] uppercase text-ink">TYPE</div>
            <div className="text-[10px] font-medium tracking-[0.04em] uppercase text-ink">QUERY</div>
            <div />
            <div className="flex justify-end">
              <select className="text-[11px] text-ink border-[0.5px] border-line rounded-md px-2.5 py-1 bg-surf outline-none cursor-pointer">
                <option>All types</option>
                <option>Category</option>
                <option>Product</option>
                <option>URL</option>
              </select>
            </div>
          </div>
          {RECENT.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[120px_minmax(0,1fr)_90px_200px] gap-3 px-[18px] py-3.5 items-center ${
                i < RECENT.length - 1 ? 'border-b-[0.5px] border-[#f0f1f3]' : ''
              }`}
            >
              <span className="text-[12px] font-medium tracking-[0.025em] uppercase text-ink">{r.type}</span>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-ink truncate">{r.q}</div>
                <div className="text-[11px] text-ink mt-0.5">
                  <strong className="font-medium">{r.found}</strong> products found · <strong className="font-medium">{r.pipeline} in pipeline</strong>
                </div>
              </div>
              <span className="text-[11px] text-ink whitespace-nowrap">{r.time}</span>
              <div className="flex items-center justify-end gap-3">
                <button className="text-[12px] font-medium text-white bg-brand border-0 rounded-md px-3 py-[5px] cursor-pointer whitespace-nowrap hover:opacity-90">
                  + Pipeline ({r.pipeline})
                </button>
                <span className="text-ink cursor-pointer flex hover:opacity-70">
                  <XIcon />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Research
