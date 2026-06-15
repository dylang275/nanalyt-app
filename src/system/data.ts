// data.ts — shared catalog data, nav config, and series helpers.
// Ported from design_handoff_nanalyt/source/system/nanalyt-shell.jsx.
// Image paths are rooted at /uploads (served from public/).

export type ProductInfo = {
  img: string
  name: string
  state: string
  stats: [string, string][]
  ads: string
}

export const NANALYT_PRODUCTS: Record<string, ProductInfo> = {
  mag: { img: '/uploads/IMG_3472.jpg', name: 'Magnesium Glycinate', state: 'IN MARKET', stats: [['Rev · wk', '$18.4k'], ['ROAS', '4.2×'], ['CVR', '3.1%']], ads: '3 live ads' },
  zzz: { img: '/uploads/IMG_3474.jpg', name: 'ZzzPlex Sleep Support', state: 'IN MARKET', stats: [['Rev · wk', '$11.2k'], ['ROAS', '3.1×'], ['CVR', '2.4%']], ads: '2 live ads' },
  ash: { img: '/uploads/IMG_3476.jpg', name: 'ASHWAGANDHA+', state: 'TESTING', stats: [['Rev · wk', '$0.8k'], ['ROAS', '2.8×'], ['CVR', '1.9%']], ads: '1 live ad' },
}

export type ActivityItem = { tone: string; bg: string; glyph: string; text: string; time: string }
export const NANALYT_ACTIVITY: { day: string; items: ActivityItem[] }[] = [
  { day: 'Today', items: [
    { tone: 'var(--dv-green-br)', bg: 'var(--dv-green-bg)', glyph: '✓', text: 'Finished evaluating "next-day calm" adoption — 1 new finding', time: '6:00 AM' },
    { tone: 'var(--dv-yellow)', bg: 'rgba(168,116,42,0.13)', glyph: '⚑', text: 'ZzzPlex CPA crossed your $35 threshold', time: '5:12 AM' },
  ]},
  { day: 'Yesterday', items: [
    { tone: 'var(--dv-blue)', bg: 'rgba(58,110,168,0.11)', glyph: '◎', text: 'Scanned 248 competitor ads across DreamWell, Beam, Ned', time: '11:40 PM' },
    { tone: 'var(--dv-green-br)', bg: 'var(--dv-green-bg)', glyph: '✎', text: 'Drafted 2 replacement creatives for ZzzPlex', time: '4:25 PM' },
    { tone: 'var(--dv-blue)', bg: 'rgba(58,110,168,0.11)', glyph: '◎', text: 'Weekly category pulse updated — sentiment +1.1', time: '6:00 AM' },
  ]},
]

// ── Sidebar nav config (route map lives here; `icon` keys index NI) ──
export type NavItem = { id: string; label: string; to: string; badge?: string }
export type NavGroup = { label: string | null; items: NavItem[] }

export const NANALYT_NAV_GROUPS: NavGroup[] = [
  { label: null, items: [{ id: 'dashboard', label: 'Dashboard', to: '/' }] },
  { label: 'Intelligence', items: [
    { id: 'findings', label: 'Findings', to: '/findings', badge: '12' },
    { id: 'competitors', label: 'Competitors', to: '/competitors' },
    { id: 'research', label: 'Research', to: '/research' },
  ]},
  { label: 'Commerce', items: [
    { id: 'products', label: 'Active Products', to: '/active-products' },
    { id: 'tests', label: 'Tests', to: '/performance', badge: '3' },
    { id: 'studio', label: 'Studio', to: '/studio' },
  ]},
]

export const NAV_SETTINGS: NavItem = { id: 'settings', label: 'Settings', to: '/settings' }

// ── Series + path helpers ──
export function ntSeries(n: number, base: number, growth: number, amp: number, period: number, seed: number): number[] {
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const trend = base * (1 + growth * t)
    const wave = amp * Math.sin(((i + seed) / period) * Math.PI * 2)
    const weekly = amp * 0.55 * Math.sin(((i + seed * 2) / 7) * Math.PI * 2)
    out.push(Math.max(0, trend + wave + weekly))
  }
  return out
}

export function ntPath(vals: number[], W: number, H: number, padTop = 0.1, padBot = 0.04) {
  const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1
  const usable = H * (1 - padTop - padBot)
  const norm = (v: number) => H - padBot * H - ((v - mn) / rng) * usable
  const pts = vals.map((v, i) => ({ x: (i / (vals.length - 1)) * W, y: norm(v) }))
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i], dx = (c.x - p.x) / 3
    d += ` C ${(p.x + dx).toFixed(1)} ${p.y.toFixed(1)} ${(c.x - dx).toFixed(1)} ${c.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`
  }
  const last = pts[pts.length - 1]
  return { d, lastX: last.x, lastY: last.y }
}
