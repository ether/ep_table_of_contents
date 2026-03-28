'use strict';

const path = require('node:path');

module.exports = {
  testDir: path.join(__dirname, 'specs'),
  testMatch: '**/*.spec.js',
  timeout: 90 * 1000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://127.0.0.1:9001',
    viewport: {width: 1280, height: 3000},
    trace: 'on-first-retry',
  },
};
