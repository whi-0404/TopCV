/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#6B7280',
        success: '#3C7363',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        emerald: {
          50: '#F0FDF9',
          100: '#E6FFF4',
          200: '#C7F7DF',
          300: '#84D9B3',
          400: '#6DD1A1',
          500: '#84D9B3',
          600: '#3C7363',
          700: '#2D5A4F',
          800: '#1E3A32',
          900: '#14291F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
} 