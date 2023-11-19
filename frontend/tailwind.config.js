/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navbar-left': '#bbe687',
        'navbar-right': '#8bca62'
      }
    },
  },
  plugins: [],
}