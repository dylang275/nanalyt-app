// PdpEditor.tsx — PDP editor (storefront preview + live editor rail).
// Ported from design_handoff_nanalyt/source/pdp-editor.jsx. Standalone full-screen
// page (its own strip; not inside AppLayout). Opened from Studio PDP tiles.
import { useState, type CSSProperties, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT } from '../system/tokens'

const PE_SANS = NT.sans
const PE_MONO = NT.mono
const PE_NAVY = '#1f2f55'
const PE_HEADLINES = [
  { h: 'Sleep through the worry, not just the fatigue.', s: 'Magnesium glycinate complex addresses anxiety as the root cause of poor sleep — calm mind enables calm body.' },
  { h: 'Wake up calm. Stay calm.', s: 'High-absorption magnesium that works with your body’s natural rhythms for deep, restorative sleep.' },
  { h: 'The racing-thoughts remedy.', s: 'For working professionals whose minds won’t shut off — glycinate-first magnesium for real rest.' },
]
const PE_DESC_DEFAULT = "Our blend of magnesium glycinate, citrate, and malate was voted 'Best Overall Magnesium Supplement' by Healthline. Working professionals 25–45 with high cognitive stress that disrupts sleep find this formulation gives them what they actually need: not just sleep onset, but freedom from the racing thoughts that keep them awake."
const PE_BULLETS_DEFAULT = ['High Absorption Formula For Improved Bioavailability*', '3rd Party And Triple Lab Tested', 'Vegan, No Artificial Fillers Or Binders', 'Made To The Highest Standards In California']
const PE_TABS = ['Description', 'Directions', 'Ingredients', 'Supplement Facts']
const PE_TAB_BODY: Record<string, string> = {
  Directions: 'Take 3 capsules daily with food, ideally 1–2 hours before bed. Consistent use for 2–4 weeks delivers the full effect.',
  Ingredients: 'Magnesium (as glycinate, malate, citrate) 300mg · vegetable cellulose capsule. No fillers, binders, or artificial ingredients.',
  'Supplement Facts': 'Serving size 3 veggie capsules · 30 servings per container · Magnesium 300mg (71% DV).',
}

type St = { headline: string; subhead: string; desc: string; bullets: string[]; rating: number; reviews: number; discount: number; price: number }

function PeCheck({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ color: '#3c7a4e', fontSize: 11, marginTop: 1, flexShrink: 0 }}>✓</span>
      <span style={{ fontSize: 12.5, color: '#222', lineHeight: 1.5 }}>{children}</span>
    </div>
  )
}
function PeStars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return <span style={{ color: '#e8a33d', fontSize: 13, letterSpacing: 1 }}>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
}

function PeStorefront({ st, imgVariant }: { st: St; imgVariant: number }) {
  const [tab, setTab] = useState('Description')
  const [qty, setQty] = useState(1)
  const [mode, setMode] = useState('sub')
  const subPrice = (st.price * (1 - st.discount / 100)).toFixed(2)
  return (
    <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', background: '#f3f2ef' }}>
      <div style={{ background: '#fff', margin: '10px', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(16,24,15,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 30px', borderBottom: '1px solid #ecebe7' }}>
          <span style={{ fontSize: 16, fontWeight: 650, color: '#2d5c3a', letterSpacing: '-0.02em' }}>Nanalyt Demo</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 24 }}>
            {['Shop', 'Bundle & Save', 'About Us', 'Rewards', 'Contact Us'].map((l) => (
              <span key={l} style={{ fontSize: 12.5, color: '#222', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)', gap: 34, padding: '26px 30px 34px' }}>
          <div style={{ position: 'relative', background: '#fafaf8', border: '1px solid #ecebe7', borderRadius: 10, overflow: 'hidden', alignSelf: 'start' }}>
            <img src="/uploads/IMG_3472.jpg" alt="Magnesium Glycinate Complex"
              style={{ width: '100%', display: 'block', transform: imgVariant === 1 ? 'scaleX(-1)' : 'none', transition: 'transform 0.3s' }} />
            <span style={{ position: 'absolute', top: 12, right: 12, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 500, color: '#222', background: '#fff', border: '1px solid #e2e0db', padding: '4px 10px', borderRadius: 8, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>✎ Edit image</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PeStars rating={st.rating} />
              <span style={{ fontSize: 11.5, color: '#222' }}>{st.reviews.toLocaleString()} Reviews</span>
            </div>
            <h1 style={{ fontSize: 27, fontWeight: 650, color: '#161614', letterSpacing: '-0.022em', lineHeight: 1.18, margin: 0 }}>{st.headline}</h1>
            <p style={{ fontSize: 12.5, color: '#222', lineHeight: 1.55, margin: 0 }}>{st.subhead}</p>

            <div onClick={() => setMode('sub')} style={{ border: `1.5px solid ${mode === 'sub' ? PE_NAVY : '#e2e0db'}`, borderRadius: 10, padding: '13px 16px', position: 'relative', cursor: 'pointer' }}>
              <span style={{ position: 'absolute', top: -9, right: 14, fontSize: 9.5, fontWeight: 600, background: PE_NAVY, color: '#fff', padding: '2.5px 9px', borderRadius: 8 }}>Save up to {st.discount}%</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', border: `4.5px solid ${mode === 'sub' ? PE_NAVY : '#c9c6bf'}`, display: 'block', flexShrink: 0 }}></span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#161614' }}>Subscribe &amp; Save</span>
                <span style={{ fontSize: 10, color: '#222', border: '1px solid #c9c6bf', borderRadius: '50%', width: 13, height: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>i</span>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#222', textDecoration: 'line-through' }}>${st.price.toFixed(2)}</div>
                  <div style={{ fontSize: 17, fontWeight: 650, color: '#161614', fontFamily: PE_MONO }}>${subPrice}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '11px 0 12px' }}>
                <PeCheck>Save {st.discount}%</PeCheck>
                <PeCheck>Free Shipping On Orders &gt; $30</PeCheck>
                <PeCheck>No commitment — Cancel any time</PeCheck>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#161614', marginBottom: 5 }}>Deliver every</div>
              <select onClick={(e) => e.stopPropagation()} style={{ width: '100%', fontSize: 12, color: '#161614', border: '1px solid #c9c6bf', borderRadius: 7, padding: '8px 10px', background: '#fff', fontFamily: PE_SANS, outline: 'none', cursor: 'pointer' }}>
                <option>30 Days: Save {st.discount}%</option><option>60 Days: Save {st.discount}%</option><option>90 Days: Save {st.discount}%</option>
              </select>
            </div>

            <div onClick={() => setMode('one')} style={{ border: `1.5px solid ${mode === 'one' ? PE_NAVY : '#e2e0db'}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', border: `${mode === 'one' ? '4.5px' : '1.5px'} solid ${mode === 'one' ? PE_NAVY : '#c9c6bf'}`, display: 'block', flexShrink: 0 }}></span>
              <span style={{ fontSize: 13, fontWeight: 550, color: '#161614' }}>One-time Purchase</span>
              <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 600, color: '#161614', fontFamily: PE_MONO }}>${st.price.toFixed(2)}</span>
            </div>

            <div style={{ fontSize: 11, color: '#222' }}><span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Shipping</span> calculated at checkout.</div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #c9c6bf', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <span onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: '9px 13px', fontSize: 13, color: '#222', cursor: 'pointer', userSelect: 'none' }}>−</span>
                <span style={{ padding: '9px 6px', fontSize: 12.5, fontWeight: 550, color: '#161614', fontFamily: PE_MONO, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                <span onClick={() => setQty((q) => q + 1)} style={{ padding: '9px 13px', fontSize: 13, color: '#222', cursor: 'pointer', userSelect: 'none' }}>+</span>
              </div>
              <button style={{ flex: 1, background: PE_NAVY, color: '#fff', border: 'none', borderRadius: 24, padding: '11px 0', fontSize: 13.5, fontWeight: 600, fontFamily: PE_SANS, cursor: 'pointer' }}>Add to Cart</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 600, color: '#161614' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3c7a4e', display: 'inline-block' }}></span>IN STOCK</span>
              <span style={{ fontSize: 10.5, color: '#222' }}>HSA/FSA eligible</span>
              <span style={{ fontSize: 10.5, color: '#222' }}>Save an average of 30% <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Learn more</span></span>
            </div>

            <div style={{ display: 'flex', gap: 7, marginTop: 2 }}>
              {PE_TABS.map((t) => (
                <span key={t} onClick={() => setTab(t)} style={{ fontSize: 11, fontWeight: tab === t ? 600 : 475, padding: '5.5px 13px', borderRadius: 8, cursor: 'pointer', background: tab === t ? PE_NAVY : '#eef1f6', color: tab === t ? '#fff' : PE_NAVY, transition: 'all 0.12s' }}>{t}</span>
              ))}
            </div>
            <div style={{ background: '#fafaf8', border: '1px solid #ecebe7', borderRadius: 10, padding: '14px 17px' }}>
              {tab === 'Description' ? (
                <>
                  <p style={{ fontSize: 12, color: '#222', lineHeight: 1.6, margin: '0 0 11px' }}>{st.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {st.bullets.map((b, i) => <PeCheck key={i}>{b}</PeCheck>)}
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 12, color: '#222', lineHeight: 1.6, margin: 0 }}>{PE_TAB_BODY[tab]}</p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
              {([['⚗', 'Lab tested'], ['🌱', 'Vegan'], ['🇺🇸', 'Made in USA'], ['🚫', 'Non GMO']] as [string, string][]).map(([g, l]) => (
                <div key={l} style={{ border: '1px solid #ecebe7', borderRadius: 9, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 15, filter: 'grayscale(1)', opacity: 0.8 }}>{g}</span>
                  <span style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: '0.05em', color: PE_NAVY, textTransform: 'uppercase' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PeField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 550, color: NT.text, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  )
}
const peInput: CSSProperties = { width: '100%', fontSize: 11.5, color: NT.text, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 9, padding: '8px 11px', fontFamily: PE_SANS, outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }

function PeSection({ id, title, open, onToggle, children }: { id: string; title: string; open: boolean; onToggle: (id: string) => void; children: ReactNode }) {
  return (
    <div style={{ background: 'var(--dv-surf)', border: `1px solid ${open ? 'var(--dv-chip-br)' : NT.borderS}`, borderRadius: 13, boxShadow: '0 1px 3px rgba(16,24,15,0.05)', overflow: 'hidden', flexShrink: 0 }}>
      <div onClick={() => onToggle(id)} style={{ display: 'flex', alignItems: 'center', padding: '11px 15px', cursor: 'pointer', background: open ? NT.greenBg : 'transparent' }}>
        <span style={{ fontSize: 11.5, fontWeight: 550, color: NT.text }}>{title}</span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: NT.text, fontWeight: 500 }}>{open ? '−' : '+'}</span>
      </div>
      {open && <div style={{ padding: '12px 15px 15px', borderTop: `1px solid ${NT.borderS}`, display: 'flex', flexDirection: 'column', gap: 11 }}>{children}</div>}
    </div>
  )
}

function PeEditor({ st, set, openSec, setOpenSec, imgVariant, setImgVariant }: {
  st: St; set: (patch: Partial<St>) => void; openSec: string | null; setOpenSec: (fn: (o: string | null) => string | null) => void
  imgVariant: number; setImgVariant: (fn: (v: number) => number) => void
}) {
  const [regenBusy, setRegenBusy] = useState(false)
  const [hIdx, setHIdx] = useState(0)
  const [suggested, setSuggested] = useState(false)
  const toggle = (id: string) => setOpenSec((o) => (o === id ? null : id))

  const regenHeadline = () => {
    const n = (hIdx + 1) % PE_HEADLINES.length
    setHIdx(n)
    set({ headline: PE_HEADLINES[n].h, subhead: PE_HEADLINES[n].s })
  }
  const regenImage = () => {
    if (regenBusy) return
    setRegenBusy(true)
    setTimeout(() => { setImgVariant((v) => (v === 0 ? 1 : 0)); setRegenBusy(false) }, 1400)
  }

  return (
    <div style={{ width: 354, flexShrink: 0, borderLeft: `1px solid ${NT.borderS}`, background: NT.page, overflowY: 'auto', padding: '14px 16px 22px', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: PE_SANS }}>
      <PeSection id="hero" title="Hero section" open={openSec === 'hero'} onToggle={toggle}>
        <PeField label="Headline">
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={st.headline} onChange={(e) => set({ headline: e.target.value })} style={{ ...peInput, flex: 1 }} />
            <button onClick={regenHeadline} title="Regenerate headline" style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, borderRadius: 9, padding: '0 10px', fontSize: 11, fontFamily: PE_SANS, cursor: 'pointer', flexShrink: 0 }}>↻</button>
          </div>
        </PeField>
        <PeField label="Sub-headline">
          <textarea value={st.subhead} onChange={(e) => set({ subhead: e.target.value })} rows={3} style={{ ...peInput, resize: 'vertical' }} />
        </PeField>
        <PeField label="Hero image">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', border: `1px solid ${NT.borderS}`, flexShrink: 0, position: 'relative' }}>
              <img src="/uploads/IMG_3472.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: imgVariant === 1 ? 'scaleX(-1)' : 'none' }} alt="hero" />
              {regenBusy && <div className="pulse" style={{ position: 'absolute', inset: 0, background: 'var(--dv-page)', opacity: 0.75 }}></div>}
            </div>
            <button style={{ flex: 1, background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '8px 0', borderRadius: 9, fontSize: 11, fontWeight: 500, fontFamily: PE_SANS, cursor: 'pointer' }}>Replace</button>
            <button onClick={regenImage} style={{ flex: 1, background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '8px 0', borderRadius: 9, fontSize: 11, fontWeight: 500, fontFamily: PE_SANS, cursor: 'pointer' }}>{regenBusy ? 'Generating…' : '↻ Regen'}</button>
          </div>
        </PeField>
      </PeSection>

      <PeSection id="pos" title="Product positioning" open={openSec === 'pos'} onToggle={toggle}>
        <PeField label="Angle">
          <span style={{ fontSize: 10, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '3px 10px', borderRadius: 9, display: 'inline-block' }}>Next-day calm · from finding</span>
        </PeField>
        <PeField label="Benefit bullets (one per line)">
          <textarea value={st.bullets.join('\n')} onChange={(e) => set({ bullets: e.target.value.split('\n') })} rows={4} style={{ ...peInput, resize: 'vertical', fontSize: 11 }} />
        </PeField>
      </PeSection>

      <PeSection id="why" title="Why it works" open={openSec === 'why'} onToggle={toggle}>
        <PeField label="Description (shown in the Description tab)">
          <textarea value={st.desc} onChange={(e) => set({ desc: e.target.value })} rows={6} style={{ ...peInput, resize: 'vertical', fontSize: 11 }} />
        </PeField>
      </PeSection>

      <PeSection id="reviews" title="Reviews & social proof" open={openSec === 'reviews'} onToggle={toggle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <PeField label="Rating">
            <select value={st.rating} onChange={(e) => set({ rating: parseFloat(e.target.value) })} style={{ ...peInput, cursor: 'pointer' }}>
              <option value={5}>5.0</option><option value={4.5}>4.5</option><option value={4}>4.0</option>
            </select>
          </PeField>
          <PeField label="Review count">
            <input type="number" value={st.reviews} onChange={(e) => set({ reviews: parseInt(e.target.value) || 0 })} style={peInput} />
          </PeField>
        </div>
        <div style={{ fontSize: 10.5, color: NT.text, lineHeight: 1.5 }}>Pulled from your Shopify reviews app — counts sync automatically when live.</div>
      </PeSection>

      <PeSection id="faq" title="FAQ" open={openSec === 'faq'} onToggle={toggle}>
        {['How long until I feel it?', 'Will it make me groggy?', 'Can I take it with melatonin?'].map((q, i) => (
          <div key={i} className="dv2-row" style={{ fontSize: 11.5, color: NT.text, padding: '7px 10px', border: `1px solid ${NT.borderS}`, borderRadius: 9, cursor: 'pointer' }}>{q}</div>
        ))}
        <div style={{ fontSize: 10.5, color: NT.text }}>Rendered further down the page — drag to reorder when live.</div>
      </PeSection>

      <PeSection id="sub" title="Subscribe & purchase" open={openSec === 'sub'} onToggle={toggle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <PeField label="Subscription discount">
            <select value={st.discount} onChange={(e) => set({ discount: parseInt(e.target.value) })} style={{ ...peInput, cursor: 'pointer' }}>
              <option value={10}>10%</option><option value={15}>15%</option><option value={20}>20%</option>
            </select>
          </PeField>
          <PeField label="One-time price">
            <input type="number" step="0.01" value={st.price} onChange={(e) => set({ price: parseFloat(e.target.value) || 0 })} style={peInput} />
          </PeField>
        </div>
        <div style={{ fontSize: 10.5, color: NT.text, lineHeight: 1.5 }}>Subscribe price updates automatically: ${(st.price * (1 - st.discount / 100)).toFixed(2)} at {st.discount}% off.</div>
      </PeSection>

      <div style={{ margin: '4px 2px 0', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 550, color: NT.text }}>Agent suggestions</span>
      </div>
      <div style={{ background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, borderRadius: 13, boxShadow: '0 1px 3px rgba(16,24,15,0.05)', padding: '12px 15px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dv-green-br)', display: 'block', marginTop: 5, flexShrink: 0 }}></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 550, color: NT.text, lineHeight: 1.45 }}>Add a 'How magnesium works' graphic</div>
            <div style={{ fontSize: 10.5, color: NT.text, lineHeight: 1.5, marginTop: 3 }}>Performance data shows visual explainers in this section lift CVR 1.4×</div>
            <button onClick={() => setSuggested(true)} disabled={suggested} style={{ marginTop: 9, background: suggested ? 'var(--dv-page)' : 'var(--dv-btn-bg)', color: suggested ? NT.text : 'var(--dv-btn-fg)', border: suggested ? `1px solid ${NT.borderS}` : 'none', padding: '6px 13px', borderRadius: 9, fontSize: 10.5, fontWeight: 500, fontFamily: PE_SANS, cursor: suggested ? 'default' : 'pointer' }}>{suggested ? '✓ Queued for generation' : 'Generate it →'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PdpEditor() {
  const navigate = useNavigate()
  const [st, setSt] = useState<St>({
    headline: PE_HEADLINES[0].h, subhead: PE_HEADLINES[0].s,
    desc: PE_DESC_DEFAULT, bullets: PE_BULLETS_DEFAULT,
    rating: 5, reviews: 1503, discount: 15, price: 27.99,
  })
  const [openSec, setOpenSec] = useState<string | null>('hero')
  const [imgVariant, setImgVariant] = useState(0)
  const [push, setPush] = useState<'idle' | 'pushing' | 'done'>('idle')
  const set = (patch: Partial<St>) => { setSt((s) => ({ ...s, ...patch })); if (push === 'done') setPush('idle') }
  const doPush = () => {
    if (push === 'pushing') return
    setPush('pushing')
    setTimeout(() => setPush('done'), 2200)
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: NT.page, fontFamily: PE_SANS, overflow: 'hidden' }}>
      <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 11, padding: '0 18px', borderBottom: `1px solid ${NT.borderS}`, background: 'var(--dv-surf)', flexShrink: 0 }}>
        <span onClick={() => navigate('/studio')} style={{ fontSize: 11.5, color: NT.text, cursor: 'pointer', fontWeight: 500 }}>← Studio</span>
        <span style={{ fontSize: 11.5, color: NT.text }}>/</span>
        <span style={{ fontSize: 11.5, fontWeight: 550, color: NT.text }}>Magnesium Glycinate Complex · PDP v1</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9.5, fontWeight: 550, color: NT.green, background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, padding: '2px 8px', borderRadius: 8 }}>
          <span className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dv-green-br)', display: 'inline-block' }}></span>Live
        </span>
        <span style={{ fontSize: 10.5, color: NT.text, fontFamily: PE_MONO }}>2.4% CVR · 32d live · Next-day calm</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {push === 'pushing' && <span style={{ fontSize: 10.5, color: NT.text, fontFamily: PE_MONO }}>syncing hero · pricing · content…</span>}
          <button style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '6.5px 13px', borderRadius: 9, fontSize: 11, fontWeight: 450, fontFamily: PE_SANS, cursor: 'pointer' }}>Discard changes</button>
          {push === 'done' ? (
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--dv-green)', color: '#fff', border: 'none', padding: '6.5px 15px', borderRadius: 9, fontSize: 11, fontWeight: 550, fontFamily: PE_SANS, cursor: 'pointer' }}>
              Open in new window
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 7.5l6-6M7.5 1.5h-5M7.5 1.5v5" /></svg>
            </button>
          ) : (
            <button onClick={doPush} className="dv2-btn-p" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '6.5px 15px', borderRadius: 9, fontSize: 11, fontWeight: 500, fontFamily: PE_SANS, cursor: push === 'pushing' ? 'default' : 'pointer', opacity: push === 'pushing' ? 0.85 : 1 }}>
              {push === 'pushing' && <span className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dv-btn-fg)', display: 'inline-block' }}></span>}
              {push === 'pushing' ? 'Pushing to Shopify…' : 'Push to Shopify →'}
            </button>
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <PeStorefront st={st} imgVariant={imgVariant} />
        <PeEditor st={st} set={set} openSec={openSec} setOpenSec={setOpenSec} imgVariant={imgVariant} setImgVariant={setImgVariant} />
      </div>
    </div>
  )
}
