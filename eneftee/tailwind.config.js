const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      orange: colors.orange,
      blue: colors.blue,
      mildGray: '#dddddd',
      mainBG: '#E5E5E5'

    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
