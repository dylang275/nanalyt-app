import { useState, useEffect, type ReactNode } from 'react'

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
        state: 'READY',
        version: 'v1',
        angle: 'Next-day calm',
        time: 'Drafted 4 days ago',
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

function GeneratingModal({ onDone, productName, angleName, variantCount, mode }: {
  onDone: () => void
  productName: string
  angleName: string
  variantCount: number
  mode: 'ad' | 'pdp'
}) {
  const [step, setStep] = useState(0)
  const STEPS = [
    'Pulled brand context from Shopify',
    'Loaded angle from finding · validated by 3 competitors',
    mode === 'pdp' ? 'Drafted PDP outline' : 'Drafted creative brief',
    `Generating ${variantCount} ${mode === 'pdp' ? 'PDP' : 'creative'} variants…`,
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
          <div className="text-[9px] font-semibold tracking-[0.08em] uppercase text-ink mb-1.5">
            Generating {mode === 'pdp' ? 'PDP' : 'Creative'}
          </div>
          <div className="text-base font-medium text-ink mb-1">{productName}</div>
          <div className="text-[13px] text-ink">{angleName} · {variantCount} variants</div>
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

// ─── Generation Wizard ──────────────────────────────────────────────────────

type WizardMode = 'ad' | 'pdp'

type WizardAngle = {
  name: string
  state: 'GAP' | 'BOTH RUN'
  hook: string
  highConfidence: boolean
  rationale: ReactNode
  recommended?: boolean
}

const WIZARD_ANGLES: WizardAngle[] = [
  {
    name: 'Sleep-Anxiety Crossover',
    state: 'GAP',
    hook: 'Sleep through the worry, not just the fatigue.',
    highConfidence: true,
    recommended: true,
    rationale: (
      <>
        <strong className="font-medium">High confidence</strong> · Validated by 3 competitors · 18d avg longevity · 28% of their spend
      </>
    ),
  },
  {
    name: 'Performance & Recovery',
    state: 'BOTH RUN',
    hook: 'Train harder. Recover faster. Sleep deeper.',
    highConfidence: false,
    rationale: (
      <>
        <strong className="font-medium">Refresh suggestion</strong> · You run at 42%, your creative is 16d old · time to refresh
      </>
    ),
  },
  {
    name: 'Lifestyle & Wellness',
    state: 'BOTH RUN',
    hook: 'Wellness that actually fits your life.',
    highConfidence: false,
    rationale: (
      <>
        <strong className="font-medium">Established angle</strong> · You run at 18%, Olly at 26% · room to expand
      </>
    ),
  },
]

type FormatOption = { key: string; label: string; desc: string; icon: ReactNode }

const AD_FORMATS: FormatOption[] = [
  {
    key: 'Static',
    label: 'Static',
    desc: 'Designed image',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="12" height="10" rx="1.2" />
        <path d="M2 10l3.5-3 3 2.5L11 6l3 4" />
        <circle cx="6" cy="6.5" r="0.9" />
      </svg>
    ),
  },
  {
    key: 'UGC',
    label: 'UGC',
    desc: 'Creator-style video',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5.5" r="2.5" />
        <path d="M3 13.5c0-2.5 2.2-4 5-4s5 1.5 5 4" />
      </svg>
    ),
  },
  {
    key: 'Video',
    label: 'Video',
    desc: 'Animated explainer',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
      </svg>
    ),
  },
]

const PDP_FORMATS: FormatOption[] = [
  {
    key: 'Hero-led',
    label: 'Hero-led',
    desc: 'Big image hero',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="12" height="7" rx="1" />
        <path d="M3 11h10M3 13h7" />
      </svg>
    ),
  },
  {
    key: 'Story-led',
    label: 'Story-led',
    desc: 'Long-form scrollable',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="12" height="3" rx="0.8" />
        <rect x="2" y="6.5" width="12" height="3" rx="0.8" />
        <rect x="2" y="11" width="12" height="3" rx="0.8" />
      </svg>
    ),
  },
  {
    key: 'Comparison-led',
    label: 'Comparison-led',
    desc: 'Feature comparison',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="5.5" height="10" rx="1" />
        <rect x="8.5" y="3" width="5.5" height="10" rx="1" />
      </svg>
    ),
  },
]

type WizardResult = { angleName: string; format: string; variantCount: number }

function GenerationWizard({ mode, product, onClose, onGenerate }: {
  mode: WizardMode
  product: Product
  onClose: () => void
  onGenerate: (r: WizardResult) => void
}) {
  const formats = mode === 'ad' ? AD_FORMATS : PDP_FORMATS
  const variants = mode === 'ad' ? [1, 2, 3, 4, 5] : [1, 2, 3]
  const defaultVariant = mode === 'ad' ? 3 : 2

  const [selectedAngleIdx, setSelectedAngleIdx] = useState(0)
  const [customAngleOpen, setCustomAngleOpen] = useState(false)
  const [customAngleText, setCustomAngleText] = useState('')
  const [selectedFormatIdx, setSelectedFormatIdx] = useState(0)
  const [variantCount, setVariantCount] = useState(defaultVariant)

  const isCustom = customAngleOpen && customAngleText.trim().length >= 3
  const angleName = isCustom ? customAngleText.trim() : WIZARD_ANGLES[selectedAngleIdx].name
  const format = formats[selectedFormatIdx]
  const canGenerate = isCustom || selectedAngleIdx >= 0
  const customValid = !customAngleOpen || customAngleText.trim().length >= 3

  const buttonText = mode === 'pdp'
    ? `Generate ${variantCount} ${format.label} PDP variants →`
    : `Generate ${variantCount} ${format.label} variants →`

  return (
    <div className="fixed inset-0 z-[450] bg-black/40 flex items-center justify-center font-sans">
      <div className="bg-surf rounded-xl px-7 py-6 w-[580px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] overflow-y-auto">
        <div className="flex items-start justify-between mb-[22px]">
          <div>
            <div className="text-[11px] font-medium tracking-[0.05em] uppercase text-ink mb-1">
              {mode === 'pdp' ? 'GENERATE PDP' : 'GENERATE AD'}
            </div>
            <div className="text-[18px] font-medium text-ink">
              {mode === 'pdp' ? 'New product page for ' : 'New creative for '}
              {product.name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-0 text-[18px] text-ink cursor-pointer leading-none hover:opacity-70"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-2.5 bg-[#f7f8fa] rounded-lg px-3 py-2.5 mb-[22px]">
          <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border-[0.5px] border-line">
            <img src={product.img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-ink mb-0.5">{product.name}</div>
            <div className="text-[11px] text-ink">
              {product.status} · {product.ads.length} active ads
            </div>
          </div>
          <span className="text-[12px] font-medium text-ink cursor-pointer hover:opacity-70">Change →</span>
        </div>

        <div className="mb-[22px]">
          <div className="text-[12px] font-medium tracking-[0.04em] uppercase text-ink mb-2.5">ANGLE</div>
          <div className="flex flex-col gap-2">
            {WIZARD_ANGLES.map((a, i) => {
              const selected = !customAngleOpen && selectedAngleIdx === i
              return (
                <div
                  key={a.name}
                  onClick={() => {
                    setSelectedAngleIdx(i)
                    setCustomAngleOpen(false)
                  }}
                  className={`rounded-lg px-4 py-3.5 cursor-pointer transition-colors ${
                    selected
                      ? 'border border-[#1d9e75] bg-[#f0f9f4]'
                      : 'border-[0.5px] border-[#e5e7eb] bg-surf hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-ink">{a.name}</span>
                      <span
                        className={`text-[9px] font-medium tracking-[0.03em] uppercase px-[7px] py-0.5 rounded-lg ${
                          a.state === 'GAP' ? 'bg-[#fcebeb] text-[#791f1f]' : 'bg-[#eaf3de] text-[#27500a]'
                        }`}
                      >
                        {a.state}
                      </span>
                    </div>
                    {a.recommended && (
                      <span className="text-[9px] font-medium tracking-[0.03em] uppercase bg-[#1d9e75] text-white px-2 py-0.5 rounded-[10px]">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] italic text-ink mb-2">"{a.hook}"</div>
                  <div className="flex items-center gap-1.5">
                    {a.highConfidence ? (
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#1d9e75" strokeWidth="1.5">
                        <circle cx="5.5" cy="5.5" r="4.5" />
                        <path d="M3.5 5.5l1.5 1.5 3-3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#6b7280" strokeWidth="1.5">
                        <circle cx="5.5" cy="5.5" r="4.5" />
                      </svg>
                    )}
                    <span className="text-[11px] text-ink">{a.rationale}</span>
                  </div>
                </div>
              )
            })}

            {customAngleOpen ? (
              <div
                className={`rounded-lg px-4 py-3 transition-colors ${
                  customValid
                    ? 'border border-[#1d9e75] bg-[#f0f9f4]'
                    : 'border-[0.5px] border-[#e5e7eb] bg-surf'
                }`}
              >
                <input
                  autoFocus
                  value={customAngleText}
                  onChange={e => setCustomAngleText(e.target.value)}
                  placeholder="Type a custom angle name (min 3 characters)…"
                  className="w-full text-[13px] text-ink bg-transparent border-0 outline-none placeholder:text-ink/40"
                />
              </div>
            ) : (
              <div
                onClick={() => setCustomAngleOpen(true)}
                className="text-center text-[12px] font-medium text-ink cursor-pointer py-2.5 hover:opacity-70"
              >
                + Custom angle
              </div>
            )}
          </div>
        </div>

        <div className="mb-[22px]">
          <div className="text-[12px] font-medium tracking-[0.04em] uppercase text-ink mb-2.5">FORMAT</div>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((f, i) => {
              const selected = selectedFormatIdx === i
              return (
                <div
                  key={f.key}
                  onClick={() => setSelectedFormatIdx(i)}
                  className={`rounded-lg px-4 py-3 text-center cursor-pointer relative ${
                    selected
                      ? 'border border-[#1d9e75] bg-[#f0f9f4]'
                      : 'border-[0.5px] border-[#e5e7eb] bg-surf'
                  }`}
                >
                  {selected && (
                    <span className="absolute top-1.5 right-1.5 text-[8px] font-medium tracking-[0.03em] uppercase bg-[#1d9e75] text-white px-1.5 py-px rounded-lg">
                      REC
                    </span>
                  )}
                  <div
                    className={`w-8 h-8 rounded-md mb-2 mx-auto flex items-center justify-center text-ink ${
                      selected ? 'bg-white' : 'bg-[#f0f1f3]'
                    }`}
                  >
                    {f.icon}
                  </div>
                  <div className="text-[12px] font-medium text-ink mb-0.5">{f.label}</div>
                  <div className="text-[10px] text-ink">{f.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mb-[22px]">
          <div>
            <div className="text-[12px] font-medium tracking-[0.04em] uppercase text-ink mb-1">VARIANTS</div>
            <div className="text-[11px] text-ink">
              {mode === 'pdp' ? 'Different layout variations' : 'Different creative interpretations'}
            </div>
          </div>
          <div className="flex gap-1">
            {variants.map(n => {
              const sel = variantCount === n
              return (
                <button
                  key={n}
                  onClick={() => setVariantCount(n)}
                  className={`text-[13px] px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                    sel
                      ? 'bg-ink text-white border-[0.5px] border-ink font-medium'
                      : 'bg-surf text-ink border-[0.5px] border-[#d1d5db] font-normal hover:bg-[#fafafa]'
                  }`}
                >
                  {n}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-[18px] border-t-[0.5px] border-[#f0f1f3]">
          <button
            onClick={onClose}
            className="text-[12px] font-medium text-ink bg-transparent border-0 cursor-pointer hover:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!canGenerate || !customValid) return
              onGenerate({ angleName, format: format.label, variantCount })
            }}
            disabled={!canGenerate || !customValid}
            className="text-[13px] font-medium text-white bg-[#1d9e75] border-0 rounded-md px-4 py-2 cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buttonText}
          </button>
        </div>
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

type GenContext = {
  mode: 'ad' | 'pdp'
  productName: string
  productIdx: number
  angleName: string
  format: string
  variantCount: number
}

function Studio() {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('All')
  const [assets] = useState<Product[]>(INITIAL_PRODUCTS)
  const [wizardMode, setWizardMode] = useState<WizardMode | null>(null)
  const [genContext, setGenContext] = useState<GenContext | null>(null)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const product = assets[selectedProduct]
  const totalNew = assets.reduce((s, p) => s + p.newCount, 0)

  const handleWizardGenerate = (mode: WizardMode, r: WizardResult) => {
    setWizardMode(null)
    setGenContext({
      mode,
      productName: product.name,
      productIdx: selectedProduct,
      angleName: r.angleName,
      format: r.format,
      variantCount: r.variantCount,
    })
  }

  const handleGeneratingDone = () => {
    // Demo flow only — wizard → generating modal → close. No assets are
    // actually injected into the workspace.
    setGenContext(null)
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
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors border-[0.5px] border-[#e5e7eb] ${
                      sel ? 'bg-surf-2' : 'bg-surf hover:bg-[#fafafa]'
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
                  onClick={() => setWizardMode('ad')}
                  className="text-[12px] text-ink bg-surf border-[0.5px] border-line rounded-[7px] px-3.5 py-1.5 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-line-soft"
                >
                  + Generate ad
                </button>
                <button
                  onClick={() => setWizardMode('pdp')}
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
                      className={`col-span-2 rounded-lg overflow-hidden cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative bg-surf border-[0.5px] border-[#e2deda] ${
                        pdp.state === 'PAUSED' ? 'opacity-60' : ''
                      }`}
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
                        {pdp.state === 'LIVE' && (
                          <div className="flex gap-1.5 mt-2" onClick={e => e.stopPropagation()}>
                            <button className="flex-1 text-[10px] font-medium text-brand bg-transparent border-[0.5px] border-brand rounded px-0 py-1 cursor-pointer flex items-center justify-center gap-1 hover:bg-brand-bg">
                              View in Shopify
                              <svg width="8" height="8" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1.5 7.5l6-6M7.5 1.5h-5M7.5 1.5v5" />
                              </svg>
                            </button>
                          </div>
                        )}
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
                    className="rounded-lg overflow-hidden cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-surf border-[0.5px] border-[#e2deda]"
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

      {wizardMode && (
        <GenerationWizard
          mode={wizardMode}
          product={product}
          onClose={() => setWizardMode(null)}
          onGenerate={r => handleWizardGenerate(wizardMode, r)}
        />
      )}
      {genContext && (
        <GeneratingModal
          mode={genContext.mode}
          productName={genContext.productName}
          angleName={genContext.angleName}
          variantCount={genContext.variantCount}
          onDone={handleGeneratingDone}
        />
      )}
      {lightbox && <Lightbox state={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  )
}

export default Studio
