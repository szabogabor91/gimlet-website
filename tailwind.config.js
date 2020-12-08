module.exports = {
  purge: {
    mode: 'layers',
    layers: ['base', 'components', 'utilities'],
    content: ['src/**/*.njk', 'src/**/*.md', 'src/**/*.js'],
  },
  theme: {
    extend: {
      colors: {
        yellow: { // primary
          '100': '#FFFBEA',
          '200': '#FCE588',
          '300': '#FADB5F',
          '400': '#F7C948',
          '500': '#F0B429',
          '600': '#DE911D',
          '700': '#CB6E17',
          '800': '#B44D12',
          '900': '#8D2B0B',
        },
        blue: { // primary
          '100': '#E3F8FF',
          '200': '#81DEFD',
          '300': '#5ED0FA',
          '400': '#40C3F7',
          '500': '#2BB0ED',
          '600': '#1992D4',
          '700': '#127FBF',
          '800': '#0B69A3',
          '900': '#035388',
        },
        gray: { // neutral
          '100': '#F7F7F7',
          '200': '#E1E1E1',
          '300': '#B1B1B1',
          '400': '#9E9E9E',
          '500': '#7E7E7E',
          '600': '#626262',
          '700': '#515151',
          '800': '#3B3B3B',
          '900': '#222222',
        },
        red: { // secondary
          '100': '#FFE3E3',
          '200': '#FF9B9B',
          '300': '#F86A6A',
          '400': '#EF4E4E',
          '500': '#E12D39',
          '600': '#CF1124',
          '700': '#AB091E',
          '800': '#8A041A',
          '900': '#8A041A',
        },
        teal: { // secondary
          '100': '#C6F7E2',
          '200': '#8EEDC7',
          '300': '#65D6AD',
          '400': '#3EBD93',
          '500': '#27AB83',
          '600': '#199473',
          '700': '#147D64',
          '800': '#0C6B58',
          '900': '#014D40',
        },

      }
    }
  },
  variants: {},
  plugins: []
}
