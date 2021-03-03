/* global tableOfContents */
'use strict';

exports.aceEditEvent = (hookName, args) => {
  // dont do anything on idle work timer, wait for changes..
  if (args.callstack && args.callstack.type === 'idleWorkTimer') return false;
  if (args.rep) {
    tableOfContents.showPosition(args.rep);
  }

  if ($('#toc:visible').length > 0) {
    tableOfContents.update();
  }
};
