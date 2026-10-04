/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fresh: {
          500: '#0aad0a',
          600: '#099809',
          700: '#088008',
        }
      }
    },
  },
  plugins: [],
}
