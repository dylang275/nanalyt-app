import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Types + scripted content ────────────────────────────────────────────────

type FindingContext = { label: string }

type AgentKey = 'q1' | 'q2' | 'q3'

type Message =
  | { role: 'user'; text: string }
  | { role: 'agent'; key: AgentKey; revealed: number }

const SCRIPTED_QUESTIONS = [
  'What price should I launch this at?',
  'Who would buy this and why?',
  "What angles are competitors testing that haven't hit yet?",
] as const

const ANSWER_KEYS: AgentKey[] = ['q1', 'q2', 'q3']

const BLOCK_COUNTS: Record<AgentKey, number> = { q1: 5, q2: 4, q3: 6 }

const REVEAL_FIRST_DELAY = 900
const REVEAL_STEP_DELAY = 320

// ─── Context ────────────────────────────────────────────────────────────────

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
      // Any in-progress agent message snaps to fully revealed so a rapid
      // follow-up doesn't leave an earlier answer half-streamed.
      const settled = prev.map(m =>
        m.role === 'agent' ? { ...m, revealed: BLOCK_COUNTS[m.key] } : m,
      )
      const q = SCRIPTED_QUESTIONS[sent]
      const key = ANSWER_KEYS[sent]
      return [...settled, { role: 'user', text: q }, { role: 'agent', key, revealed: 0 }]
    })
  }

  // Streaming-reveal effect — watches the last message and ticks the agent
  // response's reveal count forward until all blocks are visible.
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'agent') return
    const max = BLOCK_COUNTS[last.key]
    if (last.revealed >= max) return
    const delay = last.revealed === 0 ? REVEAL_FIRST_DELAY : REVEAL_STEP_DELAY
    const id = window.setTimeout(() => {
      setMessages(prev =>
        prev.map((m, i) =>
          i === prev.length - 1 && m.role === 'agent'
            ? { ...m, revealed: m.revealed + 1 }
            : m,
        ),
      )
    }, delay)
    return () => clearTimeout(id)
  }, [messages])

  const removeContext = () => setContext(null)

  return (
    <AskNanalytContext.Provider
      value={{ open, context, messages, openPanel, closePanel, submitNext, removeContext }}
    >
      {children}
    </AskNanalytContext.Provider>
  )
}

// ─── Answer building blocks ─────────────────────────────────────────────────

function ResponseCard({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: '#F7F8FA', borderRadius: 8, padding: '12px 14px' }}>
      {children}
    </div>
  )
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-[11px] font-medium uppercase text-ink mb-1"
      style={{ letterSpacing: '0.03em' }}
    >
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

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-2">
      <span className="w-1.5 h-1.5 rounded-full bg-ink/45 animate-pulse" />
      <span className="w-1.5 h-1.5 rounded-full bg-ink/45 animate-pulse" style={{ animationDelay: '180ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-ink/45 animate-pulse" style={{ animationDelay: '360ms' }} />
    </div>
  )
}

// ─── Block builders ─────────────────────────────────────────────────────────

function priceBlocks(): ReactNode[] {
  return [
    <Para key="i">
      Launch at <B>$34.99</B> for the 60-count bottle. Three reasons:
    </Para>,
    <ResponseCard key="a">
      <CardLabel>COMPETITOR ANCHOR</CardLabel>
      <Para>
        <B>DreamWell</B> launched their magnesium glycinate at <B>$36.99</B>. <B>SleepBlend Co.</B> is at <B>$32.99</B>. Pricing at <B>$34.99</B> splits the difference and positions you as competitive without anchoring to the bottom.
      </Para>
    </ResponseCard>,
    <ResponseCard key="b">
      <CardLabel>YOUR CATALOG LADDER</CardLabel>
      <Para>
        <B>ZzzPlex</B> sits at <B>$28.99</B> (entry), <B>ASHWAGANDHA+</B> at <B>$29.99</B> (mid). <B>$34.99</B> positions MGC as the premium clinical SKU without overlapping your existing tiers.
      </Para>
    </ResponseCard>,
    <ResponseCard key="c">
      <CardLabel>MARGIN MATH</CardLabel>
      <Para>
        At estimated COGS of <B>$8.50</B> (60ct glycinate, NSF-certified supply), <B>$34.99</B> retail gives you <B>~38% gross margin</B> — in line with your portfolio average.
      </Para>
    </ResponseCard>,
    <Para key="o">
      <B>Subscribe &amp; Save:</B> price at <B>$29.74</B> (15% off) to drive recurring revenue without underpricing competitors at first impression.
    </Para>,
  ]
}

function buyerBlocks(): ReactNode[] {
  return [
    <Para key="i">
      Two distinct buyer segments, with the primary representing <B>~70%</B> of expected demand:
    </Para>,
    <ResponseCard key="a">
      <div className="flex items-center justify-between mb-1 gap-2">
        <CardLabel>PRIMARY · 70%</CardLabel>
        <span
          className="text-[10px] font-medium shrink-0 bg-brand-bg text-brand"
          style={{ padding: '1px 7px', borderRadius: 6 }}
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
    </ResponseCard>,
    <ResponseCard key="b">
      <CardLabel>SECONDARY · 30%</CardLabel>
      <div className="mb-2">
        <Para>
          <B>Existing ZzzPlex customers looking to upgrade.</B> Already in your funnel. ~22% overlap with current Subscribe &amp; Save base.
        </Para>
      </div>
      <Para size={11}>
        These buyers will bundle MGC with ZzzPlex rather than replace it. Expected AOV lift: <B>$40 → $65</B> for this segment.
      </Para>
    </ResponseCard>,
    <Para key="o">
      Buying trigger: a recent stress event (job change, parenthood, health scare) that breaks their existing sleep routine. Not a "sleep aid" purchase — a "I need to fix my brain" purchase.
    </Para>,
  ]
}

function AngleBlockCard({ title, days, desc }: { title: string; days: string; desc: string }) {
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

function anglesBlocks(onTakeAction: () => void): ReactNode[] {
  return [
    <Para key="i">
      Three early-signal angles in the category. Each is being tested by 1–2 competitors but hasn't scaled — early enough to enter without being a follower:
    </Para>,
    <AngleBlockCard
      key="a"
      title={'"Recovery for high performers"'}
      days="7d running"
      desc={'DreamWell testing this angle for the executive/athlete crossover buyer. Strong early CTR. Targets the "I have to perform tomorrow" buyer rather than the "I can\'t sleep" buyer.'}
    />,
    <AngleBlockCard
      key="b"
      title={'"Skip the Ambien"'}
      days="11d running"
      desc="SleepBlend Co. positioning glycinate as the natural alternative to prescription sleep meds. Direct comparison angle. Risky regulatory framing but high engagement."
    />,
    <AngleBlockCard
      key="c"
      title={'"The form your brain actually absorbs"'}
      days="4d running"
      desc="Pure Encapsulations testing science-first positioning around bioavailability. Educational angle. Slower-burn but builds authority and reduces price sensitivity."
    />,
    <Para key="o">
      <B>My recommendation:</B> launch on Sleep-Anxiety Crossover (the validated angle) and prepare a "Recovery for high performers" creative as your second test. It's the most defensible position and aligns with your premium pricing.
    </Para>,
    <button
      key="btn"
      onClick={onTakeAction}
      className="self-start bg-brand text-white border-0 cursor-pointer hover:opacity-90 text-[11px] font-medium"
      style={{ padding: '6px 12px', borderRadius: 6 }}
    >
      Take action on this finding →
    </button>,
  ]
}

// ─── Panel ──────────────────────────────────────────────────────────────────

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

  const last = messages[messages.length - 1]
  const isStreaming = !!last && last.role === 'agent' && last.revealed < BLOCK_COUNTS[last.key]
  const submitted = messages.filter(m => m.role === 'user').length
  const allDone = submitted >= 3
  const nextQuestion = !allDone && !isStreaming ? SCRIPTED_QUESTIONS[submitted] : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (allDone || isStreaming) return
    setDraft('')
    submitNext()
  }

  const handleTakeAction = () => {
    closePanel()
    navigate('/findings?action=mgc-newproduct')
  }

  return (
    <aside
      className="fixed top-0 right-0 bottom-0 w-[440px] bg-white z-[401] flex flex-col font-sans"
      style={{ borderLeft: '0.5px solid #E5E7EB' }}
    >
      {/* Header */}
      <div className="shrink-0 border-b-[0.5px] border-[#E5E7EB]">
        <div className="flex items-center justify-between px-[18px] pt-[14px] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand" />
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
              className="flex items-center gap-2 rounded-lg bg-brand-bg"
              style={{ border: '0.5px solid #2d5c3a', padding: '8px 10px' }}
            >
              <span
                className="text-[9px] font-medium uppercase shrink-0 bg-white text-brand"
                style={{ padding: '2px 6px', borderRadius: 4, letterSpacing: '0.03em' }}
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
        {messages.map((m, i) => {
          if (m.role === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div
                  className="text-[13px] text-white leading-[1.5]"
                  style={{ background: '#111827', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', maxWidth: '85%' }}
                >
                  {m.text}
                </div>
              </div>
            )
          }
          const blocks =
            m.key === 'q1'
              ? priceBlocks()
              : m.key === 'q2'
                ? buyerBlocks()
                : anglesBlocks(handleTakeAction)
          return (
            <div key={i} className="flex flex-col gap-3" style={{ maxWidth: '94%' }}>
              {m.revealed === 0 ? <TypingDots /> : blocks.slice(0, m.revealed)}
            </div>
          )
        })}
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
            placeholder="Ask a follow-up..."
            className="flex-1 bg-transparent border-0 outline-none text-[12px] text-ink"
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
            disabled={allDone || isStreaming}
            aria-label="Send"
            className="bg-brand text-white border-0 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ width: 26, height: 26, borderRadius: 6 }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 11V2M2.5 6L6.5 2l4 4" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  )
}
