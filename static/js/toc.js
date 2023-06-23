'use strict';

$('#tocButton').click(() => {
  $('#toc').toggle();
});

const tableOfContents = {

  enable() {
    $('#toc').show();
    this.update();
  },

  disable: () => {
    $('#toc').hide();
  },

  // Find Tags
  findTags: () => {
    const toc = {}; // The main object we will use
    const tocL = {}; // A per line record of each TOC item
    let count = 0;
    let delims = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.h1', '.h2', '.h3', '.h4', '.h5', '.h6'];
    if (clientVars.plugins.plugins.ep_context) {
      if (clientVars.plugins.plugins.ep_context.styles) {
        const styles = clientVars.plugins.plugins.ep_context.styles;
        $.each(styles, (k, style) => {
          const contextStyle = `context${style.toLowerCase()}`;
          delims.push(contextStyle);
        });
      }
    }
    delims = delims.join(',');
    const hs =
    $('iframe[name="ace_outer"]').contents().find('iframe')
        .contents().find('#innerdocbody').children('div').children(delims);
    $(hs).each(function () {
      // Remember lineNumber is -1 what a user sees
      const lineNumber = $(this).parent().prevAll().length;
      let tag = this.nodeName.toLowerCase();
      const newY = `${this.offsetTop}px`;
      let linkText = $(this).text(); // get the text for the link
      const focusId = $(this).parent()[0].id; // get the id of the link

      if (tag === 'span') {
        tag = $(this).attr('class').replace(/.*(h[1-6]).*/, '$1');
        linkText = linkText.replace(/\s*#*/, '');
      }

      // Create an object of lineNumbers that include the tag
      tocL[lineNumber] = tag;

      // Does the previous line already have this delim?
      // If so do nothing..
      if (tocL[lineNumber - 1]) {
        if (tocL[lineNumber - 1] === tag) return;
      }

      toc[count] = {
        tag,
        y: newY,
        text: linkText,
        focusId,
        lineNumber,
      };
      count++;
    });

    clientVars.plugins.plugins.ep_table_of_context = toc;
    $('#tocItems').html('');
    $.each(toc, (h, v) => { // for each item we should display
      const $link = $('<a>', {
        text: v.text,
        title: v.text,
        href: '#',
        class: `tocItem toc${v.tag}`,
        click: () => { tableOfContents.scroll(`${v.y}`); return false; },
      });
      $link.data('class', `toc${v.tag}`);
      $link.data('offset', `${v.y}`);
      $link.appendTo('#tocItems');
    });
  },

  // get HTML
  getPadHTML: (rep) => {
    if ($('#options-toc').is(':checked')) {
      tableOfContents.findTags();
    }
  },

  // show the current position
  showPosition: (rep) => {
    // We need to know current line # -- see rep
    // And we need to know what section is before this line number
    const toc = clientVars.plugins.plugins.ep_table_of_context;
    if (!toc) return false;
    const repLineNumber = rep.selEnd[0]; // line Number

    // So given a line number of 10 and a toc of [4,8,12] we want to find 8..
    $.each(toc, (k, line) => {
      if (repLineNumber >= line.lineNumber) {
        // we might be showing this..
        const nextLine = toc[k];
        if (nextLine.lineNumber <= repLineNumber) {
          const activeToc = parseInt(k) + 1;

          // Seems expensive, we go through each item and remove class
          $('.tocItem').each(function () {
            $(this).removeClass('activeTOC');
          });

          $(`.toch${activeToc}`).addClass('activeTOC');
        }
      }
    });
  },

  update: (rep) => {
    if (rep) {
      tableOfContents.showPosition(rep);
    }
    tableOfContents.getPadHTML(rep);
  },

  scroll: (newY) => {
    const $outerdoc = $('iframe[name="ace_outer"]').contents().find('#outerdocbody');
    const $outerdocHTML = $outerdoc.parent();
    $outerdoc.animate({scrollTop: newY});
    $outerdocHTML.animate({scrollTop: newY}); // needed for FF
  },

  getParam: (sname) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(sname);
  },

};
