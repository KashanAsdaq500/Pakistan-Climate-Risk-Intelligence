/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pakistan: {
          50: '#f0f9f3',
          100: '#def1e4',
          200: '#bee3cc',
          300: '#91ceab',
          400: '#5fb384',
          500: '#3c9664',
          600: '#2c784f',
          700: '#246040',
          800: '#1e4d34',
          900: '#0b532e',
          950: '#01411c', // Official Pakistan Flag Green
        },
        risk: {
          low: '#10b981',
          moderate: '#f59e0b',
          high: '#f97316',
          extreme: '#dc2626',
        }
      },
      boxShadow: {
        'pakistan-sm': '0 1px 3px 0 rgba(1, 65, 28, 0.05), 0 1px 2px -1px rgba(1, 65, 28, 0.05)',
        'pakistan-md': '0 4px 6px -1px rgba(1, 65, 28, 0.07), 0 2px 4px -2px rgba(1, 65, 28, 0.05)',
        'pakistan-lg': '0 10px 15px -3px rgba(1, 65, 28, 0.08), 0 4px 6px -4px rgba(1, 65, 28, 0.04)',
      }
    },
  },
  plugins: [],
}
