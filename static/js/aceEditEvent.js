'use strict';

// aceEditEvent fires inside ACE's inner iframe, which has its own `globalThis`
// separate from the outer pad page where toc.js runs. Reach across the
// iframe boundary via `window.top` (the topmost frame, i.e. the outer pad
// page). If toc.js hasn't executed yet — e.g. during very early pad init —
// silently skip; it will be called again on the next edit event.
const getToc = () => (typeof globalThis !== 'undefined' && globalThis.tableOfContents) ||
    (window.top && window.top.tableOfContents) || null;

exports.aceEditEvent = (hookName, args) => {
  // dont do anything on idle work timer, wait for changes..
  if (args.callstack && args.callstack.type === 'idleWorkTimer') return false;
  const toc = getToc();
  if (!toc) return;
  if (args.rep) {
    toc.showPosition(args.rep);
  }

  if ($('#toc:visible').length > 0) {
    toc.update();
  }
};
