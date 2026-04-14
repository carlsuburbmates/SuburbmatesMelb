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
        display: ['var(--font-display)', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['var(--font-body)', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        /* Dark surface system — cool-biased charcoal */
        background: '#09090F',
        surface: {
          1: '#111118',
          2: '#1A1A24',
          3: '#222230',
        },
        /* Text tonal hierarchy */
        ink: {
          base:      '#09090F',
          primary:   '#F0F0F5',
          secondary: '#9B9BB0',
          tertiary:  '#5C5C72',
          surface: {
            1: '#111118',
            2: '#1A1A24',
            3: '#222230',
          }
        },
        /* Atmospheric accent — electric blue-violet */
        atmosphere: {
          DEFAULT: '#6C5CE7',
          muted: 'rgba(108, 92, 231, 0.12)',
          glow: 'rgba(108, 92, 231, 0.20)',
          soft: 'rgba(108, 92, 231, 0.06)',
        },
        /* Primary CTA — warm orange/amber */
        cta: {
          DEFAULT: '#F97316',
          hover: '#FB923C',
          glow: 'rgba(249, 115, 22, 0.25)',
          muted: 'rgba(249, 115, 22, 0.10)',
        },
        /* Legacy aliases */
        onyx:   '#09090F',
        silica: '#F0F0F5',
        /* Grayscale */
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
        accent: {
          orange: '#F97316',
          teal:   '#20B2AA',
          sage:   '#7CAA9D',
        },
      },
      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
        'nav': '76px',
      },
      maxWidth: {
        container: '1240px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'pill': '999px',
      },
      animation: {
        'fade-in':        'fadeIn 0.6s ease-out',
        'slide-up':       'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left':  'slideInLeft 0.3s ease-out forwards',
        'pulse-dim':      'pulse-dim 2s ease-in-out infinite',
        'hero-glow':      'heroGlow 6s ease-in-out infinite',
        'ambient-drift':  'ambientDrift 20s ease-in-out infinite',
        'float':          'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
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
        heroGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1', transform: 'scale(1.05)' },
        },
        ambientDrift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%':      { transform: 'translate(10px, -5px)' },
          '50%':      { transform: 'translate(-5px, 10px)' },
          '75%':      { transform: 'translate(-10px, -3px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'xl': '20px',
        '2xl': '40px',
      },
    },
  },
  plugins: [],
};
