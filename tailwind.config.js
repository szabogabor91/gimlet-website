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
      green: colors.emerald,
      gray: colors.blueGray,
      blue: colors.lightBlue,
      yellow: colors.amber,
      pink: colors.rose,
      cyan: colors.cyan,
      black: colors.black,
      orange: colors.orange,
      indigo: colors.indigo,
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      transform: ['hover'],
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ]
}
