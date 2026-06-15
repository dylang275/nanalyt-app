// Findings.tsx — findings queue (grouped triage).
// Ported from design_handoff_nanalyt/source/findings-page.jsx.
// Renders content only; the shell is AppLayout.
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { NT, ntCard } from '../system/tokens'
import { NANALYT_FINDINGS, NANALYT_FINDING_TYPES, type Finding } from '../system/findings-data'
import { GenerateAssetsModal } from '../components/GenerateAssetsFlow'

const FQ_TONE: Record<string, { fg: string; bg: string }> = {
  green: { fg: NT.green, bg: NT.greenBg }, yellow: { fg: NT.yellow, bg: 'rgba(168,116,42,0.13)' },
  red: { fg: NT.red, bg: 'rgba(196,80,74,0.1)' }, blue: { fg: NT.blue, bg: 'rgba(58,110,168,0.1)' },
}
const fqType = (t: Finding['type']) => FQ_TONE[NANALYT_FINDING_TYPES[t].tone]

function FqCard({ f, onOpen, onTakeAction }: { f: Finding; onOpen: (f: Finding) => void; onTakeAction: (f: Finding) => void }) {
  const t = fqType(f.type)
  const open = () => onOpen(f)
  return (
    <div className="dv2-card-h" onClick={open} style={{ ...ntCard, padding: '14px 22px 13px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 550, color: t.fg, background: t.bg, padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap' }}>{f.type}</span>
        <span style={{ fontSize: 10.5, color: NT.text, fontFamily: NT.mono }}>{f.time}</span>
        <span style={{ fontSize: 10, fontWeight: 550, color: f.conf === 'High' ? NT.green : NT.yellow, background: f.conf === 'High' ? NT.greenBg : 'rgba(168,116,42,0.13)', padding: '2.5px 9px', borderRadius: 9 }}>{f.conf}</span>
        <span style={{ fontSize: 10.5, color: NT.text }}>{f.urgency}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 550, color: f.risk ? NT.red : NT.greenBr, fontFamily: NT.mono, whiteSpace: 'nowrap' }}>{f.risk ? '⚠' : '↑'} {f.impact}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, lineHeight: 1.45, letterSpacing: '-0.012em', marginBottom: 10, maxWidth: 840 }}>{f.headline}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {f.sources.map((s, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, borderRadius: 9, padding: '3px 10px', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 10.5, fontWeight: 550, color: NT.text }}>{s[0]}</span>
                <span style={{ fontSize: 10.5, color: NT.text, fontFamily: NT.mono }}>{s[1]}</span>
              </span>
            ))}
            {f.related > 0 && <span style={{ fontSize: 10.5, color: NT.text }}>+{f.related} related signals</span>}
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'stretch', flexShrink: 0, width: 150 }}>
          <button className="dv2-btn-p" onClick={() => (f.generate ? onTakeAction(f) : open())} style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '7px 14px', borderRadius: 9, fontSize: 11.5, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap' }}>{f.cta}</button>
          <button className="dv2-btn-g" onClick={open} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '7px 14px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>Open finding</button>
        </div>
      </div>
    </div>
  )
}

function FqSecHead({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 24px', background: 'var(--dv-page)', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}` }}>
      <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.text }}>{children}</span>
      {right && <span style={{ fontSize: 10.5, color: NT.text }}>{right}</span>}
    </div>
  )
}

function FqAlertDrawer({ f, onClose }: { f: Finding; onClose: () => void }) {
  const t = fqType(f.type)
  const navigate = useNavigate()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div onClick={onClose} className="dv2-scrim-in" style={{ position: 'absolute', inset: 0, background: 'rgba(10,15,9,0.38)' }}></div>
      <div className="dv2-drawer-in" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 600, maxWidth: 'calc(100vw - 80px)',
        background: 'var(--dv-surf)', borderLeft: `1px solid ${NT.border}`, boxShadow: '-24px 0 64px rgba(10,15,9,0.10)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* header */}
        <div style={{ padding: '15px 24px 13px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: NT.text }}>Needs you today</span>
            <span style={{ fontSize: 11, color: NT.text }}>·</span>
            <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono }}>{f.time}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span onClick={() => navigate('/findings/' + f.id)} style={{ fontSize: 11, fontWeight: 500, color: NT.green, cursor: 'pointer', marginRight: 4 }}>Full finding →</span>
              <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, color: NT.text, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, cursor: 'pointer', fontFamily: NT.sans }}>✕</button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
            <span style={{ fontSize: 10, fontWeight: 550, color: t.fg, background: t.bg, padding: '3px 10px', borderRadius: 10 }}>{f.type}</span>
            <span style={{ fontSize: 10, fontWeight: 550, color: f.conf === 'High' ? NT.green : NT.yellow, background: f.conf === 'High' ? NT.greenBg : 'rgba(168,116,42,0.13)', padding: '3px 10px', borderRadius: 10 }}>{f.conf} confidence</span>
            <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 550, color: f.risk ? NT.red : NT.greenBr, fontFamily: NT.mono }}>{f.risk ? '⚠' : '↑'} {f.impact}</span>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, lineHeight: 1.45, letterSpacing: '-0.012em' }}>{f.headline}</div>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <FqSecHead right={f.sources.length + ' sources'}>Evidence</FqSecHead>
          <div style={{ padding: '6px 24px 10px' }}>
            {f.sources.map((s, i) => (
              <div key={i} className="dv2-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8.5px 0', borderBottom: i < f.sources.length - 1 ? `1px solid ${NT.borderS}` : 'none', cursor: 'pointer' }}>
                <span style={{ width: 96, fontSize: 11, fontWeight: 550, color: NT.text, flexShrink: 0 }}>{s[0]}</span>
                <span style={{ fontSize: 11.5, fontWeight: 550, color: NT.text, fontFamily: NT.mono, whiteSpace: 'nowrap' }}>{s[1]}</span>
                <span style={{ flex: 1, fontSize: 10.5, color: NT.text, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s[2] || ''}</span>
                <span style={{ fontSize: 11, color: NT.green, flexShrink: 0 }}>→</span>
              </div>
            ))}
          </div>
          {f.product && <>
            <FqSecHead>Current state</FqSecHead>
            <div style={{ padding: '10px 24px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img src={f.product.img} style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover' }} alt="" />
                <span style={{ fontSize: 12, fontWeight: 550, color: NT.text }}>{f.product.name}</span>
                <span onClick={() => navigate('/active-products')} className="dv2-link" style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.green, fontWeight: 500, cursor: 'pointer' }}>Open product →</span>
              </div>
              {f.product.state.map(([l, v], i) => (
                <div key={l} style={{ display: 'grid', gridTemplateColumns: '118px 1fr', gap: 12, padding: '6.5px 0', borderBottom: i < f.product!.state.length - 1 ? `1px solid ${NT.borderS}` : 'none' }}>
                  <span style={{ fontSize: 11, color: NT.text }}>{l}</span>
                  <span style={{ fontSize: 11.5, color: NT.text, fontFamily: NT.mono }}>{v}</span>
                </div>
              ))}
            </div>
          </>}
          <FqSecHead>Fix it</FqSecHead>
          <div style={{ padding: '6px 24px 14px' }}>
            {f.steps.map((step, i) => {
              const t2 = step[0] as string, cta = step[1] as string, primary = step[2] as boolean
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < f.steps.length - 1 ? `1px solid ${NT.borderS}` : 'none' }}>
                  <span style={{ fontSize: 10.5, color: NT.text, fontFamily: NT.mono, width: 20, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: NT.text }}>{t2}</span>
                  <button style={primary
                    ? { background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '6px 13px', borderRadius: 8, fontSize: 11, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }
                    : { background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{cta}</button>
                </div>
              )
            })}
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: '13px 24px', borderTop: `1px solid ${NT.borderS}`, display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <button className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer' }}>{f.cta}</button>
          <button className="dv2-btn-g" style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '8px 15px', borderRadius: 10, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>Snooze 24h</button>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.text, fontFamily: NT.mono }}>esc to close</span>
        </div>
      </div>
    </div>
  )
}

export default function Findings() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState('all')
  const [alert, setAlert] = useState<Finding | null>(null)
  const [genFinding, setGenFinding] = useState<Finding | null>(null)
  const openFinding = (f: Finding) => {
    if (f.urgency === 'Act today') setAlert(f)
    else navigate('/findings/' + f.id)
  }

  // Deep-link from the Dashboard "Take action" button: /findings?action=gummies
  useEffect(() => {
    if (searchParams.get('action') === 'gummies') {
      const f = NANALYT_FINDINGS.find((x) => x.generate)
      if (f) setGenFinding(f)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const visible = NANALYT_FINDINGS.filter((f) => (filter === 'all' ? true : filter === 'risk' ? f.risk : !f.risk))
  const urgent = visible.filter((f) => f.urgency === 'Act today')
  const rest = visible.filter((f) => f.urgency !== 'Act today').sort((a, b) => (b.impactRank ?? 0) - (a.impactRank ?? 0))
  const filters: [string, string][] = [['all', 'All · 12'], ['risk', 'Risks · 3'], ['opp', 'Opportunities · 9']]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 2px 0' }}>
        <div>
          <span style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Findings</span>
          <span style={{ fontSize: 11.5, color: NT.text, marginLeft: 9 }}>12 open · 14,210 signals scanned this week</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 7, alignItems: 'center' }}>
          {filters.map(([id, label]) => (
            <span key={id} onClick={() => setFilter(id)} style={{ fontSize: 11.5, fontWeight: filter === id ? 550 : 450, padding: '5.5px 13px', borderRadius: 9, cursor: 'pointer', whiteSpace: 'nowrap',
              background: filter === id ? 'var(--dv-btn-bg)' : 'var(--dv-surf)', color: filter === id ? 'var(--dv-btn-fg)' : NT.text,
              border: `1px solid ${filter === id ? 'var(--dv-btn-bg)' : NT.borderS}`, boxShadow: filter === id ? 'none' : NT.shadow, transition: 'all 0.12s' }}>{label}</span>
          ))}
          <button className="dv2-btn-g" style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '6px 13px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer', marginLeft: 6 }}>Notification rules</button>
        </div>
      </div>

      {urgent.length > 0 && <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 2px -4px' }}>
          <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text }}>Needs you today</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono }}>{urgent.length}</span>
        </div>
        {urgent.map((f) => <FqCard key={f.id} f={f} onOpen={openFinding} onTakeAction={setGenFinding} />)}
      </>}

      {rest.length > 0 && <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 2px -4px' }}>
          <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text }}>{filter === 'risk' ? 'Watch closely' : 'Opportunities'}</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono }}>{filter === 'all' ? 11 : rest.length}</span>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: NT.text }}>Sorted by impact</span>
        </div>
        {rest.map((f) => <FqCard key={f.id} f={f} onOpen={openFinding} onTakeAction={setGenFinding} />)}
      </>}

      {filter === 'all' && (
        <div className="dv2-card-h" style={{ ...ntCard, padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: NT.text }}>Show 6 more</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono }}>resolved & older findings</span>
        </div>
      )}

      {alert && <FqAlertDrawer f={alert} onClose={() => setAlert(null)} />}

      <GenerateAssetsModal
        open={!!genFinding}
        product={genFinding?.product2 || genFinding?.product?.name}
        angle={genFinding?.angle}
        angleMeta={genFinding?.angleMeta}
        onClose={() => setGenFinding(null)}
      />
    </>
  )
}
