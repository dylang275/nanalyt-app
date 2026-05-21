import { NavLink, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AskNanalytProvider, AskNanalytPanel, useAskNanalyt } from './AskNanalytPanel'

type NavItem = {
  to: string
  label: string
  icon: ReactNode
  badge?: string
}

const navIcon = {
  dashboard: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1.2" />
      <rect x="8.5" y="1.5" width="5" height="5" rx="1.2" />
      <rect x="1.5" y="8.5" width="5" height="5" rx="1.2" />
      <rect x="8.5" y="8.5" width="5" height="5" rx="1.2" />
    </svg>
  ),
  findings: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M7.5 1.5L13 4.5v6L7.5 13.5 2 10.5v-6z" />
      <path d="M7.5 5.5v2.5" strokeLinecap="round" />
      <circle cx="7.5" cy="9.5" r=".75" fill="currentColor" stroke="none" />
    </svg>
  ),
  products: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M2 4.5L7.5 2l5.5 2.5v6L7.5 13 2 10.5v-6z" />
      <path d="M7.5 2v11M2 4.5l5.5 3 5.5-3" strokeLinecap="round" />
    </svg>
  ),
  competitors: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="5" cy="5.5" r="2.5" />
      <circle cx="10" cy="5.5" r="2.5" />
      <path d="M1.5 13.5c0-2 1.5-3 3.5-3M7 13.5c0-2 1.5-3 3.5-3s3.5 1 3.5 3" strokeLinecap="round" />
    </svg>
  ),
  research: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="6.5" cy="6.5" r="4.5" />
      <path d="M10.5 10.5L13.5 13.5" strokeLinecap="round" />
    </svg>
  ),
  studio: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="1.5" y="1.5" width="12" height="12" rx="1.5" />
      <path d="M5 8l2.5 2.5 4-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  performance: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 12.5h12" />
      <path d="M3.5 10.5v-2.5M6.5 10.5v-5M9.5 10.5v-3.5M12.5 10.5v-6.5" />
    </svg>
  ),
  settings: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="7.5" cy="7.5" r="2" />
      <path d="M7.5 1.5v1.5M7.5 12v1.5M1.5 7.5H3M12 7.5h1.5M3.4 3.4l1.1 1.1M10.5 10.5l1.1 1.1M11.6 3.4l-1.1 1.1M4.5 10.5l-1.1 1.1" strokeLinecap="round" />
    </svg>
  ),
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: navIcon.dashboard },
  { to: '/findings', label: 'Findings', icon: navIcon.findings, badge: '12' },
  { to: '/active-products', label: 'Active Products', icon: navIcon.products },
  { to: '/competitors', label: 'Competitors', icon: navIcon.competitors },
  { to: '/research', label: 'Research', icon: navIcon.research },
  { to: '/studio', label: 'Studio', icon: navIcon.studio },
  { to: '/performance', label: 'Performance', icon: navIcon.performance },
  { to: '/settings', label: 'Settings', icon: navIcon.settings },
]

function LeftNav() {
  return (
    <div className="w-[280px] min-w-[280px] h-full bg-nav-bg border-r border-line flex flex-col font-sans">
      <div className="px-[18px] pt-[18px] pb-4 border-b border-line">
        <div className="flex items-center gap-[9px]">
          <div className="w-[26px] h-[26px] bg-brand rounded-[7px] flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L6 2.5 10 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-medium text-ink leading-none tracking-[-0.03em]">Nanalyt</div>
            <div className="text-[9px] text-ink tracking-[0.03em] mt-[2px]">Sleep supplements</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 flex flex-col gap-[2px] overflow-y-auto">
        {navItems.map(({ to, label, icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-[9px] pl-[14px] pr-3 py-2 rounded-md text-[12px] transition-colors ${
                isActive
                  ? 'bg-ink text-white font-medium'
                  : 'text-ink hover:bg-black/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex shrink-0 ${isActive ? 'text-white' : 'text-ink'}`}>{icon}</span>
                <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
                {badge && (
                  <span
                    className={`text-[9px] font-semibold font-mono px-[5px] py-[1px] rounded-[3px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-surf-2 text-ink'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-[18px] py-[14px] border-t border-line flex items-center gap-[9px]">
        <div className="w-[26px] h-[26px] rounded-full bg-brand-bg border border-brand-dim flex items-center justify-center text-[11px] font-medium text-brand shrink-0">
          D
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-ink">Dylan</div>
          <div className="text-[10px] text-ink truncate">Free plan</div>
        </div>
      </div>
    </div>
  )
}

function TopBar() {
  const { openGeneral } = useAskNanalyt()
  return (
    <div className="h-[46px] flex items-center px-5 gap-4 shrink-0 font-sans">
      <div className="flex-1" />
      <div
        onClick={openGeneral}
        className="flex items-center gap-2 bg-white border border-line rounded-lg px-3 h-[30px] w-[460px] cursor-pointer shrink-0 hover:border-[#d1d5db]"
      >
        <span className="flex-1 text-[12px] text-ink">Ask Nanalyt anything…</span>
        <span className="text-ink flex">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="4" y="1" width="5" height="7" rx="2.5" />
            <path d="M2 6.5a4.5 4.5 0 009 0" strokeLinecap="round" />
            <path d="M6.5 11V13" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-[9px] text-ink font-mono bg-surf-2 px-[5px] py-[1px] rounded-[3px] shrink-0">⌘K</span>
      </div>
      <div className="flex-1 flex items-center justify-end gap-3">
        <div className="flex items-center gap-1.5 bg-brand-bg border border-brand-dim rounded-md px-[11px] py-1 cursor-pointer">
          <span className="w-[5px] h-[5px] bg-brand rounded-full block shrink-0 animate-soft-pulse" />
          <span className="text-[10px] font-medium text-brand whitespace-nowrap">Your agent</span>
        </div>
        <span className="text-ink cursor-pointer flex relative">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M7.5 1.5A4 4 0 013.5 5.5v3.5l-1.5 2h11L11.5 9V5.5a4 4 0 01-4-4z" />
            <path d="M6 12.5a1.5 1.5 0 003 0" strokeLinecap="round" />
          </svg>
          <span className="absolute -top-px -right-px w-[5px] h-[5px] bg-brand rounded-full" />
        </span>
        <div className="w-[26px] h-[26px] rounded-full bg-brand-bg border border-brand-dim flex items-center justify-center text-[11px] font-medium text-brand cursor-pointer">
          D
        </div>
      </div>
    </div>
  )
}

function AppLayoutInner() {
  const { open } = useAskNanalyt()
  return (
    <div
      className="flex h-screen w-full bg-white transition-[padding] duration-200"
      style={{ paddingRight: open ? 440 : 0 }}
    >
      <LeftNav />
      <div className="flex-1 flex flex-col min-w-0 bg-canvas">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function AppLayout() {
  return (
    <AskNanalytProvider>
      <AppLayoutInner />
      <AskNanalytPanel />
    </AskNanalytProvider>
  )
}

export default AppLayout
