// rollup.config.js
// eslint-disable-next-line strict
const typescript = require('rollup-plugin-typescript2');
const copy = require('rollup-plugin-copy');
const glob = require('glob');

module.exports = {
  external:['ep_etherpad-lite/node/eejs','ep_etherpad-lite/node/utils/Settings'],
  input: glob.sync('src/**/*.ts'), // Matches all TypeScript files in the 'src' directory and its subdirectories
  output: {
    preserveModules: true,
    dir: './dist',
    format: 'cjs',
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    copy({
        targets: [
          {src:'./package.json', dest:'./dist'},
          { src: './LICENSE', dest: './dist' },
            { src: './src/locales/*', dest: './dist/locales' },
          { src: './src/static/css/*', dest: './dist/static/css' },
          { src: './src/templates', dest: './dist/templates' },
            {src:'./ep.json', dest:'./dist'},
        ]
    })
  ],
};
