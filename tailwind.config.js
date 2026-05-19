/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#111110',
        mid: '#6b6860',
        dim: '#a09d98',
        line: '#e8e5e0',
        'line-soft': '#f0ede8',
        surf: '#ffffff',
        'surf-2': '#f0ede8',
        'nav-bg': '#ffffff',
        canvas: '#f0efec',
        brand: {
          DEFAULT: '#2d5c3a',
          bg: '#e4ede7',
          dim: '#c2d4c8',
        },
        alert: {
          DEFAULT: '#c2410c',
          bg: '#ffedd5',
        },
        danger: {
          DEFAULT: '#dc2626',
          bg: '#fee2e2',
        },
        warn: {
          DEFAULT: '#d97706',
          bg: '#fef3c7',
        },
        info: {
          DEFAULT: '#2563eb',
          bg: '#dbeafe',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 3px 12px rgba(0,0,0,0.09)',
        lift: '0 4px 18px rgba(0,0,0,0.10)',
        drawer: '-8px 0 40px rgba(0,0,0,0.10)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        'soft-pulse': 'pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
