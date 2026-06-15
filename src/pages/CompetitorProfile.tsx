// CompetitorProfile.tsx — Olly profile: landing → product detail → angle drawer.
// Ported from design_handoff_nanalyt/source/competitor-profile-page.jsx
// (+ PF/PF_TONE/PfTag from competitor-profile-blocks.jsx). Route /competitors/:id.
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT, ntCard } from '../system/tokens'
import { StatCard, StatSpark, ChipD } from '../components/primitives'
import { PF, PF_TONE, PR_ANGLES, PR_TIER_TONE } from '../system/competitor-data'

function PfTag({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 10, fontWeight: 500, color: NT.mid, background: NT.page, border: `1px solid ${NT.borderS}`, padding: '2px 9px', borderRadius: 9, whiteSpace: 'nowrap' }}>{children}</span>
}

function PrSecHead({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 24px', background: 'var(--dv-page)', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}` }}>
      <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.dim }}>{children}</span>
      {right && <span className="dv2-link" style={{ fontSize: 10.5, color: NT.dim, cursor: 'pointer' }}>{right}</span>}
    </div>
  )
}

function PrAngleDrawer({ idx, prod = 0, onClose, onNav }: { idx: number; prod?: number; onClose: () => void; onNav: (i: number) => void }) {
  const a = PR_ANGLES[idx]
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft' && idx > 0) onNav(idx - 1); if (e.key === 'ArrowRight' && idx < PR_ANGLES.length - 1) onNav(idx + 1) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, onClose, onNav])
  const tier = PR_TIER_TONE[a.tierTone]
  const NavBtn = ({ dir, disabled }: { dir: 'prev' | 'next'; disabled: boolean }) => (
    <button onClick={() => !disabled && onNav(idx + (dir === 'prev' ? -1 : 1))} disabled={disabled}
      style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, color: disabled ? NT.dim : NT.mid,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.45 : 1, fontFamily: NT.sans }}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'prev' ? 'rotate(90deg)' : 'rotate(-90deg)' }}><path d="M2.5 4L5.5 7.5 8.5 4" /></svg>
    </button>
  )
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div onClick={onClose} className="dv2-scrim-in" style={{ position: 'absolute', inset: 0, background: 'rgba(10,15,9,0.38)' }}></div>
      <div className="dv2-drawer-in" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 620, maxWidth: 'calc(100vw - 80px)',
        background: 'var(--dv-surf)', borderLeft: `1px solid ${NT.border}`, boxShadow: '-24px 0 64px rgba(10,15,9,0.10)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* header */}
        <div style={{ padding: '15px 24px 13px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <img src={PF.products[prod || 0].img} style={{ width: 20, height: 20, borderRadius: 5, objectFit: 'cover' }} alt="" />
            <span style={{ fontSize: 11, color: NT.dim }}>{PF.products[prod || 0].name}</span>
            <span style={{ fontSize: 11, color: NT.dim }}>·</span>
            <span style={{ fontSize: 11, color: NT.dim, fontFamily: NT.mono }}>Angle {idx + 1} of {PR_ANGLES.length}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <NavBtn dir="prev" disabled={idx === 0} />
              <NavBtn dir="next" disabled={idx === PR_ANGLES.length - 1} />
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, color: NT.mid, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontFamily: NT.sans, marginLeft: 4 }}>✕</button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 16.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.02em' }}>{a.name}</span>
            <span style={{ fontSize: 10, fontWeight: 550, color: a.miss ? NT.red : NT.green, background: a.miss ? 'rgba(196,80,74,0.1)' : NT.greenBg, padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap' }}>{a.status}</span>
            <span style={{ fontSize: 10, fontWeight: 550, color: tier.fg, background: tier.bg, padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap' }}>{a.tier}</span>
          </div>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <PrSecHead>This angle for them</PrSecHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '14px 24px 16px' }}>
            {a.stats.map(([l, v, s], i) => (
              <div key={l} style={{ border: `1px solid ${NT.borderS}`, borderRadius: 12, padding: '11px 14px' }}>
                <div style={{ fontSize: 10.5, color: NT.mid, marginBottom: 7 }}>{l}</div>
                <div style={{ fontSize: 18, fontWeight: 550, color: i === 2 ? (a.trendTone === 'red' ? NT.red : a.trendTone === 'mid' ? NT.text : NT.greenBr) : NT.text, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', fontFamily: NT.mono, marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 10, color: NT.dim }}>{s}</div>
              </div>
            ))}
          </div>

          <PrSecHead>Angle profile</PrSecHead>
          <div style={{ padding: '6px 24px 12px' }}>
            {([['Positioning', a.positioning], ['Core promise', a.promise], ['Target buyer', a.buyer]] as [string, string][]).map(([l, v], i) => (
              <div key={l} style={{ display: 'grid', gridTemplateColumns: '124px 1fr', gap: 14, padding: '9px 0', borderBottom: i < 2 ? `1px solid ${NT.borderS}` : 'none' }}>
                <span style={{ fontSize: 11, color: NT.dim, paddingTop: 1 }}>{l}</span>
                <span style={{ fontSize: 12, color: NT.text, lineHeight: 1.55 }}>{v}</span>
              </div>
            ))}
          </div>

          <PrSecHead>Your position</PrSecHead>
          <div style={{ padding: '6px 24px 14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '124px 1fr', gap: 14, padding: '9px 0', borderBottom: `1px solid ${NT.borderS}`, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: NT.dim }}>Their performance</span>
              <span style={{ fontSize: 11.5, color: NT.text, fontFamily: NT.mono }}>{a.perf.text} · <span style={{ color: a.perf.tone === 'green' ? NT.greenBr : a.perf.tone === 'red' ? NT.red : NT.mid, fontWeight: 550 }}>{a.perf.delta}</span></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '124px 1fr', gap: 14, padding: '9px 0', borderBottom: `1px solid ${NT.borderS}`, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: NT.dim }}>Your coverage</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11.5, color: NT.text, fontFamily: NT.mono }}>{a.coverage.text}</span>
                {a.coverage.gap && <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.red, background: 'rgba(196,80,74,0.1)', padding: '2px 8px', borderRadius: 8 }}>Gap</span>}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '124px 1fr', gap: 14, padding: '9px 0', borderBottom: `1px solid ${NT.borderS}`, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: NT.dim }}>PDP support</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9.5, fontWeight: 550, color: a.pdp.tone === 'green' ? NT.green : NT.yellow, background: a.pdp.tone === 'green' ? NT.greenBg : 'rgba(168,116,42,0.13)', padding: '2px 8px', borderRadius: 8 }}>{a.pdp.label}</span>
                <span style={{ fontSize: 11, color: NT.dim }}>{a.pdp.note}</span>
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '124px 1fr', gap: 14, padding: '9px 0', borderBottom: `1px solid ${NT.borderS}`, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: NT.dim }}>Validated by</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {a.brands.map(([n, c]) => (
                  <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 500, color: NT.text, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, padding: '2.5px 9px', borderRadius: 9 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block' }}></span>{n}
                  </span>
                ))}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '10px 0 2px' }}>
              <span className="pulse" style={{ width: 5, height: 5, background: 'var(--dv-green-br)', borderRadius: '50%', display: 'block', marginTop: 6, flexShrink: 0 }}></span>
              <span style={{ fontSize: 12, color: NT.mid, lineHeight: 1.6 }}><span style={{ fontWeight: 550, color: NT.text }}>Nanalyt's read · </span>{a.rec}</span>
            </div>
          </div>

          <PrSecHead right="Meta Ad Library →">Example ads in this angle · {a.ads.length}</PrSecHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '14px 24px 18px' }}>
            {a.ads.map((ad, i) => (
              <div key={i} style={{ border: `1px solid ${NT.borderS}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 128, position: 'relative', background: '#111' }}>
                  <img src={ad.img} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={ad.title} />
                  {ad.play && (
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,24,15,0.5)', border: '1px solid rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="7" height="8" viewBox="0 0 7 8" fill="white"><path d="M1 0.5l5.5 3.5L1 7.5V0.5z" /></svg>
                      </span>
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px' }}>
                  <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.mid }}>{ad.fmt}</span>
                  <span style={{ fontSize: 9.5, color: NT.dim, fontFamily: NT.mono }}>{ad.sub.split(' · ')[2]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: '13px 26px', borderTop: `1px solid ${NT.borderS}`, display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <button className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer' }}>Generate creative →</button>
          <button className="dv2-btn-g" style={{ background: 'var(--dv-surf)', color: NT.mid, border: `1px solid ${NT.border}`, padding: '8px 15px', borderRadius: 10, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>Generate PDP →</button>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.dim, fontFamily: NT.mono }}>esc to close · ←→ to switch</span>
        </div>
      </div>
    </div>
  )
}

export default function CompetitorProfile() {
  const navigate = useNavigate()
  const [prodSel, setProdSel] = useState<number | null>(null)
  const [angleIdx, setAngleIdx] = useState<number | null>(null)
  const GRID = '1.4fr 200px 110px 100px 110px'

  return (
    <>
      {/* breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '8px 2px 0' }}>
        <span onClick={() => navigate('/competitors')} className="dv2-link" style={{ fontSize: 11.5, color: NT.dim, cursor: 'pointer' }}>Competitors</span>
        <span style={{ fontSize: 11.5, color: NT.dim }}>/</span>
        <span onClick={() => setProdSel(null)} style={{ fontSize: 11.5, fontWeight: prodSel == null ? 500 : 400, color: prodSel == null ? NT.text : NT.dim, cursor: prodSel == null ? 'default' : 'pointer' }}>Olly</span>
        {prodSel != null && <Fragment>
          <span style={{ fontSize: 11.5, color: NT.dim }}>/</span>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: NT.text }}>{PF.products[prodSel].name}</span>
        </Fragment>}
      </div>

      {/* header */}
      <div style={{ ...ntCard, padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={PF.cover} style={{ width: 52, height: 52, borderRadius: 11, objectFit: 'cover', flexShrink: 0 }} alt="Olly" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
            <span style={{ fontSize: 17, fontWeight: 550, color: NT.text, letterSpacing: '-0.02em' }}>Olly</span>
            <span className="pulse" style={{ width: 6, height: 6, background: NT.greenBr, borderRadius: '50%' }}></span>
            <span style={{ fontSize: 11, color: NT.dim }}>{PF.since} · {PF.last}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {PF.tags.map((t) => <PfTag key={t}>{t}</PfTag>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, flexShrink: 0 }}>
          <button className="dv2-btn-g" style={{ background: 'var(--dv-surf)', color: NT.mid, border: `1px solid ${NT.border}`, padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>Notify me on activity</button>
          <button className="dv2-btn-g" style={{ background: 'var(--dv-surf)', color: NT.mid, border: `1px solid ${NT.border}`, padding: '7px 12px', borderRadius: 10, fontSize: 12, fontFamily: NT.sans, cursor: 'pointer' }}>⋯</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 14 }}>
        {PF.kpis.map((k, i) => <StatCard key={i} label={k.l} value={k.v} sub={k.d} subTone={i === 3 ? undefined : 'pos'} spark={k.spark} />)}
      </div>

      {/* catalog */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 2px 11px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
            <span style={{ fontSize: 14, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Their catalog</span>
            <span style={{ fontSize: 11, color: NT.dim }}>{prodSel == null ? 'pick a product to see how they\'re selling it' : 'viewing ' + PF.products[prodSel].name}</span>
          </div>
          <span style={{ fontSize: 11.5, color: NT.dim }}>Sorted by ad volume</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {PF.products.map((p, i) => {
            const isSel = prodSel === i
            if (prodSel != null) return (
              <div key={i} className="dv2-card-h" onClick={() => setProdSel(i)} style={{ ...ntCard, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
                border: `1px solid ${isSel ? 'var(--dv-green-br)' : NT.borderS}`, boxShadow: isSel ? '0 0 0 1px var(--dv-green-br), ' + NT.shadow : NT.shadow }}>
                <img src={p.img} style={{ width: 30, height: 30, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} alt="" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: isSel ? 550 : 475, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 9.5, color: NT.dim }}>{p.ads} ads · {p.spendPct} of spend</div>
                </div>
              </div>
            )
            return (
              <div key={i} className="dv2-card-h" onClick={() => setProdSel(i)} style={{ ...ntCard, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 104, overflow: 'hidden' }}>
                  <img src={p.img} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={p.name} />
                </div>
                <div style={{ padding: '11px 14px 13px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 10.5, color: NT.mid, fontFamily: NT.mono }}>{p.ads} ads · {p.spendPct} of spend · {p.angles} angle{p.angles > 1 ? 's' : ''}</div>
                  <div style={{ marginTop: 'auto' }}>
                    {p.competes
                      ? <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2px 8px', borderRadius: 8, display: 'inline-block' }}>vs {p.competes}</span>
                      : <span style={{ fontSize: 9.5, color: NT.dim }}>No overlap with your catalog</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* product detail */}
      {prodSel != null && <Fragment>
        <div style={{ background: 'linear-gradient(120deg, #10180f 0%, #16241a 70%, #1a2f1f 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(16,24,15,0.18)', padding: '20px 26px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -130, right: -70, width: 330, height: 330, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,184,119,0.14) 0%, rgba(92,184,119,0) 70%)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, position: 'relative' }}>
            <img src={PF.products[prodSel].img} style={{ width: 40, height: 40, borderRadius: 9, objectFit: 'cover' }} alt="" />
            <div>
              <div style={{ fontSize: 15, fontWeight: 550, color: '#fff', letterSpacing: '-0.015em' }}>{PF.products[prodSel].name}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{prodSel === 0 ? 'Their #1 by ad volume' : PF.products[prodSel].competes ? 'Competes with your ' + PF.products[prodSel].competes : 'Top product'} · {PF.products[prodSel].ads} ads · {PF.products[prodSel].spendPct} of spend</div>
            </div>
            <button style={{ marginLeft: 'auto', background: '#fff', color: '#10180f', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 550, fontFamily: NT.sans, cursor: 'pointer', flexShrink: 0, position: 'relative' }}>Counter this product</button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 450, color: '#ffffff', lineHeight: 1.6, letterSpacing: '-0.012em', maxWidth: 820, position: 'relative' }}>
            {prodSel === 0
              ? <Fragment>This is the product behind their sleep-anxiety push — <ChipD>42%</ChipD> of its creative is on that one angle, scaled <ChipD>+12 pts</ChipD> in 30 days. It overlaps your ASHWAGANDHA+ buyer almost exactly; their angle gap is your <ChipD>"next-day calm"</ChipD> story.</Fragment>
              : <Fragment>They're running <ChipD>{String(PF.products[prodSel].ads)} ads</ChipD> on this product — <ChipD>{PF.products[prodSel].spendPct}</ChipD> of their creative spend across {PF.products[prodSel].angles} angle{PF.products[prodSel].angles > 1 ? 's' : ''}. {PF.products[prodSel].competes ? 'It competes directly with your ' + PF.products[prodSel].competes + '.' : 'It doesn\'t overlap your catalog — watch, don\'t chase.'} The angle mix below shows where they're betting.</Fragment>}
          </div>
        </div>

        <div style={{ ...ntCard, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px 22px 13px' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 550, color: NT.text, marginBottom: 2 }}>Their angles — performance-weighted</div>
              <div style={{ fontSize: 11, color: NT.dim }}>Click an angle for the full breakdown</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 11.5, color: NT.dim }}>Sorted by share</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 14, alignItems: 'center', padding: '7px 22px', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}`, background: NT.page }}>
            {['Angle', 'Share of creative', 'Median longevity', 'Trend · 30d', 'Your coverage'].map((h) =>
              <div key={h} style={{ fontSize: 10.5, fontWeight: 500, color: NT.dim }}>{h}</div>)}
          </div>
          {PR_ANGLES.map((a, i) => (
            <div key={a.name} className="dv2-row" onClick={() => setAngleIdx(i)} style={{ display: 'grid', gridTemplateColumns: GRID, gap: 14, alignItems: 'center', padding: '12px 22px', borderBottom: i < PR_ANGLES.length - 1 ? `1px solid ${NT.borderS}` : 'none', cursor: 'pointer' }}>
              <div style={{ fontSize: 12.5, fontWeight: 475, color: NT.text }}>{a.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ flex: 1, height: 6, background: NT.page, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(a.share / 30) * 100}%`, height: '100%', background: 'var(--dv-green-br)', opacity: 0.55 + 0.45 * (a.share / 30), borderRadius: 3 }}></div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 550, color: NT.text, fontFamily: NT.mono, width: 34 }}>{a.share}%</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 550, color: a.lonTone === 'red' ? NT.red : NT.yellow, background: a.lonTone === 'red' ? 'rgba(196,80,74,0.11)' : 'rgba(168,116,42,0.13)', padding: '3px 10px', borderRadius: 9, justifySelf: 'start' }}>{a.lon} median</span>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: PF_TONE[a.trendTone].fg }}>{a.trend}</span>
              <span style={{ fontSize: 10.5, fontWeight: 550, color: a.miss ? NT.red : NT.green, background: a.miss ? 'rgba(196,80,74,0.1)' : NT.greenBg, padding: '3.5px 11px', borderRadius: 10, justifySelf: 'start' }}>{a.miss ? 'Missing' : 'You run it'}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderTop: `1px solid ${NT.borderS}` }}>
            <span style={{ fontSize: 11.5, color: NT.mid }}>Creative velocity</span>
            <StatSpark data={[9, 12, 14, 11, 16]} color={NT.greenBr} w={72} h={20} />
            <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, fontFamily: NT.mono }}>16 <span style={{ fontWeight: 450, color: NT.mid, fontFamily: NT.sans }}>new ads this week — their highest</span></span>
            <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.dim, fontFamily: NT.mono }}>wk of Jun 9</span>
          </div>
          <div style={{ padding: '14px 22px 16px', borderTop: `1px solid ${NT.borderS}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <span className="pulse" style={{ width: 5, height: 5, background: 'var(--dv-green-br)', borderRadius: '50%', display: 'block' }}></span>
              <span style={{ fontSize: 11, fontWeight: 550, color: NT.text }}>Nanalyt's read</span>
            </div>
            <div style={{ fontSize: 12.5, color: NT.mid, lineHeight: 1.6, maxWidth: 780 }}>{PF.synthesis}</div>
          </div>
        </div>
      </Fragment>}

      {angleIdx != null && <PrAngleDrawer idx={angleIdx} prod={prodSel ?? 0} onClose={() => setAngleIdx(null)} onNav={(i) => setAngleIdx(i)} />}
    </>
  )
}
