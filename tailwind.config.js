/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}","**.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        "Roboto": ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}