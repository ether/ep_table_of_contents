'use strict';

const getHeadingLevel = (tag) => {
  const match = /^h([1-6])$/.exec(tag);
  return match ? Number(match[1]) : null;
};

const getOutlineEntries = (toc) => {
  const stack = [];
  const counters = [];

  const outlineEntries = toc.map((entry) => {
    const level = getHeadingLevel(entry.tag);
    if (level == null) {
      return {
        ...entry,
        displayDepth: 1,
        numbering: '',
        numberParts: [],
      };
    }

    while (stack.length > 0 && stack[stack.length - 1] >= level) {
      stack.pop();
    }

    const depth = stack.length + 1;
    counters.length = depth;
    counters[depth - 1] = (counters[depth - 1] || 0) + 1;
    stack.push(level);

    return {
      ...entry,
      displayDepth: depth,
      numbering: counters.join('.'),
      numberParts: [...counters],
    };
  });

  const topLevelHeadings = outlineEntries.filter((entry) => entry.numberParts.length === 1);
  if (topLevelHeadings.length !== 1) return outlineEntries;

  return outlineEntries.map((entry) => {
    if (entry.numberParts.length === 0) return entry;
    if (entry.numberParts.length === 1) {
      return {
        ...entry,
        numbering: '',
      };
    }

    return {
      ...entry,
      displayDepth: entry.displayDepth - 1,
      numbering: entry.numberParts.slice(1).join('.'),
    };
  });
};

if (typeof $ !== 'undefined') {
  $('#tocButton').click(() => {
    $('#toc').toggle();
  });
}

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
    const toc = [];
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

      toc.push({
        tag,
        y: newY,
        text: linkText,
        focusId,
        lineNumber,
      });
    });

    const outlineEntries = getOutlineEntries(toc);
    clientVars.plugins.plugins.ep_table_of_context = toc;
    $('#tocItems').html('');
    $.each(outlineEntries, (index, entry) => {
      const label = entry.numbering ? `${entry.numbering}. ${entry.text}` : entry.text;
      const $link = $('<a>', {
        text: label,
        title: entry.text,
        href: '#',
        class: `tocItem tocDepth${Math.min(entry.displayDepth, 6)}`,
        click: () => { tableOfContents.scroll(`${entry.y}`); return false; },
      });
      $link.attr('data-toc-index', index);
      $link.data('offset', `${entry.y}`);
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
    let activeTocIndex = null;
    $.each(toc, (k, line) => {
      if (repLineNumber >= line.lineNumber) {
        activeTocIndex = Number(k);
      }
    });

    $('.tocItem').removeClass('activeTOC');
    if (activeTocIndex === null) return;
    $(`.tocItem[data-toc-index="${activeTocIndex}"]`).addClass('activeTOC');
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
