import { useState, useEffect, useRef, type ReactNode } from 'react'

// ─── Types & data ────────────────────────────────────────────────────────────

type Source = { platform: string; metric: string }
type Step = { label: string; cta: string }

type Finding = {
  id: number
  type: 'NEW ANGLE' | 'NEW PRODUCT' | 'HIDDEN WINNER' | 'COVERAGE GAP' | 'CAMPAIGN ALERT' | 'MACRO SHIFT'
  time: string
  severity: 'Standard' | 'Time-sensitive'
  confidence: 'High' | 'Medium' | 'Low'
  related: number
  impact: { kind: 'opportunity' | 'risk'; label: string }
  headline: string
  sources: Source[]
  action: string
  why: string
  steps: Step[]
  linkedProduct: string | null
  linkedCompetitors: string[]
}

const FINDINGS: Finding[] = [
  {
    id: 1,
    type: 'NEW ANGLE',
    time: '3h ago',
    severity: 'Standard',
    confidence: 'High',
    related: 3,
    impact: { kind: 'opportunity', label: '~$3–5k revenue opportunity' },
    headline: "Buyer language is shifting toward 'next-day calm' instead of 'fall asleep fast' across reviews and Reddit.",
    sources: [
      { platform: 'Amazon', metric: '63 review phrases' },
      { platform: 'Reddit', metric: '29 threads' },
      { platform: 'YouTube', metric: '11 review videos' },
      { platform: 'Meta', metric: '3 of 14 ads use this framing' },
    ],
    action: "Update the narrative map and create a static image (with built-in policy gate) around the 'next-day calm' positioning.",
    why: "Organic search queries for 'next-day calm' have increased 3.2× over 30 days. Reddit threads in r/sleep and r/insomnia show a clear shift in how buyers describe what they want — not falling asleep faster, but waking up without grogginess. Only 3 of your 14 active ads use this framing.",
    steps: [
      { label: 'Update narrative map', cta: 'Open narrative map' },
      { label: 'Generate static creative with next-day calm angle', cta: 'Generate creative' },
      { label: 'Set reminder to review performance in 7 days', cta: 'Set reminder' },
    ],
    linkedProduct: 'Magnesium Glycinate Complex',
    linkedCompetitors: ['DreamWell', 'Beam'],
  },
  {
    id: 2,
    type: 'NEW PRODUCT',
    time: 'Yesterday',
    severity: 'Standard',
    confidence: 'Medium',
    related: 1,
    impact: { kind: 'opportunity', label: 'Whitespace opportunity' },
    headline: 'Two stores in your scope launched magnesium + ashwagandha gummies and early creative is gaining traction.',
    sources: [
      { platform: 'Meta Ad Library', metric: '3 new advertisers in 17d' },
      { platform: 'Shopify', metric: '38 review count growth in 14d' },
      { platform: 'TikTok', metric: 'Comment sentiment trending high' },
    ],
    action: 'Open the product brief, compare positioning against your current SKUs, and queue a sourcing + creative review.',
    why: "DreamWell and SleepBlend Co. both launched magnesium + ashwagandha gummies within 17 days of each other, running UGC creative focusing on the stress-sleep connection. DreamWell's top ad has 2.1k comments in 9 days.",
    steps: [
      { label: 'Review product brief and positioning', cta: 'Open product brief' },
      { label: 'Compare against your current Mag Glycinate SKU', cta: 'Open Active Products' },
      { label: 'Queue sourcing review', cta: 'Add to Research' },
    ],
    linkedProduct: 'Magnesium Glycinate Complex',
    linkedCompetitors: ['DreamWell', 'SleepBlend Co.'],
  },
  {
    id: 3,
    type: 'HIDDEN WINNER',
    time: '2d ago',
    severity: 'Standard',
    confidence: 'High',
    related: 2,
    impact: { kind: 'opportunity', label: '~$6–10k monthly upside' },
    headline: 'Magnesium L-Threonate is under-advertised relative to its organic demand · high intent, low competition.',
    sources: [
      { platform: 'Google Trends', metric: '3.2× YoY growth' },
      { platform: 'Amazon', metric: 'Low sponsored density (8%)' },
      { platform: 'Reddit', metric: '84 organic mentions' },
    ],
    action: 'Evaluate adding Mag L-Threonate SKU · category is under-served with strong intent signal.',
    why: "Google Trends shows 3.2× year-over-year growth for 'magnesium l-threonate' queries. Amazon sponsored density is only 8% — unusually low for a product with this search volume. Reddit discussions are predominantly organic, not brand-driven.",
    steps: [
      { label: 'Run product research on Mag L-Threonate', cta: 'Open Research' },
      { label: 'Check sourcing availability on Alibaba + US suppliers', cta: 'View sourcing' },
      { label: 'Add to Suggested products for evaluation', cta: 'Add to pipeline' },
    ],
    linkedProduct: null,
    linkedCompetitors: [],
  },
  {
    id: 4,
    type: 'CAMPAIGN ALERT',
    time: '2d ago',
    severity: 'Time-sensitive',
    confidence: 'High',
    related: 0,
    impact: { kind: 'risk', label: '~$8k/mo at risk' },
    headline: 'CPA on ZzzPlex Sleep Support has spiked 34% over the last 72 hours · creative fatigue likely.',
    sources: [
      { platform: 'Meta Ads', metric: 'CPA $38.20 · was $28.50' },
      { platform: 'Meta Ads', metric: 'Frequency 4.2 · threshold hit' },
      { platform: 'TikTok', metric: 'CTR dropped 3.1% to 1.9%' },
    ],
    action: 'Pause the fatiguing creative, generate 2–3 fresh variants, and restart the ad set within 48 hours.',
    why: 'The top-performing ad for ZzzPlex Sleep Support (UGC variant, 23 days running) has exceeded the 4.0 frequency threshold. CTR dropped 43% over 5 days and CPA spiked accordingly. Classic fatigue pattern — the creative needs refreshing.',
    steps: [
      { label: 'Pause fatiguing UGC creative', cta: 'Open campaign' },
      { label: 'Generate 2–3 fresh UGC variants', cta: 'Generate creatives' },
      { label: 'Restart ad set with new creative', cta: 'Open campaign' },
    ],
    linkedProduct: 'ZzzPlex Sleep Support',
    linkedCompetitors: [],
  },
  {
    id: 5,
    type: 'MACRO SHIFT',
    time: '3d ago',
    severity: 'Standard',
    confidence: 'Medium',
    related: 4,
    impact: { kind: 'risk', label: 'First-mover window closing' },
    headline: "3 of your tracked competitors launched 'sleep-anxiety crossover' creative in the last 14 days · angle is being established.",
    sources: [
      { platform: 'Meta Ad Library', metric: 'DreamWell · 4 new UGC ads' },
      { platform: 'Meta Ad Library', metric: 'Beam · 2 new static ads' },
      { platform: 'TikTok Creative', metric: 'Olly · 3 new video ads' },
    ],
    action: 'Evaluate the sleep-anxiety crossover angle · 3 competitors converging means the differentiation window is closing.',
    why: 'DreamWell, Beam, and Olly have all moved toward messaging connecting sleep quality with anxiety reduction in the last 14 days. Multi-competitor convergence signals a validated angle — the window to be an early mover is narrowing.',
    steps: [
      { label: 'Review competitor creative examples', cta: 'Open Competitors' },
      { label: 'Map angle against your current narrative map', cta: 'Open narrative map' },
      { label: 'Decide whether to enter or differentiate', cta: 'Open Studio' },
    ],
    linkedProduct: null,
    linkedCompetitors: ['DreamWell', 'Beam', 'Olly'],
  },
  {
    id: 6,
    type: 'COVERAGE GAP',
    time: '4d ago',
    severity: 'Standard',
    confidence: 'High',
    related: 1,
    impact: { kind: 'opportunity', label: 'Conversion lift est. 8–12%' },
    headline: "Your Magnesium Glycinate PDP doesn't address the 'morning grogginess' objection · top Amazon review theme.",
    sources: [
      { platform: 'Amazon', metric: '47 reviews mention morning grogginess' },
      { platform: 'Reddit', metric: '34 threads mention "groggy"' },
      { platform: 'Your PDP', metric: 'Zero mentions of morning grogginess' },
    ],
    action: 'Add a FAQ section addressing the morning grogginess objection to the Magnesium Glycinate PDP.',
    why: 'The most common objection in Magnesium Glycinate reviews is morning grogginess. 47 Amazon reviews and 34 Reddit threads mention this concern. Your current PDP doesn\'t address it anywhere.',
    steps: [
      { label: 'Generate updated PDP with grogginess objection addressed', cta: 'Generate PDP' },
      { label: 'Add FAQ section targeting this objection', cta: 'Edit PDP' },
      { label: 'A/B test new PDP against current', cta: 'Start test' },
    ],
    linkedProduct: 'Magnesium Glycinate Complex',
    linkedCompetitors: [],
  },
]

const FILTER_TYPES = ['All', 'Hidden Winners', 'New Angles', 'Coverage Gaps', 'Campaign Alerts', 'New Products', 'Macro Shifts'] as const
type Filter = (typeof FILTER_TYPES)[number]
const TYPE_MAP: Record<Exclude<Filter, 'All'>, Finding['type']> = {
  'Hidden Winners': 'HIDDEN WINNER',
  'New Angles': 'NEW ANGLE',
  'Coverage Gaps': 'COVERAGE GAP',
  'Campaign Alerts': 'CAMPAIGN ALERT',
  'New Products': 'NEW PRODUCT',
  'Macro Shifts': 'MACRO SHIFT',
}

const BADGE_CLASS: Record<Finding['type'], string> = {
  'NEW ANGLE': 'bg-brand-bg text-brand',
  'NEW PRODUCT': 'bg-brand-bg text-brand',
  'HIDDEN WINNER': 'bg-brand-bg text-brand',
  'COVERAGE GAP': 'bg-alert-bg text-alert',
  'CAMPAIGN ALERT': 'bg-alert-bg text-alert',
  'MACRO SHIFT': 'bg-brand-bg text-brand',
}

// ─── Atoms ───────────────────────────────────────────────────────────────────

function BoldHeadline({ text }: { text: string }) {
  const parts = text.split(/(‘[^’]+’|'[^']+')/g)
  return (
    <>
      {parts.map((part, i) => {
        const quoted =
          (part.startsWith('‘') && part.endsWith('’')) ||
          (part.startsWith("'") && part.endsWith("'") && part.length > 2)
        return quoted ? (
          <strong key={i} className="font-semibold text-ink">{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </>
  )
}

const PLATFORM_LOGOS: Record<string, ReactNode> = {
  Amazon: (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M2 9.5c2 1.5 6 2 9 0.5" stroke="#ff9900" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M3 11c2.5 1.5 6 2 8 0.5" stroke="#ff9900" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <text x="3" y="6" fontSize="5" fontWeight="700" fill="#232f3e" fontFamily="sans-serif">am</text>
    </svg>
  ),
  Reddit: (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="5.5" fill="#ff4500" />
      <circle cx="5" cy="7.5" r="0.8" fill="#fff" />
      <circle cx="9" cy="7.5" r="0.8" fill="#fff" />
      <path d="M5 9.5c.5.5 1.2.8 2 .8s1.5-.3 2-.8" stroke="#fff" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  ),
  YouTube: (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <rect x="1" y="3" width="12" height="8" rx="2" fill="#ff0000" />
      <path d="M6 5.5v3l2.5-1.5z" fill="#fff" />
    </svg>
  ),
  Meta: (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M1.5 7C1.5 4.5 3 3 5 3c1.5 0 2.5 1 3.5 2.5C9.5 7 10.5 8 11.5 8c1 0 1.5-.5 1.5-1.5" stroke="#0866ff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  ),
  'Meta Ads': (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M1.5 7C1.5 4.5 3 3 5 3c1.5 0 2.5 1 3.5 2.5C9.5 7 10.5 8 11.5 8c1 0 1.5-.5 1.5-1.5" stroke="#0866ff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  ),
  'Meta Ad Library': (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M1.5 7C1.5 4.5 3 3 5 3c1.5 0 2.5 1 3.5 2.5C9.5 7 10.5 8 11.5 8c1 0 1.5-.5 1.5-1.5" stroke="#0866ff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  ),
  TikTok: (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M8 1.5v7.5a2 2 0 11-2-2" stroke="#000" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M8 1.5c0 1.5 1 2.5 2.5 2.5" stroke="#ff0050" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  ),
  'TikTok Creative': (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M8 1.5v7.5a2 2 0 11-2-2" stroke="#000" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M8 1.5c0 1.5 1 2.5 2.5 2.5" stroke="#ff0050" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  ),
  'Google Trends': (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M1.5 10l2.5-3 2 2 3-5 2.5 2.5" stroke="#4285f4" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Shopify: (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M10.2 3.1c-.1-.1-.2-.1-.3 0l-.7.2c-.2-.5-.6-.9-1.1-.9-.1 0-.1 0-.2.1-.2-.3-.5-.4-.7-.4-1.2 0-1.8 1.5-2 2.4l-.9.3c-.3.1-.3.1-.3.4L3.2 12l6.3 1.2 3.4-.8-2.7-9.3z" fill="#96bf48" />
    </svg>
  ),
  'Your PDP': (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="#6b6860" strokeWidth="1.2" fill="none" />
      <path d="M4.5 5h5M4.5 7h5M4.5 9h3" stroke="#6b6860" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
}

function PlatformLogo({ platform }: { platform: string }) {
  return (
    <>
      {PLATFORM_LOGOS[platform] || (
        <svg width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5" fill="#f0ede8" stroke="#e8e5e0" strokeWidth="1" />
        </svg>
      )}
    </>
  )
}

function TypeBadge({ type }: { type: Finding['type'] }) {
  return (
    <span className={`text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-[2px] rounded inline-block whitespace-nowrap ${BADGE_CLASS[type]}`}>
      {type}
    </span>
  )
}

// ─── Finding card ────────────────────────────────────────────────────────────

function FindingCard({ finding, onOpen, onTakeAction }: {
  finding: Finding; onOpen: (f: Finding) => void; onTakeAction: (f: Finding) => void;
}) {
  return (
    <div
      onClick={() => onOpen(finding)}
      className="bg-surf border border-[#e2deda] rounded-lg cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col transition-[box-shadow,border-color] hover:border-[#c8c4be]"
    >
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 flex-wrap">
        <TypeBadge type={finding.type} />
        <span className="text-[11px] text-dim whitespace-nowrap">{finding.time}</span>
        <span className="text-[11px] text-dim whitespace-nowrap">{finding.confidence} confidence</span>
        <span
          className={`text-[13px] font-medium whitespace-nowrap ml-auto ${
            finding.impact.kind === 'risk' ? 'text-danger' : 'text-ink'
          }`}
        >
          {finding.impact.kind === 'risk' ? '⚠ ' : '↑ '}
          {finding.impact.label}
        </span>
        <span onClick={e => e.stopPropagation()} className="text-dim cursor-pointer flex">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
            <circle cx="6.5" cy="2.5" r="1.1" />
            <circle cx="6.5" cy="6.5" r="1.1" />
            <circle cx="6.5" cy="10.5" r="1.1" />
          </svg>
        </span>
      </div>

      <div className="px-4 pb-1.5 text-[15px] font-medium text-ink leading-[1.5]">
        <BoldHeadline text={finding.headline} />
      </div>

      <div className="px-4 pb-2.5 text-[12px] text-mid leading-[1.5]">{finding.action}</div>

      <div className="px-4 pb-3 flex gap-1.5 flex-wrap items-center">
        {finding.sources.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-surf-2 border border-line rounded-[20px] pl-[7px] pr-2.5 py-[3px] shrink-0"
          >
            <PlatformLogo platform={s.platform} />
            <span className="text-[11px] font-semibold text-ink whitespace-nowrap">{s.platform}</span>
            <span className="text-[11px] text-mid ml-0.5 whitespace-nowrap">{s.metric}</span>
          </div>
        ))}
      </div>

      <div
        onClick={e => e.stopPropagation()}
        className="flex items-center justify-between gap-1.5 px-4 pt-2 pb-3"
      >
        <div>
          {finding.related > 0 && (
            <button className="text-[12px] font-medium text-mid bg-surf border border-line rounded-md px-[13px] py-[5px] cursor-pointer whitespace-nowrap transition-colors hover:bg-ink hover:text-white hover:border-ink">
              {finding.related} related signals →
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button className="text-[12px] text-mid bg-surf border border-line rounded-md px-[13px] py-[5px] cursor-pointer whitespace-nowrap hover:bg-line-soft">
            Dismiss
          </button>
          <button
            onClick={() => onOpen(finding)}
            className="text-[12px] text-mid bg-surf border border-line rounded-md px-[13px] py-[5px] cursor-pointer whitespace-nowrap hover:bg-line-soft"
          >
            Open finding
          </button>
          <button
            onClick={() => onTakeAction(finding)}
            className="text-[12px] font-medium text-white bg-brand border-0 rounded-md px-[13px] py-[5px] cursor-pointer whitespace-nowrap hover:opacity-90"
          >
            Take action
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Rich detail: shared atoms ───────────────────────────────────────────────

const cardCls = 'bg-surf border border-[#e2deda] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)]'

function SubLabel({ label, right }: { label: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-[11px] font-medium text-ink">{label}</span>
      {right}
    </div>
  )
}

function ArrowR() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" />
    </svg>
  )
}

// ─── Rich detail: New Angle (id:1) ───────────────────────────────────────────

function NewAngleDetail() {
  const supporting = [
    { num: '3', label: 'Category winners', sub: 'DreamWell, Beam, Pure Enc.' },
    { num: '30d+', label: 'Median longevity', sub: 'Their ads using this' },
    { num: '5', label: 'New advertisers', sub: 'in last 14 days' },
  ]
  const evidence = [
    { platform: 'Amazon', metric: '63', unit: 'review phrases', detail: 'Grogginess and next-morning feel' },
    { platform: 'Reddit', metric: '29', unit: 'threads', detail: 'r/sleep · 3.4× volume in 30d' },
    { platform: 'YouTube', metric: '11', unit: 'of 17 videos', detail: '"Next-day" framing unprompted' },
    { platform: 'Meta Ad Library', metric: '3', unit: 'of 14 ads', detail: 'All 3 running 20+ days' },
  ]
  const coverage = [
    { num: '64%', label: 'Buyer attention', sub: 'of category conversation' },
    { num: '21%', label: 'Category ads', sub: 'of ads use this angle' },
    { num: '0%', label: 'Your coverage', sub: '0 of 6 active ads' },
  ]
  const actions = [
    { n: '01', title: 'Generate PDP variant', sub: 'Update Magnesium Glycinate PDP to address next-day calm angle', btn: 'Generate PDP →' },
    { n: '02', title: 'Generate creative', sub: 'Static image ad · angle and buyer language pre-populated', btn: 'Generate →' },
  ]

  return (
    <div className="text-ink">
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="text-[10px] font-bold tracking-[0.09em] uppercase bg-brand-bg text-brand px-2 py-[2px] rounded">New Angle</span>
          <span className="text-[11px] text-dim">3h ago · High confidence · 4 sources</span>
          <span className="ml-auto text-[11px] font-semibold text-dim whitespace-nowrap">↑ Angle opportunity</span>
        </div>
        <p className="text-[15px] font-medium leading-[1.55] tracking-[-0.01em] text-ink m-0">
          Buyers are shifting from <b className="font-semibold">"fall asleep fast"</b> to{' '}
          <b className="font-semibold">"next-day calm"</b> — 3 category winners running this for 30+ days. Your ads don't address it.
        </p>
      </div>

      <div className="mb-5">
        <div className="text-[11px] font-medium text-ink mb-2.5">Signal facts</div>
        <div className={`${cardCls} px-4 py-3.5 mb-2`}>
          <div className="text-[34px] font-medium text-ink font-mono tracking-[-0.04em] leading-none mb-1.5">3.2×</div>
          <div className="text-[13px] font-medium text-ink mb-[3px]">Buyer attention growth in 30 days</div>
          <div className="text-[12px] text-dim">Across r/sleep, r/insomnia, Amazon, and YouTube</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {supporting.map((s, i) => (
            <div key={i} className={`${cardCls} px-3 py-[11px]`}>
              <div className="text-[18px] font-medium text-ink font-mono tracking-[-0.03em] leading-none mb-1">{s.num}</div>
              <div className="text-[11px] font-medium text-ink mb-[2px]">{s.label}</div>
              <div className="text-[10px] text-dim leading-[1.3]">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-[11px] font-medium text-ink mb-2.5">Evidence</div>
        <div className={cardCls}>
          <div className="grid grid-cols-2">
            {evidence.map((e, i) => (
              <div
                key={i}
                className={`px-3.5 py-3 cursor-pointer transition-colors flex flex-col gap-1.5 hover:bg-black/[0.025] ${
                  i % 2 === 0 ? 'border-r border-line' : ''
                } ${i < 2 ? 'border-b border-line' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[7px]">
                    <PlatformLogo platform={e.platform} />
                    <span className="text-[12px] font-medium text-ink">{e.platform}</span>
                  </div>
                  <span className="text-[10px] text-brand font-medium">View →</span>
                </div>
                <div>
                  <span className="text-[20px] font-medium text-ink font-mono tracking-[-0.03em] leading-none">{e.metric}</span>
                  <span className="text-[11px] text-mid ml-1.5">{e.unit}</span>
                </div>
                <div className="text-[11px] text-dim">{e.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] font-medium text-ink">Coverage gap</div>
          <span className="text-[11px] text-brand cursor-pointer font-medium">Open narrative map →</span>
        </div>
        <div className={cardCls}>
          <div className="grid grid-cols-3">
            {coverage.map((m, i) => (
              <div key={i} className={`px-[13px] py-3 ${i < 2 ? 'border-r border-line-soft' : ''}`}>
                <div className="text-[22px] font-medium text-ink font-mono tracking-[-0.03em] leading-none mb-1">{m.num}</div>
                <div className="text-[11px] font-medium text-ink mb-[2px]">{m.label}</div>
                <div className="text-[10px] text-dim">{m.sub}</div>
              </div>
            ))}
          </div>
          <div className="px-3.5 pt-3 pb-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-dim">Buyer attention trend — last 90 days</span>
              <span className="text-[12px] font-semibold text-ink font-mono">+3.2×</span>
            </div>
            <div className="relative">
              <svg width="100%" height="64" viewBox="0 0 400 64" preserveAspectRatio="none" className="block">
                <defs>
                  <linearGradient id="fdg-na" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2d5c3a" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#2d5c3a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="16" x2="400" y2="16" stroke="#f0ede8" strokeWidth="1" />
                <line x1="0" y1="32" x2="400" y2="32" stroke="#f0ede8" strokeWidth="1" />
                <line x1="0" y1="48" x2="400" y2="48" stroke="#f0ede8" strokeWidth="1" />
                <path d="M0,56 C44,54 89,50 133,42 C178,34 222,24 267,14 C311,8 356,5 400,2 L400,64 L0,64 Z" fill="url(#fdg-na)" />
                <path d="M0,56 C44,54 89,50 133,42 C178,34 222,24 267,14 C311,8 356,5 400,2" fill="none" stroke="#2d5c3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="0" cy="56" r="3" fill="#2d5c3a" opacity="0.5" />
                <circle cx="400" cy="2" r="4" fill="#2d5c3a" />
                <circle cx="400" cy="2" r="7" fill="#2d5c3a" opacity="0.15" />
              </svg>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-dim font-mono">Feb 5</span>
                <span className="text-[9px] text-dim font-mono">Mar 5</span>
                <span className="text-[9px] text-dim font-mono">Apr 5</span>
                <span className="text-[9px] text-ink font-mono font-medium">May 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-[11px] font-medium text-ink mb-2.5">Your current state</div>
        <div className={cardCls}>
          <div className="flex items-center justify-between px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <img src="/uploads/IMG_3472.jpg" alt="" className="w-8 h-8 rounded-[7px] object-cover shrink-0 border border-line" />
              <span className="text-[13px] font-medium text-ink">Magnesium Glycinate Complex</span>
            </div>
            <span className="text-[11px] text-brand cursor-pointer font-medium">Open product →</span>
          </div>
          <div className="px-3.5 py-3 flex flex-col gap-[7px]">
            <div className="flex items-baseline gap-2">
              <span className="text-[12px] text-dim min-w-[90px] shrink-0">Active ads</span>
              <span className="text-[12px] text-ink">6 running</span>
              <span className="text-[12px] text-dim">· none use this angle</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[12px] text-dim min-w-[90px] shrink-0">PDP</span>
              <span className="text-[12px] text-mid">Not addressed — "fast-acting" ×4, "morning" ×0</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[12px] text-dim min-w-[90px] shrink-0">Last creative</span>
              <span className="text-[12px] text-dim">23 days ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-[11px] font-medium text-ink mb-2.5">Recommended actions</div>
        <div className={cardCls}>
          {actions.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-3.5 py-3 ${i === 0 ? 'border-b border-line-soft' : ''}`}>
              <span className="text-[10px] text-dim font-mono min-w-[18px]">{a.n}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-ink mb-[2px]">{a.title}</div>
                <div className="text-[11px] text-dim">{a.sub}</div>
              </div>
              <button className="text-[11px] text-mid bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:bg-brand hover:text-white hover:border-brand">
                {a.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] font-medium text-ink mb-2.5">Go deeper</div>
        <div className="flex flex-col gap-2">
          <button className={`${cardCls} w-full flex items-center justify-between px-3.5 py-[11px] text-[12px] font-medium text-ink cursor-pointer text-left transition-colors hover:border-brand`}>
            <span>Run full intelligence pass on Magnesium Glycinate Complex</span>
            <span className="text-dim ml-3 shrink-0">→</span>
          </button>
          <button className="w-full flex items-center justify-between px-3.5 py-[11px] bg-transparent border border-line rounded-lg text-[12px] text-ink cursor-pointer text-left transition-colors hover:border-brand">
            <span>Ask Nanalyt about this finding</span>
            <span className="text-dim ml-3 shrink-0">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Rich detail: New Product (id:2) ─────────────────────────────────────────

function NewProductDetail() {
  const stats = [
    { num: '2', label: 'New advertisers', sub: 'DreamWell + SleepBlend Co. in 17d' },
    { num: '38', label: 'Reviews in 14 days', sub: 'Competitor lead SKU — scaling' },
    { num: '19pt', label: 'Market gap', sub: '28% attention, 9% ad coverage' },
  ]
  const evidence = [
    { platform: 'Meta Ad Library', metric: '3', unit: 'new advertisers in 17d' },
    { platform: 'Shopify', metric: '38', unit: 'review growth in 14d' },
    { platform: 'TikTok', metric: '↑', unit: 'Comment sentiment high' },
    { platform: 'Google Trends', metric: '4.1×', unit: 'search growth in 60d' },
  ]
  const satRows = [
    { signal: 'Seller count', fact: '3 sellers on Google Shopping', verdict: 'Low concentration' },
    { signal: 'Price stability', fact: '$28–$34 range, no erosion in 30d', verdict: 'Defensible pricing' },
    { signal: 'Creative diversity', fact: '4 distinct angles being tested', verdict: 'Angle space open' },
    { signal: 'Time since first launch', fact: '~45 days in category as a winning pattern', verdict: 'Early wave' },
  ]
  const actions = [
    { n: '01', title: 'Generate PDP draft for this product', sub: 'Drafts a product page using the winning angle and your brand context — review before pushing to Shopify', btn: 'Generate PDP →' },
    { n: '02', title: 'Generate creative package against the winning angle', sub: 'Autonomous flow — angle, language, and format mix pre-populated from the finding', btn: 'Generate creative →' },
  ]

  return (
    <div className="text-ink">
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="text-[10px] font-bold tracking-[0.09em] uppercase bg-info-bg text-info px-2 py-[2px] rounded">New Product</span>
          <span className="text-[11px] text-dim">Yesterday · Medium confidence · 3 sources</span>
          <span className="ml-auto text-[11px] font-semibold text-[#0369a1] bg-[#e0f2fe] border border-[#7dd3fc] px-[9px] py-[3px] rounded-[5px] whitespace-nowrap">↑ Whitespace opportunity</span>
        </div>
        <div className="flex items-start gap-3.5">
          <p className="text-[15px] font-medium leading-[1.55] tracking-[-0.01em] text-ink m-0 flex-1">
            Magnesium + ashwagandha gummies are gaining traction — DreamWell and SleepBlend Co. both launched in the last 17 days, early creative is scaling, and the category is still defensible.
          </p>
          <div className="shrink-0 text-center">
            <img src="/uploads/IMG_3476.jpg" alt="" className="w-[72px] h-[72px] rounded-lg object-cover border border-line block" />
            <div className="text-[9px] text-dim mt-1">Representative</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-line mb-5" />

      <div className="mb-5">
        <SubLabel label="Signal facts" />
        <div className={`${cardCls} px-4 py-3.5 mb-2`}>
          <div className="text-[34px] font-medium text-ink font-mono tracking-[-0.04em] leading-none mb-1.5">4.1×</div>
          <div className="text-[13px] font-medium text-ink mb-[3px]">Buyer attention growth in 60 days</div>
          <div className="text-[12px] text-dim">Search volume for "magnesium ashwagandha gummies" · TikTok sentiment trending positive</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {stats.map((s, i) => (
            <div key={i} className={`${cardCls} px-3 py-[11px]`}>
              <div className="text-[18px] font-medium text-ink font-mono tracking-[-0.03em] leading-none mb-1">{s.num}</div>
              <div className="text-[11px] font-medium text-ink mb-[2px]">{s.label}</div>
              <div className="text-[10px] text-dim leading-[1.3]">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className={`${cardCls} px-3.5 py-2.5 flex items-baseline gap-2`}>
          <span className="text-base font-semibold text-ink font-mono whitespace-nowrap">~45 days</span>
          <span className="text-[12px] text-mid">into competitive cycle — early wave, category still defensible</span>
        </div>
      </div>

      <div className="mb-5">
        <SubLabel label="Evidence" />
        <div className={cardCls}>
          <div className="grid grid-cols-2">
            {evidence.map((e, i) => (
              <div
                key={i}
                className={`px-3.5 py-3 cursor-pointer transition-colors hover:bg-black/[0.025] ${
                  i % 2 === 0 ? 'border-r border-line-soft' : ''
                } ${i < 2 ? 'border-b border-line-soft' : ''}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-[7px]">
                    <PlatformLogo platform={e.platform} />
                    <span className="text-[12px] font-medium text-ink">{e.platform}</span>
                  </div>
                  <span className="text-[10px] text-brand font-medium">View →</span>
                </div>
                <div>
                  <span className="text-[20px] font-medium text-ink font-mono tracking-[-0.03em] leading-none">{e.metric}</span>
                  <span className="text-[11px] text-mid ml-1.5">{e.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <SubLabel
          label="Saturation read"
          right={
            <span className="text-[10px] font-semibold bg-brand-bg text-brand px-2 py-[2px] rounded-[20px]">
              Early wave, still defensible
            </span>
          }
        />
        <div className={cardCls}>
          {satRows.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-3.5 py-[11px] ${i < satRows.length - 1 ? 'border-b border-line-soft' : ''}`}
            >
              <div className="w-[5px] h-[5px] rounded-full bg-brand shrink-0" />
              <div className="flex-1">
                <span className="text-[12px] font-medium text-ink">{r.signal}</span>
                <span className="text-[11px] text-dim ml-2">{r.fact}</span>
              </div>
              <span className="text-[11px] font-medium text-mid whitespace-nowrap">{r.verdict}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <SubLabel label="Opportunity context" />
        <div className="flex flex-col gap-2">
          <div className={`${cardCls} px-3.5 py-3`}>
            <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-dim mb-2.5">Bundle potential</div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <img src="/uploads/IMG_3472.jpg" alt="" className="w-12 h-12 rounded-[7px] object-cover border border-line shrink-0" />
              <span className="text-base text-dim font-light">+</span>
              <img src="/uploads/IMG_3476.jpg" alt="" className="w-12 h-12 rounded-[7px] object-cover border border-line shrink-0" />
              <span className="text-base text-dim font-light">→</span>
              <div className="ml-auto text-right">
                <div className="text-[10px] text-dim mb-[2px]">Estimated AOV</div>
                <div className="text-base font-medium text-ink font-mono">
                  <span className="text-dim line-through text-[13px]">$40</span>{' '}
                  <span className="text-brand">$65</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-mid">
              Pairs with <span className="text-brand cursor-pointer font-medium">Magnesium Glycinate Complex</span> — same buyer segment, complementary use case.
            </div>
          </div>
          <div className={`${cardCls} px-3.5 py-3`}>
            <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-dim mb-1.5">Supplier overlap</div>
            <div className="text-[12px] text-ink">Same supplier category as 3 of your active SKUs — sourcing friction likely low.</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <SubLabel label="Recommended actions" />
        <div className={cardCls}>
          {actions.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-3.5 py-3 ${i === 0 ? 'border-b border-line-soft' : ''}`}>
              <span className="text-[10px] text-dim font-mono min-w-[18px]">{a.n}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-ink mb-[2px]">{a.title}</div>
                <div className="text-[11px] text-dim">{a.sub}</div>
              </div>
              <button className="text-[11px] text-mid bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:bg-brand hover:text-white hover:border-brand">
                {a.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SubLabel label="Go deeper" />
        <div className="flex flex-col gap-2">
          <button className={`${cardCls} w-full flex items-center justify-between px-3.5 py-[11px] text-[12px] font-medium text-ink cursor-pointer text-left transition-colors hover:border-brand`}>
            <span>Run full intelligence pass on magnesium + ashwagandha gummies</span>
            <span className="text-dim ml-3 shrink-0">→</span>
          </button>
          <button className={`${cardCls} w-full flex items-center justify-between px-3.5 py-[11px] text-[12px] text-ink cursor-pointer text-left transition-colors hover:border-brand`}>
            <span>Ask Nanalyt about this finding</span>
            <span className="text-dim ml-3 shrink-0">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Detail drawer ───────────────────────────────────────────────────────────

function DetailDrawer({ finding, onClose, onTakeAction }: {
  finding: Finding | null;
  onClose: () => void;
  onTakeAction: (f: Finding) => void;
}) {
  const open = !!finding
  const f = finding ?? FINDINGS[0]
  const isNewAngle = f.id === 1
  const isNewProduct = f.id === 2
  const isRich = isNewAngle || isNewProduct

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[200] bg-black/[0.18] transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 z-[201] w-1/2 min-w-[540px] max-w-[760px] bg-surf border-l border-line flex flex-col shadow-drawer transition-transform duration-200 ease-out font-sans ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {isRich ? (
          <>
            <div className="h-11 px-4 border-b border-line flex items-center justify-between shrink-0 bg-surf">
              <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                <span className="text-[12px] text-dim shrink-0">Findings</span>
                <span className="text-[12px] text-dim shrink-0">›</span>
                <span className="text-[12px] text-ink font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {isNewAngle ? 'New angle · Next-day calm' : 'New product · Mag + Ashwagandha Gummies'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="bg-transparent border-0 text-dim flex p-1 cursor-pointer text-sm hover:text-ink"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pt-6 pb-4">
              {isNewAngle ? <NewAngleDetail /> : <NewProductDetail />}
            </div>
            <div className="px-5 py-3 border-t border-line flex gap-2 items-center shrink-0 bg-surf">
              <button className="bg-transparent text-mid border border-line px-3 py-[5px] rounded-md text-[11px] cursor-pointer whitespace-nowrap hover:bg-line-soft">
                Remind me in 7 days
              </button>
              <div className="ml-auto flex gap-2">
                <button className="bg-transparent text-mid border border-line px-3 py-[5px] rounded-md text-[11px] cursor-pointer hover:bg-line-soft">
                  Dismiss
                </button>
                <button className="bg-transparent text-mid border border-line px-3 py-[5px] rounded-md text-[11px] cursor-pointer hover:bg-line-soft">
                  Mark complete
                </button>
                <button
                  onClick={() => onTakeAction(f)}
                  className="bg-brand text-white border-0 px-3.5 py-[5px] rounded-md text-[11px] font-medium cursor-pointer whitespace-nowrap hover:opacity-90"
                >
                  Take action →
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-line flex items-start justify-between gap-3 shrink-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <TypeBadge type={f.type} />
                  {f.severity === 'Time-sensitive' && (
                    <span className="text-[9px] font-semibold text-warn bg-warn-bg px-[7px] py-[2px] rounded">
                      Time-sensitive
                    </span>
                  )}
                  <span className="text-[10px] text-dim font-mono ml-auto">{f.time}</span>
                </div>
                <div className="text-[15px] font-medium text-ink leading-[1.5]">
                  <BoldHeadline text={f.headline} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-transparent border-0 text-dim flex p-1 cursor-pointer shrink-0 hover:text-ink"
                aria-label="Close"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l9 9M11 2l-9 9" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-6">
                <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-dim mb-2.5">
                  Why this surfaced
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {f.sources.map((s, i) => (
                    <div key={i} className="bg-surf-2 border border-line rounded-lg px-3 py-2.5">
                      <div className="text-[11px] font-medium text-ink mb-[3px]">{s.platform}</div>
                      <div className="text-[11px] text-mid">{s.metric}</div>
                      <span className="text-[10px] text-brand cursor-pointer inline-flex items-center gap-[3px] mt-1.5">
                        View source
                        <ArrowR />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[12px] text-mid leading-[1.6] bg-surf-2 border border-line rounded-lg px-3.5 py-3">
                  {f.why}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-dim mb-2.5">
                  What the agent recommends
                </div>
                <div className="flex flex-col gap-2">
                  {f.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-surf-2 border border-line rounded-lg px-3 py-2.5">
                      <span className="w-5 h-5 bg-surf border border-line rounded-full flex items-center justify-center text-[10px] font-medium text-mid font-mono shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-[12px] text-ink">{step.label}</span>
                      <span className="text-[11px] text-brand cursor-pointer whitespace-nowrap flex items-center gap-[3px]">
                        {step.cta}
                        <ArrowR />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {(f.linkedProduct || f.linkedCompetitors.length > 0) && (
                <div className="mb-6">
                  <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-dim mb-2.5">
                    Linked context
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {f.linkedProduct && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-surf-2 border border-line rounded-lg cursor-pointer hover:bg-black/[0.025]">
                        <span className="text-[11px] text-dim">Product</span>
                        <span className="text-[12px] font-medium text-ink">{f.linkedProduct}</span>
                        <span className="ml-auto text-brand flex">→</span>
                      </div>
                    )}
                    {f.linkedCompetitors.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-surf-2 border border-line rounded-lg cursor-pointer hover:bg-black/[0.025]">
                        <span className="text-[11px] text-dim">Competitors</span>
                        <span className="text-[12px] font-medium text-ink">{f.linkedCompetitors.join(', ')}</span>
                        <span className="ml-auto text-brand flex">→</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-line flex gap-2 items-center shrink-0">
              <button
                onClick={() => onTakeAction(f)}
                className="bg-brand text-white border-0 rounded-md px-3.5 py-1.5 text-[12px] font-medium cursor-pointer hover:opacity-90"
              >
                Take action
              </button>
              <button className="bg-surf text-mid border border-line rounded-md px-3.5 py-1.5 text-[12px] cursor-pointer hover:bg-line-soft">
                Mark as completed
              </button>
              <button className="ml-auto bg-surf text-danger border border-line rounded-md px-3.5 py-1.5 text-[12px] cursor-pointer hover:bg-line-soft">
                Dismiss
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ─── Take Action Modal ───────────────────────────────────────────────────────

const PACKAGE_FIELDS = [
  { label: 'Product', value: 'Magnesium + Ashwagandha Gummies' },
  { label: 'Recommended angle', value: 'Sleep-Anxiety Crossover' },
  { label: 'PDP sections', value: 'Hero, Testimonials, Feature breakdown, FAQ, Trust badges, Risk reversal' },
  { label: 'Creative format mix', value: '2 UGC + 2 Static (matched to category winners)' },
  { label: 'Buyer language', value: '12 verbatim phrases from r/sleep, r/anxiety, Amazon reviews' },
  { label: 'Avatars (UGC)', value: 'Casual female · Skeptical-convert male' },
  { label: 'Settings (UGC)', value: 'Kitchen · Desk' },
  { label: 'Sourcing', value: '2 supplier matches via Alibaba + 1 US supplier' },
]

const OUTPUT_CREATIVES = [
  { format: 'UGC' as const, label: 'UGC #1', score: 84, desc: 'Casual female · Kitchen', hook: 'Struggling with sleep AND anxiety?' },
  { format: 'UGC' as const, label: 'UGC #2', score: 78, desc: 'Skeptical-convert · Desk', hook: 'I was skeptical about magnesium…' },
  { format: 'STATIC' as const, label: 'Static #1', score: 81, desc: 'Soft palette · 1:1', hook: 'Finally. Sleep without the groggy.' },
  { format: 'STATIC' as const, label: 'Static #2', score: 76, desc: 'Bold claim · 9:16', hook: 'Calm your mind. Sleep through the night.' },
]

const FORMAT_BG: Record<'UGC' | 'STATIC' | 'VIDEO', string> = {
  UGC: '#4f86c6',
  STATIC: '#8b6fbf',
  VIDEO: '#3ba8a0',
}

type ModalState = 'confirm' | 'progress' | 'output'

function TakeActionModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<ModalState>('confirm')
  const [progress, setProgress] = useState({ pct: 0, step: 'Initializing…' })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (state === 'progress') {
      const steps = [
        { pct: 15, step: 'Writing PDP copy…' },
        { pct: 28, step: 'Selecting imagery…' },
        { pct: 42, step: 'Generating UGC scripts…' },
        { pct: 58, step: 'Rendering UGC #1 (casual female, kitchen)…' },
        { pct: 70, step: 'Rendering UGC #2 (skeptical-convert, desk)…' },
        { pct: 82, step: 'Generating static creatives…' },
        { pct: 91, step: 'Running policy gate…' },
        { pct: 100, step: 'Done!' },
      ]
      let i = 0
      timerRef.current = setInterval(() => {
        if (i < steps.length) {
          setProgress(steps[i])
          i++
        } else {
          if (timerRef.current) clearInterval(timerRef.current)
          setTimeout(() => setState('output'), 600)
        }
      }, 600)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [state])

  const perAsset = [
    { label: 'PDP', desc: 'Writing copy · selecting imagery · building layout', pct: state === 'progress' ? Math.min(100, progress.pct + 5) : 100 },
    { label: 'UGC #1', desc: 'Casual female · kitchen · sleep-anxiety angle', pct: state === 'progress' ? Math.max(0, progress.pct - 10) : 100 },
    { label: 'UGC #2', desc: 'Skeptical-convert male · desk · next-day calm', pct: state === 'progress' ? Math.max(0, progress.pct - 20) : 100 },
    { label: 'Static #1', desc: 'Soft palette · 1:1 · lifestyle', pct: state === 'progress' ? Math.max(0, progress.pct - 15) : 100 },
    { label: 'Static #2', desc: 'Bold claim · 9:16 · dark background', pct: state === 'progress' ? Math.max(0, progress.pct - 25) : 100 },
  ]

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[300] bg-black/25 flex items-center justify-center"
    >
      <div className="bg-surf border border-line rounded-xl w-[560px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-80px)] flex flex-col shadow-[0_8px_48px_rgba(0,0,0,0.14)] overflow-hidden">
        <div className="px-5 py-4 border-b border-line flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-dim mb-1.5">
              {state === 'confirm' ? 'State 1 · Confirmation' : state === 'progress' ? 'State 2 · In progress' : 'State 3 · Output'}
            </div>
            <div className="text-[15px] font-medium text-ink leading-[1.3]">
              {state === 'confirm' && "Generate launch package for 'Magnesium + Ashwagandha Gummies'"}
              {state === 'progress' && 'Building your launch package'}
              {state === 'output' && 'Launch package ready'}
            </div>
            {state === 'confirm' && (
              <div className="text-[11px] text-mid mt-1">Pre-configured based on the finding · Est. 8 minutes</div>
            )}
            {state === 'progress' && (
              <div className="text-[11px] text-mid mt-1">
                {progress.step} · {Math.max(0, Math.round(100 - (progress.pct / 100) * 95))} sec remaining
              </div>
            )}
            {state === 'output' && (
              <div className="text-[11px] text-mid mt-1">
                Generated for 'Magnesium + Ashwagandha Gummies' · Sleep-Anxiety Crossover angle
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-0 text-dim flex p-1 cursor-pointer shrink-0 hover:text-ink"
            aria-label="Close"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2l9 9M11 2l-9 9" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {state === 'confirm' && (
            <div className="flex flex-col gap-0">
              {PACKAGE_FIELDS.map((field, i) => (
                <div
                  key={field.label}
                  className={`flex items-start gap-3 py-2.5 ${i < PACKAGE_FIELDS.length - 1 ? 'border-b border-line-soft' : ''}`}
                >
                  <div className="text-[11px] text-dim w-[140px] shrink-0 pt-px">{field.label}</div>
                  <div className="flex-1 text-[12px] text-ink leading-[1.4]">{field.value}</div>
                  <span className="text-dim cursor-pointer flex shrink-0 pt-px">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                      <circle cx="6.5" cy="2.5" r="1.1" />
                      <circle cx="6.5" cy="6.5" r="1.1" />
                      <circle cx="6.5" cy="10.5" r="1.1" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          )}

          {state === 'progress' && (
            <div className="flex flex-col gap-3">
              <div className="bg-surf-2 border border-line rounded-lg px-4 py-3.5 mb-1">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[12px] font-medium text-ink">Overall progress</span>
                  <span className="text-[13px] font-medium text-brand font-mono">{progress.pct}%</span>
                </div>
                <div className="h-1 bg-line rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-sm transition-[width] duration-500"
                    style={{ width: `${progress.pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-mid mt-2">{progress.step}</div>
              </div>
              {perAsset.map((a, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-surf-2 border border-line rounded-lg">
                  <span
                    className={`text-[9px] font-semibold tracking-[0.08em] px-1.5 py-[2px] rounded-sm shrink-0 w-[46px] text-center ${
                      a.pct >= 100 ? 'bg-brand-bg text-brand' : 'bg-line text-dim'
                    }`}
                  >
                    {a.pct >= 100 ? 'DONE' : a.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-ink mb-1">{a.desc}</div>
                    <div className="h-0.5 bg-line rounded-[1px] overflow-hidden">
                      <div
                        className="h-full rounded-[1px] transition-[width] duration-500"
                        style={{ width: `${a.pct}%`, background: a.pct >= 100 ? '#2d5c3a' : '#4f86c6' }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-dim font-mono shrink-0 w-7 text-right">{a.pct}%</span>
                </div>
              ))}
            </div>
          )}

          {state === 'output' && (
            <div>
              <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-dim mb-2.5">Product page</div>
              <div className="bg-surf-2 border border-line rounded-lg px-4 py-3.5 mb-5 flex items-center gap-3">
                <div className="w-20 h-[60px] bg-brand-bg border border-brand-dim rounded-md flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-brand tracking-[0.08em]">PDP</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-medium text-ink">Magnesium + Ashwagandha Gummies PDP</span>
                    <span className="text-[11px] font-medium text-brand font-mono">Score: 84</span>
                  </div>
                  <div className="text-[11px] text-mid">Hero · Testimonials · Feature breakdown · FAQ · Trust badges · Risk reversal</div>
                </div>
                <span className="text-[11px] text-brand cursor-pointer flex items-center gap-[3px] shrink-0">
                  Preview
                  <ArrowR />
                </span>
              </div>

              <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-dim mb-2.5">Creatives</div>
              <div className="grid grid-cols-2 gap-2">
                {OUTPUT_CREATIVES.map((c, i) => (
                  <div key={i} className="bg-surf-2 border border-line rounded-lg overflow-hidden">
                    <div className="h-20 bg-[#e8f0fe] relative flex items-center justify-center">
                      <span className="text-[11px] italic opacity-70" style={{ color: '#4f86c6' }}>
                        {c.format === 'UGC' ? '▶ UGC video' : '🖼 Static'}
                      </span>
                      <span
                        className="absolute top-1.5 left-2 text-[9px] font-bold text-white px-1.5 py-[2px] rounded-sm tracking-[0.06em]"
                        style={{ background: FORMAT_BG[c.format] }}
                      >
                        {c.format}
                      </span>
                      <span className="absolute top-1.5 right-2 text-[11px] font-medium text-brand font-mono bg-white/85 px-[5px] py-px rounded-sm">
                        {c.score}
                      </span>
                    </div>
                    <div className="px-2.5 py-2">
                      <div className="text-[11px] text-dim mb-[2px]">{c.desc}</div>
                      <div className="text-[11px] font-medium text-ink italic">"{c.hook}"</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-line flex gap-2 items-center shrink-0">
          {state === 'confirm' && (
            <>
              <button
                onClick={() => setState('progress')}
                className="bg-brand text-white border-0 rounded-md px-3.5 py-1.5 text-[12px] font-medium cursor-pointer hover:opacity-90"
              >
                Generate package
              </button>
              <button className="bg-surf text-mid border border-line rounded-md px-3.5 py-1.5 text-[12px] cursor-pointer hover:bg-line-soft">
                Customize fully
              </button>
              <button
                onClick={onClose}
                className="ml-auto bg-surf text-mid border border-line rounded-md px-3.5 py-1.5 text-[12px] cursor-pointer hover:bg-line-soft"
              >
                Cancel
              </button>
            </>
          )}
          {state === 'progress' && (
            <button
              onClick={onClose}
              className="ml-auto bg-surf text-mid border border-line rounded-md px-3.5 py-1.5 text-[12px] cursor-pointer hover:bg-line-soft"
            >
              Close · continue in background
            </button>
          )}
          {state === 'output' && (
            <>
              <button className="bg-brand text-white border-0 rounded-md px-3.5 py-1.5 text-[12px] font-medium cursor-pointer hover:opacity-90">
                Add to library + start validation test
              </button>
              <button className="bg-surf text-mid border border-line rounded-md px-3.5 py-1.5 text-[12px] cursor-pointer hover:bg-line-soft">
                Add to library only
              </button>
              <button
                onClick={onClose}
                className="ml-auto bg-surf text-mid border border-line rounded-md px-3.5 py-1.5 text-[12px] cursor-pointer hover:bg-line-soft"
              >
                Save and exit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

function Findings() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [openFinding, setOpenFinding] = useState<Finding | null>(null)
  const [actionFinding, setActionFinding] = useState<Finding | null>(null)

  const filtered =
    activeFilter === 'All' ? FINDINGS : FINDINGS.filter(f => f.type === TYPE_MAP[activeFilter])

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="px-6 pt-5 shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[20px] font-medium text-ink tracking-[-0.025em]">Findings</div>
            <div className="text-[12px] text-dim mt-[3px]">Surfaced by the agent over the last 7 days</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-dim font-mono">12 new · 47 total</span>
            <button className="flex items-center gap-1.5 bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer hover:bg-line-soft">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-mid">
                <path d="M2 3h7M3 5.5h5M4 8h3" />
              </svg>
              <span className="text-[11px] text-mid">Most recent</span>
            </button>
            <button className="flex items-center gap-1.5 bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer hover:bg-line-soft">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-mid">
                <path d="M5.5 1v6m0 0L3.5 5m2 2L7.5 5M2 9.5h7" />
              </svg>
              <span className="text-[11px] text-mid">Export</span>
            </button>
            <button className="flex items-center gap-1.5 bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer hover:bg-line-soft">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-mid">
                <path d="M1.5 2.5h8M3 5.5h5M4.5 8.5h2" />
              </svg>
              <span className="text-[11px] text-mid">All products</span>
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 pb-4">
          {FILTER_TYPES.map(f => {
            const isActive = activeFilter === f
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-[11px] px-3 py-[5px] rounded-md cursor-pointer transition-colors whitespace-nowrap border ${
                  isActive
                    ? 'bg-ink text-[#f5f4f2] border-ink font-medium'
                    : 'bg-surf text-mid border-line font-normal hover:bg-line-soft'
                }`}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-12 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-dim">No findings of this type in the last 7 days.</div>
        ) : (
          filtered.map(f => (
            <FindingCard
              key={f.id}
              finding={f}
              onOpen={setOpenFinding}
              onTakeAction={setActionFinding}
            />
          ))
        )}
      </div>

      <DetailDrawer
        finding={openFinding}
        onClose={() => setOpenFinding(null)}
        onTakeAction={f => {
          setOpenFinding(null)
          setActionFinding(f)
        }}
      />

      {actionFinding && <TakeActionModal onClose={() => setActionFinding(null)} />}
    </div>
  )
}

export default Findings
