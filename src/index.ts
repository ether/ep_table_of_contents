'use strict';


type TableOfContents = {
  content:string
};


// @ts-ignore
import eejs from 'ep_etherpad-lite/node/eejs';
// @ts-ignore
import settings from 'ep_etherpad-lite/node/utils/Settings';



export const eejsBlock_styles = (hookName:string, args:TableOfContents, cb:Function) => {
  args.content +=
  "<link href='../static/plugins/ep_table_of_contents/static/css/toc.css' rel='stylesheet'>";
  return cb();
};

export const eejsBlock_dd_view = (hookName:string, args:TableOfContents, cb:Function) => {
  args.content +=
  "<li><a href='#' onClick='$(\"#options-toc\").click();'>Table Of Contents</a></li>";
  return cb();
};

export const eejsBlock_editorContainerBox = (hookName:string, args:TableOfContents, cb:Function) => {
  args.content += eejs.require('./templates/toc.ejs', {}, module);
  return cb();
};

export const eejsBlock_scripts = (hookName:string, args:TableOfContents, cb:Function) => {
  if (settings.ep_toc && settings.ep_toc.show_button === true) {
    args.content = eejs.require('ep_table_of_contents/templates/barButton.ejs') + args.content;
  }
  return cb();
};

export const eejsBlock_mySettings = (hookName:string, args:TableOfContents, cb:Function) => {
  let checkedState = 'unchecked';
  if (settings.ep_toc) {
    if (settings.ep_toc.disable_by_default === true) {
      checkedState = 'unchecked';
    } else {
      checkedState = 'checked';
    }
  }
  args.content +=
      eejs.require('./templates/toc_entry.ejs', {checked: checkedState}, module);
  return cb();
};
