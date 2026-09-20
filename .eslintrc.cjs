'use strict';

// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('eslint-config-etherpad/patch/modern-module-resolution');

module.exports = {
  root: true,
  // `globalThis` is standard in every runtime this plugin targets (Node >= 22
  // and all supported browsers), but it is not in the `env`s that
  // eslint-config-etherpad selects.
  globals: {globalThis: 'readonly'},
  extends: 'etherpad/plugin',
  ignorePatterns: [
    '/static/js/scrollTo.js',
  ],
  overrides: [
    {
      // eslint-config-etherpad has no profile for Playwright specs: it lints
      // `static/tests/**` as CommonJS mocha running under Node. These specs are
      // ES modules that run in Playwright's runner, so give them their own
      // parser options and globals.
      files: ['static/tests/frontend-new/specs/**/*'],
      parserOptions: {ecmaVersion: 'latest', sourceType: 'module'},
      env: {browser: true, node: true},
      globals: {$: 'readonly'},
      rules: {
        strict: ['error', 'never'],
        'n/no-missing-require': 'off',
        'n/no-unpublished-import': 'off',
        'mocha/no-exports': 'off',
      },
    },
  ],
};
