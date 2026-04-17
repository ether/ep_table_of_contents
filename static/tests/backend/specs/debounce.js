'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

const tocPath = path.resolve(__dirname, '..', '..', '..', '..', 'static', 'js', 'toc.js');

describe(__filename, function () {
  let src;
  before(function () { src = fs.readFileSync(tocPath, 'utf8'); });

  it('update() debounces findTags() via setTimeout (#51)', function () {
    // findTags walks every heading and rebuilds the #tocItems list. On pads
    // with hundreds of headings, firing it on every keystroke was the
    // source of the 1-char-per-second typing seen in #51. The update path
    // must now schedule findTags via setTimeout instead of calling it
    // synchronously.
    const updateBlock = src.match(/update:\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\n\s*\},/);
    assert(updateBlock, 'expected update() in tableOfContents');
    assert(!/tableOfContents\.findTags\s*\(\s*\)/.test(updateBlock[0]),
        'update() must not call findTags() synchronously on every edit');
    assert(/scheduleFindTags|setTimeout/.test(updateBlock[0]),
        'update() should defer the heading scan (via scheduleFindTags / setTimeout)');
    // And the scheduler itself should actually use setTimeout.
    assert(/scheduleFindTags[\s\S]*?setTimeout/.test(src),
        'scheduleFindTags should wrap findTags() in setTimeout');
  });
});
