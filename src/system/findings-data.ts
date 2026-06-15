// findings-data.ts — the six findings, shared by the Findings queue + Finding Detail.
// Ported from design_handoff_nanalyt/source/findings-data.js. Image paths rooted at /uploads.

export type FindingType = 'New angle' | 'Campaign alert' | 'Hidden winner' | 'Coverage gap' | 'New product' | 'Macro shift'

export type Finding = {
  id: number; type: FindingType; time: string; conf: string; urgency: string; risk: boolean
  impact: string; related: number; cta: string; rich?: boolean
  generate?: boolean; impactRank?: number; product2?: string; angle?: string; angleMeta?: string
  headline: string; bold?: string[]; action: string
  sources: string[][]
  // facts: [label, value, sub, tone|null, spark]
  facts?: [string, string, string, ('pos' | 'neg' | null), number[]][]
  coverage?: { hero: string; delta: string; strip: [string, string, string, boolean][]; dates: string[]; title?: string; sub?: string }
  // steps: non-rich [text, cta, primary]; rich [text, sub, cta, primary]
  steps: (string | boolean)[][]
  product: { name: string; img: string; state: [string, string][] } | null
  competitors: string[]
}

export const NANALYT_FINDINGS: Finding[] = [
  { id: 0, type: 'Campaign alert', time: '2d ago', conf: 'High', urgency: 'Act today', risk: true,
    impact: '~$8k/mo at risk', related: 0, cta: 'Fix creative',
    headline: 'CPA on ZzzPlex Sleep Support has spiked 34% over the last 72 hours — creative fatigue likely.',
    action: 'Pause the fatiguing creative, generate 2–3 fresh variants, and restart the ad set within 48 hours.',
    sources: [
      ['Meta Ads', 'CPA $38.20 · was $28.50', 'frequency 4.2 · threshold hit'],
      ['Meta Ads', 'frequency 4.2', 'UGC variant · 23 days running'],
      ['TikTok', 'CTR 1.9%', 'down 43% over 5 days'],
    ],
    steps: [
      ['Pause fatiguing UGC creative', 'Open campaign', true],
      ['Generate 2–3 fresh UGC variants', 'Generate creatives', false],
      ['Restart ad set with new creative', 'Open campaign', false],
    ],
    product: { name: 'ZzzPlex Sleep Support', img: '/uploads/IMG_3474.jpg',
      state: [['Active ads', '2 running · 1 fatiguing'], ['Top ad frequency', '4.2 · threshold is 4.0'], ['Last creative', '23 days ago']] },
    competitors: [] },

  { id: 1, type: 'New angle', time: '3h ago', conf: 'High', urgency: 'Act within 7 days', risk: false,
    impact: '~$3–5k/mo opportunity', related: 3, cta: 'Generate creative', rich: true, impactRank: 70,
    headline: 'Buyer language is shifting toward "next-day calm" instead of "fall asleep fast" across reviews and Reddit.',
    bold: ['"next-day calm"', '"fall asleep fast"'],
    action: 'Update the narrative map and create a static image around the next-day calm positioning.',
    sources: [
      ['Amazon', '63', 'review phrases', 'grogginess & next-morning feel'],
      ['Reddit', '29', 'threads', 'r/sleep · 3.4× volume in 30d'],
      ['YouTube', '11 of 17', 'review videos', '"next-day" framing unprompted'],
      ['Meta Ad Library', '3 of 14', 'your active ads', 'all 3 running 20+ days'],
    ],
    facts: [
      ['Buyer attention growth', '3.2×', '30 days · Reddit, Amazon, YouTube', 'pos', [12, 14, 16, 19, 25, 32, 41]],
      ['Category winners run it', '3', 'DreamWell, Beam, Pure Enc.', null, [1, 1, 2, 2, 3, 3, 3]],
      ['Their median longevity', '30d+', 'ads using this framing', 'pos', [12, 16, 18, 22, 26, 28, 31]],
      ['Your coverage', '3 of 14', 'active ads use this framing', 'neg', [3, 3, 3, 3, 3, 3, 3]],
    ],
    coverage: { hero: '64%', delta: '↑ 3.2× over the window',
      strip: [['Buyer attention', '64%', 'of category conversation', false], ['Category ads', '21%', 'of ads use this angle', false], ['Your coverage', '0%', '0 of 6 active ads', true]],
      dates: ['Mar 11', 'Apr 1', 'Apr 22', 'May 13', 'Jun 9'] },
    steps: [
      ['Generate creative', 'Static image · next-day calm angle and buyer language pre-populated', 'Generate creative →', true],
      ['Generate PDP variant', 'Update the Magnesium Glycinate PDP to address the next-day calm angle', 'Generate PDP →', false],
      ['Review performance in 7 days', 'Reminder set against this finding · auto-includes the new creative', 'Set reminder', false],
    ],
    product: { name: 'Magnesium Glycinate Complex', img: '/uploads/IMG_3472.jpg',
      state: [['Active ads', '6 running · none use this angle'], ['PDP', 'not addressed — "fast-acting" ×4 · "morning" ×0'], ['Last creative', '23 days ago']] },
    competitors: ['DreamWell', 'Beam'] },

  { id: 2, type: 'Hidden winner', time: '2d ago', conf: 'High', urgency: 'Act within 30 days', risk: false,
    impact: '~$6–10k/mo upside', related: 2, cta: 'Open research', impactRank: 90,
    headline: 'Magnesium L-Threonate is under-advertised relative to its organic demand — high intent, low competition.',
    action: 'Evaluate adding a Mag L-Threonate SKU — the category is under-served with a strong intent signal.',
    sources: [
      ['Google Trends', '3.2× YoY', 'query growth for "magnesium l-threonate"'],
      ['Amazon', '8%', 'sponsored density · unusually low'],
      ['Reddit', '84', 'organic mentions · not brand-driven'],
    ],
    steps: [
      ['Run product research on Mag L-Threonate', 'Open Research', true],
      ['Check sourcing availability — Alibaba + US suppliers', 'View sourcing', false],
      ['Add to suggested products for evaluation', 'Add to pipeline', false],
    ],
    product: null, competitors: [] },

  { id: 3, type: 'Macro shift', time: '3d ago', conf: 'Medium', urgency: 'Window closing · 2–3 weeks', risk: true,
    impact: 'First-mover window closing', related: 4, cta: 'Open competitors', impactRank: 50,
    headline: '3 of your tracked competitors launched sleep-anxiety crossover creative in the last 14 days.',
    action: 'Evaluate the angle — multi-competitor convergence means the differentiation window is closing.',
    sources: [
      ['Meta Ad Library', '4 new UGC ads', 'DreamWell · last 14 days'],
      ['Meta Ad Library', '2 new statics', 'Beam · last 9 days'],
      ['TikTok Creative', '3 new videos', 'Olly · last 6 days'],
    ],
    steps: [
      ['Review competitor creative examples', 'Open Competitors', true],
      ['Map angle against your current narrative map', 'Open narrative map', false],
      ['Decide whether to enter or differentiate', 'Open Studio', false],
    ],
    product: null, competitors: ['DreamWell', 'Beam', 'Olly'] },

  { id: 4, type: 'Coverage gap', time: '4d ago', conf: 'High', urgency: 'Before next PDP audit', risk: false,
    impact: 'Conversion lift est. 8–12%', related: 1, cta: 'Generate PDP', impactRank: 60,
    headline: 'Your Magnesium Glycinate PDP doesn\'t address the "morning grogginess" objection — the top Amazon review theme.',
    action: 'Add a FAQ section addressing the morning grogginess objection to the PDP.',
    sources: [
      ['Amazon', '47', 'reviews mention morning grogginess'],
      ['Reddit', '34', 'threads mention "groggy"'],
      ['Your PDP', '0', 'mentions of morning grogginess'],
    ],
    steps: [
      ['Generate updated PDP with the objection addressed', 'Generate PDP', true],
      ['Add FAQ section targeting this objection', 'Edit PDP', false],
      ['A/B test new PDP against current', 'Start test', false],
    ],
    product: { name: 'Magnesium Glycinate Complex', img: '/uploads/IMG_3472.jpg',
      state: [['Active ads', '6 running'], ['PDP', 'no grogginess mention anywhere'], ['Top review theme', '47 Amazon reviews · 34 Reddit threads']] },
    competitors: [] },

  { id: 5, type: 'New product', time: 'Yesterday', conf: 'High', urgency: 'Act within 7 days', risk: false,
    impact: '~$6–9k/mo new line', related: 3, cta: 'Take action', rich: true,
    generate: true, impactRank: 100, product2: 'Magnesium + Ashwagandha Gummies',
    angle: 'Sleep-Anxiety Crossover', angleMeta: 'Validated by 3 competitors · Avg 18d longevity · 28% of category spend',
    headline: 'Add magnesium + ashwagandha gummies to your catalog — fits your existing buyer.',
    action: 'Open the product brief, compare positioning against your current SKUs, and queue a sourcing review.',
    sources: [
      ['Meta Ad Library', '3 advertisers', 'new in 17 days', 'DreamWell · SleepBlend Co. +1'],
      ['Amazon', '+3.2×', 'search growth', '"magnesium ashwagandha gummies" · 60d'],
      ['Shopify', '+38', 'review-count growth', 'competitor gummy SKUs · 14d'],
      ['TikTok', '2.1k', 'comments', "DreamWell's top ad · 9 days"],
    ],
    facts: [
      ['Search demand growth', '+4.1×', '60 days · category queries', 'pos', [12, 14, 16, 19, 25, 32, 41]],
      ['Early entrants', '3', 'new advertisers in 17 days', null, [0, 1, 1, 2, 2, 3, 3]],
      ['Buyer overlap', '88%', 'shares your stress-sleep buyer', 'pos', [70, 74, 78, 80, 84, 86, 88]],
      ['Your coverage', '0 SKUs', 'no gummy format yet', 'neg', [0, 0, 0, 0, 0, 0, 0]],
    ],
    coverage: { hero: '+4.1×', delta: '↑ search demand over the window', title: 'Category demand vs your presence', sub: 'search demand for the category · last 90 days',
      strip: [['Category demand', '+4.1×', 'search growth · 60d', false], ['Early entrants', '3', 'advertisers · 17d', false], ['Your coverage', '0', 'SKUs in this format', true]],
      dates: ['Mar 11', 'Apr 1', 'Apr 22', 'May 13', 'Jun 9'] },
    steps: [
      ['Generate the launch package', 'PDP + 4 creatives against the Sleep-Anxiety Crossover angle, pre-filled from this finding', 'Take action →', true],
      ['Run a sourcing check', 'Alibaba + US suppliers for a magnesium + ashwagandha gummy · MOQ, lead time, cost', 'View sourcing', false],
      ['Add to pipeline for validation', 'Queue a validation test against your existing stress-sleep buyer', 'Add to pipeline', false],
    ],
    product: { name: 'Magnesium Glycinate Complex', img: '/uploads/IMG_3472.jpg',
      state: [['Closest SKU', 'Magnesium Glycinate Complex'], ['Overlap', 'same buyer · stress-sleep connection'], ['Their traction', '2.1k comments in 9 days']] },
    competitors: ['DreamWell', 'SleepBlend Co.'] },
]

export const NANALYT_FINDING_TYPES: Record<FindingType, { tone: 'green' | 'yellow' | 'red' | 'blue' }> = {
  'New angle': { tone: 'green' },
  'Campaign alert': { tone: 'yellow' },
  'Hidden winner': { tone: 'green' },
  'Coverage gap': { tone: 'red' },
  'New product': { tone: 'blue' },
  'Macro shift': { tone: 'blue' },
}
