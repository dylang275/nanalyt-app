// ActiveProducts.tsx — live product portfolio table.
// Ported from design_handoff_nanalyt/source/active-products-page.jsx.
// Renders content only; the shell (sidebar/top bar/status bar) is AppLayout.
import { useState } from 'react'
import { NT, ntCard } from '../system/tokens'
import { StatSpark, MetricSelect, type MetricOption } from '../components/primitives'

type Product = {
  name: string; sku: string; img: string; state: string; platforms: string
  rev: string; revN: number; margin: string; score: number; adSat: string; adCount: number
  findings: number; spark: number[]; pos: boolean; action: string
}

const APP_PRODUCTS: Product[] = [
  { name: 'Magnesium Glycinate Complex', sku: 'MAG-GLY-120', img: '/uploads/IMG_3472.jpg', state: 'In market',
    platforms: 'Meta · TikTok · Amazon · Reddit', rev: '$18,420', revN: 18420, margin: '38.4%', score: 84, adSat: 'Moderate', adCount: 20, findings: 2, spark: [60, 65, 70, 72, 78, 82, 84], pos: true, action: 'Generate creatives' },
  { name: 'ZzzPlex Sleep Support', sku: 'ZZZ-SLP-60', img: '/uploads/IMG_3474.jpg', state: 'In market',
    platforms: 'Meta · Google · Amazon', rev: '$11,340', revN: 11340, margin: '31.2%', score: 71, adSat: 'High', adCount: 34, findings: 1, spark: [75, 72, 68, 65, 69, 71, 71], pos: false, action: 'Fix creative' },
  { name: 'Vitamin D3 + K2 Complex', sku: 'VIT-D3K2-90', img: '/uploads/Screenshot 2026-05-11 at 9.01.38 PM.png', state: 'In market',
    platforms: 'Amazon · Google', rev: '$7,840', revN: 7840, margin: '42.1%', score: 68, adSat: 'Low', adCount: 8, findings: 0, spark: [50, 52, 55, 58, 60, 65, 68], pos: true, action: 'Generate creatives' },
  { name: 'ASHWAGANDHA+', sku: 'ASH-PLUS-60', img: '/uploads/IMG_3476.jpg', state: 'Testing',
    platforms: 'Meta · TikTok', rev: '—', revN: 0, margin: '36.8%', score: 63, adSat: 'Low', adCount: 4, findings: 0, spark: [40, 45, 52, 58, 60, 61, 63], pos: true, action: 'View test' },
  { name: 'Mag + Ashwagandha Gummies', sku: 'MAG-ASH-60', img: '/uploads/Screenshot 2026-05-11 at 9.01.01 PM.png', state: 'Researching',
    platforms: 'Meta · Shopify · TikTok', rev: '—', revN: 0, margin: '33.5%', score: 77, adSat: 'Low', adCount: 6, findings: 1, spark: [50, 55, 60, 65, 70, 74, 77], pos: true, action: 'Start test' },
  { name: 'Magnesium L-Threonate', sku: 'MAG-LT-60', img: '/uploads/Screenshot 2026-05-11 at 9.00.15 PM.png', state: 'Suggested',
    platforms: 'Reddit · Amazon · Google', rev: '—', revN: 0, margin: '41.2%', score: 79, adSat: 'Low', adCount: 3, findings: 2, spark: [50, 55, 60, 65, 70, 75, 79], pos: true, action: 'Open research' },
  { name: 'Glycine + Magnesium Stack', sku: 'GLY-MAG-90', img: '/uploads/Screenshot 2026-05-11 at 9.02.37 PM.png', state: 'Suggested',
    platforms: 'Amazon · Reddit', rev: '—', revN: 0, margin: '38.9%', score: 61, adSat: 'Low', adCount: 2, findings: 0, spark: [30, 35, 40, 45, 50, 55, 61], pos: true, action: 'Open research' },
]

type Stage = { solid?: boolean; bg: string; fg?: string; border?: boolean }
const APP_STAGE: Record<string, Stage> = {
  'In market': { solid: true, bg: 'var(--dv-green)' },
  'Testing': { fg: NT.green, bg: NT.greenBg },
  'Researching': { fg: NT.blue, bg: 'rgba(58,110,168,0.1)' },
  'Suggested': { fg: NT.text, bg: 'var(--dv-page)', border: true },
}
const APP_SAT: Record<string, { fg: string; bg: string }> = {
  Low: { fg: NT.green, bg: NT.greenBg },
  Moderate: { fg: NT.yellow, bg: 'rgba(168,116,42,0.13)' },
  High: { fg: NT.red, bg: 'rgba(196,80,74,0.1)' },
}
const APP_SORTS: MetricOption[] = [
  { id: 'score', label: 'Score', group: 'Sort' },
  { id: 'rev', label: 'Revenue', group: 'Sort' },
  { id: 'findings', label: 'Findings', group: 'Sort' },
]
const APP_GRID = '56px minmax(0,1.6fr) 96px 92px 72px 84px 64px 100px'

export default function ActiveProducts() {
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState<MetricOption>(APP_SORTS[0])
  const filters: [string, number][] = [['All', 7], ['In market', 3], ['Testing', 1], ['Researching', 1], ['Suggested', 2]]
  let list = APP_PRODUCTS.filter((p) => (filter === 'All' ? true : p.state === filter))
  list = [...list].sort((a, b) => (sort.id === 'rev' ? b.revN - a.revN : sort.id === 'findings' ? b.findings - a.findings : b.score - a.score))

  return (
    <>
      {/* title + filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 2px 0', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.012em' }}>Active Products</span>
          <span style={{ fontSize: 11.5, color: NT.text, marginLeft: 9 }}>7 products · $37.6k revenue this week</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
          {filters.map(([id, n]) => (
            <span key={id} onClick={() => setFilter(id)} style={{ fontSize: 11.5, fontWeight: filter === id ? 550 : 450, padding: '5.5px 13px', borderRadius: 9, cursor: 'pointer', whiteSpace: 'nowrap',
              background: filter === id ? 'var(--dv-btn-bg)' : 'var(--dv-surf)', color: filter === id ? 'var(--dv-btn-fg)' : NT.text,
              border: `1px solid ${filter === id ? 'var(--dv-btn-bg)' : NT.borderS}`, boxShadow: filter === id ? 'none' : NT.shadow, transition: 'all 0.12s' }}>{id} · {n}</span>
          ))}
          <button className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer', marginLeft: 6, whiteSpace: 'nowrap' }}>+ Add product</button>
        </div>
      </div>

      {/* portfolio table */}
      <div style={{ ...ntCard, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '13px 22px 11px' }}>
          <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>Portfolio</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: NT.mono, marginLeft: 8 }}>{list.length}</span>
          <div style={{ marginLeft: 'auto' }}>
            <MetricSelect options={APP_SORTS} metric={sort} setMetric={setSort} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: APP_GRID, gap: 12, alignItems: 'center', padding: '7px 22px', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}`, background: NT.page }}>
          {['', 'Product', 'Score', 'Rev · wk', 'Margin', 'Ad saturation', 'Findings', 'Stage'].map((h, i) =>
            <div key={i} style={{ fontSize: 10.5, fontWeight: 500, color: NT.text, whiteSpace: 'nowrap' }}>{h}</div>)}
        </div>
        {list.map((p, i) => {
          const st = APP_STAGE[p.state]
          const sat = APP_SAT[p.adSat]
          return (
            <div key={p.sku} className="dv2-row" style={{ display: 'grid', gridTemplateColumns: APP_GRID, gap: 12, alignItems: 'center', padding: '18px 22px', borderBottom: i < list.length - 1 ? `1px solid ${NT.borderS}` : 'none', cursor: 'pointer' }}>
              <img src={p.img} style={{ width: 46, height: 46, borderRadius: 10, objectFit: 'cover' }} alt={p.name} />
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13.5, fontWeight: 550, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{p.name}</div>
                <div style={{ fontSize: 10.5, color: NT.text, fontFamily: NT.mono, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.sku} · {p.platforms}</div>
                {p.findings > 0 && <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2px 8px', borderRadius: 8, alignSelf: 'start' }}>{p.findings} finding{p.findings > 1 ? 's' : ''}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 550, color: NT.text, fontFamily: NT.mono, letterSpacing: '-0.02em' }}>{p.score}</span>
                <StatSpark data={p.spark} color={p.pos ? NT.greenBr : NT.red} w={50} h={18} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, fontFamily: NT.mono, marginBottom: 2 }}>{p.rev}</div>
                {p.rev !== '—' && <div style={{ fontSize: 10, color: NT.text }}>this week</div>}
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, fontFamily: NT.mono, marginBottom: 2 }}>{p.margin}</div>
                <div style={{ fontSize: 10, color: NT.text }}>margin</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 550, color: sat.fg, background: sat.bg, padding: '2.5px 9px', borderRadius: 9, whiteSpace: 'nowrap', display: 'inline-block', marginBottom: 3 }}>{p.adSat}</span>
                <div style={{ fontSize: 10, color: NT.text, fontFamily: NT.mono }}>{p.adCount} ads</div>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, fontFamily: NT.mono }}>{p.findings > 0 ? p.findings : '—'}</span>
              <span style={{ fontSize: 10, fontWeight: 550, color: st.solid ? 'var(--dv-surf)' : st.fg, background: st.bg, border: st.border ? `1px solid ${NT.borderS}` : 'none', padding: '3.5px 11px', borderRadius: 10, whiteSpace: 'nowrap', justifySelf: 'start' }}>{p.state}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
