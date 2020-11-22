const eejs = require('ep_etherpad-lite/node/eejs');
const express = require('ep_etherpad-lite/node_modules/express');
const settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content += "<link href='../static/plugins/ep_table_of_contents/static/css/toc.css' rel='stylesheet'>";
  return cb();
};

exports.eejsBlock_dd_view = function (hook_name, args, cb) {
  args.content += "<li><a href='#' onClick='$(\"#options-toc\").click();'>Table Of Contents</a></li>";
  return cb();
};

exports.eejsBlock_editorContainerBox = function (hook_name, args, cb) {
  args.content += eejs.require('./templates/toc.ejs', {}, module);
  return cb();
};

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content += "<script src='../static/plugins/ep_table_of_contents/static/js/toc.js'></script>";
  return cb();
};

exports.eejsBlock_mySettings = function (hook_name, args, cb) {
  let checked_state = 'unchecked';
  if (settings.ep_toc) {
    if (settings.ep_toc.disable_by_default === true) {
      checked_state = 'unchecked';
    } else {
      checked_state = 'checked';
    }
  }
  args.content +=
      eejs.require('./templates/toc_entry.ejs', {checked: checked_state}, module);
  return cb();
};
