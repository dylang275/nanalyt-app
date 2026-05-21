import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Shared atoms ────────────────────────────────────────────────────────────

function SectionHead({ title, badge, link }: {
  title: string; badge?: string; link?: { label: string; fn: () => void };
}) {
  return (
    <div className="flex items-center gap-2 mb-3 font-sans">
      <span className="text-[14px] font-semibold text-ink whitespace-nowrap">{title}</span>
      {badge && (
        <span className="text-[9px] font-semibold bg-brand-bg text-brand px-[7px] py-[2px] rounded tracking-[0.04em] whitespace-nowrap">
          {badge}
        </span>
      )}
      {link && (
        <span
          onClick={link.fn}
          className="text-[11px] text-ink cursor-pointer flex items-center gap-1 whitespace-nowrap ml-auto hover:text-ink"
        >
          {link.label}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" />
          </svg>
        </span>
      )}
    </div>
  )
}

// ─── Market signals ──────────────────────────────────────────────────────────

function SignalCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2">
      <div className="text-[10px] font-medium text-ink uppercase tracking-[0.04em]">{label}</div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function SignalDivider() {
  return <div className="w-px h-9 bg-[#6b7280] self-center shrink-0" />
}

function MarketSignals() {
  return (
    <div className="flex items-stretch gap-4">
      <SignalCard label="FINDINGS · 7D">
        <div className="text-[26px] font-medium text-ink leading-none mb-1.5">14</div>
        <div className="text-[11px]">
          <span className="text-[#2d5c3a] font-medium">↑ +5</span>
          <span className="text-ink"> vs prior</span>
        </div>
      </SignalCard>

      <SignalDivider />

      <SignalCard label="MER">
        <div className="text-[26px] font-medium text-ink leading-none mb-1.5">3.42</div>
        <div className="text-[11px]">
          <span className="text-[#2d5c3a] font-medium">↑ +0.18</span>
          <span className="text-ink"> vs prior</span>
        </div>
      </SignalCard>

      <SignalDivider />

      <SignalCard label="TOP PRODUCT">
        <div className="flex items-center gap-2.5">
          <img
            src="/uploads/IMG_3472.jpg"
            alt=""
            className="w-7 h-7 rounded-[5px] object-cover shrink-0 border-[0.5px] border-[#e5e7eb]"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-ink truncate">Mag Glycinate</div>
            <div className="text-[10px] font-medium text-[#2d5c3a]">+23% rev</div>
          </div>
        </div>
      </SignalCard>

      <SignalDivider />

      <SignalCard label="TOP CREATIVE">
        <div className="flex items-center gap-2.5">
          <img
            src="/uploads/IMG_3486.jpg"
            alt=""
            className="w-9 h-9 rounded-[5px] object-cover shrink-0 border-[0.5px] border-[#e5e7eb]"
          />
          <div className="min-w-0 flex-1">
            <div className="text-base font-medium text-ink leading-[1.1]">82</div>
            <div className="text-[10px] text-ink">CTR 4.8%</div>
          </div>
        </div>
      </SignalCard>

      <SignalDivider />

      <SignalCard label="ACTIVE TESTS">
        <div className="text-[26px] font-medium text-ink leading-none mb-1.5">1</div>
        <div className="text-[11px] text-ink">2 completed 7d</div>
      </SignalCard>
    </div>
  )
}

// ─── Trend chart ─────────────────────────────────────────────────────────────

const CHART_DATA = {
  sentiment30: [62, 61, 64, 63, 65, 64, 62, 63, 64, 66, 65, 67, 66, 64, 65, 66, 68, 67, 69, 68, 66, 67, 68, 70, 69, 71, 70, 68, 69, 70],
  entrants30: [1, 0, 2, 1, 0, 1, 0, 3, 1, 0, 0, 2, 1, 0, 0, 1, 2, 1, 0, 4, 2, 1, 0, 1, 3, 2, 1, 0, 2, 3],
  magRev30: [580, 620, 750, 840, 960, 1050, 780, 650, 720, 880, 1020, 1140, 1060, 820, 700, 780, 920, 1080, 1200, 1140, 860, 720, 820, 980, 1160, 1280, 1200, 940, 780, 860],
  vitRev30: [620, 660, 700, 720, 760, 780, 740, 700, 740, 780, 820, 860, 820, 760, 740, 780, 840, 880, 920, 880, 820, 800, 860, 920, 980, 1020, 980, 900, 860, 940],
  zzRev30: [480, 520, 610, 680, 720, 710, 550, 460, 490, 570, 620, 680, 660, 510, 440, 460, 530, 580, 630, 610, 470, 420, 450, 510, 560, 580, 550, 430, 390, 410],
  ashRev30: [45, 60, 80, 95, 110, 120, 90, 70, 85, 110, 130, 150, 160, 130, 100, 120, 145, 175, 190, 200, 180, 150, 170, 195, 220, 245, 230, 195, 175, 190],
  bizRev30: [2800, 3200, 4100, 4800, 5500, 5800, 4200, 3000, 3500, 4400, 5200, 5900, 6100, 4600, 3200, 3600, 4600, 5500, 6200, 6400, 4900, 3400, 3800, 4800, 5600, 6300, 6500, 5000, 3500, 3700],
  bizSpend30: [800, 900, 1100, 1200, 1400, 1500, 1100, 800, 950, 1150, 1350, 1550, 1600, 1250, 880, 980, 1250, 1500, 1650, 1700, 1350, 950, 1050, 1300, 1550, 1700, 1750, 1400, 980, 1050],
  sentiment7: [68, 68, 70, 69, 71, 70, 70],
  entrants7: [1, 3, 2, 1, 0, 2, 3],
  magRev7: [780, 920, 1080, 1200, 1140, 860, 860],
  vitRev7: [800, 860, 920, 980, 1020, 900, 940],
  zzRev7: [460, 530, 580, 630, 610, 430, 410],
  ashRev7: [150, 170, 195, 220, 245, 230, 190],
  bizRev7: [3600, 4600, 5500, 6200, 6400, 5000, 3700],
  bizSpend7: [980, 1250, 1500, 1650, 1700, 1400, 1050],
  sentiment90: [58, 57, 59, 60, 59, 61, 60, 59, 61, 62, 61, 63, 62, 61, 62, 63, 62, 64, 63, 62, 63, 64, 63, 65, 64, 63, 65, 64, 65, 66, 65, 64, 66, 65, 64, 66, 65, 65, 66, 67, 66, 65, 66, 67, 66, 68, 67, 66, 67, 68, 67, 66, 68, 67, 67, 68, 67, 68, 69, 68, 67, 69, 68, 68, 69, 68, 69, 70, 69, 68, 69, 68, 69, 70, 69, 70, 70, 69, 70, 70, 69, 71, 70, 69, 70, 69, 70, 70, 71, 70],
  entrants90: [0, 1, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1, 0, 0, 1, 2, 1, 0, 1, 0, 1, 2, 0, 0, 1, 2, 1, 0, 3, 1, 0, 1, 2, 0, 1, 0, 0, 2, 1, 0, 1, 2, 0, 1, 0, 0, 1, 2, 3, 1, 0, 1, 2, 1, 0, 1, 2, 3, 2, 0, 1, 0, 1, 2, 1, 0, 1, 3, 2, 0, 1, 2, 1, 0, 0, 1, 2, 1, 0, 2, 3, 1, 0, 1, 3, 2, 1, 0, 3],
  magRev90: [420, 480, 580, 660, 760, 800, 600, 520, 560, 680, 780, 880, 840, 660, 580, 600, 720, 840, 940, 900, 700, 600, 680, 800, 920, 1020, 980, 780, 660, 720, 840, 940, 1060, 1000, 800, 720, 800, 920, 1040, 1120, 1060, 860, 740, 820, 940, 1080, 1180, 1120, 920, 820, 900, 1040, 1200, 1320, 1260, 1020, 880, 960, 1100, 1260, 1380, 1340, 1100, 960, 1040, 1180, 1340, 1460, 1400, 1160, 1020, 1100, 1240, 1400, 1520, 1480, 1240, 1100, 1180, 1320, 1480, 1600, 1560, 1320, 1180, 1280, 1440, 1600, 1720],
  vitRev90: [480, 500, 540, 560, 600, 580, 540, 520, 560, 600, 620, 660, 640, 600, 580, 600, 640, 680, 700, 680, 640, 620, 660, 700, 740, 760, 720, 680, 660, 700, 740, 780, 800, 760, 720, 700, 740, 780, 820, 840, 800, 760, 740, 780, 820, 860, 880, 840, 800, 780, 820, 860, 900, 920, 880, 840, 820, 860, 900, 940, 960, 920, 880, 860, 900, 940, 980, 1000, 960, 920, 900, 940, 980, 1020, 1040, 1000, 960, 940, 980, 1020, 1060, 1080, 1040, 1000, 980, 1020, 1060, 1100, 1140, 1100],
  zzRev90: [580, 620, 740, 820, 880, 870, 670, 560, 600, 700, 760, 840, 810, 630, 540, 560, 650, 720, 780, 760, 580, 510, 550, 640, 700, 730, 710, 540, 470, 510, 590, 650, 740, 720, 560, 490, 540, 630, 700, 750, 720, 560, 480, 520, 610, 680, 730, 710, 540, 470, 510, 590, 650, 710, 690, 530, 460, 500, 580, 640, 700, 680, 520, 450, 490, 570, 630, 690, 670, 510, 440, 480, 560, 620, 680, 660, 500, 430, 470, 550, 600, 660, 640, 490, 420, 460, 540, 590, 650, 630],
  ashRev90: [0, 0, 5, 8, 10, 12, 8, 5, 8, 12, 18, 22, 25, 18, 12, 15, 22, 30, 36, 40, 32, 22, 28, 36, 46, 54, 50, 38, 30, 38, 48, 60, 72, 80, 68, 52, 60, 76, 92, 104, 96, 76, 62, 74, 90, 108, 120, 112, 90, 74, 84, 102, 122, 140, 132, 106, 88, 100, 120, 140, 158, 148, 120, 100, 115, 138, 162, 182, 172, 142, 118, 134, 160, 186, 208, 196, 164, 140, 158, 188, 218, 245, 232, 196, 172, 194, 226, 258, 240, 200],
  bizRev90: [2200, 2500, 3200, 3800, 4400, 4600, 3400, 2400, 2800, 3500, 4100, 4800, 5000, 3800, 2800, 3100, 3900, 4600, 5200, 5400, 4100, 2900, 3300, 4100, 4800, 5500, 5700, 4400, 3100, 3500, 4300, 5100, 5700, 6000, 4600, 3300, 3700, 4600, 5300, 6000, 6200, 4900, 3500, 3900, 4800, 5500, 6100, 6400, 5100, 3700, 4100, 5000, 5700, 6300, 6600, 5200, 3800, 4200, 5100, 5900, 6500, 6800, 5400, 4000, 4400, 5300, 6100, 6700, 7000, 5600, 4200, 4600, 5500, 6300, 6900, 7200, 5800, 4400, 4800, 5700, 6500, 7100, 7400, 6000, 4600, 5000, 5900, 6700, 7200, 7600],
  bizSpend90: [600, 700, 900, 1050, 1200, 1250, 950, 680, 780, 980, 1150, 1350, 1400, 1080, 780, 870, 1100, 1300, 1450, 1500, 1150, 820, 940, 1170, 1350, 1540, 1580, 1220, 880, 1000, 1250, 1430, 1600, 1660, 1280, 930, 1060, 1310, 1490, 1670, 1720, 1350, 980, 1110, 1360, 1540, 1720, 1780, 1410, 1040, 1170, 1440, 1620, 1810, 1860, 1470, 1100, 1230, 1510, 1690, 1880, 1940, 1540, 1160, 1290, 1570, 1760, 1950, 2010, 1610, 1230, 1360, 1650, 1840, 2030, 2090, 1690, 1310, 1440, 1730, 1920, 2110, 2170, 1770, 1390, 1520, 1810, 2000, 2200, 2270],
}

const PROD_IMGS = {
  mag: '/uploads/IMG_3472.jpg',
  zzz: '/uploads/IMG_3474.jpg',
  ash: '/uploads/IMG_3476.jpg',
  vit: '/uploads/Screenshot 2026-05-11 at 9.01.38 PM.png',
}

function smoothPath(vals: number[], W: number, H: number, mn: number, mx: number) {
  const rng = mx - mn || 1
  const norm = (v: number) => H - ((v - mn) / rng) * (H * 0.82) - H * 0.09
  const coords = vals.map((v, i) => ({ x: (i / (vals.length - 1)) * W, y: norm(v) }))
  let d = `M ${coords[0].x} ${coords[0].y}`
  for (let i = 1; i < coords.length; i++) {
    const p = coords[i - 1]
    const c = coords[i]
    d += ` C ${p.x + (c.x - p.x) / 3} ${p.y} ${c.x - (c.x - p.x) / 3} ${c.y} ${c.x} ${c.y}`
  }
  return { d, lastX: coords[coords.length - 1].x, lastY: coords[coords.length - 1].y }
}

function TrendAreaChart({ vals, color, h = 68 }: { vals: number[]; color: string; h?: number }) {
  const W = 500
  const mn = Math.min(...vals)
  const mx = Math.max(...vals)
  const { d, lastX, lastY } = smoothPath(vals, W, h, mn, mx)
  const uid = `tac${color.replace(/[^a-z0-9]/gi, '')}${h}`
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" className="block" style={{ height: h }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${lastX} ${h} L 0 ${h} Z`} fill={`url(#${uid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
    </svg>
  )
}

function TrendDualChart({ vals1, vals2, color1, color2, h = 80 }: {
  vals1: number[]; vals2: number[]; color1: string; color2: string; h?: number;
}) {
  const W = 500
  const allV = [...vals1, ...vals2]
  const mn = Math.min(...allV) * 0.9
  const mx = Math.max(...allV) * 1.05
  const p1 = smoothPath(vals1, W, h, mn, mx)
  const p2 = smoothPath(vals2, W, h, mn, mx)
  const u1 = `tda${color1.replace(/[^a-z0-9]/gi, '')}`
  const u2 = `tdb${color2.replace(/[^a-z0-9]/gi, '')}`
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" className="block" style={{ height: h }}>
      <defs>
        <linearGradient id={u1} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color1} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color1} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={u2} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color2} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color2} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.3, 0.6].map(y => (
        <line key={y} x1="0" y1={y * h} x2={W} y2={y * h} stroke="#e8e5e0" strokeOpacity="0.4" strokeWidth="1" />
      ))}
      <path d={`${p1.d} L ${p1.lastX} ${h} L 0 ${h} Z`} fill={`url(#${u1})`} />
      <path d={`${p2.d} L ${p2.lastX} ${h} L 0 ${h} Z`} fill={`url(#${u2})`} />
      <path d={p1.d} fill="none" stroke={color1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={p2.d} fill="none" stroke={color2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={p1.lastX} cy={p1.lastY} r="3" fill={color1} />
      <circle cx={p2.lastX} cy={p2.lastY} r="3" fill={color2} />
    </svg>
  )
}

type Range = '7d' | '30d' | '90d'

function TrendDateRow({ range }: { range: Range }) {
  const L: Record<Range, [string, string]> = {
    '7d': ['Apr 28', 'May 11'],
    '30d': ['Apr 11', 'May 11'],
    '90d': ['Feb 10', 'May 11'],
  }
  const [s, e] = L[range]
  return (
    <div className="flex justify-between mt-[5px]">
      <span className="text-[9px] text-ink font-mono">{s}</span>
      <span className="text-[9px] text-ink font-mono">{e}</span>
    </div>
  )
}

function TrendChart() {
  const [range, setRange] = useState<Range>('30d')
  const D = CHART_DATA
  const pick = <K extends string>(b: K) =>
    D[`${b}${range === '7d' ? '7' : range === '90d' ? '90' : '30'}` as keyof typeof D]

  const cat = [
    { label: 'Category sentiment', value: '70 pts', delta: '+4.2 pts', pos: true, color: '#4f86c6', vals: pick('sentiment') },
    { label: 'New market entrants', value: '3', delta: '+2 this week', pos: false, color: '#2d5c3a', vals: pick('entrants') },
  ]
  const prod = [
    { label: 'Vitamin D3 + K2 Complex', value: '$9.8k/wk', delta: '+12%', pos: true, color: '#4f86c6', img: PROD_IMGS.vit, vals: pick('vitRev') },
    { label: 'ZzzPlex Sleep', value: '$11.2k/wk', delta: '-8%', pos: false, color: '#2563eb', img: PROD_IMGS.zzz, vals: pick('zzRev') },
    { label: 'ASHWAGANDHA+', value: '$0.8k/wk', delta: 'Testing', pos: true, color: '#2d5c3a', img: PROD_IMGS.ash, vals: pick('ashRev') },
  ]
  const bizR = pick('bizRev')
  const bizS = pick('bizSpend')
  const lastR = bizR[bizR.length - 1]
  const lastS = bizS[bizS.length - 1]

  return (
    <div className="bg-surf rounded-[10px] font-sans">
      <div className="px-5 pt-[10px] flex justify-end">
        <div className="flex bg-surf-2 rounded-md p-[2px] gap-[1px]">
          {(['7d', '30d', '90d'] as Range[]).map(rv => (
            <button
              key={rv}
              onClick={() => setRange(rv)}
              className={`px-[10px] py-[3px] border-0 rounded-[5px] text-[11px] cursor-pointer font-mono transition-all ${
                range === rv ? 'bg-surf text-ink font-medium shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'bg-transparent text-ink font-normal'
              }`}
            >
              {rv}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-[14px] pb-4">
        <div className="text-[12px] font-semibold text-ink mb-[14px]">Category</div>
        <div className="grid grid-cols-2">
          {cat.map((ch, i) => (
            <div key={i} className={i === 0 ? 'pr-5 border-r border-line' : 'pl-5'}>
              <div className="text-[11px] text-ink mb-[6px]">{ch.label}</div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-[22px] font-medium text-ink font-mono tracking-[-0.03em]">{ch.value}</span>
                <span className={`text-[10px] font-semibold px-[7px] py-[2px] rounded-[10px] ${ch.pos ? 'text-brand bg-brand-bg' : 'text-danger bg-danger-bg'}`}>
                  {ch.delta}
                </span>
              </div>
              <TrendAreaChart vals={ch.vals} color={ch.color} h={72} />
              <TrendDateRow range={range} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-[14px] pb-4">
        <div className="text-[12px] font-semibold text-ink mb-[14px]">Top products</div>
        <div className="grid grid-cols-3">
          {prod.map((ch, i) => (
            <div key={i} className={`${i < 2 ? 'pr-4 border-r border-line' : ''} ${i > 0 ? 'pl-4' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <img src={ch.img} className="w-[26px] h-[26px] rounded-[5px] object-cover shrink-0 border border-line" alt="" />
                <div className="text-[11px] text-ink">{ch.label}</div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-[10px]">
                <span className="text-[18px] font-medium text-ink font-mono tracking-[-0.03em]">{ch.value}</span>
                <span className={`text-[10px] font-semibold px-[6px] py-[2px] rounded-[10px] ${ch.pos ? 'text-brand bg-brand-bg' : 'text-danger bg-danger-bg'}`}>
                  {ch.delta}
                </span>
              </div>
              <TrendAreaChart vals={ch.vals} color={ch.color} h={56} />
              <TrendDateRow range={range} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-[14px] pb-4">
        <div className="text-[12px] font-semibold text-ink mb-[14px]">Business</div>
        <div className="flex items-center justify-between mb-[14px]">
          <div className="flex gap-4">
            {[
              { label: 'Revenue', color: '#4f86c6', val: `$${(lastR / 1000).toFixed(1)}k/day` },
              { label: 'Ad spend', color: '#2d5c3a', val: `$${(lastS / 1000).toFixed(1)}k/day` },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <svg width="16" height="8" viewBox="0 0 16 8">
                  <line x1="0" y1="4" x2="16" y2="4" stroke={l.color} strokeWidth="2" />
                </svg>
                <span className="text-[11px] text-ink">{l.label}</span>
                <span className="text-[11px] font-medium text-ink font-mono">{l.val}</span>
              </div>
            ))}
          </div>
          <span className="text-[10px] font-semibold text-brand bg-brand-bg px-2 py-[2px] rounded-[10px]">MER 3.8×</span>
        </div>
        <TrendDualChart vals1={bizR} vals2={bizS} color1="#4f86c6" color2="#2d5c3a" h={80} />
        <TrendDateRow range={range} />
      </div>
    </div>
  )
}

// ─── Needs attention ─────────────────────────────────────────────────────────

const ATTENTION = [
  { dot: '#d97706', title: 'Test concluded · Magnesium Glycinate Complex', sub: 'Review results and decide next step', time: '1h ago' },
  { dot: '#dc2626', title: 'Rejected ad on Meta · ZzzPlex Sleep UGC variant', sub: 'Policy flag: unsubstantiated sleep claim', time: '4h ago' },
  { dot: '#2d5c3a', title: 'Campaign brief approved · ASHWAGANDHA+', sub: 'Ready to start validation test', time: 'Yesterday' },
  { dot: '#d97706', title: 'Low stock signal · Vitamin D3 + K2 Complex', sub: 'Supplier lead time is 18 days', time: '2d ago' },
]

function NeedsAttention() {
  return (
    <div className="flex flex-col gap-2.5">
      {ATTENTION.map((a, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-[14px] py-[9px] bg-surf rounded-[10px] cursor-pointer shadow-lift hover:bg-black/[0.025]"
        >
          <span className="w-[5px] h-[5px] rounded-full block shrink-0" style={{ background: a.dot }} />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-ink">{a.title}</div>
            <div className="text-[11px] text-ink">{a.sub}</div>
          </div>
          <span className="text-[10px] text-ink font-mono whitespace-nowrap shrink-0">{a.time}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Top findings ────────────────────────────────────────────────────────────

const DASH_FINDINGS = [
  {
    type: 'NEW ANGLE',
    typeColor: '#2d5c3a',
    typeBg: '#e4ede7',
    time: 'Yesterday',
    rec: 'Start running "next-day calm" as a new angle for ZzzPlex Sleep Support.',
    m1: { label: 'VALIDATED BY', value: '3 competitors, 30d+' },
    m2: { label: 'CATEGORY DEMAND', value: '64% of buyer mentions' },
    product: { name: 'ZzzPlex Sleep Support', img: '/uploads/IMG_3474.jpg' },
  },
  {
    type: 'NEW PRODUCT',
    typeColor: '#2d5c3a',
    typeBg: '#e4ede7',
    time: 'Yesterday',
    rec: 'Add Magnesium Glycinate Complex to your catalog — fits your existing buyer.',
    m1: { label: 'EARLY ENTRANTS', value: '3 in last 17d' },
    m2: { label: 'DEMAND TREND', value: '+4.1× search in 60d' },
    product: { name: 'Magnesium Glycinate Complex', img: '/uploads/IMG_3472.jpg' },
  },
] as const

function DashFindingCards() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-2 gap-2.5 items-stretch">
      {DASH_FINDINGS.map((f, i) => (
        <div
          key={i}
          className="bg-surf rounded-[10px] overflow-hidden flex flex-col p-[14px] pb-3 shadow-lift"
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold tracking-[0.06em] uppercase px-[9px] py-[3px] rounded"
              style={{ background: f.typeBg, color: f.typeColor }}
            >
              {f.type}
            </span>
            <span className="text-[11px] text-ink font-mono">{f.time}</span>
          </div>
          <div className="text-[13px] font-medium text-ink leading-[1.5] mb-[14px] flex-1">{f.rec}</div>
          <div className="flex gap-3 mb-[14px]">
            {[f.m1, f.m2].map((m, j) => (
              <div key={j} className="flex-1 min-w-0">
                <div className="text-[9px] font-semibold tracking-[0.05em] uppercase text-ink mb-[3px] truncate">{m.label}</div>
                <div className="text-[12px] font-medium text-ink tracking-[-0.01em] leading-[1.3]">{m.value}</div>
              </div>
            ))}
          </div>
          <div className="mb-3 flex items-center gap-2 bg-surf-2 rounded-[7px] px-[10px] py-[7px]">
            <img src={f.product.img} className="w-[26px] h-[26px] rounded-[5px] object-cover shrink-0 border border-line" alt="" />
            <span className="text-[11px] font-medium text-ink">{f.product.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span
              onClick={() => navigate('/findings')}
              className="text-[12px] text-brand font-medium cursor-pointer"
            >
              View finding →
            </span>
            <button
              onClick={() => {
                if (f.type === 'NEW PRODUCT') navigate('/findings?action=mgc-newproduct')
                else navigate('/findings')
              }}
              className="bg-ink text-white border-0 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer hover:opacity-90"
            >
              Take action
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Top performing ads ──────────────────────────────────────────────────────

const TOP_ADS = [
  { format: 'STATIC', product: 'Vitamin D3 + K2 Complex', roas: '3.6×', delta: '+0.4', pos: true, cpa: '$19.80', cpaRed: false, spend: '$2.4k/wk', img: '/uploads/Screenshot 2026-05-11 at 9.01.38 PM.png' },
  { format: 'VIDEO', product: 'ZzzPlex Sleep Support', roas: '3.1×', delta: '-0.4', pos: false, cpa: '$38.20', cpaRed: true, spend: '$1.6k/wk', img: '/uploads/IMG_3474.jpg' },
  { format: 'UGC', product: 'ASHWAGANDHA+', roas: '2.8×', delta: '+0.6', pos: true, cpa: '$28.10', cpaRed: false, spend: '$0.3k/wk', img: '/uploads/IMG_3476.jpg' },
]

function TopAds() {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-[720px]">
      {TOP_ADS.map((ad, i) => (
        <div key={i} className="bg-surf rounded-[10px] shadow-lift overflow-hidden flex flex-col">
          <div className="relative w-full pb-[100%] shrink-0">
            <img src={ad.img} alt="" className="absolute inset-0 w-full h-full object-cover block" />
            <span className="absolute top-2.5 left-2.5 bg-[rgba(15,30,60,0.88)] text-white text-[10px] font-medium tracking-[0.03em] uppercase px-[9px] py-[3px] rounded-[20px]">
              {ad.format}
            </span>
          </div>
          <div className="p-3">
            <div className="text-[13px] font-medium text-ink mb-2 leading-[1.3]">{ad.product}</div>
            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="text-[10px] font-medium tracking-[0.03em] uppercase text-ink mb-0.5">ROAS</div>
                <div className="text-base font-medium text-ink">{ad.roas}</div>
              </div>
              <span
                className={`text-[11px] font-medium px-[7px] py-[2px] rounded-[20px] mb-0.5 ${
                  ad.pos ? 'bg-brand-bg text-brand' : 'bg-danger-bg text-danger'
                }`}
              >
                {ad.delta}
              </span>
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-[10px] font-medium tracking-[0.03em] uppercase text-ink mb-0.5">CPA</div>
                <div className={`text-[13px] ${ad.cpaRed ? 'text-[#993556]' : 'text-ink'}`}>{ad.cpa}</div>
              </div>
              <div>
                <div className="text-[10px] font-medium tracking-[0.03em] uppercase text-ink mb-0.5">SPEND</div>
                <div className="text-[13px] text-ink">{ad.spend}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

function Dashboard() {
  return (
    <div className="pt-6 px-12 pb-[72px] flex flex-col gap-6 font-sans">
      <div>
        <div className="text-[22px] font-medium text-ink tracking-[-0.03em] leading-none">Dashboard</div>
        <div className="text-[11px] text-ink mt-[5px]">Welcome back, Dylan · May 5, 2026</div>
      </div>

      <div>
        <SectionHead title="Market signals" />
        <MarketSignals />
      </div>

      <div className="grid grid-cols-[1.8fr_1fr] gap-5">
        <div>
          <SectionHead title="Trends" />
          <TrendChart />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <SectionHead title="Needs attention" link={{ label: 'View all', fn: () => {} }} />
            <NeedsAttention />
          </div>
          <div>
            <SectionHead title="Top findings" badge="12 new" link={{ label: 'View all findings', fn: () => {} }} />
            <DashFindingCards />
          </div>
        </div>
      </div>

      <div>
        <SectionHead title="Top performing ads" link={{ label: 'View all ads', fn: () => {} }} />
        <TopAds />
      </div>
    </div>
  )
}

export default Dashboard
