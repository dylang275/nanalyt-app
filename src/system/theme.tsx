// theme.tsx — light/dark theme provider. Ported from
// design_handoff_nanalyt/source/system/nanalyt-theme.js.
// Applies dark --dv-* tokens as inline CSS vars on <html> and persists choice
// to localStorage['nanalyt-theme']. Light is the CSS default (:root in index.css).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

const DARK_VARS: Record<string, string> = {
  '--dv-page': '#0e120d', '--dv-surf': '#161c14',
  '--dv-ink': '#0a0f09', '--dv-ink-soft': '#151c13',
  '--dv-border': 'rgba(255,255,255,0.09)', '--dv-border-s': 'rgba(255,255,255,0.06)',
  '--dv-text': '#f2f4f0', '--dv-mid': '#f2f4f0', '--dv-dim': '#f2f4f0',
  '--dv-green': '#7ac292', '--dv-green-br': '#5cb877', '--dv-green-bg': 'rgba(92,184,119,0.14)',
  '--dv-red': '#e07a74', '--dv-yellow': '#d8a04a', '--dv-blue': '#6f9fd8',
  '--dv-grid': 'rgba(255,255,255,0.06)', '--dv-grid-strong': 'rgba(255,255,255,0.18)',
  '--dv-s1': '#bfe3ca', '--dv-s2': '#94d0a5', '--dv-s3': '#6fc08a', '--dv-s4': '#4da46c', '--dv-s5': '#357a4e',
  '--dv-shadow': '0 1px 2px rgba(0,0,0,0.3), 0 8px 28px rgba(0,0,0,0.32)',
  '--dv-btn-bg': '#f2f4f0', '--dv-btn-fg': '#10180f',
  '--dv-brief': 'linear-gradient(135deg,#161c14 0%,#151b13 55%,#13211a 100%)',
  '--dv-brief-glow': 'radial-gradient(circle, rgba(92,184,119,0.12) 0%, rgba(92,184,119,0) 70%)',
  '--dv-scroll': '#333b31',
  '--dv-row-top': 'rgba(92,184,119,0.06)',
}

export function applyTheme(theme: Theme) {
  const s = document.documentElement.style
  if (theme === 'dark') {
    Object.keys(DARK_VARS).forEach((k) => s.setProperty(k, DARK_VARS[k]))
  } else {
    Object.keys(DARK_VARS).forEach((k) => s.removeProperty(k))
  }
  document.documentElement.setAttribute('data-theme', theme)
}

function readStored(): Theme {
  try {
    return (localStorage.getItem('nanalyt-theme') as Theme) || 'light'
  } catch {
    return 'light'
  }
}

type ThemeCtx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void }
const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readStored())

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem('nanalyt-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light')
  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme must be used within ThemeProvider')
  return v
}
