/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navbar': '#8bca62',
        'card-color-1': '#8d807f',
        'card-color-2': '#0bb2ef',
        'card-color-3': '#fecca5',
        'card-color-4': '#2b2a2b',
        'card-color-5': '#07090e',
        'card-color-6': '#1c1938',
        'card-color-7': '#8bca62'
      }
    },
  },
  plugins: [],
}