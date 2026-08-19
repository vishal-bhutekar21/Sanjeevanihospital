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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        hospital: {
          royal: '#002B5B',
          navy: '#003B73',
          blue: '#005B96',
          cyan: '#007791',
          teal: '#0A4D68',
          soft: '#EBF4F6',
          bg: '#F4F7FB',
          dark: '#001529',
          surface: '#FFFFFF',
        },
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          crimson: '#C53030',
        },
        health: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          emerald: '#00875A',
        }
      },
      fontFamily: {
        sans: ['Manrope', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Manrope', 'sans-serif'],
        marathi: ['"Noto Sans Devanagari"', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'card-subtle': '0 2px 12px rgba(0, 43, 91, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 16px 36px -6px rgba(0, 43, 91, 0.14), 0 8px 16px -4px rgba(0, 43, 91, 0.08)',
        'glow-teal': '0 0 25px -2px rgba(0, 119, 145, 0.35)',
        'glow-royal': '0 0 30px -4px rgba(0, 43, 91, 0.45)',
      }
    },
  },
  plugins: [],
}
