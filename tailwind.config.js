/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black cinematic base
        background: '#0B0E14',
        surface: '#151A23',
        'surface-light': '#1D2330',
        muted: '#9CA3B0',
        // Vibrant electric-purple accent for CTAs
        accent: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Teal secondary accent (glow highlights)
        teal: {
          DEFAULT: '#2DD4BF',
          light: '#5EEAD4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      // Optional: soft glowing shadows to match the cinematic aesthetic
      boxShadow: {
        'glow-accent': '0 0 24px rgba(139, 92, 246, 0.45)',
        'glow-teal': '0 0 24px rgba(45, 212, 191, 0.40)',
      },
    },
  },
  plugins: [],
}
