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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e', // Primary Brand Teal
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        slate: {
          850: '#172033',
        },
        neutral: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          'border-light': '#F1F5F9',
        },
        emergency: {
          DEFAULT: '#DC2626',
          hover: '#B91C1C',
          subtle: '#FEF2F2',
          text: '#991B1B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Mukta', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'Mukta', 'sans-serif'],
        marathi: ['Mukta', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 4px 12px 0 rgba(15, 23, 42, 0.07)',
        'dropdown': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
      },
      borderRadius: {
        'sm': '6px',
        DEFAULT: '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      maxWidth: {
        'container': '1280px',
      }
    },
  },
  plugins: [],
}
