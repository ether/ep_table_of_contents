'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const loadTocHelpers = () => {
  const tocPath = path.join(__dirname, '..', 'static', 'js', 'toc.js');
  const source = fs.readFileSync(tocPath, 'utf8');
  const sandbox = {
    console,
    URLSearchParams,
    globalThis: {},
    $: () => ({
      click() {},
    }),
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(`${source}
globalThis.__tocTestExports = {getHeadingLevel, getOutlineEntries};`, sandbox, {filename: tocPath});
  return sandbox.__tocTestExports;
};

const {getOutlineEntries} = loadTocHelpers();

const makeEntries = (tags) => tags.map((tag, index) => ({
  tag,
  text: `Heading ${index + 1}`,
  lineNumber: index,
}));

const summarize = (entries) => getOutlineEntries(makeEntries(entries)).map((entry) => ({
  depth: entry.displayDepth,
  numbering: entry.numbering,
}));

test('starts first visible heading at 1 when h1 is missing', () => {
  assert.deepEqual(summarize(['h2', 'h3', 'h3']), [
    {depth: 1, numbering: ''},
    {depth: 1, numbering: '1'},
    {depth: 1, numbering: '2'},
  ]);
});

test('increments sibling headings instead of repeating 0.1', () => {
  assert.deepEqual(summarize(['h2', 'h2', 'h2']), [
    {depth: 1, numbering: '1'},
    {depth: 1, numbering: '2'},
    {depth: 1, numbering: '3'},
  ]);
});

test('keeps a single top-level heading unnumbered and starts children at 1', () => {
  assert.deepEqual(summarize(['h1', 'h2', 'h2']), [
    {depth: 1, numbering: ''},
    {depth: 1, numbering: '1'},
    {depth: 1, numbering: '2'},
  ]);
});

test('preserves hierarchical numbering when there are multiple top-level sections', () => {
  assert.deepEqual(summarize(['h1', 'h2', 'h1', 'h2']), [
    {depth: 1, numbering: '1'},
    {depth: 2, numbering: '1.1'},
    {depth: 1, numbering: '2'},
    {depth: 2, numbering: '2.1'},
  ]);
});

test('counts nested sections correctly across section changes', () => {
  assert.deepEqual(summarize(['h2', 'h3', 'h2', 'h3', 'h4']), [
    {depth: 1, numbering: '1'},
    {depth: 2, numbering: '1.1'},
    {depth: 1, numbering: '2'},
    {depth: 2, numbering: '2.1'},
    {depth: 3, numbering: '2.1.1'},
  ]);
});

test('keeps numbering stable across many sibling headings', () => {
  const headingCount = 200;
  const summary = summarize(Array.from({length: headingCount}, () => 'h2'));

  assert.equal(summary.length, headingCount);
  assert.deepEqual(summary[0], {depth: 1, numbering: '1'});
  assert.deepEqual(summary[99], {depth: 1, numbering: '100'});
  assert.deepEqual(summary[199], {depth: 1, numbering: '200'});
});
