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
    URL,
    globalThis: {},
    window: {
      location: {href: 'https://example.com/p/test-pad?showChat=false#section'},
    },
    $: () => ({
      click: () => {},
    }),
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(
      `${source}
globalThis.__tocTestExports = {
  getHeadingLevel,
  getOutlineEntries,
  setBooleanUrlParam,
  setEmbedCodeUrlParam,
};`,
      sandbox,
      {filename: tocPath},
  );
  return sandbox.__tocTestExports;
};

const {getOutlineEntries, setBooleanUrlParam, setEmbedCodeUrlParam} = loadTocHelpers();

const loadTocRuntime = () => {
  const tocPath = path.join(__dirname, '..', 'static', 'js', 'toc.js');
  const source = fs.readFileSync(tocPath, 'utf8');
  const fields = {
    '#linkinput': 'https://example.com/p/test-pad?showChat=false',
    '#embedinput': '<iframe name="embed_readwrite" src="https://example.com/p/test-pad?showControls=true&showChat=true" width="100%" height="600" frameborder="0"></iframe>',
    '#options-toc': true,
  };
  const sandbox = {
    console,
    URLSearchParams,
    URL,
    globalThis: {},
    document: {title: 'Test Pad'},
    historyCalls: [],
    window: {
      location: {href: 'https://example.com/p/test-pad?showChat=false'},
      history: {
        state: {padId: 'test-pad'},
        replaceState(state, title, url) {
          sandbox.historyCalls.push({state, title, url});
          sandbox.window.location.href = url;
        },
      },
    },
  };
  sandbox.$ = (selector) => {
    if (selector === '#linkinput' || selector === '#embedinput') {
      return {
        length: 1,
        val(value) {
          if (value === undefined) return fields[selector];
          fields[selector] = value;
          return this;
        },
      };
    }
    if (selector === '#options-toc') {
      return {
        is(query) {
          assert.equal(query, ':checked');
          return fields[selector];
        },
      };
    }
    if (selector === '#tocButton') {
      return {click: () => {}};
    }
    if (selector === sandbox.document) {
      return {on: () => {}};
    }
    throw new Error(`Unexpected selector: ${selector}`);
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(
      `${source}
globalThis.__tocRuntimeExports = {tableOfContents};`,
      sandbox,
      {filename: tocPath},
  );
  return {
    tableOfContents: sandbox.__tocRuntimeExports.tableOfContents,
    fields,
    historyCalls: sandbox.historyCalls,
    window: sandbox.window,
  };
};

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

test('adds the toc state to shared pad links without dropping existing params', () => {
  assert.equal(
      setBooleanUrlParam('https://example.com/p/test-pad?showChat=false#section', 'toc', true),
      'https://example.com/p/test-pad?showChat=false&toc=true#section',
  );
  assert.equal(
      setBooleanUrlParam('https://example.com/p/test-pad?showChat=false#section', 'toc', false),
      'https://example.com/p/test-pad?showChat=false&toc=false#section',
  );
});

test('adds the toc state to embed iframe src urls', () => {
  const embedCode =
      '<iframe name="embed_readwrite" src="https://example.com/p/test-pad?showControls=true&showChat=true" width="100%" height="600" frameborder="0"></iframe>';
  assert.equal(
      setEmbedCodeUrlParam(embedCode, 'toc', true),
      '<iframe name="embed_readwrite" src="https://example.com/p/test-pad?showControls=true&showChat=true&toc=true" width="100%" height="600" frameborder="0"></iframe>',
  );
  assert.equal(
      setEmbedCodeUrlParam(embedCode, 'toc', false),
      '<iframe name="embed_readwrite" src="https://example.com/p/test-pad?showControls=true&showChat=true&toc=false" width="100%" height="600" frameborder="0"></iframe>',
  );
});

test('syncShareUrls updates both share fields for the active toc state', () => {
  const {tableOfContents, fields} = loadTocRuntime();

  tableOfContents.syncShareUrls(true);
  assert.equal(fields['#linkinput'], 'https://example.com/p/test-pad?showChat=false&toc=true');
  assert.match(fields['#embedinput'], /src="https:\/\/example\.com\/p\/test-pad\?showControls=true&showChat=true&toc=true"/);

  tableOfContents.syncShareUrls(false);
  assert.equal(fields['#linkinput'], 'https://example.com/p/test-pad?showChat=false&toc=false');
  assert.match(fields['#embedinput'], /src="https:\/\/example\.com\/p\/test-pad\?showControls=true&showChat=true&toc=false"/);
});

test('syncLocationUrl keeps the current pad url in sync with toc state', () => {
  const {tableOfContents, historyCalls, window} = loadTocRuntime();

  tableOfContents.syncLocationUrl(true);
  tableOfContents.syncLocationUrl(false);

  assert.deepEqual(historyCalls.map(({url}) => url), [
    'https://example.com/p/test-pad?showChat=false&toc=true',
    'https://example.com/p/test-pad?showChat=false&toc=false',
  ]);
  assert.equal(window.location.href, 'https://example.com/p/test-pad?showChat=false&toc=false');
});
