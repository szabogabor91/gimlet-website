const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const isDev = process.env.NODE_ENV !== "production";

const plugins = [
  tailwindcss('tailwind.config.js'),
  autoprefixer,
];

if (!isDev) {
  const cssnano = require('cssnano');

  [].push.apply(plugins, [
    cssnano({
      preset: 'default',
    }),
  ]);
}

module.exports = { plugins };
