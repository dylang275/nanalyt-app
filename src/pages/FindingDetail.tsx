// FindingDetail.tsx — full case for one finding (route /findings/:id).
// Ported from design_handoff_nanalyt/source/finding-detail-page.jsx.
// Renders content only; the shell is AppLayout.
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NT, ntCard } from '../system/tokens'
import { ntSeries } from '../system/data'
import { StatCard } from '../components/primitives'
import { HeroChart } from '../components/HeroChart'
import { GenerateAssetsModal } from '../components/GenerateAssetsFlow'
import { NANALYT_FINDINGS, NANALYT_FINDING_TYPES, type Finding } from '../system/findings-data'

const FD_TONE_D: Record<string, { fg: string; bg: string }> = {
  green: { fg: '#7ac292', bg: 'rgba(92,184,119,0.15)' }, yellow: { fg: '#d8a04a', bg: 'rgba(216,160,74,0.16)' },
  red: { fg: '#e0918c', bg: 'rgba(224,145,140,0.13)' }, blue: { fg: '#8ab4e0', bg: 'rgba(138,180,224,0.13)' },
}

function fdBoldify(f: Finding): ReactNode {
  if (!f.bold || !f.bold.length) return f.headline
  let parts: ReactNode[] = [f.headline]
  f.bold.forEach((b) => {
    parts = parts.flatMap((p) => {
      if (typeof p !== 'string' || !p.includes(b)) return [p]
      const segs = p.split(b)
      const out: ReactNode[] = []
      segs.forEach((s, i) => { if (i > 0) out.push(<span key={b + i} style={{ fontWeight: 650 }}>{b}</span>); out.push(s) })
      return out
    })
  })
  return parts
}

export default function FindingDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const parsed = parseInt(id ?? '1', 10)
  const idx = (parsed >= 0 && parsed < NANALYT_FINDINGS.length) ? parsed : 1
  const f = NANALYT_FINDINGS[idx]
  const typeTone = FD_TONE_D[NANALYT_FINDING_TYPES[f.type].tone]
  const [genOpen, setGenOpen] = useState(false)
  const takeAction = () => setGenOpen(true)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && idx > 0) navigate('/findings/' + (idx - 1))
      if (e.key === 'ArrowRight' && idx < NANALYT_FINDINGS.length - 1) navigate('/findings/' + (idx + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, navigate])

  const trend = ntSeries(90, 18, 2.2, 3.5, 22, 4)
  const shortName = f.type === 'New angle' ? 'Next-day calm' : f.headline.split(' ').slice(0, 4).join(' ') + '…'
  const NavBtn = ({ dir, disabled }: { dir: 'prev' | 'next'; disabled: boolean }) => (
    <button onClick={() => !disabled && navigate('/findings/' + (idx + (dir === 'prev' ? -1 : 1)))} disabled={disabled}
      style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, color: NT.text,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1, fontFamily: NT.sans }}>
      <svg width="10" height="10" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'prev' ? 'rotate(90deg)' : 'rotate(-90deg)' }}><path d="M2.5 4L5.5 7.5 8.5 4" /></svg>
    </button>
  )

  return (
    <>
      {/* breadcrumb + pager */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '8px 2px 0' }}>
        <span onClick={() => navigate('/findings')} className="dv2-link" style={{ fontSize: 11.5, color: NT.text, cursor: 'pointer' }}>Findings</span>
        <span style={{ fontSize: 11.5, color: NT.text }}>/</span>
        <span style={{ fontSize: 11.5, fontWeight: 500, color: NT.text }}>{shortName}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono }}>Finding {idx + 1} of {NANALYT_FINDINGS.length}</span>
          <NavBtn dir="prev" disabled={idx === 0} />
          <NavBtn dir="next" disabled={idx === NANALYT_FINDINGS.length - 1} />
        </span>
      </div>

      {/* dark hero — the finding */}
      <div style={{ background: 'linear-gradient(120deg, #10180f 0%, #16241a 70%, #1a2f1f 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(16,24,15,0.18)', padding: '20px 26px 18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,184,119,0.14) 0%, rgba(92,184,119,0) 70%)', pointerEvents: 'none' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12, position: 'relative', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 550, color: typeTone.fg, background: typeTone.bg, padding: '3px 10px', borderRadius: 10 }}>{f.type}</span>
          <span style={{ fontSize: 10, fontWeight: 550, color: f.conf === 'High' ? '#7ac292' : '#d8a04a', background: f.conf === 'High' ? 'rgba(92,184,119,0.15)' : 'rgba(216,160,74,0.16)', padding: '3px 10px', borderRadius: 10 }}>{f.conf} confidence</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: NT.mono }}>{f.time} · {f.sources.length} sources · {f.urgency.toLowerCase()}</span>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 550, color: f.risk ? '#e0918c' : '#7ac292', fontFamily: NT.mono, whiteSpace: 'nowrap' }}>{f.risk ? '⚠' : '↑'} {f.impact}</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 500, color: '#ffffff', lineHeight: 1.5, letterSpacing: '-0.015em', maxWidth: 860, marginBottom: 16, position: 'relative' }}>
          {fdBoldify(f)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', flexWrap: 'wrap' }}>
          <button onClick={() => { if (f.generate) takeAction() }} className="dv2-btn-p" style={{ background: '#ffffff', color: '#10180f', border: 'none', padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 550, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap' }}>{(f.steps[0][f.rich ? 2 : 1] as string).replace(' →', '')}</button>
          <button style={{ background: 'transparent', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.18)', padding: '8px 15px', borderRadius: 10, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap' }}>{f.rich ? 'Generate PDP variant' : (f.steps[1][1] as string)}</button>
          <button style={{ background: 'transparent', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.18)', padding: '8px 15px', borderRadius: 10, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>Dismiss</button>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>Found by overnight scan · Jun 9, 6:00 AM</span>
        </div>
      </div>

      {/* signal facts — rich finding only */}
      {f.rich && f.facts && (
        <div style={{ display: 'flex', gap: 14 }}>
          {f.facts.map(([l, v, s, tone, spark]) => <StatCard key={l} label={l} value={v} sub={s} subTone={tone || undefined} spark={spark} />)}
        </div>
      )}

      {/* coverage chart + evidence/current-state */}
      <div style={{ display: 'grid', gridTemplateColumns: f.rich ? '1.5fr 1fr' : '1fr 1fr', gap: 14, alignItems: 'start' }}>
        {f.rich && f.coverage && (
          <div style={{ ...ntCard, padding: '20px 24px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em' }}>{f.coverage.title || 'Buyer attention vs your coverage'}</span>
              <span style={{ fontSize: 11, color: NT.text }}>{f.coverage.sub || 'share of category conversation · last 90 days'}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.text, fontFamily: NT.mono }}>{f.coverage.dates[0]} – {f.coverage.dates[f.coverage.dates.length - 1]}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 550, color: NT.text, letterSpacing: '-0.04em', lineHeight: 1 }}>{f.coverage.hero}</span>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: NT.greenBr }}>{f.coverage.delta}</span>
            </div>
            <HeroChart vals={trend} color={'var(--dv-green-br)'} fmt={(v) => Math.round(v) + '%'} legend={[['Buyer attention', '']]} uid="fdTrend" h={172} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {f.coverage.dates.map((d) => <span key={d} style={{ fontSize: 10, color: NT.text, fontFamily: NT.mono }}>{d}</span>)}
            </div>
            <div style={{ display: 'flex', borderTop: `1px solid ${NT.borderS}`, marginTop: 12, padding: '12px 0 4px' }}>
              {f.coverage.strip.map(([l, v, s, gap], i) => (
                <div key={l} style={{ flex: 1, paddingLeft: i > 0 ? 20 : 0, marginLeft: i > 0 ? 20 : 0, borderLeft: i > 0 ? `1px solid ${NT.borderS}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                    <span style={{ fontSize: 10.5, color: NT.text }}>{l}</span>
                    {gap && <span style={{ fontSize: 9, fontWeight: 550, color: NT.red, background: 'rgba(196,80,74,0.1)', padding: '1.5px 7px', borderRadius: 7 }}>Gap</span>}
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 550, color: NT.text, fontFamily: NT.mono, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 3 }}>{v}</div>
                  <div style={{ fontSize: 10, color: NT.text }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* evidence */}
          <div style={{ ...ntCard, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px 11px' }}>
              <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>Evidence</span>
              <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono, marginLeft: 8 }}>{f.sources.length} sources</span>
              <span className="dv2-link" style={{ marginLeft: 'auto', fontSize: 11, color: NT.text, cursor: 'pointer' }}>View all →</span>
            </div>
            {f.sources.map((s, i) => (
              <div key={i} className="dv2-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderTop: `1px solid ${NT.borderS}`, cursor: 'pointer' }}>
                <span style={{ width: 120, fontSize: 11.5, fontWeight: 550, color: NT.text, flexShrink: 0 }}>{s[0]}</span>
                <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, fontFamily: NT.mono, whiteSpace: 'nowrap' }}>{s[1]}</span>
                {s[2] && <span style={{ fontSize: 11, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s[2]}</span>}
                <span style={{ flex: 1, fontSize: 10.5, color: NT.text, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s[3] || ''}</span>
                <span style={{ fontSize: 11, color: NT.green, flexShrink: 0 }}>→</span>
              </div>
            ))}
          </div>

          {/* current state */}
          {f.product && (
            <div style={{ ...ntCard, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderBottom: `1px solid ${NT.borderS}` }}>
                <img src={f.product.img} style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} alt="" />
                <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text }}>{f.product.name}</span>
                <span onClick={() => navigate('/active-products')} className="dv2-link" style={{ marginLeft: 'auto', fontSize: 11, color: NT.green, fontWeight: 500, cursor: 'pointer' }}>Open product →</span>
              </div>
              <div style={{ padding: '10px 20px 12px' }}>
                {f.product.state.map(([l, v], i) => (
                  <div key={l} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12, padding: '6.5px 0', borderBottom: i < f.product!.state.length - 1 ? `1px solid ${NT.borderS}` : 'none' }}>
                    <span style={{ fontSize: 11, color: NT.text }}>{l}</span>
                    <span style={{ fontSize: 11.5, color: NT.text, fontFamily: NT.mono }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* linked competitors */}
          {f.competitors.length > 0 && (
            <div style={{ ...ntCard, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: NT.text, marginRight: 2 }}>Linked competitors</span>
              {f.competitors.map((c) => (
                <span key={c} onClick={() => navigate('/competitors')} style={{ fontSize: 10.5, fontWeight: 500, color: NT.text, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, padding: '3px 10px', borderRadius: 9, cursor: 'pointer' }}>{c}</span>
              ))}
            </div>
          )}
        </div>

        {/* non-rich findings: recommended actions in second column */}
        {!f.rich && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ ...ntCard, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '13px 22px 11px' }}>
                <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>Recommended actions</span>
              </div>
              {f.steps.map((step, i) => {
                const t = step[0] as string, cta = step[1] as string, primary = step[2] as boolean
                return (
                  <div key={i} className="dv2-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 22px', borderTop: `1px solid ${NT.borderS}`, cursor: 'pointer' }}>
                    <span style={{ fontSize: 10.5, color: NT.text, fontFamily: NT.mono, width: 20, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ flex: 1, fontSize: 12.5, fontWeight: 525, color: NT.text }}>{t}</span>
                    <button style={primary
                      ? { background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '6.5px 14px', borderRadius: 9, fontSize: 11.5, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }
                      : { background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '6.5px 13px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{cta}</button>
                  </div>
                )
              })}
            </div>
            <div className="dv2-card-h" style={{ ...ntCard, padding: '13px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: NT.text }}>Ask Nanalyt about this finding</span>
              <span style={{ fontSize: 12, color: NT.text }}>→</span>
            </div>
          </div>
        )}
      </div>

      {/* rich finding: full-width actions + go deeper */}
      {f.rich && <>
        <div style={{ ...ntCard, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 22px 11px' }}>
            <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>Recommended actions</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: NT.text }}>The agent pre-fills everything — you approve</span>
          </div>
          {f.steps.map((step, i) => {
            const t = step[0] as string, s = step[1] as string, cta = step[2] as string, primary = step[3] as boolean
            return (
              <div key={i} className="dv2-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 22px', borderTop: `1px solid ${NT.borderS}`, cursor: 'pointer' }}>
                <span style={{ fontSize: 10.5, color: NT.text, fontFamily: NT.mono, width: 20, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 525, color: NT.text, marginBottom: 2 }}>{t}</div>
                  <div style={{ fontSize: 11, color: NT.text }}>{s}</div>
                </div>
                <button onClick={() => { if (f.generate && primary) takeAction() }} style={primary
                  ? { background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '6.5px 14px', borderRadius: 9, fontSize: 11.5, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }
                  : { background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '6.5px 13px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{cta}</button>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[`Run full intelligence pass on ${f.product ? f.product.name : 'this category'}`, 'Ask Nanalyt about this finding'].map((t) => (
            <div key={t} className="dv2-card-h" style={{ ...ntCard, padding: '13px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: NT.text }}>{t}</span>
              <span style={{ fontSize: 12, color: NT.text }}>→</span>
            </div>
          ))}
        </div>
      </>}

      <GenerateAssetsModal
        open={genOpen}
        product={f.product2 || f.product?.name}
        angle={f.angle}
        angleMeta={f.angleMeta}
        onClose={() => setGenOpen(false)}
      />
    </>
  )
}
