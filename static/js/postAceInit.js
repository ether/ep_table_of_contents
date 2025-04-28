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
      optionToc.attr('checked', false);
      tableOfContents.disable(); // disables line tocping
    }
  });
  if (optionToc.is(':checked')) {
    tableOfContents.enable();
  } else {
    tableOfContents.disable();
  }

  const urlContainstocTrue = tableOfContents.getParam('toc'); // if the url param is set
  if (urlContainstocTrue === 'true') {
    optionToc.attr('checked', 'checked');
    tableOfContents.enable();
  } else if (urlContainstocTrue === 'false') {
    optionToc.attr('checked', false);
    tableOfContents.disable();
  }
};
