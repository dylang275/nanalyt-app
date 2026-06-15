// tokens.tsx — NT token aliases, ntCard, and the NI inline icon set.
// Ported from design_handoff_nanalyt/source/system/nanalyt-shell.jsx.
// Components reference CSS vars through NT so theme swap is automatic.
import type { CSSProperties, ReactElement } from 'react'

export const NT = {
  page: 'var(--dv-page)', surf: 'var(--dv-surf)',
  ink: 'var(--dv-ink)', inkSoft: 'var(--dv-ink-soft)', inkDim: 'var(--dv-ink-dim)',
  border: 'var(--dv-border)', borderS: 'var(--dv-border-s)',
  text: 'var(--dv-text)', mid: 'var(--dv-mid)', dim: 'var(--dv-dim)',
  green: 'var(--dv-green)', greenBr: 'var(--dv-green-br)', greenBg: 'var(--dv-green-bg)',
  red: 'var(--dv-red)', yellow: 'var(--dv-yellow)', blue: 'var(--dv-blue)',
  sans: "'Geist', ui-sans-serif, system-ui, sans-serif",
  mono: "'Geist Mono','DM Mono',monospace",
  shadow: 'var(--dv-shadow)',
} as const

export const ntCard: CSSProperties = {
  background: NT.surf,
  border: `1px solid ${NT.borderS}`,
  borderRadius: 16,
  boxShadow: NT.shadow,
}

// ── Icons — inline 15×15 stroke SVGs (single source of truth, do not redraw) ──
export const NI: Record<string, ReactElement> = {
  dashboard:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="1.5" width="5" height="5" rx="1.2"/><rect x="8.5" y="1.5" width="5" height="5" rx="1.2"/><rect x="1.5" y="8.5" width="5" height="5" rx="1.2"/><rect x="8.5" y="8.5" width="5" height="5" rx="1.2"/></svg>,
  findings:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M7.5 1.5L13 4.5v6L7.5 13.5 2 10.5v-6z"/><path d="M7.5 5.5v2.5" strokeLinecap="round"/><circle cx="7.5" cy="9.5" r=".75" fill="currentColor" stroke="none"/></svg>,
  products:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 4.5L7.5 2l5.5 2.5v6L7.5 13 2 10.5v-6z"/><path d="M7.5 2v11M2 4.5l5.5 3 5.5-3" strokeLinecap="round"/></svg>,
  competitors: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="5" cy="5.5" r="2.5"/><circle cx="10" cy="5.5" r="2.5"/><path d="M1.5 13.5c0-2 1.5-3 3.5-3M7 13.5c0-2 1.5-3 3.5-3s3.5 1 3.5 3" strokeLinecap="round"/></svg>,
  research:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5L13.5 13.5" strokeLinecap="round"/></svg>,
  studio:      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="1.5" width="12" height="12" rx="1.5"/><path d="M5 8l2.5 2.5 4-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  tests:       <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M5.5 1.5h4v6.5l2.5 5H3l2.5-5V1.5z"/><path d="M5 1.5h5" strokeLinecap="round"/></svg>,
  settings:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="7.5" cy="7.5" r="2"/><path d="M7.5 1.5v1.5M7.5 12v1.5M1.5 7.5H3M12 7.5h1.5M3.4 3.4l1.1 1.1M10.5 10.5l1.1 1.1M11.6 3.4l-1.1 1.1M4.5 10.5l-1.1 1.1" strokeLinecap="round"/></svg>,
  bell:        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M7.5 1.5A4 4 0 013.5 5.5v3.5l-1.5 2h11L11.5 9V5.5a4 4 0 01-4-4z"/><path d="M6 12.5a1.5 1.5 0 003 0" strokeLinecap="round"/></svg>,
  search:      <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5L13.5 13.5" strokeLinecap="round"/></svg>,
  chevD:       <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4L5.5 7.5 8.5 4"/></svg>,
  check:       <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6l3 3 5-5.5"/></svg>,
  moon:        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 9.5A6 6 0 015.5 2 6 6 0 1013 9.5z"/></svg>,
  sun:         <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="7.5" cy="7.5" r="3"/><path d="M7.5 1v1.8M7.5 12.2V14M1 7.5h1.8M12.2 7.5H14M3 3l1.3 1.3M10.7 10.7L12 12M12 3l-1.3 1.3M4.3 10.7L3 12"/></svg>,
}
