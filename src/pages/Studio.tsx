// Studio.tsx — creative workspace (rail + workspace, Direction A).
// Ported from design_handoff_nanalyt/source/studio-page.jsx.
// Renders content only; the shell is AppLayout.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT, ntCard } from '../system/tokens'

const SP_MONO = NT.mono
const SP_SANS = NT.sans
const SP_GRAD = 'linear-gradient(120deg, #10180f 0%, #16241a 70%, #1a2f1f 100%)'

type Pdp = { id: string; state: string; version: string; angle: string; time: string; img: string }
type Ad = { id: string; state: string; fmt: string; desc: string; spec: string; img: string }
type Product = { id: string; name: string; img: string; status: string; live: boolean; pdps: Pdp[]; ads: Ad[] }

const SP_INIT: Product[] = [
  { id: 'mag', name: 'Magnesium Glycinate Complex', img: '/uploads/IMG_3472.jpg', status: 'In market', live: true,
    pdps: [{ id: 'pdp1', state: 'Live', version: 'v1', angle: 'Next-day calm', time: '2.4% CVR · 32d live', img: '/uploads/Screenshot 2026-05-18 at 9.56.07 AM.png' }],
    ads: [
      { id: 'ad1', state: 'New', fmt: 'UGC', desc: 'Next-day calm test', spec: '9:16 vertical', img: '/uploads/IMG_3495.PNG' },
      { id: 'ad2', state: 'New', fmt: 'Static', desc: 'Lifestyle composition', spec: '1:1 square', img: '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png' },
      { id: 'ad3', state: 'New', fmt: 'Video', desc: 'Ingredient explainer', spec: '15s · 9:16', img: '/uploads/IMG_3497.PNG' },
      { id: 'ad4', state: 'Ready', fmt: 'UGC', desc: 'Testimonial', spec: '4 days ago', img: '/uploads/IMG_3499.PNG' },
    ] },
  { id: 'zzz', name: 'ZzzPlex Sleep Support', img: '/uploads/IMG_3474.jpg', status: 'In market', live: false,
    pdps: [{ id: 'pdp2', state: 'Ready', version: 'v1', angle: 'Sleep quality', time: '2 weeks ago', img: '/uploads/IMG_3474.jpg' }],
    ads: [
      { id: 'ad5', state: 'Ready', fmt: 'Static', desc: 'Sleep quality', spec: '1:1 square', img: '/uploads/IMG_3474.jpg' },
      { id: 'ad6', state: 'Ready', fmt: 'UGC', desc: 'Creator review', spec: '9:16 vertical', img: '/uploads/IMG_3474.jpg' },
    ] },
  { id: 'ash', name: 'ASHWAGANDHA+', img: '/uploads/IMG_3476.jpg', status: 'Testing', live: false,
    pdps: [],
    ads: [{ id: 'ad7', state: 'Ready', fmt: 'UGC', desc: 'Stress-sleep angle', spec: '9:16 vertical', img: '/uploads/IMG_3476.jpg' }] },
]

function SpSecHead({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 20px', background: 'var(--dv-page)', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}` }}>
      <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.text }}>{children}</span>
      {right && <span style={{ fontSize: 10.5, color: NT.text, fontFamily: SP_MONO }}>{right}</span>}
    </div>
  )
}
function SpStatePill({ state }: { state: string }) {
  if (state === 'Live') return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9.5, fontWeight: 550, color: NT.green, background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, padding: '2px 8px', borderRadius: 8 }}>
      <span className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dv-green-br)', display: 'inline-block' }}></span>Live
    </span>)
  if (state === 'New') return <span style={{ fontSize: 9.5, fontWeight: 550, color: 'var(--dv-surf)', background: 'var(--dv-btn-bg)', padding: '2px 8px', borderRadius: 8 }}>New</span>
  return <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.text, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, padding: '2px 8px', borderRadius: 8 }}>Ready</span>
}
function SpFmtPill({ fmt }: { fmt: string }) {
  return <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.03em', background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '2px 7px', borderRadius: 6 }}>{fmt}</span>
}
function SpPlay() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: '1.5px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="9" height="11" viewBox="0 0 10 12" fill="#fff"><path d="M1 1l9 5-9 5V1z" /></svg>
      </div>
    </div>
  )
}
function SpAdTile({ ad, onOpen }: { ad: Ad; onOpen: (i: { type: 'ad'; asset: Ad }) => void }) {
  return (
    <div className="dv2-card-h" onClick={() => onOpen({ type: 'ad', asset: ad })} style={{ ...ntCard, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div style={{ aspectRatio: '1/1', position: 'relative', overflow: 'hidden', background: 'var(--dv-page)' }}>
        <img src={ad.img} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={ad.desc} />
        <div style={{ position: 'absolute', top: 8, left: 8 }}><SpFmtPill fmt={ad.fmt} /></div>
        <div style={{ position: 'absolute', top: 8, right: 8 }}><SpStatePill state={ad.state} /></div>
        {(ad.fmt === 'UGC' || ad.fmt === 'Video') && <SpPlay />}
      </div>
      <div style={{ padding: '9px 12px 11px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 11.5, fontWeight: 550, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ad.desc}</div>
        <div style={{ fontSize: 10, color: NT.text, fontFamily: SP_MONO }}>{ad.spec}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 7 }} onClick={(e) => e.stopPropagation()}>
          {ad.state === 'Live'
            ? <button style={{ flex: 1, background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '5px 0', borderRadius: 8, fontSize: 10, fontWeight: 500, fontFamily: SP_SANS, cursor: 'pointer' }}>View on Meta</button>
            : <button style={{ flex: 1, background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '5px 0', borderRadius: 8, fontSize: 10, fontWeight: 500, fontFamily: SP_SANS, cursor: 'pointer' }}>↓ Download</button>}
          <button style={{ width: 30, background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, borderRadius: 8, fontSize: 10.5, fontFamily: SP_SANS, cursor: 'pointer' }}>↻</button>
        </div>
      </div>
    </div>
  )
}
function SpPdpTile({ pdp, onOpen }: { pdp: Pdp; onOpen: () => void }) {
  return (
    <div className="dv2-card-h" onClick={onOpen} style={{ ...ntCard, overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ aspectRatio: '3/2', position: 'relative', overflow: 'hidden', background: 'var(--dv-page)' }}>
        <img src={pdp.img} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} alt="PDP" />
        <div style={{ position: 'absolute', top: 8, right: 8 }}><SpStatePill state={pdp.state} /></div>
      </div>
      <div style={{ padding: '9px 12px 11px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 550, color: NT.text, marginBottom: 2 }}>{pdp.version} · {pdp.angle}</div>
        <div style={{ fontSize: 10, color: NT.text, fontFamily: SP_MONO, marginBottom: 7 }}>{pdp.time}</div>
        <button onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '5px 0', borderRadius: 8, fontSize: 10, fontWeight: 500, fontFamily: SP_SANS, cursor: 'pointer' }}>View in Shopify ↗</button>
      </div>
    </div>
  )
}

const SP_GEN_STEPS = [
  { label: 'Brand context', result: 'pulled from Shopify', at: 12, activeText: undefined as string | undefined },
  { label: 'Angle', result: 'from finding · validated by 3 competitors', at: 30, activeText: undefined },
  { label: 'PDP variant', result: 'drafted · v2 against Next-day calm', at: 58, activeText: undefined },
  { label: 'Creative variants', result: '3 of 3 generated', at: 100, activeText: 'generating…' },
]
function SpGenModal({ product, kind, onDone, onCancel }: { product: Product; kind: string; onDone: () => void; onCancel: () => void }) {
  const [pct, setPct] = useState(0)
  const [sec, setSec] = useState(0)
  const fired = useRef(false)
  const startRef = useRef<number>(0)
  useEffect(() => {
    startRef.current = performance.now()
    const t = setInterval(() => {
      setSec(Math.floor((performance.now() - startRef.current) / 1000))
      setPct((p) => {
        const n = Math.min(100, p + Math.random() * 2.6 + 1.1)
        if (n >= 100 && !fired.current) { fired.current = true; clearInterval(t); setTimeout(onDone, 600) }
        return n
      })
    }, 150)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const done = pct >= 100
  const mm = Math.floor(sec / 60), ss = String(sec % 60).padStart(2, '0')
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(16,24,15,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SP_SANS }} className="dv2-scrim-in">
      <div style={{ ...ntCard, width: 560, overflow: 'hidden', boxShadow: '0 24px 80px rgba(16,24,15,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px 12px' }}>
          {done
            ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill="var(--dv-green-bg)" /><path d="M4 7l2.5 2.5 4-4" stroke="var(--dv-green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            : <span className="pulse" style={{ width: 6, height: 6, background: 'var(--dv-green-br)', borderRadius: '50%', display: 'block' }}></span>}
          <img src={product.img} style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover' }} alt="" />
          <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>{product.name}</span>
          <span style={{ fontSize: 10, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2.5px 9px', borderRadius: 9 }}>{kind === 'pdp' ? 'PDP variant' : 'Next-day calm · 3 variants'}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: NT.text, fontFamily: SP_MONO }}>{mm}:{ss}</span>
            <span style={{ fontSize: 11, fontWeight: 550, color: NT.text, fontFamily: SP_MONO }}>{Math.round(pct)}%</span>
          </div>
        </div>
        <div style={{ height: 4, background: 'var(--dv-page)', margin: '0 22px 14px', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--dv-green-br)', borderRadius: 2, transition: 'width 0.15s linear' }}></div>
        </div>
        <SpSecHead right={`${SP_GEN_STEPS.filter((s) => pct >= s.at).length} of ${SP_GEN_STEPS.length} complete`}>Generation steps</SpSecHead>
        {SP_GEN_STEPS.map((s, i) => {
          const stepDone = pct >= s.at
          const prevAt = i === 0 ? 0 : SP_GEN_STEPS[i - 1].at
          const active = !stepDone && pct >= prevAt
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 14, alignItems: 'center', padding: '9.5px 22px', borderBottom: i < SP_GEN_STEPS.length - 1 ? `1px solid ${NT.borderS}` : 'none', opacity: stepDone || active ? 1 : 0.55, transition: 'opacity 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                {stepDone ? (
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill="var(--dv-green-bg)" /><path d="M4 7l2.5 2.5 4-4" stroke="var(--dv-green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : active ? (
                  <span className="pulse" style={{ width: 9, height: 9, borderRadius: '50%', border: '2px solid var(--dv-green-br)', display: 'block', margin: 2, flexShrink: 0 }}></span>
                ) : (
                  <span style={{ width: 9, height: 9, borderRadius: '50%', border: `1.5px solid ${NT.borderS}`, display: 'block', margin: 2, flexShrink: 0 }}></span>
                )}
                <span style={{ fontSize: 12, fontWeight: active ? 550 : 475, color: NT.text }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 11.5, color: NT.text, fontFamily: stepDone ? SP_MONO : SP_SANS }}>{stepDone ? s.result : active ? (s.activeText || 'working…') : 'queued'}</span>
            </div>
          )
        })}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 22px', borderTop: `1px solid ${NT.borderS}` }}>
          <button onClick={onCancel} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '7px 14px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: SP_SANS, cursor: 'pointer' }}>{done ? 'Close' : 'Cancel'}</button>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.text }}>{done ? 'New creatives added to the review queue' : 'Usually takes about 60 seconds — new creatives land in the review queue'}</span>
        </div>
      </div>
    </div>
  )
}

type LightItem = { type: 'ad'; asset: Ad } | { type: 'pdp'; asset: Pdp }
function SpLightbox({ item, product, onClose }: { item: LightItem; product: Product; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(16,24,15,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SP_SANS }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...ntCard, overflow: 'hidden', maxWidth: 640, width: '88%', maxHeight: '86vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(16,24,15,0.3)' }}>
        <div style={{ padding: '13px 18px', borderBottom: `1px solid ${NT.borderS}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>{item.type === 'pdp' ? `PDP · ${item.asset.version} · ${item.asset.angle}` : item.asset.desc}</div>
            <div style={{ fontSize: 10.5, color: NT.text, fontFamily: SP_MONO, marginTop: 2 }}>{product.name}</div>
          </div>
          <span style={{ marginLeft: 'auto' }}><SpStatePill state={item.asset.state} /></span>
          <span onClick={onClose} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${NT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: NT.text, fontSize: 11 }}>✕</span>
        </div>
        <div style={{ flex: 1, overflow: 'auto', background: 'var(--dv-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, minHeight: 280 }}>
          <img src={item.asset.img} style={{ maxWidth: '100%', maxHeight: item.type === 'pdp' ? 440 : 420, borderRadius: 10, boxShadow: '0 4px 20px rgba(16,24,15,0.12)', objectFit: 'contain' }} alt="" />
        </div>
        <div style={{ padding: '12px 18px', borderTop: `1px solid ${NT.borderS}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '7px 14px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: SP_SANS, cursor: 'pointer' }}>Archive</button>
          {item.type === 'pdp'
            ? <button className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '7px 16px', borderRadius: 9, fontSize: 11.5, fontWeight: 500, fontFamily: SP_SANS, cursor: 'pointer' }}>Push to Shopify →</button>
            : <button className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '7px 16px', borderRadius: 9, fontSize: 11.5, fontWeight: 500, fontFamily: SP_SANS, cursor: 'pointer' }}>↓ Download</button>}
        </div>
      </div>
    </div>
  )
}

export default function Studio() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>(SP_INIT)
  const [sel, setSel] = useState(0)
  const [filter, setFilter] = useState('All')
  const [gen, setGen] = useState<{ kind: string } | null>(null)
  const [justGen, setJustGen] = useState(false)
  const [lightbox, setLightbox] = useState<LightItem | null>(null)
  const p = products[sel]
  const newCount = (ps: Product) => ps.pdps.filter((a) => a.state === 'New').length + ps.ads.filter((a) => a.state === 'New').length
  const totalNew = products.reduce((s, pr) => s + newCount(pr), 0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const matches = (a: { state: string }) => filter === 'All' ? true : filter === 'Live' ? a.state === 'Live' : (a.state === 'New' || a.state === 'Ready')
  const pdps = p.pdps.filter(matches)
  const ads = p.ads.filter(matches)

  const onGenDone = () => {
    setProducts((prev) => prev.map((pr, i) => {
      if (i !== sel) return pr
      if (gen?.kind === 'pdp') {
        return { ...pr, pdps: [...pr.pdps, { id: 'pdp-new-' + pr.pdps.length, state: 'New', version: 'v2', angle: 'Next-day calm', time: 'just now', img: '/uploads/Screenshot 2026-05-18 at 9.56.07 AM.png' }] }
      }
      return { ...pr, ads: [...pr.ads, { id: 'ad-new-' + pr.ads.length, state: 'New', fmt: 'Static', desc: 'Next-day calm · variant B', spec: '1:1 square · just now', img: '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png' }] }
    }))
    setJustGen(true)
    setTimeout(() => setJustGen(false), 8000)
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, margin: '8px 2px 0' }}>
        <span style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Studio</span>
        <span style={{ fontSize: 11.5, color: NT.text }}>creatives and product pages, organized by product</span>
      </div>

      {totalNew > 0 && (
        <div style={{ background: SP_GRAD, borderRadius: 14, boxShadow: '0 4px 24px rgba(16,24,15,0.18)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="pulse" style={{ width: 6, height: 6, background: '#7ac292', borderRadius: '50%', display: 'block', flexShrink: 0 }}></span>
          <span style={{ fontSize: 12, fontWeight: 550, color: '#fff' }}>{totalNew} new creative{totalNew > 1 ? 's' : ''} pending review</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{justGen ? 'just generated — scroll to the New tiles below' : 'generated from the "Start running next-day calm as a new angle" finding · last 24 hours'}</span>
          <button onClick={() => { setSel(0); setFilter('Drafts') }} style={{ marginLeft: 'auto', background: '#fff', color: '#10180f', border: 'none', padding: '6.5px 14px', borderRadius: 9, fontSize: 11, fontWeight: 550, fontFamily: SP_SANS, cursor: 'pointer', whiteSpace: 'nowrap' }}>Review →</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '250px minmax(0,1fr)', gap: 12, alignItems: 'start' }}>
        <div style={{ ...ntCard, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px 10px' }}>
            <span style={{ fontSize: 12, fontWeight: 550, color: NT.text }}>Products</span>
            <span style={{ fontSize: 10.5, color: NT.text, fontFamily: SP_MONO, marginLeft: 7 }}>{products.length}</span>
          </div>
          {products.map((pr, i) => (
            <div key={pr.id} className="dv2-row" onClick={() => setSel(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderTop: `1px solid ${NT.borderS}`, cursor: 'pointer', background: i === sel ? 'var(--dv-page)' : 'transparent' }}>
              <img src={pr.img} style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} alt={pr.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {pr.live && <span className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dv-green-br)', display: 'inline-block', flexShrink: 0 }}></span>}
                  <span style={{ fontSize: 11.5, fontWeight: i === sel ? 550 : 475, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pr.name}</span>
                </div>
                <div style={{ fontSize: 9.5, color: NT.text, fontFamily: SP_MONO, marginTop: 2 }}>{pr.pdps.length > 0 ? `${pr.pdps.length} PDP` : 'No PDP'} · {pr.ads.length} ads</div>
              </div>
              {newCount(pr) > 0 && <span style={{ fontSize: 9, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '1.5px 7px', borderRadius: 8, flexShrink: 0 }}>{newCount(pr)} new</span>}
            </div>
          ))}
        </div>

        <div style={{ ...ntCard, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px 12px', flexWrap: 'wrap' }}>
            <img src={p.img} style={{ width: 38, height: 38, borderRadius: 9, objectFit: 'cover' }} alt={p.name} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em' }}>{p.name}</div>
              <div style={{ fontSize: 10.5, color: NT.text, fontFamily: SP_MONO, marginTop: 1 }}>{p.status} · {p.pdps.length > 0 ? `${p.pdps.length} PDP` : 'No PDP'} · {p.ads.length} ads</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['All', 'Live', 'Drafts'].map((f) => (
                  <span key={f} onClick={() => setFilter(f)} style={{ fontSize: 10.5, fontWeight: filter === f ? 550 : 450, padding: '4px 11px', borderRadius: 8, cursor: 'pointer', background: filter === f ? 'var(--dv-chip-bg)' : 'transparent', color: NT.text, border: `1px solid ${filter === f ? 'var(--dv-chip-br)' : 'transparent'}`, transition: 'all 0.12s' }}>{f}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setGen({ kind: 'ad' })} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '7px 13px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: SP_SANS, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Generate ad</button>
                <button onClick={() => setGen({ kind: 'pdp' })} className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '7px 14px', borderRadius: 9, fontSize: 11.5, fontWeight: 500, fontFamily: SP_SANS, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Generate PDP</button>
              </div>
            </div>
          </div>

          <SpSecHead right={p.pdps.filter((a) => a.state === 'Live').length > 0 ? `${p.pdps.filter((a) => a.state === 'Live').length} live` : p.pdps.length === 0 ? 'none yet' : `${p.pdps.length} draft`}>Product page</SpSecHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, padding: '14px 20px 16px' }}>
            {pdps.map((pdp) => <SpPdpTile key={pdp.id} pdp={pdp} onOpen={() => navigate('/studio/pdp/edit')} />)}
            {filter !== 'Live' && (
              <div onClick={() => setGen({ kind: 'pdp' })} style={{ border: `1.5px dashed ${NT.border}`, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer', color: NT.text, minHeight: 130, padding: '18px 0' }}>
                <span style={{ fontSize: 18, fontWeight: 550 }}>+</span>
                <span style={{ fontSize: 11, fontWeight: 500 }}>{p.pdps.length === 0 ? 'Generate PDP' : 'Generate PDP variant'}</span>
                <span style={{ fontSize: 10, fontFamily: SP_MONO }}>{p.pdps.length === 0 ? 'from the winning angle' : 'test against v1 · Next-day calm'}</span>
              </div>
            )}
            {pdps.length === 0 && filter === 'Live' && (
              <div style={{ gridColumn: '1 / -1', fontSize: 11.5, color: NT.text, padding: '6px 2px' }}>No live PDP for this product yet.</div>
            )}
          </div>

          <SpSecHead right={`${p.ads.filter((a) => a.state === 'New').length} new · ${p.ads.filter((a) => a.state === 'Ready').length} ready`}>Ads · {ads.length}</SpSecHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, padding: '14px 20px 18px' }}>
            {ads.map((ad) => <SpAdTile key={ad.id} ad={ad} onOpen={setLightbox} />)}
            {ads.length === 0 && (
              <div style={{ gridColumn: '1 / -1', fontSize: 11.5, color: NT.text, padding: '6px 2px' }}>Nothing matches this filter.</div>
            )}
          </div>
        </div>
      </div>

      {gen && <SpGenModal product={p} kind={gen.kind} onDone={onGenDone} onCancel={() => setGen(null)} />}
      {lightbox && <SpLightbox item={lightbox} product={p} onClose={() => setLightbox(null)} />}
    </>
  )
}
