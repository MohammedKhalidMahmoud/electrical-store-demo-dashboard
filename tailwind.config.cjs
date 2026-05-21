/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'IBM Plex Sans Arabic', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#effdf6',
          100: '#d9fbe9',
          500: '#11b97d',
          600: '#0d9c69',
          700: '#0d7d56',
        },
        ink: {
          950: '#111827',
        },
      },
      boxShadow: {
        panel: '0 18px 40px rgba(15, 23, 42, 0.08)',
      },
      keyframes: {
        pageIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        flashSuccess: {
          '0%': { backgroundColor: 'rgba(16, 185, 129, 0.20)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'page-in': 'pageIn 0.35s ease-out',
        'pulse-soft': 'pulseSoft 1.2s ease-in-out infinite',
        'flash-success': 'flashSuccess 1s ease-out',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 20% 20%, rgba(17, 185, 125, 0.15), transparent 30%), radial-gradient(circle at 80% 0%, rgba(99, 102, 241, 0.10), transparent 22%)',
      },
    },
  },
  plugins: [],
};
