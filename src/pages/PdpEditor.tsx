import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Demo content ────────────────────────────────────────────────────────────

const DEFAULT_HEADLINE = 'Sleep through the worry, not just the fatigue.'
const DEFAULT_SUBHEAD =
  'Magnesium glycinate complex addresses anxiety as the root cause of poor sleep — calm mind enables calm body.'
const DEFAULT_BODY =
  "Our blend of magnesium glycinate, citrate, and malate was voted 'Best Overall Magnesium Supplement' by Healthline. Working professionals 25-45 with high cognitive stress that disrupts sleep find this formulation gives them what they actually need: not just sleep onset, but freedom from the racing thoughts that keep them awake."

const ALT_IMAGES = [
  '/uploads/IMG_3472.jpg',
  '/uploads/IMG_3474.jpg',
  '/uploads/IMG_3476.jpg',
  '/uploads/Screenshot 2026-05-11 at 9.00.15 PM.png',
]
const DEFAULT_IMAGE = ALT_IMAGES[0]

const FEATURES = [
  { title: '400mg glycinate form', desc: 'Calms the nervous system at clinical dose' },
  { title: 'No melatonin grogginess', desc: 'Wake up clear-headed, not foggy' },
  { title: 'NSF Certified', desc: 'Third-party tested for purity' },
  { title: 'Vegan, non-GMO', desc: 'Clean formulation' },
]

type SectionId =
  | 'hero'
  | 'positioning'
  | 'why'
  | 'ingredients'
  | 'reviews'
  | 'faq'
  | 'subscribe'

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Hero section' },
  { id: 'positioning', label: 'Product positioning' },
  { id: 'why', label: 'Why it works' },
  { id: 'ingredients', label: 'Ingredient breakdown' },
  { id: 'reviews', label: 'Reviews & social proof' },
  { id: 'faq', label: 'FAQ' },
  { id: 'subscribe', label: 'Subscribe & purchase' },
]

// ─── PDP canvas ──────────────────────────────────────────────────────────────

function PdpCanvas({
  headline,
  subHeadline,
  heroImg,
  onEditHeadline,
  onEditSubHead,
}: {
  headline: string
  subHeadline: string
  heroImg: string
  onEditHeadline: () => void
  onEditSubHead: () => void
}) {
  const editClass =
    'cursor-pointer rounded-sm transition-colors hover:bg-brand-bg hover:outline hover:outline-1 hover:outline-dashed hover:outline-brand'

  return (
    <div className="bg-white border-[0.5px] border-[#e5e7eb] rounded-xl overflow-hidden">
      <div className="bg-[#fafbfc] border-b-[0.5px] border-[#e5e7eb] px-4 py-1.5 flex items-center justify-between text-[10px] text-ink">
        <span className="font-mono">nanalyt-demo.myshopify.com/products/magnesium-glycinate-complex</span>
        <span>Preview · Desktop</span>
      </div>

      <div className="px-7 py-5 border-b-[0.5px] border-[#e5e7eb] flex items-center justify-between">
        <div className="text-[16px] font-bold tracking-tight text-[#0066a0]">Nanalyt Demo</div>
        <div className="flex gap-6 text-[12px] text-ink">
          <span>Shop</span>
          <span>Bundle &amp; Save</span>
          <span>About Us</span>
          <span>Rewards</span>
          <span>Contact Us</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 p-7">
        <div className="aspect-square bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] rounded-lg overflow-hidden relative group">
          <img src={heroImg} alt="" className="w-full h-full object-contain p-6" />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] rounded px-2 py-1 text-[10px] font-medium text-ink">
            ✎ Edit image
          </div>
        </div>

        <div>
          <div className="text-[11px] text-ink mb-2">
            <span className="text-[#fbbf24]">★★★★★</span> 1503 Reviews
          </div>

          <h1
            onClick={onEditHeadline}
            className={`text-[24px] font-semibold leading-[1.2] text-ink mb-4 ${editClass}`}
          >
            {headline}
          </h1>

          <p
            onClick={onEditSubHead}
            className={`text-[13px] leading-[1.5] text-ink mb-5 ${editClass}`}
          >
            {subHeadline}
          </p>

          <div className="bg-[#f0f4f8] rounded-lg px-3.5 py-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-[1.5px] border-[#0066a0] bg-[#0066a0] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-[12px] font-semibold text-ink">Subscribe &amp; Save</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-ink line-through">$27.99</div>
                <div className="text-[13px] font-semibold text-ink">$23.79</div>
              </div>
            </div>
            <div className="text-[10px] text-ink space-y-0.5 mb-2">
              <div>✓ Save 15%</div>
              <div>✓ Free Shipping On Orders &gt; $30</div>
              <div>✓ No commitment — Cancel any time</div>
            </div>
            <div>
              <div className="text-[9px] text-ink mb-1">Deliver every</div>
              <div className="bg-white border-[0.5px] border-[#e5e7eb] rounded px-2 py-1 text-[10px] text-ink flex items-center justify-between">
                <span>30 Days: Save 15%</span>
                <span>▾</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <input
              type="number"
              defaultValue={1}
              className="w-[60px] border-[0.5px] border-[#e5e7eb] rounded px-2 py-2 text-[12px] text-ink outline-none text-center"
            />
            <button className="flex-1 bg-[#1b3654] text-white rounded py-2 text-[12px] font-semibold hover:opacity-90">
              Add to Cart
            </button>
          </div>

          <div className="text-[9px] text-ink">
            <span className="text-brand">●</span> IN STOCK · HSA/FSA eligible · Save an average of 30%
          </div>
        </div>
      </div>

      <div className="px-7 border-b-[0.5px] border-[#e5e7eb] flex gap-6">
        {['Description', 'Directions', 'Ingredients', 'Supplement Facts'].map(t => (
          <div
            key={t}
            className={`pb-2 text-[12px] cursor-pointer ${
              t === 'Description'
                ? 'border-b-2 border-[#0066a0] text-[#0066a0] font-medium -mb-px'
                : 'text-ink'
            }`}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="px-7 py-5">
        <p className="text-[12px] leading-[1.6] text-ink mb-5">{DEFAULT_BODY}</p>

        <div className="text-[11px] font-medium tracking-[0.04em] uppercase text-ink mb-3">WHY IT WORKS</div>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map(f => (
            <div key={f.title} className="border-[0.5px] border-[#e5e7eb] rounded-md px-3 py-2.5">
              <div className="text-[12px] font-medium text-ink mb-1">{f.title}</div>
              <div className="text-[10px] text-ink">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Edit panel components ───────────────────────────────────────────────────

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-medium tracking-[0.03em] uppercase text-ink mb-1">{children}</div>
  )
}

function ImageField({
  thumb,
  onReplace,
  onRegen,
}: {
  thumb: string
  onReplace: () => void
  onRegen: () => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-9 h-9 rounded shrink-0 overflow-hidden border-[0.5px] border-[#d1d5db]">
        <img src={thumb} alt="" className="w-full h-full object-cover" />
      </div>
      <button
        onClick={onReplace}
        className="flex-1 text-[11px] text-ink bg-white border-[0.5px] border-[#d1d5db] rounded px-2 py-1.5 cursor-pointer hover:bg-[#fafafa]"
      >
        Replace
      </button>
      <button
        onClick={onRegen}
        className="text-[11px] text-ink bg-white border-[0.5px] border-[#d1d5db] rounded px-2 py-1.5 cursor-pointer hover:bg-[#fafafa]"
        aria-label="Regenerate"
      >
        ↻ Regen
      </button>
    </div>
  )
}

function SectionCard({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string
  expanded: boolean
  onToggle: () => void
  children?: ReactNode
}) {
  return (
    <div
      className={`rounded-md border-[0.5px] ${
        expanded ? 'border-brand bg-brand-bg p-3.5' : 'border-[#e5e7eb] bg-white px-3.5 py-3'
      }`}
    >
      <div onClick={onToggle} className="flex items-center justify-between cursor-pointer">
        <span className="text-[12px] font-medium text-ink">{label}</span>
        <span className="text-[12px] text-ink leading-none">{expanded ? '−' : '+'}</span>
      </div>
      {expanded && children && <div className="mt-2.5 flex flex-col gap-2.5">{children}</div>}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

function PdpEditor() {
  const navigate = useNavigate()
  const [headline, setHeadline] = useState(DEFAULT_HEADLINE)
  const [subHeadline, setSubHeadline] = useState(DEFAULT_SUBHEAD)
  const [heroImg, setHeroImg] = useState(DEFAULT_IMAGE)
  const [expandedSection, setExpandedSection] = useState<SectionId | null>('hero')
  const [replaceMenuOpen, setReplaceMenuOpen] = useState(false)
  const [regenSpinning, setRegenSpinning] = useState(false)
  const [focusField, setFocusField] = useState<'headline' | 'sub' | null>(null)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const headlineRef = useRef<HTMLInputElement>(null)
  const subRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (expandedSection !== 'hero' || !focusField) return
    const id = window.setTimeout(() => {
      if (focusField === 'headline') headlineRef.current?.focus()
      if (focusField === 'sub') subRef.current?.focus()
      setFocusField(null)
    }, 30)
    return () => clearTimeout(id)
  }, [expandedSection, focusField])

  const editFromCanvas = (field: 'headline' | 'sub') => {
    setExpandedSection('hero')
    setFocusField(field)
  }

  const handleDiscard = () => {
    setHeadline(DEFAULT_HEADLINE)
    setSubHeadline(DEFAULT_SUBHEAD)
    setHeroImg(DEFAULT_IMAGE)
    setShowDiscardConfirm(false)
    navigate('/studio')
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas font-sans">
      <div className="bg-white border-b-[0.5px] border-[#e5e7eb] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/studio')}
            className="text-[12px] text-ink bg-transparent border-0 cursor-pointer hover:opacity-70"
          >
            ← Back to Studio
          </button>
          <div className="w-px h-6 bg-line" />
          <div>
            <div className="text-[12px] font-medium text-ink">Magnesium Glycinate Complex</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-ink">PDP · v1 · Drafted 4 days ago</span>
              <span className="text-[9px] font-semibold bg-info-bg text-info px-1.5 py-px rounded">DRAFT</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-ink bg-brand-bg px-2.5 py-1 rounded-md">
            Generated for Sleep-Anxiety Crossover
          </span>
          <button
            onClick={() => setShowDiscardConfirm(true)}
            className="text-[12px] text-ink bg-white border-[0.5px] border-[#d1d5db] rounded-md px-3 py-1.5 cursor-pointer hover:bg-[#fafafa]"
          >
            Discard
          </button>
          <button
            onClick={() => navigate('/studio')}
            className="text-[12px] font-medium text-white bg-brand border-0 rounded-md px-3.5 py-1.5 cursor-pointer hover:opacity-90"
          >
            Mark ready
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] flex-1 min-h-0">
        <div className="overflow-y-auto p-8">
          <PdpCanvas
            headline={headline}
            subHeadline={subHeadline}
            heroImg={heroImg}
            onEditHeadline={() => editFromCanvas('headline')}
            onEditSubHead={() => editFromCanvas('sub')}
          />
        </div>

        <div className="bg-white border-l-[0.5px] border-[#e5e7eb] px-[18px] py-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-ink">Edit page</span>
            <span className="text-[11px] text-brand flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand block animate-soft-pulse" />
              Live preview
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {SECTIONS.map(s => {
              const expanded = expandedSection === s.id
              return (
                <SectionCard
                  key={s.id}
                  label={s.label}
                  expanded={expanded}
                  onToggle={() => setExpandedSection(expanded ? null : s.id)}
                >
                  {s.id === 'hero' && (
                    <>
                      <div>
                        <FieldLabel>HEADLINE</FieldLabel>
                        <input
                          ref={headlineRef}
                          value={headline}
                          onChange={e => setHeadline(e.target.value)}
                          className="w-full text-[11px] text-ink bg-white border-[0.5px] border-[#d1d5db] rounded px-2 py-1.5 outline-none focus:border-brand"
                        />
                      </div>
                      <div>
                        <FieldLabel>SUB-HEADLINE</FieldLabel>
                        <textarea
                          ref={subRef}
                          value={subHeadline}
                          onChange={e => setSubHeadline(e.target.value)}
                          rows={3}
                          className="w-full text-[11px] text-ink bg-white border-[0.5px] border-[#d1d5db] rounded px-2 py-1.5 outline-none focus:border-brand resize-none"
                        />
                      </div>
                      <div className="relative">
                        <FieldLabel>HERO IMAGE</FieldLabel>
                        <ImageField
                          thumb={heroImg}
                          onReplace={() => setReplaceMenuOpen(v => !v)}
                          onRegen={() => {
                            setRegenSpinning(true)
                            setTimeout(() => setRegenSpinning(false), 1200)
                          }}
                        />
                        {regenSpinning && (
                          <div className="text-[10px] text-ink mt-1 flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 14 14" className="animate-spin" fill="none">
                              <circle cx="7" cy="7" r="5.5" stroke="#e8e5e0" strokeWidth="1.5" />
                              <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="#2d5c3a" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Regenerating…
                          </div>
                        )}
                        {replaceMenuOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border-[0.5px] border-[#e5e7eb] rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.1)] p-2 z-10">
                            <div className="text-[9px] font-semibold tracking-[0.04em] uppercase text-ink mb-2">Choose an image</div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {ALT_IMAGES.map(img => (
                                <div
                                  key={img}
                                  onClick={() => {
                                    setHeroImg(img)
                                    setReplaceMenuOpen(false)
                                  }}
                                  className={`aspect-square rounded overflow-hidden cursor-pointer border-[0.5px] ${
                                    img === heroImg ? 'border-brand' : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                                  }`}
                                >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </SectionCard>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t-[0.5px] border-[#f0f1f3]">
            <div className="text-[10px] font-medium tracking-[0.03em] uppercase text-ink mb-2">AGENT SUGGESTIONS</div>
            <div className="bg-[#f7f8fa] rounded-md px-3 py-2.5 flex gap-2">
              <span className="text-[13px] text-brand shrink-0 leading-none">●</span>
              <div>
                <div className="text-[11px] font-medium text-ink mb-0.5">Add a 'How magnesium works' graphic</div>
                <div className="text-[10px] text-ink">
                  Performance data shows visual explainers in this section lift CVR 1.4×
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDiscardConfirm && (
        <div
          onClick={() => setShowDiscardConfirm(false)}
          className="fixed inset-0 z-[600] bg-black/35 flex items-center justify-center"
        >
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-xl px-6 py-5 w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div className="text-[14px] font-medium text-ink mb-2">Discard all edits?</div>
            <div className="text-[12px] text-ink mb-5">This can't be undone.</div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="text-[12px] text-ink bg-white border-[0.5px] border-[#d1d5db] rounded-md px-3 py-1.5 cursor-pointer hover:bg-[#fafafa]"
              >
                Cancel
              </button>
              <button
                onClick={handleDiscard}
                className="text-[12px] font-medium text-white bg-danger border-0 rounded-md px-3 py-1.5 cursor-pointer hover:opacity-90"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PdpEditor
