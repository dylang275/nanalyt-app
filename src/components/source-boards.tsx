// source-boards.tsx — per-source evidence drawers (all 6 sources).
// Ported from design_handoff_nanalyt/source/source-boards.jsx. Image paths rooted at /uploads.
import { useState, type ReactNode } from 'react'
import { NT } from '../system/tokens'
import { HeroChart } from './HeroChart'

const S_SANS = NT.sans
const S_MONO = NT.mono

export type DrawerProps = { onClose: () => void; onSwitch: (key: string) => void }

// ── shared drawer primitives ──
function SBand({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 22px', background: 'var(--dv-page)', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}` }}>
      <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.text }}>{children}</span>
      {right && <span style={{ fontSize: 10.5, color: NT.text, fontFamily: S_MONO }}>{right}</span>}
    </div>
  )
}
function SCheck() {
  return <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><circle cx="7" cy="7" r="6.5" fill="var(--dv-green-bg)" /><path d="M4 7l2.5 2.5 4-4" stroke="var(--dv-green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function SCrit({ rows }: { rows: [string, string][] }) {
  return <>{rows.map(([l, v], i) => (
    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 230px', gap: 14, alignItems: 'center', padding: '10px 22px', borderBottom: i < rows.length - 1 ? `1px solid ${NT.borderS}` : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><SCheck /><span style={{ fontSize: 12, color: NT.text }}>{l}</span></div>
      <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{v}</span>
    </div>
  ))}</>
}
function SKpis({ items }: { items: [string, string, string?][] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 12, padding: '12px 22px 14px' }}>
      {items.map(([l, v, s], i) => (
        <div key={i} style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, color: NT.text, marginBottom: 3 }}>{l}</div>
          <div style={{ fontSize: 14.5, fontWeight: 550, color: NT.text, fontFamily: S_MONO, letterSpacing: '-0.02em', marginBottom: 2 }}>{v}</div>
          {s && <div style={{ fontSize: 10, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div>}
        </div>
      ))}
    </div>
  )
}
function SSummary({ children }: { children: ReactNode }) {
  return <div style={{ padding: '12px 22px 14px', fontSize: 11.5, color: NT.text, lineHeight: 1.6 }}>{children}</div>
}
function SQuote({ q, meta, tag }: { q: string; meta: string; tag?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '11px 22px', borderBottom: `1px solid ${NT.borderS}` }}>
      <div style={{ fontSize: 12, color: NT.text, lineHeight: 1.55 }}>"{q}"</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: NT.text, fontFamily: S_MONO }}>{meta}</span>
        {tag && <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '1.5px 7px', borderRadius: 8 }}>{tag}</span>}
      </div>
    </div>
  )
}
function SCross({ rows }: { rows: [string, string, string, boolean][] }) {
  return <>{rows.map(([sig, desc, tag, good], i) => (
    <div key={i} style={{ display: 'grid', gridTemplateColumns: '128px minmax(0,1fr) 96px', gap: 14, alignItems: 'center', padding: '10px 22px', borderBottom: i < rows.length - 1 ? `1px solid ${NT.borderS}` : 'none' }}>
      <span style={{ fontSize: 12, fontWeight: 550, color: NT.text }}>{sig}</span>
      <span style={{ fontSize: 11.5, color: NT.text }}>{desc}</span>
      <span style={{ fontSize: 10, fontWeight: 550, color: good ? NT.green : NT.text, background: good ? NT.greenBg : 'var(--dv-page)', border: good ? 'none' : `1px solid ${NT.borderS}`, padding: '2.5px 9px', borderRadius: 9, justifySelf: 'end', whiteSpace: 'nowrap' }}>{tag}</span>
    </div>
  ))}</>
}
function SDrawer({ abbr, name, pill, pillTone = 'green', meta, footerAction, onClose, onSwitch, children }: {
  abbr: string; name: string; pill: string; pillTone?: 'green' | 'plain'; meta: string; footerAction: string
  onClose: () => void; onSwitch: (key: string) => void; children: ReactNode
}) {
  const [switchOpen, setSwitchOpen] = useState(false)
  const S_SWITCH: [string, string][] = [['google', 'Google'], ['amazon', 'Amazon reviews'], ['reddit', 'Reddit'], ['tiktok', 'TikTok ads'], ['youtube', 'YouTube'], ['meta', 'Meta ads']]
  const pillStyles = pillTone === 'green'
    ? { color: NT.green, background: NT.greenBg }
    : { color: NT.text, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}` }
  return (
    <div style={{ width: '100%', height: '100%', background: 'rgba(16,24,15,0.18)', fontFamily: S_SANS, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 680, background: 'var(--dv-surf)', borderLeft: `1px solid ${NT.borderS}`, boxShadow: '-12px 0 40px rgba(16,24,15,0.14)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 22px 12px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: NT.text, flexShrink: 0 }}>{abbr}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 550, color: NT.text }}>{name}</span>
              <span style={{ fontSize: 10, fontWeight: 550, padding: '2px 9px', borderRadius: 9, whiteSpace: 'nowrap', ...pillStyles }}>{pill}</span>
            </div>
            <div style={{ fontSize: 10.5, color: NT.text, fontFamily: S_MONO }}>{meta}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setSwitchOpen((o) => !o)} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '7px 13px', borderRadius: 9, fontSize: 11.5, fontWeight: 450, fontFamily: S_SANS, cursor: 'pointer', whiteSpace: 'nowrap' }}>Switch source ▾</button>
              {switchOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 5px)', right: 0, background: 'var(--dv-surf)', border: `1px solid ${NT.border}`, borderRadius: 11, boxShadow: '0 8px 28px rgba(16,24,15,0.16)', padding: 5, zIndex: 10, minWidth: 160 }}>
                  {S_SWITCH.map(([key, label]) => (
                    <div key={key} className="dv2-row" onClick={() => { setSwitchOpen(false); onSwitch(key) }} style={{ fontSize: 11.5, fontWeight: label === name ? 550 : 450, color: NT.text, padding: '7px 11px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</div>
                  ))}
                </div>
              )}
            </div>
            <span onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${NT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: NT.text, fontSize: 12, flexShrink: 0 }}>✕</span>
          </div>
        </div>
        {children}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 9, justifyContent: 'flex-end', padding: '13px 22px', borderTop: `1px solid ${NT.borderS}` }}>
          <button onClick={onClose} style={{ background: 'var(--dv-surf)', color: NT.text, border: `1px solid ${NT.border}`, padding: '7.5px 14px', borderRadius: 9, fontSize: 12, fontWeight: 450, fontFamily: S_SANS, cursor: 'pointer' }}>Close</button>
          <button style={{ background: 'var(--dv-btn-bg)', color: 'var(--dv-btn-fg)', border: 'none', padding: '8px 16px', borderRadius: 9, fontSize: 12, fontWeight: 550, fontFamily: S_SANS, cursor: 'pointer' }}>{footerAction}</button>
        </div>
      </div>
    </div>
  )
}
function SAdCard({ img, fmt, title, sub, play }: { img: string; fmt: string; title: string; sub: string; play?: boolean }) {
  return (
    <div className="dv2-card-h" style={{ border: `1px solid ${NT.borderS}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: 'var(--dv-surf)' }}>
      <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={title} />
        <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, fontWeight: 600, color: '#fff', background: 'rgba(16,24,15,0.72)', padding: '2px 8px', borderRadius: 7 }}>{fmt}</span>
        {play && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(16,24,15,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="#fff"><path d="M0 0l10 6-10 6z" /></svg>
          </span>
        </span>}
      </div>
      <div style={{ padding: '8px 11px 10px' }}>
        <div style={{ fontSize: 11, fontWeight: 550, color: NT.text, marginBottom: 2, lineHeight: 1.35 }}>{title}</div>
        <div style={{ fontSize: 9.5, color: NT.text, fontFamily: S_MONO }}>{sub}</div>
      </div>
    </div>
  )
}

// ═══ GOOGLE ═══
export function SrcGoogle(props: DrawerProps) {
  return (
    <SDrawer {...props} abbr="G" name="Google" pill="Strong · 5 of 5 criteria" meta="Magnesium L-Threonate · updated 2h ago" footerAction="Open live SERP →">
      <SBand right="5 of 5 passed">Signal criteria</SBand>
      <SCrit rows={[
        ['Search trend positive or stable (30d & 90d)', '+0.08% (30d) · +0.24% (90d)'],
        ['Commercial intent on SERP', 'Mixed-commercial'],
        ['Non-big-box sellers above threshold', '5 of 6 results'],
        ['Healthy price distribution', '$28–$48 spread · stable 60d'],
        ['Volume across multiple intent tiers', '2 tiers · 18k/mo total'],
      ]} />
      <SBand right="vs category median">At a glance</SBand>
      <SKpis items={[
        ['30d trend slope', '+0.08%', 'median 0.04%'],
        ['Keyword volume', '18k/mo', 'median 14k/mo'],
        ['Non-big-box', '5', 'median 6'],
        ['Shopping sellers', '11', 'median 13'],
        ['Price spread', '$28–$48', 'median $31'],
      ]} />
      <SBand right="30 days · sustained 90d">Search interest</SBand>
      <div style={{ padding: '10px 22px 4px' }}>
        <HeroChart vals={[2, 1, 2, 2, 3, 2, 3, 3, 4, 3, 4, 5, 4, 5, 6, 8]} color="var(--dv-green-br)" fmt={(v) => `${v} idx`} uid="srcGoog" h={110} w={620} />
      </div>
      <SSummary><span style={{ fontWeight: 550 }}>Stable positive trajectory, not a one-month spike.</span> SERP mixes informational and commercial results; prices span $28–$48 with no compression over 60 days. Real search demand with room for a new entrant.</SSummary>
      <SBand right="18k/mo · 3 buckets">Keywords</SBand>
      <div style={{ padding: '12px 22px 4px' }}>
        <div style={{ display: 'flex', height: 8, borderRadius: 3, overflow: 'hidden', gap: 2, marginBottom: 7 }}>
          <div style={{ flex: 52, background: 'var(--dv-green-br)' }}></div>
          <div style={{ flex: 41, background: 'rgba(92,184,119,0.55)' }}></div>
          <div style={{ flex: 7, background: 'rgba(92,184,119,0.25)' }}></div>
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 4 }}>
          {([['Cognitive BOF', '52%'], ['Sleep BOF', '41%'], ['Category BOF', '7%']] as [string, string][]).map(([l, p], i) => (
            <span key={i} style={{ fontSize: 10.5, color: NT.text }}><span style={{ fontWeight: 550 }}>{l}</span> <span style={{ fontFamily: S_MONO }}>{p}</span></span>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 110px 76px 60px 90px', gap: 12, padding: '7px 22px', borderTop: `1px solid ${NT.borderS}`, borderBottom: `1px solid ${NT.borderS}`, background: 'var(--dv-page)' }}>
        {['Keyword', 'Tier', 'Volume', 'CPC', 'Competition'].map((h, i) => <div key={i} style={{ fontSize: 10.5, fontWeight: 500, color: NT.text, textAlign: i > 1 ? 'right' : 'left' }}>{h}</div>)}
      </div>
      {([
        ['magnesium l threonate', 'Cognitive', '4,200', '$1.42', 'Medium'],
        ['magnesium l threonate sleep', 'Sleep', '3,900', '$1.61', 'Medium'],
        ['magtein', 'Cognitive', '2,800', '$1.18', 'Low'],
        ['magnesium threonate for sleep', 'Sleep', '2,200', '$1.83', 'Low'],
        ['magnesium for brain', 'Cognitive', '1,650', '$1.94', 'Medium'],
        ['magtein sleep', 'Sleep', '1,400', '$1.44', 'Low'],
        ['best magnesium for memory', 'Category', '1,290', '$2.18', 'High'],
      ] as [string, string, string, string, string][]).map(([kw, tier, vol, cpc, comp], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 110px 76px 60px 90px', gap: 12, alignItems: 'center', padding: '9px 22px', borderBottom: i < 6 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12, color: NT.text }}>{kw}</span>
          <span style={{ fontSize: 10.5, color: NT.text, fontFamily: S_MONO }}>{tier}</span>
          <span style={{ fontSize: 11.5, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{vol}</span>
          <span style={{ fontSize: 11.5, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{cpc}</span>
          <span style={{ fontSize: 10, fontWeight: 550, color: comp === 'Low' ? NT.green : comp === 'High' ? NT.red : NT.yellow, background: comp === 'Low' ? NT.greenBg : comp === 'High' ? 'rgba(178,58,58,0.08)' : 'rgba(178,134,58,0.1)', padding: '2px 9px', borderRadius: 9, justifySelf: 'end' }}>{comp}</span>
        </div>
      ))}
      <SBand right={'sampled: "magnesium l threonate"'}>SERP composition</SBand>
      <SKpis items={[
        ['Shopping ads', '8', 'on sampled SERP'],
        ['Search ads', '2', 'on sampled SERP'],
        ['Big-box dominance', '0%', 'below 50% threshold'],
        ['Non-big-box', '5 of 6', 'top 10 domains'],
      ]} />
      {([
        ['1', 'purerawz.com', 'Non-big-box', true], ['2', 'amazon.com', 'Big-box', false], ['3', 'nootropicsdepot.com', 'Non-big-box', true],
        ['4', 'jarrow.com', 'Non-big-box', true], ['5', 'iherb.com', 'Non-big-box', true], ['6', 'swansonvitamins.com', 'Non-big-box', true],
      ] as [string, string, string, boolean][]).map(([n, d, bb, good], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '26px minmax(0,1fr) 110px 70px', gap: 12, alignItems: 'center', padding: '8.5px 22px', borderTop: i === 0 ? `1px solid ${NT.borderS}` : 'none', borderBottom: `1px solid ${NT.borderS}` }}>
          <span style={{ fontSize: 10.5, color: NT.text, fontFamily: S_MONO }}>{n}</span>
          <span style={{ fontSize: 12, color: NT.text }}>{d}</span>
          <span style={{ fontSize: 10, fontWeight: 550, color: good ? NT.green : NT.text, background: good ? NT.greenBg : 'var(--dv-page)', border: good ? 'none' : `1px solid ${NT.borderS}`, padding: '2px 9px', borderRadius: 9, justifySelf: 'start' }}>{bb}</span>
          <span style={{ fontSize: 10.5, fontWeight: 500, color: NT.text, justifySelf: 'end', cursor: 'pointer' }}>View →</span>
        </div>
      ))}
      <SBand right="11 sellers · $28–$48">Shopping sellers</SBand>
      {([
        ['amazon.com', '$34.95', '4,280', 'Running'], ['iherb.com', '$32.40', '1,840', 'Running'], ['nootropicsdepot.com', '$28.00', '3,100', '—'],
        ['jarrow.com', '$31.50', '890', 'Running'], ['swansonvitamins.com', '$29.99', '445', '—'],
      ] as [string, string, string, string][]).map(([s, p, rv, ad], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 76px 76px 90px', gap: 12, alignItems: 'center', padding: '8.5px 22px', borderBottom: i < 4 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12, color: NT.text }}>{s}</span>
          <span style={{ fontSize: 11.5, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{p}</span>
          <span style={{ fontSize: 11.5, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{rv}</span>
          {ad === 'Running'
            ? <span style={{ fontSize: 10, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2px 9px', borderRadius: 9, justifySelf: 'end' }}>Running</span>
            : <span style={{ fontSize: 11.5, color: NT.text, fontFamily: S_MONO, justifySelf: 'end' }}>—</span>}
        </div>
      ))}
      <div style={{ padding: '9px 22px 11px', borderTop: `1px solid ${NT.borderS}`, fontSize: 10.5, color: NT.text }}><span style={{ fontWeight: 550 }}>Price stability (60d):</span> stable — no compression trend. Margin environment looks durable. +6 more sellers in the full set.</div>
      <SBand right="vs 5 other sources">Cross-source agreement</SBand>
      <SCross rows={[
        ['Top angle', 'Cognitive — agrees with TikTok, Amazon, YouTube, Meta', 'Agree', true],
        ['Demand direction', 'Active — 18k/mo, agrees everywhere', 'Agree', true],
        ['Sentiment', 'Not in SERP text — Amazon and Reddit carry this signal', 'Coverage gap', false],
      ]} />
    </SDrawer>
  )
}

// ═══ AMAZON REVIEWS ═══
export function SrcAmazon(props: DrawerProps) {
  const dist: [string, number][] = [['5★', 58], ['4★', 24], ['3★', 9], ['2★', 5], ['1★', 4]]
  return (
    <SDrawer {...props} abbr="A" name="Amazon reviews" pill="Strong · 84 mentions" meta="Magnesium L-Threonate · 4.4★ avg · updated 2h ago" footerAction="View all 84 mentions →">
      <SBand right="30 days">At a glance</SBand>
      <SKpis items={[
        ['Review mentions', '84', 'across 6 listings'],
        ['Average rating', '4.4★', 'category avg 4.2★'],
        ['Mention velocity', '+3.2/wk', 'vs 0 five weeks ago'],
        ['Verified purchase', '91%', 'of sampled reviews'],
      ]} />
      <SBand right="84 mentions · 30d">Mention velocity</SBand>
      <div style={{ padding: '10px 22px 4px' }}>
        <HeroChart vals={[0, 0.5, 1, 1.5, 1.8, 2.1, 1.4, 2.3, 2.8, 3.2, 3, 3.5]} color="var(--dv-green-br)" fmt={(v) => `${v.toFixed(1)}/wk`} uid="srcAmz" h={110} w={620} />
      </div>
      <SSummary><span style={{ fontWeight: 550 }}>Weekly review mentions climbing — 3.2× YoY.</span> Organic demand is accelerating, not spiking. Buyers describe outcomes in cognitive language far more than the category baseline.</SSummary>
      <SBand right="84 reviews sampled">Rating distribution</SBand>
      <div style={{ padding: '12px 22px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {dist.map(([l, p], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO, minWidth: 24 }}>{l}</span>
            <div style={{ flex: 1, height: 5, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${p}%`, height: '100%', background: i < 2 ? 'var(--dv-green-br)' : i === 2 ? NT.yellow : NT.red, borderRadius: 2 }}></div>
            </div>
            <span style={{ fontSize: 10.5, color: NT.text, fontFamily: S_MONO, minWidth: 32, textAlign: 'right' }}>{p}%</span>
          </div>
        ))}
      </div>
      <SBand right="from 84 mentions">Angles in buyer language</SBand>
      {([
        ['Cognitive / focus', '71 of 84', '85%', true],
        ['Sleep quality', '38 of 84', '45%', true],
        ['Stress & calm', '22 of 84', '26%', false],
        ['Value & dosage', '9 of 84', '11%', false],
      ] as [string, string, string, boolean][]).map(([a, n, p, top], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 90px 50px', gap: 12, alignItems: 'center', padding: '9.5px 22px', borderBottom: i < 3 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: top ? 550 : 475, color: NT.text }}>{a}{top && <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '1.5px 7px', borderRadius: 8, marginLeft: 8 }}>Top angle</span>}</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{n}</span>
          <span style={{ fontSize: 11, fontWeight: 550, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{p}</span>
        </div>
      ))}
      <SBand right="63 phrases extracted">Buyer language</SBand>
      <SQuote q="The brain fog lift is real — I noticed sharper recall within two weeks. I bought it for sleep but I'm staying for the focus." meta="4.4★ · Verified purchase · 12d ago" tag="Cognitive" />
      <SQuote q="Fall asleep faster and wake up actually rested. No next-day grogginess like melatonin." meta="5★ · Verified purchase · 8d ago" tag="Sleep" />
      <SQuote q="Wish the capsules were smaller and it's pricier than regular magnesium, but it's the only form that worked." meta="4★ · Verified purchase · 19d ago" tag="Objection · price" />
      <SBand right="2 recurring">Objections</SBand>
      {([
        ['Taste / capsule size', '14 mentions', 'address in PDP copy'],
        ['Price vs regular magnesium', '6 mentions', 'justify with form-factor science'],
      ] as [string, string, string][]).map(([o, n, note], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 100px 220px', gap: 12, alignItems: 'center', padding: '9.5px 22px', borderBottom: i < 1 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 550, color: NT.text }}>{o}</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO }}>{n}</span>
          <span style={{ fontSize: 11, color: NT.text, textAlign: 'right' }}>{note}</span>
        </div>
      ))}
      <SBand right="vs 5 other sources">Cross-source agreement</SBand>
      <SCross rows={[
        ['Top angle', 'Cognitive — agrees with TikTok, Google, YouTube, Meta', 'Agree', true],
        ['Sentiment', 'Positive 4.4★ — agrees with Reddit and YouTube', 'Agree', true],
        ['Top objection', 'Taste — only Reddit also surfaces an objection (price)', 'Partial', false],
      ]} />
    </SDrawer>
  )
}

// ═══ REDDIT ═══
export function SrcReddit(props: DrawerProps) {
  return (
    <SDrawer {...props} abbr="R" name="Reddit" pill="Strong · pos/neg 3.4:1" meta="Magnesium L-Threonate · 29 posts · 3 subreddits · updated 2h ago" footerAction="View all 29 threads →">
      <SBand right="30 days">At a glance</SBand>
      <SKpis items={[
        ['Threads', '29', 'in 30 days'],
        ['Subreddits', '3', 'sleep · Nootropics · Supplements'],
        ['Sentiment ratio', '3.4:1', 'positive : negative'],
        ['Comment volume', '610', 'across threads'],
      ]} />
      <SBand right="by mention share">Subreddits</SBand>
      {([
        ['r/Nootropics', '14 threads', 'focus & memory framing', 52],
        ['r/sleep', '9 threads', 'deep-sleep & wake-quality framing', 31],
        ['r/Supplements', '6 threads', 'form-factor comparisons', 17],
      ] as [string, string, string, number][]).map(([sub, n, fr, p], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 90px minmax(0,1fr) 110px', gap: 12, alignItems: 'center', padding: '9.5px 22px', borderBottom: i < 2 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 550, color: NT.text, fontFamily: S_MONO }}>{sub}</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO }}>{n}</span>
          <span style={{ fontSize: 11.5, color: NT.text }}>{fr}</span>
          <div style={{ height: 4, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${p}%`, height: '100%', background: 'var(--dv-green-br)', borderRadius: 2 }}></div>
          </div>
        </div>
      ))}
      <SBand right="top 4 by engagement">Threads</SBand>
      {([
        ['Magnesium L-Threonate completely changed my deep sleep — AMA', 'r/sleep', '214 upvotes · 89 comments', 'Positive'],
        ['Magtein vs glycinate for cognition — 60-day self test', 'r/Nootropics', '187 upvotes · 64 comments', 'Positive'],
        ['Is L-Threonate worth 3× the price of citrate?', 'r/Supplements', '96 upvotes · 41 comments', 'Mixed'],
        ['Two weeks on threonate: focus is up, dreams are wild', 'r/Nootropics', '73 upvotes · 28 comments', 'Positive'],
      ] as [string, string, string, string][]).map(([t, sub, eng, sent], i) => (
        <div key={i} className="dv2-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 110px 170px 70px', gap: 12, alignItems: 'center', padding: '10.5px 22px', borderBottom: i < 3 ? `1px solid ${NT.borderS}` : 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: 12, fontWeight: 525, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t}</span>
          <span style={{ fontSize: 10.5, color: NT.text, fontFamily: S_MONO }}>{sub}</span>
          <span style={{ fontSize: 10.5, color: NT.text, fontFamily: S_MONO }}>{eng}</span>
          <span style={{ fontSize: 10, fontWeight: 550, color: sent === 'Positive' ? NT.green : NT.yellow, background: sent === 'Positive' ? NT.greenBg : 'rgba(178,134,58,0.1)', padding: '2px 9px', borderRadius: 9, justifySelf: 'end' }}>{sent}</span>
        </div>
      ))}
      <SBand right="from 610 comments">Community language</SBand>
      <SQuote q="It's the only magnesium form that crosses the blood-brain barrier meaningfully. For focus it beats everything else I've stacked." meta="r/Nootropics · 187 upvotes thread" tag="Cognitive" />
      <SQuote q="My sleep tracker shows +40 min deep sleep on threonate nights. Placebo or not, I'm keeping it." meta="r/sleep · 214 upvotes thread" tag="Sleep" />
      <SQuote q="The price is the only thing stopping me from recommending it to everyone." meta="r/Supplements · 96 upvotes thread" tag="Objection · price" />
      <SBand right="vs 5 other sources">Cross-source agreement</SBand>
      <SCross rows={[
        ['Top angle', 'Sleep — differs from the cognitive consensus elsewhere', 'Differ', false],
        ['Sentiment', 'Positive 3.4:1 — agrees with Amazon and YouTube', 'Agree', true],
        ['Top objection', 'Price — Amazon surfaces taste instead', 'Partial', false],
      ]} />
      <SSummary><span style={{ fontWeight: 550 }}>Why the angle differs:</span> r/sleep over-indexes in engagement, not volume. By thread count, cognitive framing still leads — treat sleep as the secondary angle, not a contradiction.</SSummary>
    </SDrawer>
  )
}

// ═══ TIKTOK ADS ═══
export function SrcTikTok(props: DrawerProps) {
  return (
    <SDrawer {...props} abbr="T" name="TikTok ads" pill="Strong · low saturation" meta="Magnesium L-Threonate · 12 ads · 4 advertisers · updated 2h ago" footerAction="View all 12 ads →">
      <SBand right="30 days">At a glance</SBand>
      <SKpis items={[
        ['Active ads', '12', 'across the niche'],
        ['Advertisers', '4', 'unique pages'],
        ['Sponsored density', '8%', 'of niche content'],
        ['Longest-running', '21d', 'UGC creator review'],
      ]} />
      <SBand right="4 of 12 shown">Active creatives</SBand>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, padding: '12px 22px 14px' }}>
        <SAdCard img="/uploads/IMG_3495.PNG" fmt="UGC" title="Creator review · focus hook" sub="9:16 · 21d running" play />
        <SAdCard img="/uploads/IMG_3499.PNG" fmt="Video" title="Ingredient story · Magtein" sub="9:16 · 14d running" play />
        <SAdCard img="/uploads/IMG_3486.jpg" fmt="UGC" title="Sleep routine · tracker proof" sub="9:16 · 9d running" play />
        <SAdCard img="/uploads/IMG_3488.jpg" fmt="Video" title="Morning clarity · day-in-life" sub="9:16 · 6d running" play />
      </div>
      <SBand right="by ad count">Advertisers</SBand>
      {([
        ['Neuro Lab Co.', '5 ads', 'Cognitive', 'est. $8–12k/mo'],
        ['Calm Stack', '3 ads', 'Sleep', 'est. $4–6k/mo'],
        ['VitaCore', '2 ads', 'Cognitive', 'est. $2–4k/mo'],
        ['PureForm', '2 ads', 'Value', 'est. $1–2k/mo'],
      ] as [string, string, string, string][]).map(([a, n, angle, spend], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 70px 110px 130px', gap: 12, alignItems: 'center', padding: '9.5px 22px', borderBottom: i < 3 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 525, color: NT.text }}>{a}</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO }}>{n}</span>
          <span style={{ fontSize: 10, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2px 9px', borderRadius: 9, justifySelf: 'start' }}>{angle}</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{spend}</span>
        </div>
      ))}
      <SBand right="from 12 ads">Hooks in market</SBand>
      <SQuote q="POV: you found the only magnesium that actually works on your brain" meta="Neuro Lab Co. · UGC · 21d running" tag="Cognitive" />
      <SQuote q="My sleep score went from 68 to 84 — here's the only thing I changed" meta="Calm Stack · UGC · 9d running" tag="Sleep" />
      <SQuote q="Neurologists have been quietly taking this form of magnesium for years" meta="VitaCore · Video · 14d running" tag="Authority" />
      <SBand right="vs 5 other sources">Cross-source agreement</SBand>
      <SCross rows={[
        ['Top angle', 'Cognitive 4 of 4 lead ads — agrees with Amazon, Google, YouTube, Meta', 'Agree', true],
        ['Demand direction', 'Active — 12 running ads, agrees everywhere', 'Agree', true],
        ['Saturation', '8% density — well below the 20% crowding threshold', 'Low', true],
      ]} />
      <SSummary><span style={{ fontWeight: 550 }}>Read:</span> four small advertisers, none with creative volume. The cognitive hook is proven but uncrowded — first mover with real creative output takes the angle.</SSummary>
    </SDrawer>
  )
}

// ═══ YOUTUBE ═══
export function SrcYouTube(props: DrawerProps) {
  return (
    <SDrawer {...props} abbr="Y" name="YouTube" pill="Moderate · view:sub 0.2×" pillTone="plain" meta="Magnesium L-Threonate · 11 videos · 89k views · updated 2h ago" footerAction="View all 11 videos →">
      <SBand right="trailing 12 months">At a glance</SBand>
      <SKpis items={[
        ['Videos', '11', 'review & science'],
        ['Total views', '89k', 'median 4.2k/video'],
        ['View:sub ratio', '0.2×', 'below 1.0× breakout'],
        ['Comment sentiment', 'Positive', 'outcome-focused'],
      ]} />
      <SBand right="top 5 by views">Videos</SBand>
      {([
        ['Magnesium L-Threonate: 6-month results for memory & focus', 'Dr. Brad Stanfield', '31k views', '9 mo ago', 'Cognitive'],
        ['I tried Magtein for 30 days — sleep tracker data inside', 'Sleep Diplomat', '22k views', '5 mo ago', 'Sleep'],
        ['The ONLY magnesium that reaches your brain (science explained)', 'Physionic', '14k views', '11 mo ago', 'Cognitive'],
        ['Threonate vs Glycinate vs Citrate — which one for what', 'Supplement Sleuth', '9k views', '3 mo ago', 'Comparison'],
        ['Why neurologists recommend magnesium L-threonate', 'Brain Health TV', '6k views', '7 mo ago', 'Cognitive'],
      ] as [string, string, string, string, string][]).map(([t, ch, v, age, angle], i) => (
        <div key={i} className="dv2-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 130px 76px 70px 92px', gap: 12, alignItems: 'center', padding: '10.5px 22px', borderBottom: i < 4 ? `1px solid ${NT.borderS}` : 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: 12, fontWeight: 525, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t}</span>
          <span style={{ fontSize: 10.5, color: NT.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch}</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{v}</span>
          <span style={{ fontSize: 10.5, color: NT.text, fontFamily: S_MONO, textAlign: 'right' }}>{age}</span>
          <span style={{ fontSize: 10, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '2px 9px', borderRadius: 9, justifySelf: 'end' }}>{angle}</span>
        </div>
      ))}
      <SBand right="9 of 11 videos">Angle mix</SBand>
      {([
        ['Cognitive / memory', '9 of 11 videos', 82, true],
        ['Sleep quality', '5 of 11 videos', 45, false],
        ['Form comparison', '3 of 11 videos', 27, false],
      ] as [string, string, number, boolean][]).map(([a, n, p, top], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 110px 160px', gap: 12, alignItems: 'center', padding: '9.5px 22px', borderBottom: i < 2 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: top ? 550 : 475, color: NT.text }}>{a}{top && <span style={{ fontSize: 9.5, fontWeight: 550, color: NT.green, background: NT.greenBg, padding: '1.5px 7px', borderRadius: 8, marginLeft: 8 }}>Top angle</span>}</span>
          <span style={{ fontSize: 11, color: NT.text, fontFamily: S_MONO }}>{n}</span>
          <div style={{ height: 4, background: 'var(--dv-page)', border: `1px solid ${NT.borderS}`, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${p}%`, height: '100%', background: 'var(--dv-green-br)', borderRadius: 2 }}></div>
          </div>
        </div>
      ))}
      <SBand right="from comments">Viewer language</SBand>
      <SQuote q="Three weeks in and my word recall is noticeably better. This video convinced me to switch from glycinate." meta="31k-view video · top comment · 412 likes" tag="Cognitive" />
      <SQuote q="The tracker data sold me. Deep sleep numbers don't lie." meta="22k-view video · top comment · 188 likes" tag="Sleep" />
      <SBand right="vs 5 other sources">Cross-source agreement</SBand>
      <SCross rows={[
        ['Top angle', 'Cognitive 9 of 11 — agrees with Amazon, Google, TikTok, Meta', 'Agree', true],
        ['Sentiment', 'Positive comments — agrees with Amazon and Reddit', 'Agree', true],
        ['Demand direction', 'Moderate — 0.2× view:sub, softer than other sources', 'Differ', false],
      ]} />
      <SSummary><span style={{ fontWeight: 550 }}>Why demand reads softer:</span> coverage is creator-review content, not search-driven — views track channel size, not product interest. Treat YouTube as angle validation, not a demand signal.</SSummary>
    </SDrawer>
  )
}

// ═══ META ADS ═══
export function SrcMeta(props: DrawerProps) {
  return (
    <SDrawer {...props} abbr="M" name="Meta ads" pill="Strong · 1 advertiser" meta="Magnesium L-Threonate · 8 ads · 1 page · updated 2h ago" footerAction="View all 8 ads →">
      <SBand right="Ad Library · 30 days">At a glance</SBand>
      <SKpis items={[
        ['Active ads', '8', 'single page'],
        ['Advertisers', '1', 'Neuro Lab Co.'],
        ['Formats', '3', 'static · video · carousel'],
        ['Longest-running', '18d', 'static product still'],
      ]} />
      <SBand right="3 of 8 shown">Active creatives</SBand>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '12px 22px 14px' }}>
        <SAdCard img="/uploads/Screenshot 2026-05-13 at 10.15.26 PM.png" fmt="Static" title="Product still · evening ritual" sub="1:1 · 18d running" play={false} />
        <SAdCard img="/uploads/IMG_3488.jpg" fmt="Video" title="Science explainer · brain barrier" sub="4:5 · 12d running" play />
        <SAdCard img="/uploads/IMG_3486.jpg" fmt="UGC" title="Creator testimonial · focus" sub="9:16 · 8d running" play />
      </div>
      <SBand right="Neuro Lab Co.">Advertiser</SBand>
      {([
        ['Page', 'Neuro Lab Co. · 24k followers'],
        ['Ads launched (90d)', '19 total · 8 still active'],
        ['Creative cadence', '~2 new ads/wk · iterating on cognitive hooks'],
        ['Estimated spend', '$10–15k/mo across Meta placements'],
      ] as [string, string][]).map(([l, v], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '170px minmax(0,1fr)', gap: 14, alignItems: 'center', padding: '9.5px 22px', borderBottom: i < 3 ? `1px solid ${NT.borderS}` : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 550, color: NT.text }}>{l}</span>
          <span style={{ fontSize: 11.5, color: NT.text, fontFamily: S_MONO }}>{v}</span>
        </div>
      ))}
      <SBand right="from 8 ads">Hooks in market</SBand>
      <SQuote q="Most magnesium never reaches your brain. This one was designed to." meta="Neuro Lab Co. · static · 18d running" tag="Cognitive" />
      <SQuote q="The form neuroscientists chose for their own families" meta="Neuro Lab Co. · video · 12d running" tag="Authority" />
      <SBand right="vs 5 other sources">Cross-source agreement</SBand>
      <SCross rows={[
        ['Top angle', 'Cognitive 7 of 8 ads — agrees with Amazon, Google, TikTok, YouTube', 'Agree', true],
        ['Demand direction', 'Active — sustained spend from one page', 'Agree', true],
        ['Competition', '1 advertiser — lowest concentration of any channel', 'Low', true],
      ]} />
      <SSummary><span style={{ fontWeight: 550 }}>Read:</span> Meta is a one-player channel right now. Neuro Lab Co. is proving the cognitive angle converts — and nobody is contesting the auction. Second entrant economics are unusually good.</SSummary>
    </SDrawer>
  )
}

export const SOURCE_DRAWERS: Record<string, (p: DrawerProps) => ReactNode> = {
  google: SrcGoogle, amazon: SrcAmazon, reddit: SrcReddit, tiktok: SrcTikTok, youtube: SrcYouTube, meta: SrcMeta,
}
