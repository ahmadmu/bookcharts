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
      },
      keyframes: {
        appear: {
          "0%": {
            opacity: 0,
            transform: "translateY(-20)"
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)"
          }
        }
      },
      animation: {
        appear: "appear .1s ease-in-out"
      }
    },
  },
  plugins: [],
}

