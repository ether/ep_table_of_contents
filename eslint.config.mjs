import browser from 'eslint-config-etherpad/flat/browser.js';
import etherpad from 'eslint-config-etherpad/flat/plugin.js';

// The globals of the shared browser profile (browser, jQuery, ES2017).
const browserGlobals = Object.assign({}, ...browser.map((c) => c.languageOptions?.globals ?? {}));

export default [
  {
    // Third-party code, not linted.
    ignores: ['static/js/scrollTo.js'],
  },
  ...etherpad,
  {
    // `globalThis` is standard in every runtime this plugin targets (Node >= 22
    // and all supported browsers), but it is not in the environments that
    // eslint-config-etherpad selects.
    languageOptions: {globals: {globalThis: 'readonly'}},
  },
  {
    // eslint-config-etherpad has no profile for Playwright specs: it lints
    // `static/tests/**` as CommonJS mocha running under Node. These specs are
    // ES modules that run in Playwright's runner, so give them their own
    // parser options and globals.
    files: ['static/tests/frontend-new/specs/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {...browserGlobals, $: 'readonly'},
    },
    rules: {
      'strict': ['error', 'never'],
      'n/no-missing-require': 'off',
      'n/no-unpublished-import': 'off',
      'mocha/no-exports': 'off',
    },
  },
];
