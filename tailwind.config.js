/** @type {import('tailwindcss').Config} */
const { tailwindColors } = require('./tailwind-colors');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans']
      },
      colors: {
        primary: tailwindColors.primary,
        secondary: tailwindColors.secondary,
        darkgray: tailwindColors.darkgray
      }
    },
  },
  plugins: [],
}

