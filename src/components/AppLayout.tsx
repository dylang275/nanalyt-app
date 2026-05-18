import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Lightbulb,
  Users,
  Package,
  Wand2,
  Microscope,
  type LucideIcon,
} from 'lucide-react'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/findings', label: 'Findings', icon: Lightbulb },
  { to: '/competitors', label: 'Competitors', icon: Users },
  { to: '/active-products', label: 'Active Products', icon: Package },
  { to: '/studio', label: 'Studio', icon: Wand2 },
  { to: '/research', label: 'Research', icon: Microscope },
]

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-60 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="px-6 py-5">
          <span className="text-[18px] font-medium text-gray-900">Nanalyt</span>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-200 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
