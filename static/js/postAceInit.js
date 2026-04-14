/* global tableOfContents */
'use strict';

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
  const optionToc = $('#options-toc');
  /* on click */
  optionToc.on('click', () => {
    if (optionToc.is(':checked')) {
      tableOfContents.enable(); // enables line tocping
    } else {
      optionToc.prop('checked', false);
      tableOfContents.disable(); // disables line tocping
    }
  });
  if (optionToc.is(':checked')) {
    tableOfContents.enable();
  } else {
    tableOfContents.disable();
  }

  const tocParam = tableOfContents.getParam('toc');
  if (tocParam === true) {
    optionToc.prop('checked', true);
    tableOfContents.enable();
  } else if (tocParam === false) {
    optionToc.prop('checked', false);
    tableOfContents.disable();
  }
};
