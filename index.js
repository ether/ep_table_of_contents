'use strict';

const {template} = require('ep_plugin_helpers');

const eejs = require('ep_etherpad-lite/node/eejs');
const settings = require('ep_etherpad-lite/node/utils/Settings');
const {padToggle} = require('ep_plugin_helpers/pad-toggle-server');

// Parallel User Settings + Pad Wide Settings checkboxes for TOC visibility.
// Helper owns the storage, broadcast, enforce, and i18n wiring.
const tocToggle = padToggle({
  pluginName: 'ep_table_of_contents',
  settingId: 'toc',
  l10nId: 'ep_table_of_contents.toc',
  defaultLabel: 'Show Table of Contents',
  defaultEnabled: false,
});

exports.loadSettings = tocToggle.loadSettings;
exports.clientVars = tocToggle.clientVars;
exports.eejsBlock_mySettings = tocToggle.eejsBlock_mySettings;
exports.eejsBlock_padSettings = tocToggle.eejsBlock_padSettings;

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

exports.eejsBlock_editorContainerBox =
    template('./templates/toc.ejs');

exports.eejsBlock_editbarMenuRight = (hookName, args, cb) => {
  if (settings.ep_toc && settings.ep_toc.show_button === true) {
    args.content = eejs.require('ep_table_of_contents/templates/barButton.ejs') + args.content;
  }
  return cb();
};

exports.eejsBlock_scripts = (hookName, args, cb) => {
  args.content +=
  "<script src='../static/plugins/ep_table_of_contents/static/js/toc.js'></script>";
  return cb();
};
