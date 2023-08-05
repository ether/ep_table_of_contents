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
  /* on click */
  $('#options-toc').on('click', () => {
    if ($('#options-toc').is(':checked')) {
      tableOfContents.enable(); // enables line tocping
    } else {
      $('#options-toc').attr('checked', false);
      tableOfContents.disable(); // disables line tocping
    }
  });
  if ($('#options-toc').is(':checked')) {
    tableOfContents.enable();
  } else {
    tableOfContents.disable();
  }

  const urlContainstocTrue = tableOfContents.getParam('toc'); // if the url param is set
  if (urlContainstocTrue) {
    $('#options-toc').attr('checked', 'checked');
    tableOfContents.enable();
  }
};
