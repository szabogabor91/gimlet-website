const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    mode: 'layers',
    layers: ['base', 'components', 'utilities'],
    content: ['src/**/*.njk', 'src/**/*.md', 'src/**/*.js'],
  },
  theme: {
    colors: {
      white: colors.white,
      red: colors.red,
      green: colors.green,
      gray: colors.warmGray,
      blue: colors.lightBlue,
      yellow: colors.amber,
      pink: colors.rose,
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [

  ]
}
