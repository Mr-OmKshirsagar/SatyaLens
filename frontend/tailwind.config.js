/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: '#090D16',
          light: '#F8FAFC',
        },
        surface: {
          dark: '#0F172A',
          light: '#FFFFFF',
          elevated: 'rgba(21, 34, 56, 0.72)',
          'elevated-light': 'rgba(255, 255, 255, 0.85)',
          glass: 'rgba(255, 255, 255, 0.03)',
        },
        border: {
          glass: 'rgba(255, 255, 255, 0.08)',
          'glass-light': 'rgba(15, 23, 42, 0.08)',
          'glass-active': 'rgba(59, 130, 246, 0.35)',
        },
        brand: {
          primary: '#3B82F6',
          'primary-hover': '#2563EB',
          secondary: '#0EA5E9',
        },
        verdict: {
          verified: '#10B981',
          misleading: '#F59E0B',
          fabricated: '#EF4444',
          neutral: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px rgba(59, 130, 246, 0.15)',
        'emerald-glow': '0 0 25px rgba(16, 185, 129, 0.20)',
        'crimson-glow': '0 0 25px rgba(239, 68, 68, 0.20)',
      },
    },
  },
  plugins: [],
}
