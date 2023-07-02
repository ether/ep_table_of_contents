// rollup.config.js
// eslint-disable-next-line strict
const typescript = require('rollup-plugin-typescript2');
const copy = require('rollup-plugin-copy');

module.exports = {
  external:['ep_etherpad-lite/node/eejs','ep_etherpad-lite/node/utils/Settings'],
  input: ['./src/index.ts'],
  output: {
    dir: './dist',
    format: 'cjs',
  },
  plugins: [
    typescript({
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)'],
    }),
    copy({
        targets: [
            { src: './src/locales/*', dest: './dist/locales' },
          { src: './src/static/css/*', dest: './dist/static/css' },
          { src: './src/templates', dest: './dist/templates' },
            {src:'./ep.json', dest:'./dist'},
        ]
    })
  ],
};
