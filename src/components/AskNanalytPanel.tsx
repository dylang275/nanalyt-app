import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Types + scripted content ────────────────────────────────────────────────

type FindingContext = { label: string }

type Message =
  | { role: 'user'; text: string }
  | { role: 'agent'; key: 'q1' | 'q2' | 'q3' }

const SCRIPTED_QUESTIONS = [
  'What price should I launch this at?',
  'Who would buy this and why?',
  "What angles are competitors testing that haven't hit yet?",
] as const

const ANSWER_KEYS: Array<'q1' | 'q2' | 'q3'> = ['q1', 'q2', 'q3']

// ─── Context ─────────────────────────────────────────────────────────────────

type Ctx = {
  open: boolean
  context: FindingContext | null
  messages: Message[]
  openPanel: (c: FindingContext) => void
  closePanel: () => void
  submitNext: () => void
  removeContext: () => void
}

const AskNanalytContext = createContext<Ctx | null>(null)

export function useAskNanalyt() {
  const c = useContext(AskNanalytContext)
  if (!c) throw new Error('useAskNanalyt must be used inside AskNanalytProvider')
  return c
}

export function AskNanalytProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState<FindingContext | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const openPanel = (c: FindingContext) => {
    setContext(c)
    setMessages([])
    setOpen(true)
  }

  const closePanel = () => setOpen(false)

  const submitNext = () => {
    setMessages(prev => {
      const sent = prev.filter(m => m.role === 'user').length
      if (sent >= 3) return prev
      const q = SCRIPTED_QUESTIONS[sent]
      const key = ANSWER_KEYS[sent]
      return [...prev, { role: 'user', text: q }, { role: 'agent', key }]
    })
  }

  const removeContext = () => setContext(null)

  return (
    <AskNanalytContext.Provider value={{ open, context, messages, openPanel, closePanel, submitNext, removeContext }}>
      {children}
    </AskNanalytContext.Provider>
  )
}

// ─── Answer building blocks ──────────────────────────────────────────────────

function ResponseCard({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: '#F7F8FA', borderRadius: 8, padding: '12px 14px' }}>
      {children}
    </div>
  )
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase text-ink mb-1" style={{ letterSpacing: '0.03em' }}>
      {children}
    </div>
  )
}

function Para({ children, size = 12 }: { children: ReactNode; size?: 11 | 12 }) {
  return (
    <p className="m-0 text-ink leading-[1.5]" style={{ fontSize: size }}>
      {children}
    </p>
  )
}

function B({ children }: { children: ReactNode }) {
  return <b className="font-medium">{children}</b>
}

// ─── Q1 · Price ──────────────────────────────────────────────────────────────

function PriceAnswer() {
  return (
    <>
      <Para>
        Launch at <B>$34.99</B> for the 60-count bottle. Three reasons:
      </Para>
      <ResponseCard>
        <CardLabel>COMPETITOR ANCHOR</CardLabel>
        <Para>
          <B>DreamWell</B> launched their magnesium glycinate at <B>$36.99</B>. <B>SleepBlend Co.</B> is at <B>$32.99</B>. Pricing at <B>$34.99</B> splits the difference and positions you as competitive without anchoring to the bottom.
        </Para>
      </ResponseCard>
      <ResponseCard>
        <CardLabel>YOUR CATALOG LADDER</CardLabel>
        <Para>
          <B>ZzzPlex</B> sits at <B>$28.99</B> (entry), <B>ASHWAGANDHA+</B> at <B>$29.99</B> (mid). <B>$34.99</B> positions MGC as the premium clinical SKU without overlapping your existing tiers.
        </Para>
      </ResponseCard>
      <ResponseCard>
        <CardLabel>MARGIN MATH</CardLabel>
        <Para>
          At estimated COGS of <B>$8.50</B> (60ct glycinate, NSF-certified supply), <B>$34.99</B> retail gives you <B>~38% gross margin</B> — in line with your portfolio average.
        </Para>
      </ResponseCard>
      <Para>
        <B>Subscribe &amp; Save:</B> price at <B>$29.74</B> (15% off) to drive recurring revenue without underpricing competitors at first impression.
      </Para>
    </>
  )
}

// ─── Q2 · Buyer ──────────────────────────────────────────────────────────────

function BuyerAnswer() {
  return (
    <>
      <Para>
        Two distinct buyer segments, with the primary representing <B>~70%</B> of expected demand:
      </Para>
      <ResponseCard>
        <div className="flex items-center justify-between mb-1 gap-2">
          <CardLabel>PRIMARY · 70%</CardLabel>
          <span
            className="text-[10px] font-medium shrink-0"
            style={{ background: '#EAF3DE', color: '#27500A', padding: '1px 7px', borderRadius: 6 }}
          >
            HIGH INTENT
          </span>
        </div>
        <div className="mb-2">
          <Para>
            <B>Working professionals 28–45 with cognitive stress disrupting sleep.</B> Skews 60% female. Income $75k+. Lives in metro areas.
          </Para>
        </div>
        <Para size={11}>
          Already on melatonin or magnesium citrate, frustrated by morning grogginess. Reading Reddit threads about glycinate as the "smarter" form. Searching "anxiety sleep" and "racing thoughts." Wants science-backed but not pharmaceutical.
        </Para>
      </ResponseCard>
      <ResponseCard>
        <CardLabel>SECONDARY · 30%</CardLabel>
        <div className="mb-2">
          <Para>
            <B>Existing ZzzPlex customers looking to upgrade.</B> Already in your funnel. ~22% overlap with current Subscribe &amp; Save base.
          </Para>
        </div>
        <Para size={11}>
          These buyers will bundle MGC with ZzzPlex rather than replace it. Expected AOV lift: <B>$40 → $65</B> for this segment.
        </Para>
      </ResponseCard>
      <Para>
        Buying trigger: a recent stress event (job change, parenthood, health scare) that breaks their existing sleep routine. Not a "sleep aid" purchase — a "I need to fix my brain" purchase.
      </Para>
    </>
  )
}

// ─── Q3 · Angles ─────────────────────────────────────────────────────────────

function AngleCard({ title, days, desc }: { title: string; days: string; desc: string }) {
  return (
    <ResponseCard>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-[12px] font-medium text-ink">{title}</span>
        <span
          className="text-[10px] font-medium shrink-0"
          style={{ background: '#F0F1F3', color: '#4B5563', padding: '1px 7px', borderRadius: 6 }}
        >
          {days}
        </span>
      </div>
      <p className="m-0 text-[11px] text-ink leading-[1.45] mb-2.5">{desc}</p>
      <div className="flex justify-end">
        <button
          className="text-[10px] font-medium text-ink bg-white border-[0.5px] border-[#D1D5DB] rounded-md cursor-pointer hover:bg-[#fafafa]"
          style={{ padding: '4px 10px' }}
        >
          View angle →
        </button>
      </div>
    </ResponseCard>
  )
}

function AnglesAnswer({ onTakeAction }: { onTakeAction: () => void }) {
  return (
    <>
      <Para>
        Three early-signal angles in the category. Each is being tested by 1–2 competitors but hasn't scaled — early enough to enter without being a follower:
      </Para>
      <AngleCard
        title={'"Recovery for high performers"'}
        days="7d running"
        desc={'DreamWell testing this angle for the executive/athlete crossover buyer. Strong early CTR. Targets the "I have to perform tomorrow" buyer rather than the "I can\'t sleep" buyer.'}
      />
      <AngleCard
        title={'"Skip the Ambien"'}
        days="11d running"
        desc="SleepBlend Co. positioning glycinate as the natural alternative to prescription sleep meds. Direct comparison angle. Risky regulatory framing but high engagement."
      />
      <AngleCard
        title={'"The form your brain actually absorbs"'}
        days="4d running"
        desc="Pure Encapsulations testing science-first positioning around bioavailability. Educational angle. Slower-burn but builds authority and reduces price sensitivity."
      />
      <Para>
        <B>My recommendation:</B> launch on Sleep-Anxiety Crossover (the validated angle) and prepare a "Recovery for high performers" creative as your second test. It's the most defensible position and aligns with your premium pricing.
      </Para>
      <button
        onClick={onTakeAction}
        className="self-start text-white border-0 cursor-pointer hover:opacity-90 text-[11px] font-medium"
        style={{ background: '#1D9E75', padding: '6px 12px', borderRadius: 6 }}
      >
        Take action on this finding →
      </button>
    </>
  )
}

// ─── Panel ───────────────────────────────────────────────────────────────────

export function AskNanalytPanel() {
  const { open, context, messages, closePanel, submitNext, removeContext } = useAskNanalyt()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (open) {
      setDraft('')
      const id = window.setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(id)
    }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  if (!open) return null

  const submitted = messages.filter(m => m.role === 'user').length
  const allDone = submitted >= 3
  const nextQuestion = !allDone ? SCRIPTED_QUESTIONS[submitted] : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (allDone) return
    setDraft('')
    submitNext()
  }

  const handleTakeAction = () => {
    closePanel()
    navigate('/findings?action=mgc-newproduct')
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[400] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.15)' }}
        aria-hidden
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-[440px] bg-white z-[401] flex flex-col font-sans"
        style={{ borderLeft: '0.5px solid #E5E7EB' }}
      >
        {/* Header */}
        <div className="shrink-0 border-b-[0.5px] border-[#E5E7EB]">
          <div className="flex items-center justify-between px-[18px] pt-[14px] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#1D9E75' }} />
              <span className="text-[14px] font-medium text-ink">Ask Nanalyt</span>
            </div>
            <button
              onClick={closePanel}
              className="bg-transparent border-0 text-ink cursor-pointer flex p-1 hover:opacity-70"
              aria-label="Close panel"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 3l12 12M15 3l-12 12" />
              </svg>
            </button>
          </div>
          {context && (
            <div className="px-[18px] pb-3">
              <div
                className="flex items-center gap-2 rounded-lg"
                style={{ background: '#F0F9F4', border: '0.5px solid #1D9E75', padding: '8px 10px' }}
              >
                <span
                  className="text-[9px] font-medium uppercase shrink-0"
                  style={{ background: 'white', color: '#27500A', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.03em' }}
                >
                  CONTEXT
                </span>
                <span className="flex-1 text-[11px] text-ink leading-snug">{context.label}</span>
                <button
                  onClick={removeContext}
                  className="bg-transparent border-0 text-ink cursor-pointer flex p-0.5 hover:opacity-70 shrink-0"
                  aria-label="Remove context"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 3l8 8M11 3l-8 8" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Conversation */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-4">
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <div
                  className="text-[13px] text-white leading-[1.5]"
                  style={{ background: '#111827', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', maxWidth: '85%' }}
                >
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex flex-col gap-3" style={{ maxWidth: '94%' }}>
                {m.key === 'q1' && <PriceAnswer />}
                {m.key === 'q2' && <BuyerAnswer />}
                {m.key === 'q3' && <AnglesAnswer onTakeAction={handleTakeAction} />}
              </div>
            ),
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 border-t-[0.5px] border-[#E5E7EB]" style={{ padding: '12px 14px' }}>
          {nextQuestion && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              <button
                onClick={() => submitNext()}
                className="text-[11px] text-ink bg-white border-[0.5px] border-[#D1D5DB] rounded-md cursor-pointer hover:bg-[#fafafa]"
                style={{ padding: '4px 10px' }}
              >
                {nextQuestion}
              </button>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
            style={{ background: '#F7F8FA', border: '0.5px solid #E5E7EB', borderRadius: 8, padding: '8px 10px' }}
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={allDone ? 'Conversation complete' : 'Ask a follow-up...'}
              className="flex-1 bg-transparent border-0 outline-none text-[12px] text-ink"
              style={{ minWidth: 0 }}
              disabled={allDone}
            />
            <button
              type="submit"
              disabled={allDone}
              aria-label="Send"
              className="text-white border-0 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#1D9E75', width: 26, height: 26, borderRadius: 6 }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 11V2M2.5 6L6.5 2l4 4" />
              </svg>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
