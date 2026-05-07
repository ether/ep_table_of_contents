'use strict';

// Sub-path import keeps the client bundle clean. Importing the top-level
// `ep_plugin_helpers` index pulls in every helper's getters; `settings` and
// `toggle` reach server-only modules (eejs, Settings) which esbuild can't
// resolve for the browser.
const {padToggle} = require('ep_plugin_helpers/pad-toggle');

// postAceInit is loaded as a CommonJS plugin hook module; its scope is not
// the same as the <script> tag that loads toc.js, so `tableOfContents` is
// not visible via the normal scope chain. Look it up explicitly on the
// topmost window (where toc.js runs) with a globalThis fallback for the
// case where both happen to share a realm.
const getToc = () => (typeof globalThis !== 'undefined' && globalThis.tableOfContents) ||
    (window.top && window.top.tableOfContents) ||
    window.tableOfContents || null;

// Same config as the server-side instance — must agree on pluginName,
// settingId, and l10nId for the checkbox ids and clientVars lookup to line up.
const tocToggle = padToggle({
  pluginName: 'ep_table_of_contents',
  settingId: 'toc',
  l10nId: 'ep_table_of_contents.toc',
  defaultEnabled: false,
});

// Re-export so the helper sees pad-wide broadcasts and refreshes our state
// when another user toggles the pad-wide checkbox.
exports.handleClientMessage_CLIENT_MESSAGE = tocToggle.handleClientMessage_CLIENT_MESSAGE;

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

  const state = tocToggle.init({
    onChange: (enabled) => { enabled ? toc.enable() : toc.disable(); },
  });

  // ?toc=true / ?toc=false URL parameter still overrides the resolved
  // setting, matching the pre-migration behavior.
  const tocParam = toc.getParam('toc');
  if (tocParam === true || tocParam === false) {
    tocParam ? toc.enable() : toc.disable();
    $('#options-toc').prop('checked', tocParam);
  } else {
    // No URL override — make sure the editor matches the helper's effective
    // value. (init() already fired onChange once, so this is belt-and-braces.)
    void state;
  }
};
