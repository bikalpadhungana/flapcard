/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand_main':'#143385',
        'brand_1':'#2A2D40',
        'navbar': '#8bca62',
        'card-color-1': '#07090e',
        'card-color-2': '#CBD1F0',
        'card-color-3': '#fecca5',
        'card-color-4': '#2b2a2b',
        'card-color-5': '#8d807f',
        'card-color-6': '#1c1938',
        'card-color-7': '#8bca62'

      },
      backgroundImage: {
        'world-map': "url('/images/world-map.png')",
        'card-design_1':"url(';)"
      },
    },
  },
  plugins: [],
}