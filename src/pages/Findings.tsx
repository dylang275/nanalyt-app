import { useState, type ReactNode } from 'react'

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
    headline: "Buyers are shifting from 'fall asleep fast' to 'next-day calm' — 3 category winners running this for 30+ days. ZzzPlex Sleep Support doesn't address it.",
    sources: [
      { platform: 'Amazon', metric: '63 review phrases' },
      { platform: 'Reddit', metric: '29 threads' },
      { platform: 'YouTube', metric: '11 review videos' },
      { platform: 'Meta', metric: '3 of 14 ads use this framing' },
    ],
    action: "Update ZzzPlex Sleep Support's PDP and creative to address the 'next-day calm' positioning before more category winners arrive.",
    why: "Organic search queries for 'next-day calm' have increased 3.2× over 30 days. Reddit threads in r/sleep and r/insomnia show a clear shift in how buyers describe what they want — not falling asleep faster, but waking up without grogginess. ZzzPlex's 2 active ads don't use this framing.",
    steps: [
      { label: 'Update narrative map', cta: 'Open narrative map' },
      { label: 'Generate static creative with next-day calm angle', cta: 'Generate creative' },
      { label: 'Set reminder to review performance in 7 days', cta: 'Set reminder' },
    ],
    linkedProduct: 'ZzzPlex Sleep Support',
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
    headline: 'Magnesium glycinate complex is gaining traction — DreamWell and SleepBlend Co. both launched in the last 17 days, early creative is scaling, and the category is still defensible.',
    sources: [
      { platform: 'Meta Ad Library', metric: '3 new advertisers in 17d' },
      { platform: 'Shopify', metric: '38 review count growth in 14d' },
      { platform: 'TikTok', metric: 'Comment sentiment trending high' },
    ],
    action: 'Open the product brief, compare positioning against your current SKUs, and queue a sourcing + creative review.',
    why: "DreamWell and SleepBlend Co. both launched magnesium glycinate complex within 17 days of each other, running UGC creative focusing on the sleep-anxiety connection. DreamWell's top ad has 2.1k comments in 9 days.",
    steps: [
      { label: 'Review product brief and positioning', cta: 'Open product brief' },
      { label: 'Compare against your current sleep SKUs', cta: 'Open Active Products' },
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

const cdnIcon = (slug: string, color: string) => (
  <img
    src={`https://cdn.simpleicons.org/${slug}/${color}`}
    width="14"
    height="14"
    alt=""
    className="block shrink-0"
  />
)

const GoogleG = (
  <svg width="14" height="14" viewBox="0 0 24 24" className="block shrink-0">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58v2.99h3.85c2.25-2.08 3.56-5.14 3.56-8.81z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.85-2.99c-1.07.72-2.44 1.15-4.09 1.15-3.13 0-5.78-2.11-6.72-4.96H1.31v3.09C3.3 21.3 7.34 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.29c-.24-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.31C.48 8.27 0 10.09 0 12c0 1.91.48 3.73 1.31 5.38l3.97-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.3 2.7 1.31 6.62l3.97 3.09c.94-2.85 3.59-4.96 6.72-4.96z" />
  </svg>
)

const MetaIcon = cdnIcon('meta', '0866FF')
const TikTokIcon = cdnIcon('tiktok', '000000')

const AmazonIcon = (
  <img
    src="https://api.iconify.design/fa6-brands:amazon.svg?color=%23232F3E"
    width="14"
    height="14"
    alt=""
    className="block shrink-0"
  />
)

const PLATFORM_LOGOS: Record<string, ReactNode> = {
  Amazon: AmazonIcon,
  Reddit: cdnIcon('reddit', 'FF4500'),
  YouTube: cdnIcon('youtube', 'FF0000'),
  Meta: MetaIcon,
  'Meta Ads': MetaIcon,
  'Meta Ad Library': MetaIcon,
  TikTok: TikTokIcon,
  'TikTok Creative': TikTokIcon,
  'Google Trends': GoogleG,
  Shopify: cdnIcon('shopify', '96BF48'),
  'Your PDP': (
    <svg width="14" height="14" viewBox="0 0 14 14" className="block shrink-0">
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
        <span className="text-[11px] text-ink whitespace-nowrap">{finding.time}</span>
        <span className="text-[11px] text-ink whitespace-nowrap">{finding.confidence} confidence</span>
        <span
          className={`text-[13px] font-medium whitespace-nowrap ml-auto ${
            finding.impact.kind === 'risk' ? 'text-danger' : 'text-ink'
          }`}
        >
          {finding.impact.kind === 'risk' ? '⚠ ' : '↑ '}
          {finding.impact.label}
        </span>
        <span onClick={e => e.stopPropagation()} className="text-ink cursor-pointer flex">
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

      <div className="px-4 pb-2.5 text-[12px] text-ink leading-[1.5]">{finding.action}</div>

      <div className="px-4 pb-3 flex gap-1.5 flex-wrap items-center">
        {finding.sources.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-surf-2 border border-line rounded-[20px] pl-[7px] pr-2.5 py-[3px] shrink-0"
          >
            <PlatformLogo platform={s.platform} />
            <span className="text-[11px] font-semibold text-ink whitespace-nowrap">{s.platform}</span>
            <span className="text-[11px] text-ink ml-0.5 whitespace-nowrap">{s.metric}</span>
          </div>
        ))}
      </div>

      <div
        onClick={e => e.stopPropagation()}
        className="flex items-center justify-between gap-1.5 px-4 pt-2 pb-3"
      >
        <div>
          {finding.related > 0 && (
            <button className="text-[12px] font-medium text-ink bg-surf border border-line rounded-md px-[13px] py-[5px] cursor-pointer whitespace-nowrap transition-colors hover:bg-ink hover:text-white hover:border-ink">
              {finding.related} related signals →
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button className="text-[12px] text-ink bg-surf border border-line rounded-md px-[13px] py-[5px] cursor-pointer whitespace-nowrap hover:bg-line-soft">
            Dismiss
          </button>
          <button
            onClick={() => onOpen(finding)}
            className="text-[12px] text-ink bg-surf border border-line rounded-md px-[13px] py-[5px] cursor-pointer whitespace-nowrap hover:bg-line-soft"
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

const cardCls = 'bg-surf rounded-lg shadow-lift'

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
    { n: '01', title: 'Generate PDP variant', sub: 'Update ZzzPlex Sleep PDP to address next-day calm angle', btn: 'Generate PDP →' },
    { n: '02', title: 'Generate creative', sub: 'Static image ad · angle and buyer language pre-populated', btn: 'Generate →' },
  ]

  return (
    <div className="text-ink">
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="text-[10px] font-bold tracking-[0.09em] uppercase bg-brand-bg text-brand px-2 py-[2px] rounded">New Angle</span>
          <span className="text-[11px] text-ink">3h ago · High confidence · 4 sources</span>
          <span className="ml-auto text-[11px] font-semibold text-ink whitespace-nowrap">↑ Angle opportunity</span>
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
          <div className="text-[12px] text-ink">Across r/sleep, r/insomnia, Amazon, and YouTube</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {supporting.map((s, i) => (
            <div key={i} className={`${cardCls} px-3 py-[11px]`}>
              <div className="text-[18px] font-medium text-ink font-mono tracking-[-0.03em] leading-none mb-1">{s.num}</div>
              <div className="text-[11px] font-medium text-ink mb-[2px]">{s.label}</div>
              <div className="text-[10px] text-ink leading-[1.3]">{s.sub}</div>
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
                  <span className="text-[11px] text-ink ml-1.5">{e.unit}</span>
                </div>
                <div className="text-[11px] text-ink">{e.detail}</div>
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
                <div className="text-[10px] text-ink">{m.sub}</div>
              </div>
            ))}
          </div>
          <div className="px-3.5 pt-3 pb-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-ink">Buyer attention trend — last 90 days</span>
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
                <span className="text-[9px] text-ink font-mono">Feb 5</span>
                <span className="text-[9px] text-ink font-mono">Mar 5</span>
                <span className="text-[9px] text-ink font-mono">Apr 5</span>
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
              <img src="/uploads/IMG_3474.jpg" alt="" className="w-8 h-8 rounded-[7px] object-cover shrink-0 border border-line" />
              <span className="text-[13px] font-medium text-ink">ZzzPlex Sleep Support</span>
            </div>
            <span className="text-[11px] text-brand cursor-pointer font-medium">Open product →</span>
          </div>
          <div className="px-3.5 py-3 flex flex-col gap-[7px]">
            <div className="flex items-baseline gap-2">
              <span className="text-[12px] text-ink min-w-[90px] shrink-0">Active ads</span>
              <span className="text-[12px] text-ink">2 running</span>
              <span className="text-[12px] text-ink">· none use this angle</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[12px] text-ink min-w-[90px] shrink-0">PDP</span>
              <span className="text-[12px] text-ink">Not addressed — "fast-acting" ×2, "morning" ×0</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[12px] text-ink min-w-[90px] shrink-0">Last creative</span>
              <span className="text-[12px] text-ink">18 days ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-[11px] font-medium text-ink mb-2.5">Recommended actions</div>
        <div className={cardCls}>
          {actions.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-3.5 py-3 ${i === 0 ? 'border-b border-line-soft' : ''}`}>
              <span className="text-[10px] text-ink font-mono min-w-[18px]">{a.n}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-ink mb-[2px]">{a.title}</div>
                <div className="text-[11px] text-ink">{a.sub}</div>
              </div>
              <button className="text-[11px] text-ink bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:bg-brand hover:text-white hover:border-brand">
                {a.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] font-medium text-ink mb-2.5">Go deeper</div>
        <div className="flex flex-col gap-2.5">
          <button className={`group ${cardCls} w-full flex items-center justify-between px-3.5 py-[11px] text-[12px] font-medium text-ink cursor-pointer text-left transition-colors hover:bg-ink hover:text-white`}>
            <span>Run full intelligence pass on ZzzPlex Sleep Support</span>
            <span className="text-ink ml-3 shrink-0 group-hover:text-white">→</span>
          </button>
          <button className={`group ${cardCls} w-full flex items-center justify-between px-3.5 py-[11px] text-[12px] text-ink cursor-pointer text-left transition-colors hover:bg-ink hover:text-white`}>
            <span>Ask Nanalyt about this finding</span>
            <span className="text-ink ml-3 shrink-0 group-hover:text-white">→</span>
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
          <span className="text-[11px] text-ink">Yesterday · Medium confidence · 3 sources</span>
          <span className="ml-auto text-[11px] font-semibold text-[#0369a1] bg-[#e0f2fe] border border-[#7dd3fc] px-[9px] py-[3px] rounded-[5px] whitespace-nowrap">↑ Whitespace opportunity</span>
        </div>
        <div className="flex items-start gap-3.5">
          <p className="text-[15px] font-medium leading-[1.55] tracking-[-0.01em] text-ink m-0 flex-1">
            Magnesium glycinate complex is gaining traction — DreamWell and SleepBlend Co. both launched in the last 17 days, early creative is scaling, and the category is still defensible.
          </p>
          <div className="shrink-0 text-center">
            <img src="/uploads/IMG_3472.jpg" alt="" className="w-[72px] h-[72px] rounded-lg object-cover border border-line block" />
            <div className="text-[9px] text-ink mt-1">Representative</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-line mb-5" />

      <div className="mb-5">
        <SubLabel label="Signal facts" />
        <div className={`${cardCls} px-4 py-3.5 mb-2`}>
          <div className="text-[34px] font-medium text-ink font-mono tracking-[-0.04em] leading-none mb-1.5">4.1×</div>
          <div className="text-[13px] font-medium text-ink mb-[3px]">Buyer attention growth in 60 days</div>
          <div className="text-[12px] text-ink">Search volume for "magnesium glycinate complex" · TikTok sentiment trending positive</div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-2">
          {stats.map((s, i) => (
            <div key={i} className={`${cardCls} px-3 py-[11px]`}>
              <div className="text-[18px] font-medium text-ink font-mono tracking-[-0.03em] leading-none mb-1">{s.num}</div>
              <div className="text-[11px] font-medium text-ink mb-[2px]">{s.label}</div>
              <div className="text-[10px] text-ink leading-[1.3]">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className={`${cardCls} px-3.5 py-2.5 flex items-baseline gap-2`}>
          <span className="text-base font-semibold text-ink font-mono whitespace-nowrap">~45 days</span>
          <span className="text-[12px] text-ink">into competitive cycle — early wave, category still defensible</span>
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
                  <span className="text-[11px] text-ink ml-1.5">{e.unit}</span>
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
                <span className="text-[11px] text-ink ml-2">{r.fact}</span>
              </div>
              <span className="text-[11px] font-medium text-ink whitespace-nowrap">{r.verdict}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <SubLabel label="Opportunity context" />
        <div className="flex flex-col gap-2.5">
          <div className={`${cardCls} px-3.5 py-3`}>
            <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-ink mb-2.5">Bundle potential</div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <img src="/uploads/IMG_3472.jpg" alt="" className="w-12 h-12 rounded-[7px] object-cover border border-line shrink-0" />
              <span className="text-base text-ink font-light">+</span>
              <img src="/uploads/IMG_3474.jpg" alt="" className="w-12 h-12 rounded-[7px] object-cover border border-line shrink-0" />
              <span className="text-base text-ink font-light">→</span>
              <div className="ml-auto text-right">
                <div className="text-[10px] text-ink mb-[2px]">Estimated AOV</div>
                <div className="text-base font-medium text-ink font-mono">
                  <span className="text-ink line-through text-[13px]">$40</span>{' '}
                  <span className="text-brand">$65</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-ink">
              Pairs with <span className="text-brand cursor-pointer font-medium">ZzzPlex Sleep Support</span> — same buyer segment, complementary use case.
            </div>
          </div>
          <div className={`${cardCls} px-3.5 py-3`}>
            <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-ink mb-1.5">Supplier overlap</div>
            <div className="text-[12px] text-ink">Same supplier category as 3 of your active SKUs — sourcing friction likely low.</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <SubLabel label="Recommended actions" />
        <div className={cardCls}>
          {actions.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-3.5 py-3 ${i === 0 ? 'border-b border-line-soft' : ''}`}>
              <span className="text-[10px] text-ink font-mono min-w-[18px]">{a.n}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-ink mb-[2px]">{a.title}</div>
                <div className="text-[11px] text-ink">{a.sub}</div>
              </div>
              <button className="text-[11px] text-ink bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:bg-brand hover:text-white hover:border-brand">
                {a.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SubLabel label="Go deeper" />
        <div className="flex flex-col gap-2.5">
          <button className={`group ${cardCls} w-full flex items-center justify-between px-3.5 py-[11px] text-[12px] font-medium text-ink cursor-pointer text-left transition-colors hover:bg-ink hover:text-white`}>
            <span>Run full intelligence pass on magnesium glycinate complex</span>
            <span className="text-ink ml-3 shrink-0 group-hover:text-white">→</span>
          </button>
          <button className={`group ${cardCls} w-full flex items-center justify-between px-3.5 py-[11px] text-[12px] text-ink cursor-pointer text-left transition-colors hover:bg-ink hover:text-white`}>
            <span>Ask Nanalyt about this finding</span>
            <span className="text-ink ml-3 shrink-0 group-hover:text-white">→</span>
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
        className={`fixed top-0 right-0 bottom-0 z-[201] w-1/2 min-w-[540px] max-w-[760px] bg-canvas border-l border-line flex flex-col shadow-drawer transition-transform duration-200 ease-out font-sans ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {isRich ? (
          <>
            <div className="h-11 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                <span className="text-[12px] text-ink shrink-0">Findings</span>
                <span className="text-[12px] text-ink shrink-0">›</span>
                <span className="text-[12px] text-ink font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {isNewAngle ? 'New angle · Next-day calm' : 'New product · Magnesium Glycinate Complex'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="bg-transparent border-0 text-ink flex p-1 cursor-pointer text-sm hover:text-ink"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pt-6 pb-4">
              {isNewAngle ? <NewAngleDetail /> : <NewProductDetail />}
            </div>
            <div className="px-5 py-3 flex gap-2 items-center shrink-0">
              <button className="bg-transparent text-ink border border-line px-3 py-[5px] rounded-md text-[11px] cursor-pointer whitespace-nowrap hover:bg-line-soft">
                Remind me in 7 days
              </button>
              <div className="ml-auto flex gap-2">
                <button className="bg-transparent text-ink border border-line px-3 py-[5px] rounded-md text-[11px] cursor-pointer hover:bg-line-soft">
                  Dismiss
                </button>
                <button className="bg-transparent text-ink border border-line px-3 py-[5px] rounded-md text-[11px] cursor-pointer hover:bg-line-soft">
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
            <div className="px-5 py-4 flex items-start justify-between gap-3 shrink-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <TypeBadge type={f.type} />
                  {f.severity === 'Time-sensitive' && (
                    <span className="text-[9px] font-semibold text-warn bg-warn-bg px-[7px] py-[2px] rounded">
                      Time-sensitive
                    </span>
                  )}
                  <span className="text-[10px] text-ink font-mono ml-auto">{f.time}</span>
                </div>
                <div className="text-[15px] font-medium text-ink leading-[1.5]">
                  <BoldHeadline text={f.headline} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-transparent border-0 text-ink flex p-1 cursor-pointer shrink-0 hover:text-ink"
                aria-label="Close"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l9 9M11 2l-9 9" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-6">
                <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-ink mb-2.5">
                  Why this surfaced
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {f.sources.map((s, i) => (
                    <div key={i} className="bg-surf rounded-lg shadow-lift px-3 py-2.5">
                      <div className="text-[11px] font-medium text-ink mb-[3px]">{s.platform}</div>
                      <div className="text-[11px] text-ink">{s.metric}</div>
                      <span className="text-[10px] text-brand cursor-pointer inline-flex items-center gap-[3px] mt-1.5">
                        View source
                        <ArrowR />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[12px] text-ink leading-[1.6] bg-surf rounded-lg shadow-lift px-3.5 py-3">
                  {f.why}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-ink mb-2.5">
                  What the agent recommends
                </div>
                <div className="flex flex-col gap-2.5">
                  {f.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-surf rounded-lg shadow-lift px-3 py-2.5">
                      <span className="w-5 h-5 bg-canvas border border-line rounded-full flex items-center justify-center text-[10px] font-medium text-ink font-mono shrink-0">
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
                  <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-ink mb-2.5">
                    Linked context
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {f.linkedProduct && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-surf rounded-lg shadow-lift cursor-pointer hover:bg-black/[0.025]">
                        <span className="text-[11px] text-ink">Product</span>
                        <span className="text-[12px] font-medium text-ink">{f.linkedProduct}</span>
                        <span className="ml-auto text-brand flex">→</span>
                      </div>
                    )}
                    {f.linkedCompetitors.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-surf rounded-lg shadow-lift cursor-pointer hover:bg-black/[0.025]">
                        <span className="text-[11px] text-ink">Competitors</span>
                        <span className="text-[12px] font-medium text-ink">{f.linkedCompetitors.join(', ')}</span>
                        <span className="ml-auto text-brand flex">→</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 flex gap-2 items-center shrink-0">
              <button
                onClick={() => onTakeAction(f)}
                className="bg-brand text-white border-0 rounded-md px-3.5 py-1.5 text-[12px] font-medium cursor-pointer hover:opacity-90"
              >
                Take action
              </button>
              <button className="bg-surf text-ink border border-line rounded-md px-3.5 py-1.5 text-[12px] cursor-pointer hover:bg-line-soft">
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

// ─── Confirmation Modal (scope before generation) ───────────────────────────

type AssetFormat = 'PDP' | 'UGC' | 'VIDEO' | 'STATIC'

type Asset = {
  id: string
  format: AssetFormat
  title: string
  badge?: 'HERO-LED' | 'RECOMMENDED'
  desc: string
}

const CONFIRM_ASSETS: Asset[] = [
  {
    id: 'pdp',
    format: 'PDP',
    title: 'Product page',
    badge: 'HERO-LED',
    desc: 'Full product page with Sleep-Anxiety Crossover positioning, headline, sub-headline, ingredient breakdown, and Subscribe & Save block · 1 variant',
  },
  {
    id: 'ugc1',
    format: 'UGC',
    title: 'UGC creative variant 1',
    badge: 'RECOMMENDED',
    desc: '9:16 vertical · Talking head with text overlays · "Couldn\'t shut my brain off" hook · 15 seconds',
  },
  {
    id: 'video',
    format: 'VIDEO',
    title: 'Animated video creative',
    desc: '15s · Animated explainer with product · "Tried everything for sleep" hook · 9:16 vertical',
  },
  {
    id: 'static',
    format: 'STATIC',
    title: 'Static image creative',
    desc: '1:1 square · Designed image · Lifestyle composition with product and headline',
  },
  {
    id: 'ugc2',
    format: 'UGC',
    title: 'UGC creative variant 2',
    desc: '9:16 vertical · Talking head · Alternative hook for A/B testing · 15 seconds',
  },
]

const FORMAT_COLOR: Record<AssetFormat, { bg: string; text: string }> = {
  PDP: { bg: '#e4ede7', text: '#2d5c3a' },
  UGC: { bg: '#dbeafe', text: '#1e40af' },
  VIDEO: { bg: '#dbeafe', text: '#1e40af' },
  STATIC: { bg: '#dbeafe', text: '#1e40af' },
}

function ConfirmGenerateModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(CONFIRM_ASSETS.map(a => [a.id, true])),
  )
  const selectedCount = Object.values(checked).filter(Boolean).length
  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  const selectAll = () => setChecked(Object.fromEntries(CONFIRM_ASSETS.map(a => [a.id, true])))
  const deselectAll = () => setChecked(Object.fromEntries(CONFIRM_ASSETS.map(a => [a.id, false])))

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[300] flex items-center justify-center font-sans"
      style={{ background: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div
        className="bg-surf rounded-xl w-[580px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] overflow-y-auto shadow-[0_12px_48px_rgba(0,0,0,0.2)]"
        style={{ padding: '28px 24px' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[11px] font-medium uppercase text-ink mb-1" style={{ letterSpacing: '0.05em' }}>
              GENERATE ASSETS
            </div>
            <div className="text-[18px] font-medium text-ink leading-tight">Launch Magnesium Glycinate Complex</div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-0 text-ink cursor-pointer flex p-1 hover:opacity-70"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3l12 12M15 3l-12 12" />
            </svg>
          </button>
        </div>

        {/* Context paragraph */}
        <p className="text-[12px] text-ink leading-[1.5] mb-5">
          We'll generate a product page and a creative package targeting the winning angle from your finding. Review and adjust before we start.
        </p>

        {/* Winning angle callout */}
        <div
          className="rounded-lg mb-[22px]"
          style={{ background: '#e4ede7', border: '0.5px solid #2d5c3a', padding: '12px 14px' }}
        >
          <div className="text-[11px] font-medium uppercase text-ink mb-1" style={{ letterSpacing: '0.04em' }}>
            WINNING ANGLE
          </div>
          <div className="text-[13px] font-medium text-ink mb-1">Sleep-Anxiety Crossover</div>
          <div className="text-[11px] text-ink">Validated by 3 competitors · Avg 18d longevity · 28% of category spend</div>
        </div>

        {/* Assets header */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[12px] font-medium uppercase text-ink" style={{ letterSpacing: '0.04em' }}>
            ASSETS TO GENERATE · {CONFIRM_ASSETS.length}
          </span>
          <div className="flex items-center gap-2 text-[11px] font-medium text-ink">
            <span onClick={selectAll} className="cursor-pointer hover:opacity-70">Select all</span>
            <span>·</span>
            <span onClick={deselectAll} className="cursor-pointer hover:opacity-70">Deselect all</span>
          </div>
        </div>

        {/* Asset rows */}
        <div className="flex flex-col gap-1.5 mb-[22px]">
          {CONFIRM_ASSETS.map(a => {
            const fc = FORMAT_COLOR[a.format]
            return (
              <div
                key={a.id}
                onClick={() => toggle(a.id)}
                className="flex items-start gap-3 bg-white border-[0.5px] border-[#E5E7EB] rounded-lg cursor-pointer hover:border-[#d1d5db]"
                style={{ padding: '12px 14px' }}
              >
                <input
                  type="checkbox"
                  checked={!!checked[a.id]}
                  onChange={() => toggle(a.id)}
                  onClick={e => e.stopPropagation()}
                  className="w-4 h-4 mt-1 shrink-0 cursor-pointer"
                  style={{ accentColor: '#2d5c3a' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-[9px] font-medium uppercase rounded-[4px]"
                      style={{ background: fc.bg, color: fc.text, padding: '2px 8px', letterSpacing: '0.04em' }}
                    >
                      {a.format}
                    </span>
                    <span className="text-[13px] font-medium text-ink">{a.title}</span>
                    {a.badge && (
                      <span
                        className="text-[9px] font-medium uppercase rounded-[8px]"
                        style={{ background: '#e4ede7', color: '#2d5c3a', padding: '1px 7px', letterSpacing: '0.03em' }}
                      >
                        {a.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-ink leading-[1.5]">{a.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t-[0.5px] border-[#F0F1F3]">
          <div className="text-[11px] text-ink">
            Estimated <span className="font-medium">3 minutes</span> · You can navigate while we work
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-white text-ink border-[0.5px] border-[#D1D5DB] rounded-md cursor-pointer text-[12px] hover:bg-[#fafafa]"
              style={{ padding: '7px 14px' }}
            >
              Cancel
            </button>
            <button
              onClick={() => selectedCount > 0 && onGenerate()}
              disabled={selectedCount === 0}
              className={`text-white border-0 rounded-md text-[12px] font-medium ${
                selectedCount === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-90'
              }`}
              style={{ background: '#2d5c3a', padding: '7px 14px' }}
            >
              Generate {selectedCount} {selectedCount === 1 ? 'asset' : 'assets'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Take Action Modal ───────────────────────────────────────────────────────

function TakeActionModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[300] bg-black/35 flex items-center justify-center font-sans"
    >
      <div className="bg-surf border border-line rounded-xl px-8 pt-8 pb-9 w-[420px] max-w-[calc(100vw-48px)] relative shadow-[0_8px_48px_rgba(0,0,0,0.14)]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-transparent border-0 text-ink p-1 cursor-pointer flex hover:opacity-70"
          aria-label="Close"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 2l9 9M11 2l-9 9" />
          </svg>
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" className="animate-spin">
              <circle cx="14" cy="14" r="11" fill="none" stroke="#e4ede7" strokeWidth="2.5" />
              <path d="M14 3A11 11 0 0 1 25 14" fill="none" stroke="#2d5c3a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[15px] font-medium text-ink mb-1.5">Generating assets in the background</div>
          <div className="text-[12px] text-ink">Will notify you when complete</div>
          <div className="text-[11px] text-ink mt-2.5">Estimated 3 minutes</div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

function Findings() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [openFinding, setOpenFinding] = useState<Finding | null>(null)
  const [confirmFinding, setConfirmFinding] = useState<Finding | null>(null)
  const [actionFinding, setActionFinding] = useState<Finding | null>(null)

  const startAction = (f: Finding) => {
    if (f.type === 'NEW PRODUCT') setConfirmFinding(f)
    else setActionFinding(f)
  }

  const filtered =
    activeFilter === 'All' ? FINDINGS : FINDINGS.filter(f => f.type === TYPE_MAP[activeFilter])

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="px-6 pt-5 shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[20px] font-medium text-ink tracking-[-0.025em]">Findings</div>
            <div className="text-[12px] text-ink mt-[3px]">Surfaced by the agent over the last 7 days</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-ink font-mono">12 new · 47 total</span>
            <button className="flex items-center gap-1.5 bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer hover:bg-line-soft">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
                <path d="M2 3h7M3 5.5h5M4 8h3" />
              </svg>
              <span className="text-[11px] text-ink">Most recent</span>
            </button>
            <button className="flex items-center gap-1.5 bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer hover:bg-line-soft">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
                <path d="M5.5 1v6m0 0L3.5 5m2 2L7.5 5M2 9.5h7" />
              </svg>
              <span className="text-[11px] text-ink">Export</span>
            </button>
            <button className="flex items-center gap-1.5 bg-surf border border-line rounded-md px-2.5 py-[5px] cursor-pointer hover:bg-line-soft">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
                <path d="M1.5 2.5h8M3 5.5h5M4.5 8.5h2" />
              </svg>
              <span className="text-[11px] text-ink">All products</span>
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
                    : 'bg-surf text-ink border-line font-normal hover:bg-line-soft'
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
          <div className="text-center py-12 text-ink">No findings of this type in the last 7 days.</div>
        ) : (
          filtered.map(f => (
            <FindingCard
              key={f.id}
              finding={f}
              onOpen={setOpenFinding}
              onTakeAction={startAction}
            />
          ))
        )}
      </div>

      <DetailDrawer
        finding={openFinding}
        onClose={() => setOpenFinding(null)}
        onTakeAction={f => {
          setOpenFinding(null)
          startAction(f)
        }}
      />

      {confirmFinding && (
        <ConfirmGenerateModal
          onClose={() => setConfirmFinding(null)}
          onGenerate={() => {
            const f = confirmFinding
            setConfirmFinding(null)
            setActionFinding(f)
          }}
        />
      )}
      {actionFinding && <TakeActionModal onClose={() => setActionFinding(null)} />}
    </div>
  )
}

export default Findings
