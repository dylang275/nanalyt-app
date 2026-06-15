// Research.tsx — ask the agent to scan a market (Direction A).
// Ported from design_handoff_nanalyt/source/research-page.jsx.
// Renders content only; the shell is AppLayout.
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT, ntCard } from '../system/tokens'

const RES_TABS = ['Category', 'Product', 'Import URL']
const RES_PLACEHOLDERS: Record<string, string> = {
  'Category': 'Category or niche (e.g. magnesium sleep supplements)',
  'Product': 'Product name or ASIN',
  'Import URL': 'Paste a URL (olly.com, amazon.com/dp/…)',
}
const RES_SOURCES = ['Amazon Reviews', 'TikTok Ads', 'Meta Ads', 'YouTube', 'Reddit', 'Google']
const RES_SEEDS = [
  { tag: 'From a finding', text: 'Validate demand for the sleep-anxiety crossover angle', sub: 'Olly is scaling it · you have 0 coverage', q: 'sleep anxiety crossover supplements' },
  { tag: 'From your pipeline', text: 'Sourcing check on Magnesium L-Threonate', sub: 'Score 79 · 2 findings attached', q: 'Magnesium L-Threonate' },
  { tag: 'From competitors', text: 'Who else is bidding on "next-day calm"?', sub: 'Your differentiated angle · 3 brands adjacent', q: 'next-day calm supplements' },
]
const RES_RECENT = [
  { q: 'Magnesium sleep supplements', type: 'Category', found: 6, pipeline: 3, time: '2h ago' },
  { q: 'Melatonin gummies 5mg', type: 'Product', found: 4, pipeline: 2, time: 'Yesterday' },
  { q: 'Ashwagandha stress relief', type: 'Category', found: 8, pipeline: 5, time: '2d ago' },
  { q: 'olly.com/products/sleep-gummies', type: 'URL', found: 1, pipeline: 1, time: '3d ago' },
]
const RES_STEPS = [
  { label: 'Amazon Reviews', result: '8 active campaigns' },
  { label: 'TikTok Ads', result: '320 relevant threads' },
  { label: 'Meta Ads', result: '14 competitor ads found' },
  { label: 'YouTube', result: '11 review videos' },
  { label: 'Reddit', result: '29 community threads' },
  { label: 'Google Trends', result: '+3.2× search growth' },
  { label: 'Buyer language patterns', result: '63 key phrases extracted' },
  { label: 'Angle opportunities', result: '4 angle gaps found' },
]

type Step = { label: string; result: string }
type Scan = { query: string; steps: Step[]; current: number; pct: number; done: boolean; elapsed: number }

function ResSecHead({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 22px', background: 'var(--dv-page)', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}` }}>
      <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.text }}>{children}</span>
      {right && <span style={{ fontSize: 10.5, color: NT.text }}>{right}</span>}
    </div>
  )
}
function ResTypePill({ type }: { type: string }) {
  const m: Record<string, { fg: string; bg: string; br?: boolean }> = { Category: { fg: NT.green, bg: NT.greenBg }, Product: { fg: NT.blue, bg: 'rgba(58,110,168,0.1)' }, URL: { fg: NT.text, bg: 'var(--dv-page)', br: true } }
  const s = m[type]
  return <span style={{ fontSize: 10, fontWeight: 550, color: s.fg, background: s.bg, border: s.br ? `1px solid ${NT.borderS}` : 'none', padding: '2.5px 9px', borderRadius: 9, whiteSpace: 'nowrap', justifySelf: 'start' }}>{type}</span>
}

function ResSearchHero({ tab, setTab, query, setQuery, sources, toggleSource, onScan }: {
  tab: string; setTab: (t: string) => void; query: string; setQuery: (q: string) => void
  sources: Record<string, boolean>; toggleSource: (s: string) => void; onScan: () => void
}) {
  const enabled = RES_SOURCES.filter((s) => sources[s]).length
  return (
    <div style={{ background: 'linear-gradient(120deg, #10180f 0%, #16241a 70%, #1a2f1f 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(16,24,15,0.18)', padding: '22px 26px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -130, right: -70, width: 330, height: 330, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,184,119,0.14) 0%, rgba(92,184,119,0) 70%)', pointerEvents: 'none' }}></div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, position: 'relative' }}>
        {RES_TABS.map((t) => (
          <span key={t} onClick={() => setTab(t)} style={{ fontSize: 11.5, fontWeight: tab === t ? 550 : 450, padding: '5.5px 14px', borderRadius: 9, cursor: 'pointer', transition: 'all 0.12s',
            background: tab === t ? '#fff' : 'rgba(255,255,255,0.07)', color: tab === t ? '#10180f' : 'rgba(255,255,255,0.85)' }}>{t}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12, padding: '6px 8px 6px 16px', marginBottom: 12, position: 'relative' }}>
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" style={{ flexShrink: 0 }}><circle cx="6.5" cy="6.5" r="4.5" /><path d="M10.5 10.5L13.5 13.5" /></svg>
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onScan() }}
          placeholder={RES_PLACEHOLDERS[tab]}
          style={{ flex: 1, fontSize: 13.5, color: '#fff', background: 'transparent', border: 'none', outline: 'none', fontFamily: NT.sans, padding: '8px 0', minWidth: 0 }} />
        <button onClick={onScan} style={{ background: query.trim() ? '#fff' : 'rgba(255,255,255,0.12)', color: query.trim() ? '#10180f' : 'rgba(255,255,255,0.8)', border: 'none', padding: '8px 16px', borderRadius: 9, fontSize: 12, fontWeight: 550, fontFamily: NT.sans, cursor: query.trim() ? 'pointer' : 'default', flexShrink: 0, transition: 'all 0.15s' }}>Scan market →</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>Sources · {enabled} of 6</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {RES_SOURCES.map((s) => {
            const on = sources[s]
            return (
              <span key={s} onClick={() => toggleSource(s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 500, padding: '3.5px 11px', borderRadius: 9, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.12s',
                color: on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.8)', background: on ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${on ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.10)'}` }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: on ? '#7ac292' : 'rgba(255,255,255,0.25)', display: 'inline-block', transition: 'background 0.12s' }}></span>{s}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ResScanCard({ scan, onCancel, onNew, onView }: { scan: Scan; onCancel: () => void; onNew: () => void; onView: () => void }) {
  const { query, steps, current, pct, done, elapsed } = scan
  const mm = Math.floor(elapsed / 60), ss = String(elapsed % 60).padStart(2, '0')
  return (
    <div style={{ ...ntCard, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px 12px' }}>
        {done
          ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill="var(--dv-green-bg)" /><path d="M4 7l2.5 2.5 4-4" stroke="var(--dv-green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : <span className="pulse" style={{ width: 6, height: 6, background: 'var(--dv-green-br)', borderRadius: '50%', display: 'block' }}></span>}
        <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>{query}</span>
        <span style={{ fontSize: 10, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2.5px 9px', borderRadius: 9 }}>Category scan</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono }}>{mm}:{ss} elapsed</span>
          <span style={{ fontSize: 11, fontWeight: 550, color: NT.text, fontFamily: NT.mono }}>{pct}%</span>
        </div>
      </div>
      <div style={{ height: 4, background: 'var(--dv-page)', margin: '0 22px 14px', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--dv-green-br)', borderRadius: 2, transition: 'width 0.18s ease' }}></div>
      </div>
      <ResSecHead right={`${Math.min(current, steps.length)} of ${steps.length} complete`}>Scan steps</ResSecHead>
      {steps.map((s, i) => {
        const isDone = i < current
        const isCurrent = i === current && !done
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: 14, alignItems: 'center', padding: '9.5px 22px', borderBottom: i < steps.length - 1 ? `1px solid ${NT.borderS}` : 'none', opacity: isDone || isCurrent || done ? 1 : 0.55, transition: 'opacity 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              {isDone || done ? (
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill="var(--dv-green-bg)" /><path d="M4 7l2.5 2.5 4-4" stroke="var(--dv-green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : isCurrent ? (
                <span className="pulse" style={{ width: 9, height: 9, borderRadius: '50%', border: '2px solid var(--dv-green-br)', display: 'block', margin: 2, flexShrink: 0 }}></span>
              ) : (
                <span style={{ width: 9, height: 9, borderRadius: '50%', border: `1.5px solid ${NT.borderS}`, display: 'block', margin: 2, flexShrink: 0 }}></span>
              )}
              <span style={{ fontSize: 12, fontWeight: isCurrent ? 550 : 475, color: NT.text }}>{s.label}</span>
            </div>
            <span style={{ fontSize: 11.5, color: NT.text, fontFamily: (isDone || done) ? NT.mono : NT.sans }}>
              {(isDone || done) ? s.result : isCurrent ? 'scanning…' : 'queued'}
            </span>
          </div>
        )
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 22px', borderTop: `1px solid ${NT.borderS}` }}>
        {done ? (
          <Fragment>
            <button className="dv2-btn-p" onClick={onView} style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '8px 16px', borderRadius: 9, fontSize: 12, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer' }}>View analysis →</button>
            <button onClick={onNew} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '7.5px 14px', borderRadius: 9, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>New search</button>
            <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.text }}>6 products found · 4 angle gaps</span>
          </Fragment>
        ) : (
          <Fragment>
            <button onClick={onCancel} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '7px 14px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer' }}>Cancel scan</button>
            <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.text }}>You'll get a finding when this completes — safe to leave the page</span>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default function Research() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Category')
  const [query, setQuery] = useState('')
  const [sources, setSources] = useState<Record<string, boolean>>(() => { const o: Record<string, boolean> = {}; RES_SOURCES.forEach((s) => (o[s] = true)); return o })
  const [scan, setScan] = useState<Scan | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startScan = () => {
    if (!query.trim() || scan) return
    const steps = RES_STEPS.filter((_, i) => (i < 6 ? sources[RES_SOURCES[i]] : true))
    setScan({ query, steps, current: 0, pct: 0, done: false, elapsed: 0 })
    let tick = 0
    timerRef.current = setInterval(() => {
      tick += 1
      setScan((prev) => {
        if (!prev || prev.done) return prev
        const pct = Math.min(100, prev.pct + Math.random() * 2.6 + 1.2)
        const current = Math.min(prev.steps.length, Math.floor((pct / 96) * prev.steps.length))
        const done = pct >= 100
        if (done && timerRef.current) clearInterval(timerRef.current)
        return { ...prev, pct: Math.round(pct), current, done, elapsed: Math.round(tick * 0.18) }
      })
    }, 180)
  }
  const stopScan = () => { if (timerRef.current) clearInterval(timerRef.current); setScan(null) }
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  return (
    <div style={{ width: '100%', maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, margin: '8px 2px 0' }}>
        <span style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Research</span>
        <span style={{ fontSize: 11.5, color: NT.text }}>ask the agent to scan a market</span>
      </div>

      {scan
        ? <ResScanCard scan={scan} onCancel={stopScan} onNew={stopScan} onView={() => navigate('/research/analysis')} />
        : <ResSearchHero tab={tab} setTab={setTab} query={query} setQuery={setQuery} sources={sources}
          toggleSource={(s) => setSources((prev) => ({ ...prev, [s]: !prev[s] }))} onScan={startScan} />}

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, margin: '2px 2px 9px' }}>
          <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text }}>Start from what Nanalyt already knows</span>
          <span style={{ fontSize: 11, color: NT.text }}>seeds from your findings, pipeline, and competitors</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {RES_SEEDS.map((s, i) => (
            <div key={i} className="dv2-card-h" onClick={() => { if (!scan) setQuery(s.q) }} style={{ ...ntCard, padding: '14px 17px', cursor: 'pointer' }}>
              <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2px 8px', borderRadius: 8, display: 'inline-block', marginBottom: 9 }}>{s.tag}</span>
              <div style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, lineHeight: 1.4, marginBottom: 5 }}>{s.text}</div>
              <div style={{ fontSize: 10.5, color: NT.text }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...ntCard, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '13px 22px 11px' }}>
          <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>Recent research</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono, marginLeft: 8 }}>4</span>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: NT.text, cursor: 'pointer' }}>All types ▾</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '90px minmax(0,1.5fr) 150px 70px 120px', gap: 12, padding: '7px 22px', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}`, background: 'var(--dv-page)' }}>
          {['Type', 'Query', 'Results', 'When', ''].map((h, i) =>
            <div key={i} style={{ fontSize: 10.5, fontWeight: 500, color: NT.text }}>{h}</div>)}
        </div>
        {RES_RECENT.map((r, i) => (
          <div key={i} className="dv2-row" onClick={() => navigate('/research/analysis')} style={{ display: 'grid', gridTemplateColumns: '90px minmax(0,1.5fr) 150px 70px 120px', gap: 12, alignItems: 'center', padding: '13px 22px', borderBottom: i < RES_RECENT.length - 1 ? `1px solid ${NT.borderS}` : 'none', cursor: 'pointer' }}>
            <ResTypePill type={r.type} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 525, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{r.q}</div>
              <div style={{ fontSize: 10.5, color: NT.text }}>{r.found} products found · <span style={{ fontWeight: 550, color: NT.green }}>{r.pipeline} in pipeline</span></div>
            </div>
            <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono }}>{r.found} found · {r.pipeline} piped</span>
            <span style={{ fontSize: 10.5, color: NT.text, fontFamily: NT.mono, whiteSpace: 'nowrap' }}>{r.time}</span>
            <button onClick={(e) => { e.stopPropagation(); navigate('/research/analysis') }} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '5px 12px', borderRadius: 8, fontSize: 10.5, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', justifySelf: 'end' }}>Open report</button>
          </div>
        ))}
      </div>
    </div>
  )
}
