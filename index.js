'use strict';

const eejs = require('ep_etherpad-lite/node/eejs');
const settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_styles = (hookName, args, cb) => {
  args.content +=
  "<link href='../static/plugins/ep_table_of_contents/static/css/toc.css' rel='stylesheet'>";
  return cb();
};

exports.eejsBlock_dd_view = (hookName, args, cb) => {
  args.content +=
  "<li><a href='#' onClick='$(\"#options-toc\").click();'>Table Of Contents</a></li>";
  return cb();
};

exports.eejsBlock_editorContainerBox = (hookName, args, cb) => {
  args.content += eejs.require('./templates/toc.ejs', {}, module);
  return cb();
};

exports.eejsBlock_scripts = (hookName, args, cb) => {
  args.content +=
  "<script src='../static/plugins/ep_table_of_contents/static/js/toc.js'></script>";
  return cb();
};

exports.eejsBlock_mySettings = (hookName, args, cb) => {
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
