// competitor-data.ts — Olly profile data + per-angle material.
// Ported from design_handoff_nanalyt/source/competitor-profile-blocks.jsx (PF, PF_TONE)
// and competitor-profile-page.jsx (PR_ANGLES). Image paths rooted at /uploads.
import { NT } from './tokens'

export type PfProduct = { img: string; name: string; ads: number; spendPct: string; angles: number; competes: string | null }
export type PfKpi = { l: string; v: string; d: string; spark: number[] }

export const PF = {
  name: 'Olly', cover: '/uploads/Screenshot 2026-05-11 at 10.35.38 PM.png',
  tags: ['Mass market', 'Retail', 'TikTok-first'],
  since: 'Tracked since Mar 2026', last: 'Last move 3h ago',
  kpis: [
    { l: 'Active creatives', v: '31', d: '+7 this month', spark: [24, 26, 27, 29, 30, 31] },
    { l: 'Active products', v: '12', d: '+2 this month', spark: [10, 10, 11, 11, 12, 12] },
    { l: 'Ads run · 30 days', v: '62', d: '+22 vs prior', spark: [40, 46, 52, 56, 60, 62] },
    { l: 'Activity level', v: 'High', d: 'top of your watchlist', spark: [2, 2, 3, 3, 3, 3] },
  ] as PfKpi[],
  products: [
    { img: '/uploads/Screenshot 2026-05-13 at 10.48.22 AM.png', name: 'Goodbye Stress Gummies', ads: 19, spendPct: '42%', angles: 4, competes: 'Magnesium Glycinate Complex' },
    { img: '/uploads/Screenshot 2026-05-13 at 10.48.48 AM.png', name: 'Sleep Gummies', ads: 14, spendPct: '31%', angles: 3, competes: 'ZzzPlex Sleep Support' },
    { img: '/uploads/Screenshot 2026-05-13 at 10.49.59 AM.png', name: 'PMS Care Gummies', ads: 9, spendPct: '16%', angles: 2, competes: null },
    { img: '/uploads/Screenshot 2026-05-13 at 10.50.43 AM.png', name: 'Big 10 Probiotic', ads: 5, spendPct: '7%', angles: 2, competes: null },
    { img: '/uploads/Screenshot 2026-05-13 at 10.51.27 AM.png', name: 'Extra Strength Daily Energy', ads: 4, spendPct: '4%', angles: 1, competes: null },
  ] as PfProduct[],
  synthesis: 'Sleep-anxiety crossover is their play right now — +12 pts in 30 days, though longevity is mediocre (18 days), suggesting they haven\'t found the creative that sticks. You overlap on their weaker angles (Lifestyle, Performance, Price) but miss their growth bet. Their price-value angle is dying — don\'t follow them there.',
}

export const PF_TONE: Record<string, { fg: string; bg: string }> = {
  green: { fg: NT.greenBr, bg: NT.greenBg }, yellow: { fg: NT.yellow, bg: 'rgba(168,116,42,0.13)' },
  blue: { fg: NT.blue, bg: 'rgba(58,110,168,0.11)' }, red: { fg: NT.red, bg: 'rgba(196,80,74,0.11)' },
  mid: { fg: NT.mid, bg: 'var(--dv-page)' },
}

export type PrAngleAd = { img: string; fmt: string; title: string; sub: string; play: boolean }
export type PrAngle = {
  name: string; share: number; lon: string; lonTone: string; trend: string; trendTone: string; miss: boolean
  status: string; tier: string; tierTone: string
  stats: [string, string, string][]
  promise: string; positioning: string; buyer: string
  read: [string, string][]; rec: string
  perf: { text: string; delta: string; tone: string }
  coverage: { text: string; gap: boolean }
  pdp: { label: string; tone: string; note: string }
  brands: [string, string][]
  ads: PrAngleAd[]
}

export const PR_ANGLES: PrAngle[] = [
  { name: 'Sleep-Anxiety Crossover', share: 28, lon: '18d', lonTone: 'yellow', trend: '▲ +12 pts', trendTone: 'green', miss: true,
    status: 'Missing from your ads', tier: 'Recommended to run', tierTone: 'green',
    stats: [['Share of budget', '28%', 'of their creative spend'], ['Avg longevity', '18d', 'median days running'], ['30d momentum', '+12', 'share point change']],
    promise: '“Calm the mind first — the sleep follows.”',
    positioning: 'Magnesium addresses anxiety as the root cause of poor sleep, rather than selling sleep directly. Emotional, problem-first creative.',
    buyer: 'Working professionals 25–45 with high cognitive stress disrupting sleep. Skews female.',
    read: [
      ['Their performance', 'Growing — 18d longevity, 28% of budget, +12 pts in 30 days'],
      ['Your coverage', '0 of your 6 active ads address this angle'],
      ['PDP support', 'Not addressed on your ASHWAGANDHA+ product page'],
      ['Validated by', 'Olly · Beam · Moon Juice — all three run it'],
    ],
    rec: 'This is the gap. Your ASHWAGANDHA+ is built for exactly this story — generate a creative and PDP variant to test it.',
    perf: { text: '18d · 28% of spend', delta: '▲ +12 pts', tone: 'green' },
    coverage: { text: '0 of 6 active ads', gap: true },
    pdp: { label: 'Not addressed', tone: 'yellow', note: 'ASHWAGANDHA+ product page' },
    brands: [['Olly', '#c2531f'], ['Beam', '#23254d'], ['Moon Juice', '#6e4379']],
    ads: [
      { img: '/uploads/IMG_3495.PNG', fmt: 'UGC', title: 'Creator review · anxiety-first hook', sub: 'UGC · 9:16 · 12d running', play: true },
      { img: '/uploads/IMG_3499.PNG', fmt: 'Video', title: 'Ingredient story · calm chemistry', sub: 'Video · 9:16 · 9d running', play: true },
      { img: '/uploads/Screenshot 2026-05-13 at 10.15.26 PM.png', fmt: 'Static', title: 'Product lifestyle · evening ritual', sub: 'Static · 1:1 · 18d running', play: false },
    ] },
  { name: 'Lifestyle & Wellness', share: 26, lon: '14d', lonTone: 'yellow', trend: '▲ +3 pts', trendTone: 'green', miss: false,
    status: 'You also run this', tier: 'Already running well', tierTone: 'green',
    stats: [['Share of budget', '26%', 'of their creative spend'], ['Avg longevity', '14d', 'median days running'], ['30d momentum', '+3', 'share point change']],
    promise: '“A small ritual for a better life.”',
    positioning: 'Soft lifestyle storytelling — wellness rituals, morning routines, aspirational imagery rather than specific claims.',
    buyer: 'Wellness-curious adults 25–45 building daily routines. Heavy TikTok discovery.',
    read: [
      ['Their performance', 'Stable — 14d longevity, 26% of budget, +3 pts in 30 days'],
      ['Your coverage', '3 of your 6 active ads address this angle'],
      ['PDP support', 'Addressed on Magnesium Glycinate Complex'],
      ['Validated by', 'Olly · Beam · Moon Juice'],
    ],
    rec: 'Your coverage is adequate — no immediate action needed. Watch their UGC volume here.',
    perf: { text: '14d · 26% of spend', delta: '▲ +3 pts', tone: 'green' },
    coverage: { text: '3 of 6 active ads', gap: false },
    pdp: { label: 'Addressed', tone: 'green', note: 'Magnesium Glycinate Complex' },
    brands: [['Olly', '#c2531f'], ['Beam', '#23254d'], ['Moon Juice', '#6e4379']],
    ads: [
      { img: '/uploads/IMG_3486.jpg', fmt: 'UGC', title: 'Creator review · morning routine', sub: 'UGC · 9:16 · 15d running', play: true },
      { img: '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png', fmt: 'Static', title: 'Flat-lay · daily ritual set', sub: 'Static · 1:1 · 22d running', play: false },
      { img: '/uploads/IMG_3488.jpg', fmt: 'Video', title: 'Unboxing · gummies up close', sub: 'Video · 9:16 · 8d running', play: true },
    ] },
  { name: 'Performance & Recovery', share: 24, lon: '10d', lonTone: 'yellow', trend: '▼ −2 pts', trendTone: 'red', miss: false,
    status: 'You also run this', tier: 'Stable — monitor', tierTone: 'mid',
    stats: [['Share of budget', '24%', 'of their creative spend'], ['Avg longevity', '10d', 'median days running'], ['30d momentum', '−2', 'share point change']],
    promise: '“Recover harder. Sleep is training.”',
    positioning: 'Frames sleep as an athletic performance input — recovery metrics, training narratives, morning readiness.',
    buyer: 'Fitness-focused 25–40, tracks sleep with wearables, buys on metrics and proof.',
    read: [
      ['Their performance', 'Softening — 10d longevity, 24% of budget, −2 pts in 30 days'],
      ['Your coverage', '2 of your 6 active ads address this angle'],
      ['PDP support', 'Lightly addressed on Magnesium Glycinate Complex'],
      ['Validated by', 'Olly · Beam'],
    ],
    rec: 'Their spend here is drifting down. Hold your current coverage; don\'t add budget.',
    perf: { text: '10d · 24% of spend', delta: '▼ −2 pts', tone: 'red' },
    coverage: { text: '2 of 6 active ads', gap: false },
    pdp: { label: 'Lightly addressed', tone: 'yellow', note: 'Magnesium Glycinate Complex' },
    brands: [['Olly', '#c2531f'], ['Beam', '#23254d']],
    ads: [
      { img: '/uploads/IMG_3488.jpg', fmt: 'Video', title: 'Training day · recovery stack', sub: 'Video · 9:16 · 10d running', play: true },
      { img: '/uploads/IMG_3495.PNG', fmt: 'UGC', title: 'Creator review · readiness score', sub: 'UGC · 9:16 · 7d running', play: true },
      { img: '/uploads/Screenshot 2026-05-13 at 10.15.26 PM.png', fmt: 'Static', title: 'Product still · metrics overlay', sub: 'Static · 1:1 · 12d running', play: false },
    ] },
  { name: 'Price & Value', share: 22, lon: '8d', lonTone: 'red', trend: '— stable', trendTone: 'mid', miss: false,
    status: 'You also run this', tier: 'Skip — saturated', tierTone: 'red',
    stats: [['Share of budget', '22%', 'of their creative spend'], ['Avg longevity', '8d', 'median days running'], ['30d momentum', '0', 'share point change']],
    promise: '“Better sleep shouldn\'t cost more.”',
    positioning: 'Straight price-value comparison — bundle math, cost-per-night framing, discount-led statics.',
    buyer: 'Price-sensitive switchers comparing across brands; weak loyalty, high churn.',
    read: [
      ['Their performance', 'Declining — 8d longevity, 22% of budget, flat trend'],
      ['Your coverage', '1 of your 6 active ads runs this angle'],
      ['PDP support', 'Addressed on Magnesium Glycinate Complex'],
      ['Validated by', 'Olly only — others have exited'],
    ],
    rec: 'Declining across the category — high saturation. Consider pulling spend from this angle.',
    perf: { text: '8d · 22% of spend', delta: '— flat', tone: 'mid' },
    coverage: { text: '1 of 6 active ads', gap: false },
    pdp: { label: 'Addressed', tone: 'green', note: 'Magnesium Glycinate Complex' },
    brands: [['Olly', '#c2531f']],
    ads: [
      { img: '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png', fmt: 'Static', title: 'Bundle math · cost per night', sub: 'Static · 1:1 · 8d running', play: false },
      { img: '/uploads/IMG_3486.jpg', fmt: 'UGC', title: 'Creator review · drugstore dupe', sub: 'UGC · 9:16 · 6d running', play: true },
      { img: '/uploads/IMG_3499.PNG', fmt: 'Video', title: 'Side-by-side · price reveal', sub: 'Video · 9:16 · 5d running', play: true },
    ] },
]

export const PR_TIER_TONE: Record<string, { fg: string; bg: string }> = {
  green: { fg: NT.green, bg: NT.greenBg }, mid: { fg: NT.mid, bg: 'var(--dv-page)' }, red: { fg: NT.red, bg: 'rgba(196,80,74,0.1)' },
}
