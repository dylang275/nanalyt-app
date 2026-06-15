// Performance.tsx — Tests page (nav label "Tests", route /performance).
// Ported from design_handoff_nanalyt/source/tests-page-v2.jsx.
// Tab switcher → dark test header → chart + agent log → funnel stats → creatives table.
// Renders content only; the shell is AppLayout.
import { useState } from 'react'
import { NT, ntCard } from '../system/tokens'
import { StatCard } from '../components/primitives'
import { HeroChart, type ChartEvent } from '../components/HeroChart'

// ── Data ──
const T2_IMG: Record<string, string> = {
  pdp: '/uploads/Screenshot 2026-05-18 at 9.56.07 AM.png',
  flat: '/uploads/Screenshot 2026-05-18 at 10.02.02 AM.png',
  ugc: '/uploads/IMG_3486.jpg',
  hand: '/uploads/IMG_3488.jpg',
}

type Stage = { label: string; tone: 'solid' | 'soft' | 'warn' }
type LogEntry = { glyph: string; tone: 'green' | 'yellow' | 'blue'; t: string; s: string }
type Funnel = { l: string; v: string; d: string; spark: number[] }
type Pdp = { img: string; name: string; sub: string; cvr: string; verdict: string }
type Ad = { img: string; fmt: string; play: boolean; name: string; winner: boolean; sub: string; spend: string; roas: string; cvr: string; ctr: string; verdict: string }
type Test = {
  id: string; img: string; name: string; tabSub: string; title: string
  stage: Stage; sub: [string, string]; kpis: [string, string][]
  cta: { label: string; primary: boolean }; hero: [string, string]
  chart: { n: number; f: (t: number) => number; amp: number; per: number; dates: string[] }
  events: { d: number; glyph: string; title: string; detail: string }[]
  log: LogEntry[]; funnel: Funnel[]; pdp: Pdp; ads: Ad[]
}

const T2_TESTS: Test[] = [
  {
    id: 'gummies', img: '/uploads/IMG_3476.jpg', name: 'Mag + Ashwagandha Gummies', tabSub: 'Validation · validated',
    title: 'Magnesium + Ashwagandha Gummies',
    stage: { label: 'VALIDATED', tone: 'solid' },
    sub: ['Validation test · day 32 · 1 landing page · 4 ads', '+21% vs catalog avg ROAS'],
    kpis: [['Spend', '$4.2k'], ['ROAS', '4.6×'], ['CVR', '3.1%']],
    cta: { label: 'Promote to catalog →', primary: true },
    hero: ['4.6×', '↑ 0.8 over test'],
    chart: { n: 30, f: (t) => 3.0 + 1.7 * t, amp: 0.15, per: 2.7, dates: ['May 11', 'May 18', 'May 25', 'Jun 1', 'Jun 9'] },
    events: [
      { d: 24, glyph: '✎', title: 'Launched validation test', detail: '4 ads · 1 PDP live' },
      { d: 13, glyph: '⚑', title: 'Paused weakest lifestyle angle', detail: 'Reallocated $40/day to UGC' },
      { d: 5, glyph: '▲', title: 'Scaled winning UGC +40%', detail: 'ROAS held at 5.2×' },
    ],
    log: [
      { glyph: '▲', tone: 'green', t: 'Scaled winning UGC +40%', s: 'ROAS held at 5.2× · Jun 4' },
      { glyph: '⚑', tone: 'yellow', t: 'Paused weakest lifestyle angle', s: 'Reallocated $40/day · May 27' },
      { glyph: '✎', tone: 'blue', t: 'Drafted stress-sleep static', s: 'You approved · May 22' },
      { glyph: '✎', tone: 'blue', t: 'Launched validation test', s: '4 ads · 1 PDP · May 8' },
    ],
    funnel: [
      { l: 'Impressions', v: '481k', d: '+18% wk', spark: [30, 34, 33, 38, 41, 44, 48] },
      { l: 'Click-through', v: '1.4%', d: '+0.3 wk', spark: [0.9, 1.0, 1.1, 1.1, 1.2, 1.3, 1.4] },
      { l: 'Adds to cart', v: '1,240', d: '+9% wk', spark: [80, 86, 92, 98, 104, 112, 124] },
      { l: 'Cost per acquisition', v: '$18.20', d: '−$2.10 wk', spark: [24, 23, 22, 21, 20, 19, 18.2] },
    ],
    pdp: { img: 'pdp', name: 'Two birds, one gummy landing page', sub: 'v1 · live 32 days', cvr: '2.8%', verdict: 'scaling' },
    ads: [
      { img: 'ugc', fmt: 'UGC', play: true, name: '“Two birds, one gummy”', winner: true, sub: 'Sleep & Stress Combo · 28 days', spend: '$1.8k', roas: '5.2×', cvr: '3.4%', ctr: '1.9%', verdict: 'scaling' },
      { img: 'hand', fmt: 'Video', play: true, name: 'Why magnesium AND ashwagandha?', winner: false, sub: 'Sleep & Stress Combo · 21 days', spend: '$1.2k', roas: '4.8×', cvr: '3.0%', ctr: '1.6%', verdict: 'stable' },
      { img: 'flat', fmt: 'Static', play: false, name: 'The science of stress-sleep', winner: false, sub: 'Sleep-Anxiety Crossover · 18 days', spend: '$0.8k', roas: '3.9×', cvr: '2.7%', ctr: '1.2%', verdict: 'stable' },
      { img: 'self', fmt: 'UGC', play: true, name: '“My new bedtime ritual”', winner: false, sub: 'Lifestyle & Wellness · 14 days', spend: '$0.4k', roas: '2.4×', cvr: '1.8%', ctr: '0.9%', verdict: 'watch' },
    ],
  },
  {
    id: 'mag', img: '/uploads/IMG_3472.jpg', name: 'Magnesium Glycinate', tabSub: 'Angle test · day 12 of 14',
    title: 'Magnesium Glycinate Complex',
    stage: { label: 'DAY 12 OF 14', tone: 'soft' },
    sub: ['Angle test · “next-day calm” · 3 ads', '+14% vs current best angle'],
    kpis: [['Spend', '$1.9k'], ['ROAS', '4.9×'], ['CVR', '3.3%']],
    cta: { label: 'View early read', primary: false },
    hero: ['4.9×', '↑ 0.6 over test'],
    chart: { n: 12, f: (t) => 3.9 + 1.0 * t, amp: 0.12, per: 1.9, dates: ['May 28', 'Jun 1', 'Jun 4', 'Jun 6', 'Jun 9'] },
    events: [
      { d: 10, glyph: '✎', title: 'Launched angle test', detail: '3 creatives · you approved' },
      { d: 3, glyph: '▲', title: 'Shifted budget to UGC', detail: '+$25/day · CVR 3.6%' },
    ],
    log: [
      { glyph: '⚑', tone: 'yellow', t: 'Flagged static under-delivery', s: 'CTR 1.5% vs 2.1% UGC · Jun 7' },
      { glyph: '▲', tone: 'green', t: 'Shifted budget to UGC', s: '+$25/day · Jun 5' },
      { glyph: '✎', tone: 'blue', t: 'Drafted 3 “next-day calm” creatives', s: 'You approved · May 27' },
      { glyph: '✎', tone: 'blue', t: 'Launched angle test', s: 'vs current best angle · May 28' },
    ],
    funnel: [
      { l: 'Impressions', v: '212k', d: '+24% wk', spark: [14, 16, 17, 19, 22, 25, 28] },
      { l: 'Click-through', v: '1.7%', d: '+0.4 wk', spark: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7] },
      { l: 'Adds to cart', v: '618', d: '+12% wk', spark: [40, 44, 47, 50, 54, 58, 62] },
      { l: 'Cost per acquisition', v: '$20.10', d: '−$1.40 wk', spark: [23, 22.5, 22, 21.6, 21, 20.5, 20.1] },
    ],
    pdp: { img: 'pdp', name: 'Next-day calm landing page', sub: 'v2 · live 12 days', cvr: '3.1%', verdict: 'scaling' },
    ads: [
      { img: 'ugc', fmt: 'UGC', play: true, name: '“I wake up actually calm”', winner: true, sub: 'Next-Day Calm · 12 days', spend: '$0.9k', roas: '5.4×', cvr: '3.6%', ctr: '2.1%', verdict: 'scaling' },
      { img: 'flat', fmt: 'Static', play: false, name: 'Calm that carries to tomorrow', winner: false, sub: 'Next-Day Calm · 12 days', spend: '$0.6k', roas: '4.5×', cvr: '3.1%', ctr: '1.5%', verdict: 'stable' },
      { img: 'hand', fmt: 'Video', play: true, name: 'The 24-hour magnesium story', winner: false, sub: 'Next-Day Calm · 12 days', spend: '$0.4k', roas: '3.8×', cvr: '2.6%', ctr: '1.1%', verdict: 'stable' },
    ],
  },
  {
    id: 'zzz', img: '/uploads/IMG_3474.jpg', name: 'ZzzPlex Sleep Support', tabSub: 'Creative refresh · needs review',
    title: 'ZzzPlex Sleep Support',
    stage: { label: 'NEEDS REVIEW', tone: 'warn' },
    sub: ['Creative refresh · 2 replacements vs fatigued control · concluded', '+0.6× ROAS vs control'],
    kpis: [['Spend', '$1.1k'], ['ROAS', '3.4×'], ['CVR', '2.6%']],
    cta: { label: 'Review 2 creatives', primary: true },
    hero: ['3.4×', '↑ 0.6 vs control'],
    chart: { n: 14, f: (t) => 2.8 + 0.65 * t, amp: 0.1, per: 2.2, dates: ['May 26', 'May 30', 'Jun 2', 'Jun 5', 'Jun 8'] },
    events: [
      { d: 11, glyph: '✎', title: 'Drafted 2 replacement creatives', detail: 'After fatigue flag · you approved' },
      { d: 8, glyph: '▲', title: 'Launched head-to-head', detail: 'Replacements vs fatigued control' },
    ],
    log: [
      { glyph: '✓', tone: 'green', t: 'Concluded test — replacement A wins', s: '+0.6× ROAS, CPA −$6.80 · Jun 8' },
      { glyph: '▲', tone: 'blue', t: 'Launched head-to-head', s: '2 replacements vs control · May 31' },
      { glyph: '✎', tone: 'blue', t: 'Drafted 2 replacement creatives', s: 'You approved · May 26' },
      { glyph: '⚑', tone: 'yellow', t: 'Flagged creative fatigue', s: 'CPA +34% in 10 days · May 24' },
    ],
    funnel: [
      { l: 'Impressions', v: '148k', d: '+6% wk', spark: [17, 17.5, 18, 18.2, 18.8, 19.4, 20] },
      { l: 'Click-through', v: '1.2%', d: '+0.2 wk', spark: [0.9, 0.95, 1.0, 1.0, 1.1, 1.15, 1.2] },
      { l: 'Adds to cart', v: '402', d: '+4% wk', spark: [50, 51, 53, 54, 55, 56, 58] },
      { l: 'Cost per acquisition', v: '$31.40', d: '−$6.80 wk', spark: [40, 39, 38, 36, 34, 32.5, 31.4] },
    ],
    pdp: { img: 'pdp', name: 'ZzzPlex sleep support page', sub: 'v3 · live 94 days', cvr: '2.4%', verdict: 'stable' },
    ads: [
      { img: 'hand', fmt: 'UGC', play: true, name: '“Finally sleeping through”', winner: true, sub: 'Replacement A · 9 days', spend: '$0.5k', roas: '3.9×', cvr: '2.9%', ctr: '1.4%', verdict: 'scaling' },
      { img: 'self', fmt: 'Video', play: true, name: 'Your wind-down, upgraded', winner: false, sub: 'Replacement B · 9 days', spend: '$0.4k', roas: '3.3×', cvr: '2.5%', ctr: '1.1%', verdict: 'stable' },
      { img: 'flat', fmt: 'Static', play: false, name: 'Deep sleep, decoded', winner: false, sub: 'Fatigued control · 64 days', spend: '$0.2k', roas: '2.8×', cvr: '2.0%', ctr: '0.7%', verdict: 'winddown' },
    ],
  },
]

const T2_LOG_TONE: Record<string, { fg: string; bg: string }> = {
  green: { fg: NT.greenBr, bg: NT.greenBg },
  yellow: { fg: NT.yellow, bg: 'rgba(168,116,42,0.13)' },
  blue: { fg: NT.blue, bg: 'rgba(58,110,168,0.11)' },
}

// ── Atoms ──
function T2StagePill({ stage }: { stage: Stage }) {
  const m: Record<string, { bg: string; fg: string }> = {
    solid: { bg: '#5cb877', fg: '#0c130b' },
    soft: { bg: 'rgba(92,184,119,0.18)', fg: '#7ac292' },
    warn: { bg: 'rgba(216,160,74,0.18)', fg: '#d8a04a' },
  }
  const s = m[stage.tone]
  return <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', background: s.bg, color: s.fg, padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap' }}>{stage.label}</span>
}

function T2Verdict({ verdict }: { verdict: string }) {
  const m: Record<string, { bg: string; fg: string; l: string }> = {
    scaling: { bg: NT.greenBg, fg: NT.green, l: 'Scaling ↑' },
    stable: { bg: NT.page, fg: NT.mid, l: 'Stable' },
    watch: { bg: 'rgba(168,116,42,0.13)', fg: NT.yellow, l: 'Watch' },
    winddown: { bg: 'rgba(196,80,74,0.11)', fg: NT.red, l: 'Wind down ↓' },
  }
  const s = m[verdict] || m.stable
  return <span style={{ fontSize: 11, fontWeight: 550, background: s.bg, color: s.fg, padding: '4px 11px', borderRadius: 11, whiteSpace: 'nowrap' }}>{s.l}</span>
}

function T2Thumb({ imgKey, productImg, play }: { imgKey: string; productImg: string; play?: boolean }) {
  const src = imgKey === 'self' ? productImg : T2_IMG[imgKey]
  return (
    <div style={{ width: 46, height: 46, borderRadius: 9, position: 'relative', overflow: 'hidden', flexShrink: 0, background: NT.page }}>
      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
      {play && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,24,15,0.14)' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(16,24,15,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="6" height="7" viewBox="0 0 7 8" fill="white"><path d="M1 0.5l5.5 3.5L1 7.5V0.5z" /></svg>
          </div>
        </div>
      )}
    </div>
  )
}

const T2_GRID = '58px 1.5fr 76px 70px 64px 64px 110px'

const Head = ({ children }: { children?: React.ReactNode }) => <div style={{ fontSize: 10.5, fontWeight: 500, color: NT.dim }}>{children}</div>
const Cell = ({ v }: { v: string }) => <div style={{ fontSize: 12.5, color: v === '—' ? NT.dim : NT.text, fontFamily: NT.mono, fontVariantNumeric: 'tabular-nums' }}>{v}</div>

export default function Performance() {
  const [sel, setSel] = useState<Test>(T2_TESTS[0])
  const d = sel
  const n = d.chart.n
  const vals = Array.from({ length: n }, (_, i) => d.chart.f(i / (n - 1)) + d.chart.amp * Math.sin(i / d.chart.per))
  const events: ChartEvent[] = d.events.map((e) => ({ glyph: e.glyph, title: e.title, detail: e.detail, i: (n - 1) - e.d })).filter((e) => e.i >= 1 && e.i <= n - 2)

  return (
    <>
      {/* ── Test switcher tabs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        {T2_TESTS.map((t) => {
          const active = t.id === sel.id
          return (
            <div key={t.id} onClick={() => setSel(t)} className={active ? '' : 'dv2-menu-item'}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 14px 7px 8px', borderRadius: 11, cursor: 'pointer',
                background: active ? NT.surf : 'transparent',
                border: `1px solid ${active ? NT.border : 'transparent'}`,
                boxShadow: active ? NT.shadow : 'none' }}>
              <img src={t.img} style={{ width: 26, height: 26, borderRadius: 7, objectFit: 'cover' }} alt="" />
              <div>
                <div style={{ fontSize: 12, fontWeight: active ? 550 : 475, color: active ? NT.text : NT.mid, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{t.name}</div>
                <div style={{ fontSize: 9.5, color: NT.dim, whiteSpace: 'nowrap' }}>{t.tabSub}</div>
              </div>
            </div>
          )
        })}
        <span className="dv2-link" style={{ marginLeft: 'auto', fontSize: 11.5, color: NT.dim, cursor: 'pointer', whiteSpace: 'nowrap' }}>Concluded tests →</span>
      </div>

      {/* ── Dark test header ── */}
      <div style={{ background: 'linear-gradient(120deg, #10180f 0%, #16241a 70%, #1a2f1f 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(16,24,15,0.18)', padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 18, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -130, right: -70, width: 330, height: 330, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,184,119,0.14) 0%, rgba(92,184,119,0) 70%)', pointerEvents: 'none' }}></div>
        <img src={d.img} style={{ width: 52, height: 52, borderRadius: 11, objectFit: 'cover', flexShrink: 0, position: 'relative' }} alt={d.title} />
        <div style={{ flex: 1, minWidth: 210, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 10px', marginBottom: 5 }}>
            <span style={{ fontSize: 17, fontWeight: 550, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.25 }}>{d.title}</span>
            <T2StagePill stage={d.stage} />
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.sub[0]} · <span style={{ color: '#7ac292', fontWeight: 550 }}>{d.sub[1]}</span></div>
        </div>
        <div style={{ display: 'flex', flexShrink: 0, marginRight: 10, position: 'relative' }}>
          {d.kpis.map(([l, v], i) => (
            <div key={l} style={{ textAlign: 'right', paddingLeft: 16, borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none', marginLeft: i > 0 ? 16 : 0 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>{l}</div>
              <div style={{ fontSize: 21, fontWeight: 550, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
            </div>
          ))}
        </div>
        <button className="dv2-btn-p" style={d.cta.primary
          ? { background: '#ffffff', color: '#10180f', border: 'none', padding: '9px 18px', borderRadius: 10, fontSize: 12.5, fontWeight: 550, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, position: 'relative' }
          : { background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.22)', padding: '9px 18px', borderRadius: 10, fontSize: 12.5, fontWeight: 475, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, position: 'relative' }}>
          {d.cta.label}
        </button>
      </div>

      {/* ── Chart + slim agent log ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr calc((100% - 42px)/4)', gap: 14, alignItems: 'stretch' }}>
        <div style={{ ...ntCard, padding: '20px 24px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 13.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em' }}>Test performance</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: NT.mid }}><span style={{ width: 12, height: 2.5, background: NT.greenBr, borderRadius: 2, display: 'inline-block' }}></span>Blended ROAS</span>
            <span style={{ fontSize: 10.5, color: NT.mid }}>◦ Agent actions</span>
            <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.dim, fontFamily: NT.mono }}>{d.chart.dates[0]} – {d.chart.dates[d.chart.dates.length - 1]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
            <span key={d.id} className="dv2-num-in" style={{ fontSize: 30, fontWeight: 550, color: NT.text, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{d.hero[0]}</span>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: NT.greenBr }}>{d.hero[1]}</span>
          </div>
          <HeroChart vals={vals} color={'var(--dv-green-br)'} fmt={(v) => v.toFixed(1) + '×'} legend={[['ROAS', '']]} events={events} uid={'t2' + d.id} h={208} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {d.chart.dates.map((dt) => <span key={dt} style={{ fontSize: 10, color: NT.dim, fontFamily: NT.mono }}>{dt}</span>)}
          </div>
        </div>

        <div style={{ ...ntCard, padding: '16px 18px 8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em' }}>What the agent did</span>
            <span className="dv2-link" style={{ fontSize: 10.5, color: NT.dim, cursor: 'pointer' }}>View all</span>
          </div>
          {d.log.map((e, i) => {
            const tone = T2_LOG_TONE[e.tone]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? `1px solid ${NT.borderS}` : 'none', flex: 1 }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: tone.bg, color: tone.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>{e.glyph}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 475, color: NT.text, lineHeight: 1.35 }}>{e.t}</div>
                  <div style={{ fontSize: 10, color: NT.dim, marginTop: 2 }}>{e.s}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Funnel stat row ── */}
      <div style={{ display: 'flex', gap: 14 }}>
        {d.funnel.map((f, i) => <StatCard key={d.id + i} label={f.l} value={f.v} sub={f.d} subTone="pos" spark={f.spark} />)}
      </div>

      {/* ── Creatives table ── */}
      <div style={{ ...ntCard, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '15px 22px 13px' }}>
          <span style={{ fontSize: 13.5, fontWeight: 550, color: NT.text, letterSpacing: '-0.01em' }}>Creatives in this test</span>
          <span style={{ fontSize: 11, color: NT.dim, fontFamily: NT.mono, marginLeft: 9 }}>{d.ads.length + 1}</span>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: NT.dim }}>Sorted by spend</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: T2_GRID, gap: 14, alignItems: 'center', padding: '7px 22px', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}`, background: NT.page }}>
          <Head></Head><Head>Creative</Head><Head>Spend</Head><Head>ROAS</Head><Head>CVR</Head><Head>CTR</Head><Head>Verdict</Head>
        </div>
        <div className="dv2-row" style={{ display: 'grid', gridTemplateColumns: T2_GRID, gap: 14, alignItems: 'center', padding: '11px 22px', borderBottom: `1px solid ${NT.borderS}`, cursor: 'pointer' }}>
          <T2Thumb imgKey={d.pdp.img} productImg={d.img} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
              <span style={{ fontSize: 12.5, fontWeight: 525, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.pdp.name}</span>
              <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.blue, background: 'rgba(58,110,168,0.1)', padding: '1.5px 7px', borderRadius: 5, flexShrink: 0 }}>Landing page</span>
            </div>
            <div style={{ fontSize: 10.5, color: NT.dim }}>{d.pdp.sub}</div>
          </div>
          <Cell v="—" /><Cell v="—" /><Cell v={d.pdp.cvr} /><Cell v="—" />
          <T2Verdict verdict={d.pdp.verdict} />
        </div>
        {d.ads.map((a, i) => (
          <div key={d.id + i} className="dv2-row" style={{ display: 'grid', gridTemplateColumns: T2_GRID, gap: 14, alignItems: 'center', padding: '11px 22px', cursor: 'pointer',
            background: a.winner ? 'var(--dv-row-top)' : 'transparent',
            borderBottom: i === d.ads.length - 1 ? 'none' : `1px solid ${NT.borderS}` }}>
            <T2Thumb imgKey={a.img} productImg={d.img} play={a.play} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                <span style={{ fontSize: 12.5, fontWeight: 525, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
                {a.winner && <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '1.5px 7px', borderRadius: 5, flexShrink: 0 }}>Top creative</span>}
              </div>
              <div style={{ fontSize: 10.5, color: NT.dim }}>{a.fmt} · {a.sub}</div>
            </div>
            <Cell v={a.spend} /><Cell v={a.roas} /><Cell v={a.cvr} /><Cell v={a.ctr} />
            <T2Verdict verdict={a.verdict} />
          </div>
        ))}
      </div>
    </>
  )
}
