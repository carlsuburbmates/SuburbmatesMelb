/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // ── Dark surface system ──────────────────────────────────
        background: '#0A0A0A',
        surface: {
          1: '#141414',
          2: '#1C1C1E',
          3: '#242426',
        },
        // ── Text tonal hierarchy ─────────────────────────────────
        ink: {
          base:      '#0A0A0A',
          primary:   '#F5F5F7',
          secondary: '#A1A1A6',
          tertiary:  '#636366',
          surface: {
            1: '#141414',
            2: '#1C1C1E',
            3: '#242426',
          }
        },
        // ── Legacy aliases (keep for existing code) ──────────────
        onyx:   '#090A0B',
        silica: '#FAFAFA',
        // ── Grayscale (utility) ──────────────────────────────────
        gray: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // ── Accent (CSS overlay only — not for primary colour) ───
        accent: {
          orange: '#FF6B35',
          teal:   '#20B2AA',
          sage:   '#7CAA9D',
        },
      },
      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
        // Mobile nav clearance
        'nav': '72px',
      },
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        // Sharp geometry system — 0-2px max per Tesla direction
        sharp: '2px',
        none:  '0px',
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'slide-up':     'slideUp 0.6s ease-out',
        'slide-in-left':'slideInLeft 0.3s ease-out forwards',
        'pulse-dim':    'pulse-dim 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-dim': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
