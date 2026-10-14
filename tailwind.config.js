/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1c1917',
          soft: '#57534e',
          muted: '#a8a29e',
        },
        paper: '#faf7f2',
        sand: '#f1ebe1',
        accent: {
          DEFAULT: '#d9572b',
          dark: '#b8461f',
          soft: '#fbe9e1',
        },
        pine: {
          DEFAULT: '#2f5d50',
          soft: '#e3eee9',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 4px 16px -4px rgba(28, 25, 23, 0.06)',
        lift: '0 2px 4px rgba(28, 25, 23, 0.04), 0 20px 40px -12px rgba(28, 25, 23, 0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
