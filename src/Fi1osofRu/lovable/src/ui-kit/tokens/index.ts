export const tokens = {
  color: {
    paper: '#FAF8F3',
    surface: '#FFFFFF',
    surfaceMuted: '#F3EFE6',
    ink: '#1A1A1A',
    inkMuted: '#5A5A5A',
    inkSubtle: '#8A8578',
    hairline: '#E6E1D6',
    accent: '#1E3A8A',
    accentSoft: '#E8ECF7',
    warm: '#B7410E',
    warmSoft: '#F6E6DD',
    success: '#1F6F43',
    warning: '#8A6A00',
  },
  font: {
    serif: `"Source Serif 4", "IBM Plex Serif", Georgia, serif`,
    sans: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    mono: `"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace`,
  },
  size: {
    xs: '12px',
    sm: '13px',
    md: '15px',
    lg: '17px',
    xl: '20px',
    h3: '24px',
    h2: '32px',
    h1: '44px',
  },
  space: (n: number) => `${n * 4}px`,
  radius: { sm: '2px', md: '4px', lg: '8px' },
  shadow: {
    soft: '0 1px 0 rgba(26,26,26,0.04), 0 1px 2px rgba(26,26,26,0.04)',
  },
  breakpoint: { mobile: '768px', tablet: '1024px' },
} as const

export type Tokens = typeof tokens
