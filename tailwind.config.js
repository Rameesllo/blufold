/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0A0A",
          white: "#FFFFFF",
          blue: "#2962FF",
          gray: "#B0B0B0",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-up': 'fadeUp 1s ease-out forwards',
        'zoom-in': 'zoomIn 20s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(41, 98, 255, 0.5)' },
          '50%': { boxShadow: '0 0 25px rgba(41, 98, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
