/** @type {import('tailwindcss').Config} */
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
        primary: '#CC7666',
        secondary: '#66BCCC',
        darkgray: '#6D4C46'
      }
    },
  },
  plugins: [],
}

