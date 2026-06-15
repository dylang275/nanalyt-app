// chrome.ts — per-route shell chrome (active nav id, top-bar title, status bar,
// agent-working note). The design sets these per page; in this router app the
// AppLayout shell resolves them from the current path. As each page is ported,
// refine its entry here with the exact copy from its design source.

export type Status = { live: string; items: string[]; right: string }
export type Chrome = { active: string; title: string; status: Status; agentNote: string }

const DEFAULT_STATUS: Status = {
  live: 'Monitoring 3 sources',
  items: ['Last full scan 6:02 AM', 'Next competitor re-scrape in 3h'],
  right: '14,210 signals processed · 7d',
}
const DEFAULT_AGENT_NOTE = "Tracking 'next-day calm' · reviewing 8 new ads"

// Static path → chrome. Dynamic paths handled in resolveChrome below.
const ROUTES: Record<string, Chrome> = {
  '/': { active: 'dashboard', title: 'Dashboard', status: DEFAULT_STATUS, agentNote: DEFAULT_AGENT_NOTE },
  '/findings': {
    active: 'findings', title: 'Findings',
    status: { live: 'Monitoring 3 sources', items: ['Last finding 3h ago', 'Next evaluation pass in 40 min'], right: '14,210 signals processed · 7d' },
    agentNote: 'Evaluating 8 candidate signals · 2 likely findings',
  },
  '/competitors': {
    active: 'competitors', title: 'Competitors',
    status: { live: 'Monitoring 5 competitors', items: ['Next re-scrape in 3h', '84 ads scanned overnight'], right: '14,210 signals processed · 7d' },
    agentNote: 'Scanning Meta Ad Library · 8 new competitor ads queued',
  },
  '/research': {
    active: 'research', title: 'Research',
    status: { live: 'Sources connected', items: ['6 sources available', '23 scans this month'], right: 'Scans run in ~90 seconds' },
    agentNote: '2 research seeds ready · from your findings and pipeline',
  },
  '/research/analysis': {
    active: 'research', title: 'Research',
    status: { live: 'Report ready', items: ['6 sources scanned', 'last updated 2h ago'], right: 'From scan: Magnesium sleep supplements' },
    agentNote: 'Watching this niche · re-scans sources daily',
  },
  '/active-products': {
    active: 'products', title: 'Active Products',
    status: { live: 'Catalog synced', items: ['Shopify sync 2h ago', 'Scores re-computed nightly'], right: '7 SKUs tracked' },
    agentNote: 'Re-scoring catalog · checking 2 suggested products for sourcing',
  },
  '/performance': {
    active: 'tests', title: 'Tests',
    status: { live: '3 tests running', items: ['Verdicts re-scored hourly', 'Gummies validation · day 32'], right: 'Last verdict change 2h ago' },
    agentNote: 'Watching 3 tests · next verdict pass in 40 min',
  },
  '/studio': {
    active: 'studio', title: 'Studio',
    status: { live: 'Shopify connected', items: ['Meta ad account synced', 'last generation 4h ago'], right: '3 creatives pending review' },
    agentNote: '3 creatives generated overnight · from the next-day calm finding',
  },
  '/settings': { active: 'settings', title: 'Settings', status: DEFAULT_STATUS, agentNote: DEFAULT_AGENT_NOTE },
}

export function resolveChrome(pathname: string): Chrome {
  if (ROUTES[pathname]) return ROUTES[pathname]
  if (pathname.startsWith('/findings/')) return {
    active: 'findings', title: 'Findings',
    status: { live: 'Monitoring 3 sources', items: ['Last finding 3h ago', 'Next evaluation pass in 40 min'], right: '14,210 signals processed · 7d' },
    agentNote: 'Evaluating 8 candidate signals · 2 likely findings',
  }
  if (pathname.startsWith('/competitors/')) return {
    active: 'competitors', title: 'Competitors',
    status: { live: 'Monitoring 5 competitors', items: ['Olly re-scraped 3h ago', '62 ads catalogued · 30d'], right: '14,210 signals processed · 7d' },
    agentNote: 'Scanning Meta Ad Library · 8 new competitor ads queued',
  }
  if (pathname.startsWith('/performance/')) return {
    active: 'tests', title: 'Performance Detail',
    status: { live: 'Tracking performance', items: ['Magnesium Glycinate · last 30 days', 'Verdicts re-scored hourly'], right: 'Updated 2h ago' },
    agentNote: 'Watching this product · next verdict pass in 40 min',
  }
  return { active: 'dashboard', title: 'Nanalyt', status: DEFAULT_STATUS, agentNote: DEFAULT_AGENT_NOTE }
}
