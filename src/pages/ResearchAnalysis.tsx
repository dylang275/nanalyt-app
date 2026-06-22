// ResearchAnalysis.tsx — full opportunity report (Magnesium L-Threonate) with source drawers.
// Ported from design_handoff_nanalyt/source/analysis-page.jsx (+ source-boards drawers).
// Renders content only; the shell is AppLayout.
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { NT, ntCard } from '../system/tokens'
import { HeroChart } from '../components/HeroChart'
import { SOURCE_DRAWERS } from '../components/source-boards'
import AngleMap from '../components/AngleMap'

const AP_MONO = NT.mono
const AP_IMG = '/uploads/Screenshot 2026-05-11 at 9.00.15 PM.png'

const AP_SCORE: [string, number, number][] = [
  ['Angle quality', 17.9, 30], ['Signal volume', 8.5, 10], ['Reddit engagement', 9.8, 12], ['Platform presence', 10.5, 10],
  ['Pricing quality', 5.0, 5], ['Angle diversity', 6.5, 5], ['YouTube engagement', 4.2, 10], ['Sales momentum', 0.0, 8],
]
const AP_FINDINGS = [
  { type: 'Demand', src: 'Amazon', val: '+3.2', unit: '/wk', sub: 'new organic searches per week', insight: 'Ads will find a warm, ready audience.', chips: ['84 Reddit mentions', '8% ad density'] },
  { type: 'Competition', src: 'Meta · Google', val: '4', unit: ' advertisers', sub: 'unique advertisers across paid channels', insight: 'Enter before crowding begins.', chips: ['12 active ads', 'Low saturation'] },
  { type: 'Positioning', src: 'Amazon · Reddit', val: '42pt', unit: ' gap', sub: 'buyer mentions vs 0% ad adoption', insight: 'First-mover angle — 2–3× lower CPCs.', chips: ['42% buyer mentions', '0% ad adoption'] },
]
type Signal = { vals: number[]; fmt: (v: number) => string; stats: [string, string][]; note: ReactNode }
const AP_SIGNAL: Record<string, Signal> = {
  'Amazon reviews': { vals: [0, 0.5, 1, 1.5, 1.8, 2.1, 1.4, 2.3, 2.8, 3.2, 3, 3.5], fmt: (v) => `${v.toFixed(1)}/wk`,
    stats: [['Current', '3.5/wk'], ['30-day high', '3.5/wk'], ['30-day low', '0/wk'], ['Trend', '+3.2× YoY']],
    note: <span><span style={{ fontWeight: 550 }}>Weekly review mentions climbing</span> — 3.2× YoY growth vs zero five weeks ago. Organic demand is accelerating, not spiking.</span> },
  'Buyer intent': { vals: [10, 12, 11, 14, 16, 15, 18, 20, 22, 24, 23, 26], fmt: (v) => `${Math.round(v)} idx`,
    stats: [['Current', '26 idx'], ['30-day high', '26 idx'], ['30-day low', '10 idx'], ['Trend', '+2.6× 90d']],
    note: <span><span style={{ fontWeight: 550 }}>Buyer intent compounding</span> — reviews and threads describe outcomes, not ingredients. A warm audience for outcome-led creative.</span> },
  'Ad saturation': { vals: [2, 2, 3, 3, 4, 4, 3, 5, 6, 7, 6, 8], fmt: (v) => `${Math.round(v)}%`,
    stats: [['Current', '8%'], ['30-day high', '8%'], ['30-day low', '2%'], ['Threshold', '20%']],
    note: <span><span style={{ fontWeight: 550 }}>Sponsored density is 8%</span> — well below the 20% crowding threshold. The arbitrage window is open, but rising slowly.</span> },
  'Keywords': { vals: [30, 32, 35, 38, 36, 40, 42, 45, 44, 48, 50, 52], fmt: (v) => `${Math.round(v)} idx`,
    stats: [['Current', '52 idx'], ['Volume', '18k/mo'], ['Intent tiers', '2'], ['Trend', '+0.24% 90d']],
    note: <span><span style={{ fontWeight: 550 }}>Keyword volume rising across both intent tiers</span> — 18k/mo total with low CPCs on cognitive terms ($1.18–$1.94).</span> },
}
const AP_SIGNAL_TABS = Object.keys(AP_SIGNAL)
const AP_ANGLES = [
  { name: 'Cognitive health', score: '87.3', trend: 'Rising', pct: 87 },
  { name: 'Sleep quality', score: '72.1', trend: 'Rising', pct: 72 },
  { name: 'Stress relief', score: '58.4', trend: 'Rising', pct: 58 },
  { name: 'Clinical / science', score: '44.2', trend: 'Stable', pct: 44 },
  { name: 'Value & dosage', score: '24.5', trend: 'Stable', pct: 24 },
]
const AP_ECON = [
  { src: '$18', margin: '41%', verdict: 'Viable', good: true },
  { src: '$22', margin: '32%', verdict: 'Viable', good: true },
  { src: '$26', margin: '23%', verdict: 'Viable', good: true },
  { src: '$30', margin: '13%', verdict: 'Marginal', good: false },
]
const AP_SOURCES = [
  { key: 'amazon', abbr: 'A', name: 'Amazon reviews', detail: '84 mentions · 4.4★ avg', strength: 'Strong' },
  { key: 'google', abbr: 'G', name: 'Google', detail: '7 keywords · 18k/mo · 5 of 5 criteria', strength: 'Strong', focal: true },
  { key: 'reddit', abbr: 'R', name: 'Reddit', detail: '29 posts · pos/neg 3.4:1', strength: 'Strong' },
  { key: 'tiktok', abbr: 'T', name: 'TikTok ads', detail: '12 ads · 4 advertisers', strength: 'Strong' },
  { key: 'youtube', abbr: 'Y', name: 'YouTube', detail: '11 videos · 89k views', strength: 'Moderate' },
  { key: 'meta', abbr: 'M', name: 'Meta ads', detail: '8 ads · 1 page', strength: 'Strong' },
]

function ApScoreBars() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '9px 28px' }}>
      {AP_SCORE.map(([l, s, m], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', minWidth: 128, flexShrink: 0 }}>{l}</span>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (s / m) * 100)}%`, height: '100%', background: s / m > 0.65 ? '#7ac292' : s / m > 0.35 ? NT.yellow : NT.red, borderRadius: 2 }}></div>
          </div>
          <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontFamily: AP_MONO, minWidth: 48, textAlign: 'right' }}>{s}/{m}</span>
        </div>
      ))}
    </div>
  )
}

function ApHero() {
  return (
    <div style={{ background: 'linear-gradient(120deg, #10180f 0%, #16241a 70%, #1a2f1f 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(16,24,15,0.18)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -130, right: -70, width: 330, height: 330, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,184,119,0.14) 0%, rgba(92,184,119,0) 70%)', pointerEvents: 'none' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', position: 'relative' }}>
        <img src={AP_IMG} style={{ width: 50, height: 50, borderRadius: 11, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.16)' }} alt="Magnesium L-Threonate" />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
            <span style={{ fontSize: 15.5, fontWeight: 550, color: '#fff', letterSpacing: '-0.012em' }}>Magnesium L-Threonate</span>
            <span style={{ fontSize: 10, fontWeight: 550, color: '#7ac292', background: 'rgba(92,184,119,0.14)', border: '1px solid rgba(122,194,146,0.3)', padding: '2.5px 10px', borderRadius: 9 }}>Strong — worth validating</span>
          </div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontFamily: AP_MONO }}>$29–$48 retail · 6 platforms · updated 2h ago</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{ background: '#fff', color: '#10180f', border: 'none', padding: '8px 16px', borderRadius: 9, fontSize: 12, fontWeight: 550, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap' }}>Add to pipeline</button>
          <button style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.16)', padding: '7.5px 14px', borderRadius: 9, fontSize: 12, fontWeight: 450, fontFamily: NT.sans, cursor: 'pointer', whiteSpace: 'nowrap' }}>Campaign package</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
        <div style={{ padding: '16px 24px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 550, color: '#fff', fontFamily: AP_MONO, letterSpacing: '-0.03em', lineHeight: 1 }}>79</div>
          <div style={{ fontSize: 11, fontWeight: 550, color: '#7ac292', margin: '6px 0 2px' }}>Strong</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>worth validating</div>
        </div>
        <div style={{ padding: '14px 24px' }}>
          <ApScoreBars />
        </div>
      </div>
    </div>
  )
}

function ApFindingCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
      {AP_FINDINGS.map((f, i) => (
        <div key={i} className="dv2-card-h" style={{ ...ntCard, padding: '15px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2px 8px', borderRadius: 8 }}>{f.type}</span>
            <span style={{ fontSize: 10.5, color: NT.text, fontFamily: AP_MONO }}>{f.src}</span>
          </div>
          <div>
            <span style={{ fontSize: 23, fontWeight: 550, color: NT.text, fontFamily: AP_MONO, letterSpacing: '-0.02em' }}>{f.val}</span>
            <span style={{ fontSize: 12.5, color: NT.text }}>{f.unit}</span>
            <div style={{ fontSize: 11, color: NT.text, marginTop: 3 }}>{f.sub}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {f.chips.map((ch) => <span key={ch} style={{ fontSize: 10, color: NT.text, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, padding: '2px 8px', borderRadius: 8 }}>{ch}</span>)}
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 550, color: NT.green, marginTop: 'auto' }}>{f.insight}</div>
        </div>
      ))}
    </div>
  )
}

function ApSignalCard() {
  const [tab, setTab] = useState(AP_SIGNAL_TABS[0])
  const sig = AP_SIGNAL[tab]
  return (
    <div style={{ ...ntCard, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '13px 22px 11px' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 550, color: NT.text, marginBottom: 1 }}>Signal trends</div>
          <div style={{ fontSize: 10.5, color: NT.text }}>cross-platform signals composing the score</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
          {AP_SIGNAL_TABS.map((t) => (
            <span key={t} onClick={() => setTab(t)} style={{ fontSize: 10.5, fontWeight: tab === t ? 550 : 450, padding: '4px 11px', borderRadius: 8, cursor: 'pointer', background: tab === t ? 'var(--dv-page)' : 'transparent', color: NT.text, border: `1px solid ${tab === t ? NT.border : 'transparent'}`, transition: 'all 0.12s' }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '4px 22px 8px' }}>
        <HeroChart vals={sig.vals} color="var(--dv-green-br)" fmt={sig.fmt} uid={`apsig-${tab.replace(/\s/g, '')}`} h={150} w={760} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, padding: '11px 22px 14px', borderTop: `1px solid ${NT.borderS}` }}>
        {sig.stats.map(([l, v], i) => (
          <div key={i}>
            <div style={{ fontSize: 10, color: NT.text, marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 12.5, fontWeight: 550, color: i === 3 ? NT.green : NT.text, fontFamily: AP_MONO }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '11px 22px 14px', borderTop: `1px solid ${NT.borderS}`, fontSize: 11.5, color: NT.text, lineHeight: 1.55 }}>{sig.note}</div>
    </div>
  )
}

function ApEconCard() {
  return (
    <div style={{ ...ntCard, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '13px 22px 11px' }}>
        <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>Economics — pre-test</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: NT.text }}>retail $39.99 · est. CPC $2.80</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 110px', gap: 12, padding: '7px 22px', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}`, background: 'var(--dv-page)' }}>
        {['Sourcing', 'Retail', 'Est. CPC', 'Margin', 'Verdict'].map((h, i) => <div key={i} style={{ fontSize: 10.5, fontWeight: 500, color: NT.text }}>{h}</div>)}
      </div>
      {AP_ECON.map((r, i) => (
        <div key={i} className="dv2-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 110px', gap: 12, alignItems: 'center', padding: '10.5px 22px', borderBottom: i < AP_ECON.length - 1 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12.5, color: NT.text, fontFamily: AP_MONO }}>{r.src}</span>
          <span style={{ fontSize: 12.5, color: NT.text, fontFamily: AP_MONO }}>$39.99</span>
          <span style={{ fontSize: 12.5, color: NT.text, fontFamily: AP_MONO }}>$2.80</span>
          <span style={{ fontSize: 12.5, fontWeight: 550, color: r.good ? NT.green : NT.red, fontFamily: AP_MONO }}>{r.margin}</span>
          <span style={{ fontSize: 10, fontWeight: 550, color: r.good ? NT.green : NT.red, background: r.good ? NT.greenBg : 'rgba(178,58,58,0.08)', padding: '2.5px 9px', borderRadius: 9, justifySelf: 'start' }}>{r.verdict}</span>
        </div>
      ))}
      <div style={{ padding: '9px 22px 11px', borderTop: `1px solid ${NT.borderS}`, fontSize: 10.5, color: NT.text }}>CPC is estimated — figures update automatically with real spend once a validation test runs.</div>
    </div>
  )
}

function ApAnglesCard({ onExpand }: { onExpand: () => void }) {
  return (
    <div style={{ ...ntCard, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 22px 11px' }}>
        <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>Positioning angles</span>
        <span className="dv2-link" onClick={onExpand} style={{ fontSize: 11, fontWeight: 500, color: NT.green, cursor: 'pointer' }}>Expand ↗</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: NT.text, fontFamily: AP_MONO }}>5 classified</span>
      </div>
      <div style={{ padding: '4px 22px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {AP_ANGLES.map((a, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: i === 0 ? 550 : 475, color: NT.text }}>{a.name}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontSize: 12, fontFamily: AP_MONO, fontWeight: 550, color: NT.text }}>{a.score}</span>
                <span style={{ fontSize: 10, fontWeight: 550, color: a.trend === 'Rising' ? NT.green : NT.text }}>{a.trend === 'Rising' ? '↑' : '→'} {a.trend}</span>
              </div>
            </div>
            <div style={{ height: 4, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${a.pct}%`, height: '100%', background: 'var(--dv-green-br)', borderRadius: 2 }}></div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 10.5, color: NT.text, lineHeight: 1.5 }}>Classified from competitor ad copy. Open a source for buyer language and evidence.</div>
      </div>
    </div>
  )
}

function ApSourcesCard({ onOpen }: { onOpen: (key: string) => void }) {
  return (
    <div style={{ ...ntCard, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '13px 22px 11px' }}>
        <span style={{ fontSize: 13, fontWeight: 550, color: NT.text }}>Evidence by source</span>
        <span style={{ fontSize: 11, color: NT.text, fontFamily: AP_MONO, marginLeft: 8 }}>6</span>
      </div>
      <div style={{ borderTop: `1px solid ${NT.borderS}` }}>
        {AP_SOURCES.map((s, i) => (
          <div key={s.key} className="dv2-row" onClick={() => onOpen(s.key)} style={{ display: 'grid', gridTemplateColumns: '30px minmax(0,1fr) 70px', gap: 12, alignItems: 'center', padding: '10px 22px', borderBottom: i < AP_SOURCES.length - 1 ? `1px solid ${NT.borderS}` : 'none', cursor: 'pointer' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: NT.text }}>{s.abbr}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 525, color: NT.text }}>{s.name}{s.focal && <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '1.5px 7px', borderRadius: 8, marginLeft: 7 }}>Focal</span>}</div>
              <div style={{ fontSize: 10.5, color: NT.text, fontFamily: AP_MONO, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.detail}</div>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.text, justifySelf: 'end' }}>Open →</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ResearchAnalysis() {
  const navigate = useNavigate()
  const [drawer, setDrawer] = useState<string | null>(null)
  const [angleMap, setAngleMap] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const DrawerComp = drawer ? SOURCE_DRAWERS[drawer] : null

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 2px 0' }}>
        <span onClick={() => navigate('/research')} style={{ fontSize: 11.5, color: NT.text, cursor: 'pointer' }}>← Research</span>
        <span style={{ fontSize: 11.5, color: NT.text }}>/</span>
        <span style={{ fontSize: 11.5, fontWeight: 550, color: NT.text }}>Magnesium L-Threonate</span>
        <span style={{ marginLeft: 'auto', fontSize: 10.5, color: NT.text, fontFamily: AP_MONO }}>From scan: Magnesium sleep supplements · 2h ago</span>
      </div>

      <ApHero />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 12, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <ApFindingCards />
          <ApSignalCard />
          <ApEconCard />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ ...ntCard, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 550, color: NT.text, marginBottom: 6 }}>Next step</div>
            <div style={{ fontSize: 11.5, color: NT.text, lineHeight: 1.55, marginBottom: 11 }}>Add to pipeline and generate a campaign package to start validation testing.</div>
            <button className="dv2-btn-p" style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '8px 16px', borderRadius: 9, fontSize: 12, fontWeight: 500, fontFamily: NT.sans, cursor: 'pointer' }}>Add to pipeline</button>
          </div>
          <ApAnglesCard onExpand={() => setAngleMap(true)} />
          <ApSourcesCard onOpen={(k) => setDrawer(k)} />
        </div>
      </div>

      {DrawerComp && (
        <div className="ap-drawer-wrap" onClick={() => setDrawer(null)} style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          {DrawerComp({ onClose: () => setDrawer(null), onSwitch: (k) => setDrawer(k) })}
        </div>
      )}

      <AngleMap open={angleMap} onClose={() => setAngleMap(false)} />
    </>
  )
}
