/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['"Source Serif 4"', 'serif'],
      },
      colors: {
        clinic: {
          900: '#0d2b1f',
          800: '#14432f',
          700: '#1a5c40',
          600: '#1f7a54',
          500: '#25976a',
          400: '#34b87f',
          300: '#5dd09b',
          200: '#a8e6c8',
          100: '#d4f3e4',
          50: '#edfaf4',
        },
        gray: {
          50: '#f8faf9', 100: '#f0f4f2', 200: '#e1e9e5', 300: '#c8d6d0',
          400: '#96afa6', 500: '#6b8880', 600: '#4a6460', 700: '#2e3f3c', 900: '#111c1a',
        },
        success: { DEFAULT: '#16a34a', light: '#dcfce7' },
        warning: { DEFAULT: '#b45309', light: '#fef3c7' },
        danger: { DEFAULT: '#b91c1c', light: '#fee2e2' },
        info: { DEFAULT: '#0369a1', light: '#e0f2fe' },
      },
    },
  },
  plugins: [],
}