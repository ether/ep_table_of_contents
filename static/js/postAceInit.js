'use strict';

// postAceInit is loaded as a CommonJS plugin hook module; its scope is not
// the same as the <script> tag that loads toc.js, so `tableOfContents` is
// not visible via the normal scope chain. Look it up explicitly on the
// topmost window (where toc.js runs) with a globalThis fallback for the
// case where both happen to share a realm.
const getToc = () => (typeof globalThis !== 'undefined' && globalThis.tableOfContents) ||
    (window.top && window.top.tableOfContents) ||
    window.tableOfContents || null;

exports.postAceInit = () => {
  if (!$('#editorcontainerbox').hasClass('flex-layout')) {
    $.gritter.add({
      title: 'Error',
      text:
      'Ep_table_of_contents: Please upgrade to etherpad 1.8.3 for this plugin to work correctly',
      sticky: true,
      class_name: 'error',
    });
  }
  const toc = getToc();
  if (!toc) return;
  const optionToc = $('#options-toc');
  /* on click */
  optionToc.on('click', () => {
    if (optionToc.is(':checked')) {
      toc.enable(); // enables line tocping
    } else {
      optionToc.prop('checked', false);
      toc.disable(); // disables line tocping
    }
  });
  if (optionToc.is(':checked')) {
    toc.enable();
  } else {
    toc.disable();
  }

  const tocParam = toc.getParam('toc');
  if (tocParam === true) {
    optionToc.prop('checked', true);
    toc.enable();
  } else if (tocParam === false) {
    optionToc.prop('checked', false);
    toc.disable();
  }
};
