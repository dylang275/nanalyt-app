import { useState, useEffect } from 'react'

// ─── Types & data ────────────────────────────────────────────────────────────

type AssetState = 'NEW' | 'READY' | 'LIVE' | 'PAUSED' | 'ARCHIVED'
type AdFormat = 'UGC' | 'STATIC' | 'VIDEO'

type Pdp = {
  id: string
  state: AssetState
  version: string
  angle: string
  time: string
  img: string
}

type Ad = {
  id: string
  state: AssetState
  fmt: AdFormat
  desc: string
  spec: string
  img: string
}

type Product = {
  id: string
  hasLive?: boolean
  name: string
  img: string
  status: string
  newCount: number
  pdps: Pdp[]
  ads: Ad[]
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'mag',
    hasLive: true,
    name: 'Magnesium Glycinate Complex',
    img: '/uploads/IMG_3472.jpg',
    status: 'In market',
    newCount: 3,
    pdps: [
      {
        id: 'pdp1',
        state: 'LIVE',
        version: 'v1',
        angle: 'Next-day calm',
        time: '2.4% CVR · 32d live',
        img: '/uploads/Screenshot 2026-05-18 at 9.56.07 AM.png',
      },
    ],
    ads: [
      { id: 'ad1', state: 'NEW', fmt: 'UGC', desc: 'Next-day calm test', spec: '9:16 vertical', img: '/uploads/IMG_3495.PNG' },
      { id: 'ad2', state: 'NEW', fmt: 'STATIC', desc: 'Lifestyle composition', spec: '1:1 square', img: '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png' },
      { id: 'ad3', state: 'NEW', fmt: 'VIDEO', desc: 'Ingredient explainer', spec: '15s · 9:16', img: '/uploads/IMG_3497.PNG' },
      { id: 'ad4', state: 'READY', fmt: 'UGC', desc: 'Testimonial', spec: '4 days ago · Ready', img: '/uploads/IMG_3499.PNG' },
    ],
  },
  {
    id: 'zzz',
    name: 'ZzzPlex Sleep Support',
    img: '/uploads/IMG_3474.jpg',
    status: 'In market',
    newCount: 0,
    pdps: [{ id: 'pdp2', state: 'READY', version: 'v1', angle: 'Sleep quality', time: '2 weeks ago', img: '/uploads/IMG_3474.jpg' }],
    ads: [
      { id: 'ad5', state: 'READY', fmt: 'STATIC', desc: 'Sleep quality', spec: '1:1 square', img: '/uploads/IMG_3474.jpg' },
      { id: 'ad6', state: 'READY', fmt: 'UGC', desc: 'Creator review', spec: '9:16 vertical', img: '/uploads/IMG_3474.jpg' },
    ],
  },
  {
    id: 'ash',
    name: 'ASHWAGANDHA+',
    img: '/uploads/IMG_3476.jpg',
    status: 'Testing',
    newCount: 0,
    pdps: [],
    ads: [
      { id: 'ad7', state: 'READY', fmt: 'UGC', desc: 'Stress-sleep angle', spec: '9:16 vertical', img: '/uploads/IMG_3476.jpg' },
    ],
  },
]

// ─── Atoms ───────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor">
      <path d="M1 1l9 5.5L1 12V1z" />
    </svg>
  )
}

function AdThumb({ ad, product }: { ad: Ad; product: Product }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <img
        src={ad.img}
        alt=""
        className="w-full h-full object-cover block"
        onError={e => {
          ;(e.currentTarget as HTMLImageElement).src = product.img
        }}
      />
      <div className="absolute inset-0 bg-black/[0.12]" />
      <span className="absolute top-2 left-2 text-[9px] font-bold tracking-[0.04em] bg-black/55 text-white px-[6px] py-0.5 rounded-[3px]">
        {ad.fmt}
      </span>
      {(ad.fmt === 'UGC' || ad.fmt === 'VIDEO') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-black/40 border-[1.5px] border-white/60 flex items-center justify-center text-white">
            <PlayIcon />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Generating modal ────────────────────────────────────────────────────────

function GeneratingModal({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const STEPS = [
    'Pulled brand context from Shopify',
    'Loaded angle from finding · validated by 3 competitors',
    'Drafted PDP variant',
    'Generating 3 creative variants…',
  ]
  useEffect(() => {
    const timers = [600, 1400, 2300, 3400]
    const ts = timers.map((t, i) => setTimeout(() => setStep(i + 1), t))
    const done = setTimeout(onDone, 4200)
    return () => {
      ts.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[500] bg-black/35 flex items-center justify-center">
      <div className="bg-surf rounded-[14px] px-8 py-7 w-[440px] shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" className="animate-spin">
              <circle cx="14" cy="14" r="11" fill="none" stroke="#e4ede7" strokeWidth="2.5" />
              <path d="M14 3A11 11 0 0 1 25 14" fill="none" stroke="#2d5c3a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="text-center mb-5">
          <div className="text-[9px] font-semibold tracking-[0.08em] uppercase text-ink mb-1.5">Generating Creative</div>
          <div className="text-base font-medium text-ink mb-1">Magnesium Glycinate Complex</div>
          <div className="text-[13px] text-ink">Next-day calm · 3 variants</div>
        </div>
        <div className="h-px bg-line mb-4" />
        <div className="flex flex-col gap-2.5 mb-4">
          {STEPS.map((s, i) => {
            const done = i < step && i < STEPS.length - 1
            const active = i === step - 1 && i === STEPS.length - 1
            return (
              <div key={i} className="flex items-center gap-2.5">
                {done ? (
                  <div className="w-[18px] h-[18px] rounded-full bg-brand flex items-center justify-center shrink-0">
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5l2.5 2.5 5-5.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : active ? (
                  <div className="w-[18px] h-[18px] rounded-full bg-brand-bg border-[1.5px] border-brand flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-soft-pulse" />
                  </div>
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full bg-surf-2 border border-line shrink-0" />
                )}
                <span className="text-[12px] text-ink leading-[1.3]">{s}</span>
              </div>
            )
          })}
        </div>
        <div className="text-[11px] text-ink text-center">This usually takes about 60 seconds.</div>
      </div>
    </div>
  )
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

type LightboxState = { type: 'pdp'; asset: Pdp; product: Product } | { type: 'ad'; asset: Ad; product: Product }

function Lightbox({ state, onClose }: { state: LightboxState; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-surf rounded-xl overflow-hidden max-w-[680px] w-[90%] max-h-[85vh] flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
      >
        <div className="px-[18px] py-3.5 border-b-[0.5px] border-line flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium text-ink">
              {state.type === 'pdp' ? `PDP · ${state.asset.version}` : state.asset.desc}
            </div>
            <div className="text-[11px] text-ink mt-0.5">{state.product.name}</div>
          </div>
          <button onClick={onClose} className="bg-transparent border-0 text-base text-ink cursor-pointer hover:opacity-70">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-hidden bg-surf-2 flex items-center justify-center p-5 min-h-[300px]">
          {state.type === 'pdp' ? (
            <div className="max-w-[680px] max-h-[500px] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] bg-[#f5f4f2]">
              <img src={state.asset.img} alt="" className="w-full block object-contain max-h-[500px]" />
            </div>
          ) : (
            <div className="max-w-[360px] max-h-[480px] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
              <img src={state.asset.img} alt="" className="w-full h-full object-cover block" />
            </div>
          )}
        </div>
        <div className="px-[18px] py-3 border-t-[0.5px] border-line flex gap-2 justify-end">
          {state.type === 'pdp' ? (
            <>
              <button
                onClick={() => window.open(state.asset.img, '_blank')}
                className="text-[12px] text-ink bg-surf border-[0.5px] border-line rounded-md px-3.5 py-1.5 cursor-pointer flex items-center gap-1.5 hover:bg-line-soft"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 1.5H1.5v8h8V6.5M6.5 1.5h3v3M5.5 5.5l4-4" />
                </svg>
                Open in new window
              </button>
              <button className="text-[12px] text-ink bg-surf border-[0.5px] border-line rounded-md px-3.5 py-1.5 cursor-pointer hover:bg-line-soft">
                Archive
              </button>
              <button className="text-[12px] font-medium text-white bg-brand border-0 rounded-md px-3.5 py-1.5 cursor-pointer hover:opacity-90">
                Push to Shopify →
              </button>
            </>
          ) : (
            <>
              <a
                href={state.asset.img}
                download
                className="text-[12px] text-ink bg-surf border-[0.5px] border-line rounded-md px-3.5 py-1.5 cursor-pointer no-underline flex items-center gap-1.5 hover:bg-line-soft"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5.5 1v7M2.5 6l3 3 3-3M1 10h9" />
                </svg>
                Download
              </a>
              <button className="text-[12px] text-ink bg-surf border-[0.5px] border-line rounded-md px-3.5 py-1.5 cursor-pointer hover:bg-line-soft">
                Archive
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── State badges ────────────────────────────────────────────────────────────

function NewBadge() {
  return (
    <span className="absolute top-2 right-2 text-[9px] font-semibold bg-brand text-white px-[7px] py-0.5 rounded-[10px] tracking-[0.03em]">
      NEW
    </span>
  )
}

function LiveBadge() {
  return (
    <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-medium text-brand bg-surf border-[0.5px] border-brand px-[7px] py-0.5 rounded-[10px] tracking-[0.03em]">
      <span className="w-[5px] h-[5px] rounded-full bg-brand block animate-soft-pulse" />
      LIVE
    </span>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

type AssetFilter = 'All' | 'Live' | 'Drafts'

function Studio() {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('All')
  const [assets] = useState<Product[]>(INITIAL_PRODUCTS)
  const [showGenerating, setShowGenerating] = useState(false)
  const [justGenerated, setJustGenerated] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const product = assets[selectedProduct]
  const totalNew = assets.reduce((s, p) => s + p.newCount, 0)

  const handleGeneratingDone = () => {
    setShowGenerating(false)
    setJustGenerated(true)
    setTimeout(() => setJustGenerated(false), 8000)
  }

  const filterPdps = (pdps: Pdp[]) =>
    pdps.filter(p => {
      if (assetFilter === 'Live') return p.state === 'LIVE' || p.state === 'PAUSED'
      if (assetFilter === 'Drafts') return p.state === 'NEW' || p.state === 'READY'
      return p.state !== 'ARCHIVED'
    })

  const filterAds = (ads: Ad[]) =>
    ads.filter(a => {
      if (assetFilter === 'Live') return a.state === 'LIVE' || a.state === 'PAUSED'
      if (assetFilter === 'Drafts') return a.state === 'NEW' || a.state === 'READY'
      return a.state !== 'ARCHIVED'
    })

  const filteredPdps = filterPdps(product.pdps)
  const filteredAds = filterAds(product.ads)

  return (
    <div className="font-sans">
      <div className="max-w-[1200px] mx-auto px-6 pt-5 pb-12">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[20px] font-medium text-ink tracking-[-0.02em] mb-1">Studio</div>
            <div className="text-[12px] text-ink">Generated and uploaded creatives, organized by product</div>
          </div>
          <div className="flex gap-2 items-center mt-1">
            <select className="text-[11px] text-ink border-[0.5px] border-line rounded-md px-2.5 py-[5px] bg-surf outline-none cursor-pointer">
              <option>All products</option>
              <option>Current catalog</option>
              <option>Pipeline</option>
            </select>
            <select className="text-[11px] text-ink border-[0.5px] border-line rounded-md px-2.5 py-[5px] bg-surf outline-none cursor-pointer">
              <option>Format: All</option>
              <option>PDP</option>
              <option>Static</option>
              <option>UGC</option>
              <option>Video</option>
            </select>
          </div>
        </div>

        {totalNew > 0 && (
          <div className="flex items-center justify-between bg-brand-bg border-[0.5px] border-brand-dim rounded-lg px-4 py-2.5 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand shrink-0" />
              <span className="text-[12px] text-brand font-medium">{totalNew} new creatives pending review</span>
              <span className="text-[12px] text-brand/70">· From last 24 hours</span>
            </div>
            <span className="text-[12px] text-brand font-semibold cursor-pointer">Review →</span>
          </div>
        )}

        {justGenerated && (
          <div className="flex items-center gap-2.5 bg-brand-bg border-[0.5px] border-brand-dim rounded-lg px-4 py-3 mb-4">
            <span className="text-[9px] font-bold tracking-[0.05em] uppercase bg-brand text-white px-2 py-0.5 rounded-[10px] shrink-0">
              Just generated
            </span>
            <span className="text-[12px] text-[#27500a]">
              4 new creatives from <span className="underline cursor-pointer">'Start running next-day calm as a new angle'</span> finding
            </span>
          </div>
        )}

        <div className="grid grid-cols-[220px_1fr] gap-[18px] items-start">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-ink mb-2.5">
              PRODUCTS · {assets.length}
            </div>
            <div className="flex flex-col gap-1">
              {assets.map((p, pi) => {
                const sel = selectedProduct === pi
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(pi)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors border-[0.5px] ${
                      sel ? 'bg-surf-2 border-line' : 'bg-transparent border-transparent hover:bg-surf-2'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border-[0.5px] border-line">
                      <img src={p.img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-px">
                        {p.hasLive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand block shrink-0 animate-soft-pulse" />
                        )}
                        <div className={`text-[12px] truncate leading-[1.3] text-ink ${sel ? 'font-medium' : 'font-normal'}`}>
                          {p.name}
                        </div>
                      </div>
                      <div className="text-[10px] text-ink mt-px">
                        {p.pdps.length > 0 ? `${p.pdps.length} PDP` : 'No PDP'} · {p.ads.length} {p.ads.length === 1 ? 'ad' : 'ads'}
                      </div>
                    </div>
                    {p.newCount > 0 && (
                      <span className="text-[9px] font-semibold bg-brand text-white px-1.5 py-px rounded-lg shrink-0 tracking-[0.02em]">
                        {p.newCount} NEW
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border-[0.5px] border-line">
                <img src={product.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-base font-medium text-ink tracking-[-0.01em] leading-[1.2]">{product.name}</div>
                <div className="text-[11px] text-ink mt-0.5">
                  {product.status} · {product.pdps.length > 0 ? `${product.pdps.length} PDP` : 'No PDP'} · {product.ads.length} ads
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGenerating(true)}
                  className="text-[12px] text-ink bg-surf border-[0.5px] border-line rounded-[7px] px-3.5 py-1.5 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-line-soft"
                >
                  + Generate ad
                </button>
                <button
                  onClick={() => setShowGenerating(true)}
                  className="text-[12px] font-medium text-white bg-brand border-0 rounded-[7px] px-3.5 py-1.5 cursor-pointer hover:opacity-90"
                >
                  + Generate PDP
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-medium tracking-[0.05em] uppercase text-ink">Show</span>
              {(['All', 'Live', 'Drafts'] as AssetFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setAssetFilter(f)}
                  className={`text-[12px] px-3 py-1 rounded-md border-[0.5px] cursor-pointer transition-colors ${
                    assetFilter === f
                      ? 'font-medium border-ink bg-ink text-white'
                      : 'font-normal border-line bg-transparent text-ink hover:bg-surf-2'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {filteredPdps.length > 0 ? (
              <div className="mb-7">
                <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-ink mb-2.5">Product page</div>
                <div className="grid grid-cols-4 gap-2.5">
                  {filteredPdps.map(pdp => (
                    <div
                      key={pdp.id}
                      onClick={() => setLightbox({ type: 'pdp', asset: pdp, product })}
                      className={`col-span-2 rounded-lg overflow-hidden cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative bg-surf border ${
                        pdp.state === 'NEW' ? 'border border-brand' : 'border-[0.5px] border-[#e2deda]'
                      } ${pdp.state === 'PAUSED' ? 'opacity-60' : ''}`}
                    >
                      <div className="aspect-[3/2] overflow-hidden relative">
                        <img
                          src={pdp.img}
                          alt=""
                          className="w-full h-full object-cover block"
                          onError={e => {
                            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        {pdp.state === 'NEW' && <NewBadge />}
                        {pdp.state === 'LIVE' && <LiveBadge />}
                      </div>
                      <div className="px-2.5 py-2 bg-surf">
                        <div className="text-[11px] font-medium text-ink mb-0.5">
                          {pdp.version} · {pdp.angle}
                        </div>
                        <div className="text-[10px] text-ink">{pdp.time}</div>
                        <div className="flex gap-1.5 mt-2" onClick={e => e.stopPropagation()}>
                          <button className="flex-1 text-[10px] font-medium text-brand bg-transparent border-[0.5px] border-brand rounded px-0 py-1 cursor-pointer flex items-center justify-center gap-1 hover:bg-brand-bg">
                            View in Shopify
                            <svg width="8" height="8" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1.5 7.5l6-6M7.5 1.5h-5M7.5 1.5v5" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-7">
                <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-ink mb-2.5">Product page</div>
                <div className="w-[calc(25%-8px)] aspect-[3/4] border border-dashed border-line rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer text-ink hover:bg-surf-2">
                  <span className="text-[22px]">+</span>
                  <span className="text-[11px]">Generate PDP</span>
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-ink mb-2.5">
                ADS · {filteredAds.length}
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {filteredAds.map(ad => (
                  <div
                    key={ad.id}
                    onClick={() => setLightbox({ type: 'ad', asset: ad, product })}
                    className={`rounded-lg overflow-hidden cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-surf border ${
                      ad.state === 'NEW' ? 'border border-brand' : 'border-[0.5px] border-[#e2deda]'
                    }`}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <AdThumb ad={ad} product={product} />
                      {ad.state === 'NEW' && <NewBadge />}
                      {ad.state === 'LIVE' && <LiveBadge />}
                    </div>
                    <div className="px-2.5 py-2">
                      <div className="text-[11px] font-medium text-ink mb-0.5 truncate">{ad.desc}</div>
                      <div className="text-[10px] text-ink mb-1.5">{ad.spec}</div>
                      {ad.state === 'LIVE' ? (
                        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                          <button className="flex-[3] text-[10px] font-medium text-ink bg-surf border-[0.5px] border-line rounded px-0 py-1 cursor-pointer hover:bg-line-soft">
                            View on Meta
                          </button>
                          <button className="flex-1 text-[11px] text-ink bg-surf border-[0.5px] border-line rounded px-0 py-1 cursor-pointer hover:bg-line-soft">
                            ↻
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                          <a
                            href={ad.img}
                            download
                            className="flex-[3] text-[10px] font-semibold text-white bg-ink border-0 rounded px-0 py-1 cursor-pointer no-underline flex items-center justify-center gap-1 hover:opacity-90"
                          >
                            ↓ Download
                          </a>
                          <button className="flex-1 text-[11px] text-ink bg-surf border-[0.5px] border-line rounded px-0 py-1 cursor-pointer hover:bg-line-soft">
                            ↻
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGenerating && <GeneratingModal onDone={handleGeneratingDone} />}
      {lightbox && <Lightbox state={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  )
}

export default Studio
