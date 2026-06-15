// AskNanalyt.tsx — global Ask Nanalyt assistant (⌘K panel + live execution).
// Ported from design_handoff_nanalyt/source/system/nanalyt-chat.jsx.
// Host listens for the `nanalyt-chat-open` window event and ⌘K/Ctrl-K; rendered
// once by AppLayout. Open: top-bar search / ⌘K. Close: ✕, backdrop, Esc.
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT } from '../system/tokens'

const NC_SANS = NT.sans
const NC_MONO = NT.mono

// ── message pieces ──
function NcUser({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <span style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', padding: '8px 14px', borderRadius: '12px 12px 3px 12px', fontSize: 12, fontWeight: 500, lineHeight: 1.45, maxWidth: '85%' }}>{children}</span>
    </div>
  )
}
function NcText({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 12, color: NT.text, lineHeight: 1.55 }}>{children}</div>
}
function NcCard({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div style={{ background: 'var(--dv-surf)', border: `1px solid ${NT.borderS}`, borderRadius: 12, boxShadow: '0 1px 3px rgba(16,24,15,0.05)', overflow: 'hidden' }}>
      <div style={{ padding: '6px 13px', background: 'var(--dv-page)', borderBottom: `1px solid ${NT.borderS}` }}>
        <span style={{ fontSize: 10, fontWeight: 550, color: NT.text }}>{title}</span>
      </div>
      <div style={{ padding: '9px 13px 11px', fontSize: 11.5, color: NT.text, lineHeight: 1.55 }}>{children}</div>
    </div>
  )
}
function NcM({ children }: { children: ReactNode }) { return <span style={{ fontFamily: NC_MONO, fontWeight: 550 }}>{children}</span> }
function NcChips({ items, onPick }: { items: string[]; onPick: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {items.map((c) => (
        <span key={c} onClick={() => onPick(c)} className="dv2-row" style={{ fontSize: 10.5, fontWeight: 500, color: NT.text, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, padding: '4.5px 12px', borderRadius: 9, cursor: 'pointer', whiteSpace: 'nowrap' }}>{c}</span>
      ))}
    </div>
  )
}
function NcThinking({ lines }: { lines: [string, string | null][] }) {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((p) => Math.min(p + 1, lines.length - 1)), 750); return () => clearInterval(t) }, [lines.length])
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="pulse" style={{ width: 6, height: 6, background: 'var(--dv-green-br)', borderRadius: '50%', display: 'block' }}></span>
        <span style={{ fontSize: 11.5, color: NT.text }}>{lines[i][0]}</span>
      </div>
      {lines[i][1] && <div style={{ fontSize: 10.5, color: NT.text, fontFamily: NC_MONO, paddingLeft: 14, marginTop: 3 }}>{lines[i][1]}</div>}
    </div>
  )
}

// ── live run card (execution state) ──
const NC_RUN_STEPS: { label: string; result: string; at: number; activeText?: string }[] = [
  { label: 'Brand context', result: 'pulled from Shopify', at: 10 },
  { label: 'Angle', result: 'from finding · validated by 3 competitors', at: 26 },
  { label: 'PDP variant', result: 'drafted · v2 against Next-day calm', at: 55 },
  { label: 'Creative variants', result: '3 of 3 generated', at: 100, activeText: 'generating…' },
]
function NcRunCard({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [sec, setSec] = useState(0)
  const doneRef = useRef(false)
  const t0Ref = useRef(0)
  useEffect(() => {
    t0Ref.current = performance.now()
    const t = setInterval(() => {
      setSec(Math.floor((performance.now() - t0Ref.current) / 1000))
      setPct((p) => {
        const n = Math.min(100, p + Math.random() * 2.4 + 0.9)
        if (n >= 100 && !doneRef.current) { doneRef.current = true; clearInterval(t); setTimeout(onDone, 450) }
        return n
      })
    }, 160)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const done = pct >= 100
  const mm = Math.floor(sec / 60), ss = String(sec % 60).padStart(2, '0')
  return (
    <div style={{ border: `1px solid ${NT.borderS}`, borderRadius: 12, overflow: 'hidden', background: 'var(--dv-surf)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: 'var(--dv-page)', borderBottom: `1px solid ${NT.borderS}` }}>
        {done
          ? <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill="var(--dv-green-bg)" /><path d="M4 7l2.5 2.5 4-4" stroke="var(--dv-green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : <span className="pulse" style={{ width: 6, height: 6, background: 'var(--dv-green-br)', borderRadius: '50%', display: 'block' }}></span>}
        <span style={{ fontSize: 10.5, fontWeight: 550, color: NT.text }}>{done ? 'Creative package · complete' : 'Generating creative package'}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: NT.text, fontFamily: NC_MONO }}>{mm}:{ss}{done ? '' : ` · ${Math.round(pct)}%`}</span>
      </div>
      {!done && (
        <div style={{ height: 3, background: 'var(--dv-page)' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--dv-green-br)', transition: 'width 0.16s linear' }}></div>
        </div>
      )}
      {NC_RUN_STEPS.map((s, i) => {
        const stepDone = pct >= s.at
        const prevAt = i === 0 ? 0 : NC_RUN_STEPS[i - 1].at
        const active = !stepDone && pct >= prevAt
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7.5px 13px', borderBottom: i < NC_RUN_STEPS.length - 1 ? `1px solid ${NT.borderS}` : 'none', opacity: stepDone || active ? 1 : 0.55, transition: 'opacity 0.2s' }}>
            {stepDone ? (
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill="var(--dv-green-bg)" /><path d="M4 7l2.5 2.5 4-4" stroke="var(--dv-green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : active ? (
              <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid var(--dv-green-br)', display: 'block', margin: 2, flexShrink: 0 }}></span>
            ) : (
              <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${NT.borderS}`, display: 'block', margin: 2, flexShrink: 0 }}></span>
            )}
            <span style={{ fontSize: 11, fontWeight: active ? 550 : 475, color: NT.text, minWidth: 108, flexShrink: 0 }}>{s.label}</span>
            <span style={{ fontSize: 10.5, color: NT.text, fontFamily: stepDone ? NC_MONO : NC_SANS, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {stepDone ? s.result : active ? (s.activeText || 'working…') : 'queued'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── scripted flows ──
const NC_PROMPTS = ['How is the calm angle doing?', 'How should I price MGC against competitors?', 'Generate the creative package']
type Flow = 'generate' | 'pricing' | 'calm'
function ncDetectFlow(q: string): Flow {
  const s = q.toLowerCase()
  if (/(generat|create|make|build).*(creative|package|ad|pdp)|^generate/.test(s)) return 'generate'
  if (/pric|cost|charge|\$/.test(s)) return 'pricing'
  return 'calm'
}
type Block = { kind: 'text' | 'card'; title?: string; el: ReactNode }
type Answer = { thinking: [string, string | null][]; blocks: Block[]; chips: string[] }
const NC_ANSWERS: Record<'calm' | 'pricing', Answer> = {
  calm: {
    thinking: [['Reading your Meta campaigns…', '12 active ads · 3 tests · 30d window'], ['Pulling test results…', 'UGC test finished Tuesday'], ['Composing answer…', null]],
    blocks: [
      { kind: 'text', el: <NcText><span style={{ fontWeight: 550 }}>Next-day calm is your best performer.</span> The PDP has held <NcM>2.4%</NcM> CVR over <NcM>32</NcM> days live, and the UGC test that finished Tuesday beat control CPA by <NcM>22%</NcM>.</NcText> },
      { kind: 'card', title: "Where it's working", el: <span>Meta UGC drives <NcM>$8.4k</NcM> of weekly revenue at <NcM>$19.40</NcM> CPA. TikTok is untested — the agent flagged it as this week's opportunity.</span> },
    ],
    chips: ['Run it on TikTok', 'Show the test results', 'Generate the creative package'],
  },
  pricing: {
    thinking: [['Checking competitor pricing…', 'DreamWell · SleepBlend Co. · 4 others'], ['Reading your catalog ladder…', '3 active SKUs'], ['Running margin math…', 'COGS estimate from supplier data']],
    blocks: [
      { kind: 'text', el: <NcText>Launch at <NcM>$34.99</NcM> for the 60-count bottle. Three reasons:</NcText> },
      { kind: 'card', title: 'Competitor anchor', el: <span>DreamWell launched their magnesium glycinate at <NcM>$36.99</NcM>. SleepBlend Co. is at <NcM>$32.99</NcM>. Pricing at <NcM>$34.99</NcM> splits the difference without anchoring to the bottom.</span> },
      { kind: 'card', title: 'Your catalog ladder', el: <span>ZzzPlex sits at <NcM>$28.99</NcM> (entry), ASHWAGANDHA+ at <NcM>$29.99</NcM> (mid). <NcM>$34.99</NcM> positions MGC as the premium clinical SKU without overlapping your tiers.</span> },
      { kind: 'card', title: 'Margin math', el: <span>At estimated COGS of <NcM>$8.50</NcM>, <NcM>$34.99</NcM> retail gives you <NcM>~38%</NcM> gross margin — in line with your portfolio average.</span> },
      { kind: 'text', el: <NcText><span style={{ fontWeight: 550 }}>Subscribe &amp; Save:</span> price at <NcM>$29.74</NcM> (15% off) to drive recurring revenue without underpricing competitors at first impression.</NcText> },
    ],
    chips: ['Set up the pricing test', 'Show competitor PDPs', 'Generate the creative package'],
  },
}

type Msg = {
  id: number; kind: 'user' | 'thinking' | 'text' | 'card' | 'chips' | 'run' | 'thumbs' | 'actions'
  text?: string; el?: ReactNode; title?: string; lines?: [string, string | null][]; items?: string[]
}

function AskNanalytPanel({ context, onClose }: { context?: string; onClose: () => void }) {
  const navigate = useNavigate()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [ctxOn, setCtxOn] = useState(true)
  const bodyRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  const nid = () => ++idRef.current

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  })

  const ask = (q: string) => {
    if (busy || !q.trim()) return
    setInput('')
    const flow = ncDetectFlow(q)
    if (flow === 'generate') {
      setBusy(true)
      setMsgs((m) => [...m,
        { id: nid(), kind: 'user', text: q },
        { id: nid(), kind: 'text', el: <NcText>On it — angle, language, and format mix come pre-filled from the finding.</NcText> },
        { id: nid(), kind: 'run' },
      ])
      return
    }
    const a = NC_ANSWERS[flow]
    setBusy(true)
    setMsgs((m) => [...m, { id: nid(), kind: 'user', text: q }, { id: nid(), kind: 'thinking', lines: a.thinking }])
    setTimeout(() => {
      setMsgs((m) => {
        const out = m.filter((x) => x.kind !== 'thinking')
        a.blocks.forEach((b) => out.push({ id: nid(), kind: b.kind, title: b.title, el: b.el }))
        out.push({ id: nid(), kind: 'chips', items: a.chips })
        return out
      })
      setBusy(false)
    }, 2300)
  }

  const onRunDone = () => {
    setMsgs((m) => [...m,
      { id: nid(), kind: 'text', el: <NcText><span style={{ fontWeight: 550 }}>4 creatives ready for review.</span> One PDP variant and three ads against next-day calm.</NcText> },
      { id: nid(), kind: 'thumbs' },
      { id: nid(), kind: 'actions' },
    ])
    setBusy(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, fontFamily: NC_SANS }}>
      <div onClick={onClose} className="ap-drawer-wrap" style={{ position: 'absolute', inset: 0, background: 'rgba(16,24,15,0.18)' }}></div>
      <div className="dv2-drawer-in" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--dv-surf)', borderLeft: `1px solid ${NT.borderS}`, boxShadow: '-12px 0 40px rgba(16,24,15,0.14)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px 11px', borderBottom: `1px solid ${NT.borderS}`, flexShrink: 0 }}>
          <span className="pulse" style={{ width: 6, height: 6, background: 'var(--dv-green-br)', borderRadius: '50%', display: 'block' }}></span>
          <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text }}>Ask Nanalyt</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: NT.text, fontFamily: NC_MONO }}>⌘K</span>
          <span onClick={onClose} style={{ width: 24, height: 24, borderRadius: 7, border: `1px solid ${NT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: NT.text, fontSize: 10.5 }}>✕</span>
        </div>
        <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ctxOn && context && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: NT.greenBg, border: `1px solid ${NT.borderS}`, borderRadius: 10, padding: '8px 12px', flexShrink: 0 }}>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.02em', color: NT.green, background: 'var(--dv-surf)', padding: '2px 7px', borderRadius: 7, flexShrink: 0 }}>Context</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: NT.text, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{context}</span>
              <span onClick={() => setCtxOn(false)} style={{ fontSize: 10.5, color: NT.text, cursor: 'pointer', flexShrink: 0 }}>✕</span>
            </div>
          )}
          {msgs.length === 0 && (
            <Fragment>
              <NcText>Ask about your data, or tell me to do something — I know what you're looking at.</NcText>
              <NcChips items={NC_PROMPTS} onPick={ask} />
            </Fragment>
          )}
          {msgs.map((m) => {
            if (m.kind === 'user') return <NcUser key={m.id}>{m.text}</NcUser>
            if (m.kind === 'thinking') return <NcThinking key={m.id} lines={m.lines!} />
            if (m.kind === 'text') return <Fragment key={m.id}>{m.el}</Fragment>
            if (m.kind === 'card') return <NcCard key={m.id} title={m.title}>{m.el}</NcCard>
            if (m.kind === 'chips') return <NcChips key={m.id} items={m.items!} onPick={ask} />
            if (m.kind === 'run') return <NcRunCard key={m.id} onDone={onRunDone} />
            if (m.kind === 'thumbs') return (
              <div key={m.id} style={{ display: 'flex', gap: 8 }}>
                {['/uploads/IMG_3495.PNG', '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png', '/uploads/IMG_3497.PNG'].map((src, i) => (
                  <img key={i} src={src} style={{ width: 64, height: 64, borderRadius: 9, objectFit: 'cover', border: `1px solid ${NT.borderS}` }} alt="creative" />
                ))}
              </div>
            )
            if (m.kind === 'actions') return (
              <div key={m.id} style={{ display: 'flex', gap: 7 }}>
                <button className="dv2-btn-p" onClick={() => { onClose(); navigate('/studio') }} style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '7px 14px', borderRadius: 9, fontSize: 11, fontWeight: 500, fontFamily: NC_SANS, cursor: 'pointer' }}>Review in Studio →</button>
                <button onClick={() => ask('Generate the creative package')} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '6.5px 13px', borderRadius: 9, fontSize: 11, fontWeight: 450, fontFamily: NC_SANS, cursor: 'pointer' }}>Generate more</button>
              </div>
            )
            return null
          })}
          {busy && msgs.length > 0 && msgs[msgs.length - 1].kind === 'run' && (
            <div style={{ fontSize: 10.5, color: NT.text }}>Safe to close — I'll keep working and the results land in Studio.</div>
          )}
        </div>
        <div style={{ padding: '12px 18px 16px', borderTop: `1px solid ${NT.borderS}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 11, padding: '4px 4px 4px 14px' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') ask(input) }}
              placeholder={msgs.length === 0 ? 'Ask Nanalyt anything…' : 'Ask a follow-up…'} autoFocus
              style={{ flex: 1, fontSize: 12, color: NT.text, background: 'transparent', border: 'none', outline: 'none', fontFamily: NC_SANS, padding: '7px 0', minWidth: 0 }} />
            <span onClick={() => ask(input)} style={{ width: 28, height: 28, borderRadius: 8, background: input.trim() ? 'var(--dv-btn-bg)' : 'var(--dv-page)', color: input.trim() ? 'var(--dv-btn-fg)' : NT.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10V2M2.5 5.5L6 2l3.5 3.5" /></svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AskNanalytHost({ context }: { context?: string }) {
  const [open, setOpen] = useState(false)
  const [ctxOverride, setCtxOverride] = useState<string | undefined>(undefined)
  useEffect(() => {
    // Opened from the top-bar search (no detail) or a specific surface
    // (e.g. a finding's "Ask Nanalyt about this finding" → detail.context).
    const onOpen = (e: Event) => { setCtxOverride((e as CustomEvent).detail?.context); setOpen(true) }
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCtxOverride(undefined); setOpen((o) => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('nanalyt-chat-open', onOpen)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('nanalyt-chat-open', onOpen); window.removeEventListener('keydown', onKey) }
  }, [])
  if (!open) return null
  return <AskNanalytPanel context={ctxOverride || context} onClose={() => setOpen(false)} />
}
