/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#ff9f1c', // Saturated Amber
          hover: '#e58f13',
          dark: '#cc7f10',
          light: '#ffb347',
        },
        cinema: {
          black: '#070708', // Deep near-black background
          card: '#0f0f12', // Lighter container card
          border: '#1e1e24', // Subtle panel borders
          muted: '#80808a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
