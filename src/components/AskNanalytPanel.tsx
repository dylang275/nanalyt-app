import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Types + scripted content ────────────────────────────────────────────────

type FindingContext = { label: string }
type Mode = 'finding' | 'general'

type AgentKey = 'q1' | 'q2' | 'q3' | 'qgap'

type Message =
  | { role: 'user'; text: string }
  | { role: 'agent'; key: AgentKey; revealed: number }

const FINDING_KEYS: AgentKey[] = ['q1', 'q2', 'q3']

const BLOCK_COUNTS: Record<AgentKey, number> = { q1: 5, q2: 4, q3: 6, qgap: 6 }

const REVEAL_FIRST_DELAY = 900
const REVEAL_STEP_DELAY = 320

// ─── Context ────────────────────────────────────────────────────────────────

type Ctx = {
  open: boolean
  agentOpen: boolean
  panelOpen: boolean
  mode: Mode
  context: FindingContext | null
  messages: Message[]
  openForFinding: (c: FindingContext) => void
  openGeneral: () => void
  openAgent: () => void
  closeAgent: () => void
  closePanel: () => void
  submitNext: (userText: string) => void
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
  const [agentOpen, setAgentOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('general')
  const [context, setContext] = useState<FindingContext | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const openForFinding = (c: FindingContext) => {
    setAgentOpen(false)
    setMode('finding')
    setContext(c)
    setMessages([])
    setOpen(true)
  }

  const openGeneral = () => {
    setAgentOpen(false)
    setMode('general')
    setContext(null)
    setMessages([])
    setOpen(true)
  }

  const closePanel = () => setOpen(false)

  const openAgent = () => {
    setOpen(false)
    setAgentOpen(true)
  }
  const closeAgent = () => setAgentOpen(false)

  const submitNext = (userText: string) => {
    const trimmed = userText.trim()
    if (!trimmed) return
    setMessages(prev => {
      const sent = prev.filter(m => m.role === 'user').length
      const limit = mode === 'finding' ? 3 : 1
      if (sent >= limit) return prev
      // Settle any in-progress agent message so a fast follow-up doesn't leave
      // an earlier answer half-streamed.
      const settled = prev.map(m =>
        m.role === 'agent' ? { ...m, revealed: BLOCK_COUNTS[m.key] } : m,
      )
      const agentKey: AgentKey = mode === 'finding' ? FINDING_KEYS[sent] : 'qgap'
      return [
        ...settled,
        { role: 'user', text: trimmed },
        { role: 'agent', key: agentKey, revealed: 0 },
      ]
    })
  }

  // Streaming reveal — ticks the last agent message's revealed count forward.
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
      value={{
        open,
        agentOpen,
        panelOpen: open || agentOpen,
        mode,
        context,
        messages,
        openForFinding,
        openGeneral,
        openAgent,
        closeAgent,
        closePanel,
        submitNext,
        removeContext,
      }}
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

function TagPill({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block text-[9px] font-medium uppercase bg-brand-bg text-brand mb-2"
      style={{ padding: '2px 7px', borderRadius: 4, letterSpacing: '0.03em' }}
    >
      {children}
    </span>
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

// ─── Q1 · Price ─────────────────────────────────────────────────────────────

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

// ─── Q2 · Buyer ─────────────────────────────────────────────────────────────

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

// ─── Q3 · Angles ────────────────────────────────────────────────────────────

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

// ─── Qgap · General gap question ────────────────────────────────────────────

function gapBlocks(handlers: {
  onViewFinding: () => void
  onViewCompetitors: () => void
}): ReactNode[] {
  return [
    <Para key="i">
      The clearest gap is <B>combination supplements addressing anxiety as the root cause of poor sleep,</B> not sleep onset directly. Three signals point to this:
    </Para>,
    <ResponseCard key="a">
      <TagPill>BUYER LANGUAGE</TagPill>
      <Para>
        Reddit and Amazon reviews show a <B>3.2× shift</B> in 12 months from "fall asleep faster" to "calm my racing thoughts" / "next-day calm." Buyers are reframing the problem.
      </Para>
    </ResponseCard>,
    <ResponseCard key="b">
      <TagPill>COMPETITOR ACTIVITY</TagPill>
      <Para>
        <B>4 of 12 tracked competitors</B> launched magnesium + ashwagandha combos in the last 45 days. Olly, Beam, and Moon Juice are running "Sleep-Anxiety Crossover" angle ads at 28% of category spend. Category attention is at <B>64%</B>, ad coverage at <B>21%</B> — a 43-point execution gap.
      </Para>
    </ResponseCard>,
    <ResponseCard key="c">
      <TagPill>CATEGORY DEMAND</TagPill>
      <Para>
        Search volume for "magnesium glycinate" up <B>4.1× in 60 days</B>. TikTok creator content tagging the combo grew <B>+180% in 30 days</B>. Demand is outpacing supply.
      </Para>
    </ResponseCard>,
    <Para key="o">
      <B>What this means for you:</B> your existing portfolio (ZzzPlex, ASHWAGANDHA+, Vitamin D3 + K2) doesn't address this combined positioning. You have two paths: (1) launch a combo SKU into the whitespace, or (2) reposition existing creative around the next-day calm angle on ZzzPlex.
    </Para>,
    <div key="btns" className="flex gap-1.5 flex-wrap">
      <button
        onClick={handlers.onViewFinding}
        className="bg-brand text-white border-0 cursor-pointer hover:opacity-90 text-[11px] font-medium"
        style={{ padding: '6px 12px', borderRadius: 6 }}
      >
        View related finding →
      </button>
      <button
        onClick={handlers.onViewCompetitors}
        className="text-ink bg-white border-[0.5px] border-[#D1D5DB] cursor-pointer hover:bg-[#fafafa] text-[11px] font-medium"
        style={{ padding: '6px 12px', borderRadius: 6 }}
      >
        See competitor activity →
      </button>
    </div>,
  ]
}

// ─── Panel ──────────────────────────────────────────────────────────────────

export function AskNanalytPanel() {
  const { open, mode, context, messages, closePanel, submitNext, removeContext } = useAskNanalyt()
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
  const limit = mode === 'finding' ? 3 : 1
  const allDone = submitted >= limit
  const placeholder = mode === 'finding' ? 'Ask a follow-up...' : 'Ask anything about the market...'

  // Decorative starter chips — shown before the first message. They don't
  // advance the script (the user types + sends to trigger the next scripted
  // response).
  const starterChips =
    mode === 'finding'
      ? ['What suppliers can fulfill this?', 'Should I bundle this?', 'Will this cannibalize ZzzPlex?']
      : ['What should I avoid spending on?']
  const showStarterChips = messages.length === 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (allDone || isStreaming) return
    const text = draft.trim()
    if (!text) return
    setDraft('')
    submitNext(text)
  }

  const handleTakeAction = () => {
    closePanel()
    navigate('/findings?action=mgc-newproduct')
  }

  const handleViewFinding = () => {
    navigate('/findings?finding=2')
  }

  const handleViewCompetitors = () => {
    navigate('/competitors')
  }

  return (
    <aside
      className="fixed top-0 right-0 bottom-0 w-[440px] bg-white z-[401] flex flex-col font-sans"
      style={{ borderLeft: '0.5px solid #E5E7EB' }}
    >
      {/* Header */}
      <div className="shrink-0 border-b-[0.5px] border-[#E5E7EB]">
        <div className="flex items-center justify-between px-[18px] pt-[14px] pb-[14px]">
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
          <div className="px-[18px] pb-3 -mt-2">
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
                : m.key === 'q3'
                  ? anglesBlocks(handleTakeAction)
                  : gapBlocks({ onViewFinding: handleViewFinding, onViewCompetitors: handleViewCompetitors })
          return (
            <div key={i} className="flex flex-col gap-3" style={{ maxWidth: '94%' }}>
              {m.revealed === 0 ? <TypingDots /> : blocks.slice(0, m.revealed)}
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t-[0.5px] border-[#E5E7EB]" style={{ padding: '12px 14px' }}>
        {showStarterChips && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {starterChips.map(c => (
              <button
                key={c}
                type="button"
                className="text-[11px] text-ink bg-white border-[0.5px] border-[#D1D5DB] rounded-md cursor-pointer hover:bg-[#fafafa]"
                style={{ padding: '4px 10px' }}
              >
                {c}
              </button>
            ))}
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
            placeholder={placeholder}
            className="flex-1 bg-transparent border-0 outline-none text-[12px] text-ink"
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
            disabled={allDone || isStreaming || draft.trim().length === 0}
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

// ─── Agent drawer ───────────────────────────────────────────────────────────

type WorkingCard =
  | { kind: 'progress'; name: string; sub: string; pct: number }
  | { kind: 'continuous'; name: string; right: string; sub: string }
  | { kind: 'pulse'; name: string; sub: string }
  | { kind: 'remaining'; name: string; right: string; sub: string }

const WORKING: WorkingCard[] = [
  {
    kind: 'progress',
    name: 'Generating assets for Magnesium Glycinate Complex',
    sub: 'PDP + 4 ad creatives · 2m remaining',
    pct: 72,
  },
  {
    kind: 'continuous',
    name: 'Monitoring 5 competitors',
    right: 'Continuous',
    sub: 'Last refresh: 3m ago · Next: 12m',
  },
  {
    kind: 'pulse',
    name: 'Refreshing TikTok signal data',
    sub: 'Pulling creator content for sleep + magnesium tags',
  },
  {
    kind: 'remaining',
    name: 'Scoring 14 new product candidates',
    right: '~8m remaining',
    sub: 'Researching demand and saturation for adjacent SKUs',
  },
]

const NEXT_UP = [
  { name: 'Re-evaluate Sleep-Anxiety Crossover angle freshness', schedule: 'Scheduled · Daily' },
  { name: 'Run weekly market entrants scan', schedule: 'Scheduled · Sunday 2am' },
  { name: 'Generate creative refresh for ZzzPlex', schedule: 'Triggered when avg ad longevity exceeds 18d' },
]

const COMPLETED = [
  { text: 'Surfaced new finding · ZzzPlex needs Sleep-Anxiety angle coverage', time: '14m ago' },
  { text: 'Detected Moon Juice paused 8 of 14 active ads', time: '1h ago' },
  { text: 'Validated Magnesium + Ashwagandha Tablets at 4.6× ROAS', time: '3h ago' },
  { text: 'Ran competitive intelligence pass · 47 ads analyzed', time: '6h ago' },
]

function WorkingCardItem({ c }: { c: WorkingCard }) {
  return (
    <div
      className="bg-white"
      style={{ border: '0.5px solid #E5E7EB', borderRadius: 8, padding: '10px 12px' }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[12px] font-medium text-ink">{c.name}</span>
        {(c.kind === 'progress' || c.kind === 'pulse') && (
          <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-soft-pulse" />
        )}
        {c.kind === 'continuous' && <span className="text-[10px] text-ink shrink-0">{c.right}</span>}
        {c.kind === 'remaining' && <span className="text-[10px] text-ink shrink-0">{c.right}</span>}
      </div>
      <div className={`text-[11px] text-ink ${c.kind === 'progress' ? 'mb-1.5' : ''}`}>{c.sub}</div>
      {c.kind === 'progress' && (
        <div className="h-[3px] rounded-[2px] overflow-hidden" style={{ background: '#F0F1F3' }}>
          <div className="h-full bg-brand" style={{ width: `${c.pct}%`, borderRadius: 2 }} />
        </div>
      )}
    </div>
  )
}

function SectionHead({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <span
        className="text-[11px] font-medium uppercase text-ink"
        style={{ letterSpacing: '0.04em' }}
      >
        {left}
      </span>
      {right}
    </div>
  )
}

export function AgentDrawer() {
  const { agentOpen, closeAgent } = useAskNanalyt()
  if (!agentOpen) return null

  return (
    <aside
      className="fixed top-0 right-0 bottom-0 w-[440px] bg-white z-[401] flex flex-col font-sans"
      style={{ borderLeft: '0.5px solid #E5E7EB' }}
    >
      {/* Header */}
      <div className="shrink-0 border-b-[0.5px] border-[#E5E7EB]">
        <div className="flex items-center justify-between" style={{ padding: '16px 18px 0 18px' }}>
          <span className="text-[14px] font-medium text-ink">Your agent</span>
          <button
            onClick={closeAgent}
            className="bg-transparent border-0 text-ink cursor-pointer flex p-1 hover:opacity-70"
            aria-label="Close agent drawer"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3l12 12M15 3l-12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-1.5" style={{ padding: '6px 18px 14px 18px' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
          <span className="text-[11px] text-ink">
            Active · <b className="font-medium">4 tasks in flight</b> · 12 queued
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 18 }}>
        <div className="flex flex-col gap-[22px]">
          {/* CURRENTLY WORKING ON */}
          <section>
            <SectionHead
              left="CURRENTLY WORKING ON"
              right={<span className="text-[11px] text-ink">{WORKING.length}</span>}
            />
            <div className="flex flex-col gap-1.5">
              {WORKING.map((c, i) => (
                <WorkingCardItem key={i} c={c} />
              ))}
            </div>
          </section>

          {/* NEXT UP */}
          <section>
            <SectionHead
              left="NEXT UP"
              right={
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-ink cursor-pointer hover:opacity-70">
                    Edit queue
                  </span>
                  <span className="text-[11px] font-medium text-ink cursor-pointer hover:opacity-70">
                    View all 12 →
                  </span>
                </div>
              }
            />
            <div className="flex flex-col gap-1.5">
              {NEXT_UP.map((n, i) => (
                <div
                  key={i}
                  className="bg-white flex items-center justify-between gap-2"
                  style={{ border: '0.5px solid #E5E7EB', borderRadius: 8, padding: '10px 12px' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-ink mb-0.5">{n.name}</div>
                    <div className="text-[11px] text-ink">{n.schedule}</div>
                  </div>
                  <span className="text-[14px] text-ink cursor-pointer leading-none pl-2 shrink-0 hover:opacity-70">
                    ⋯
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* RECENTLY COMPLETED */}
          <section>
            <SectionHead
              left="RECENTLY COMPLETED"
              right={
                <span className="text-[11px] font-medium text-ink cursor-pointer hover:opacity-70">
                  View activity log →
                </span>
              }
            />
            <div className="flex flex-col">
              {COMPLETED.map((c, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 py-2 ${i < COMPLETED.length - 1 ? 'border-b border-line-soft' : ''}`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-brand shrink-0"
                    style={{ marginTop: 5 }}
                  />
                  <div className="flex-1">
                    <div className="text-[12px] text-ink leading-[1.4]">{c.text}</div>
                    <div className="text-[10px] text-ink mt-0.5">{c.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </aside>
  )
}
