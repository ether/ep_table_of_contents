var eejs = require('ep_etherpad-lite/node/eejs'),
 express = require('ep_etherpad-lite/node_modules/express');


exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + "<link href='/static/plugins/ep_table_of_contents/static/css/edit_offline.css' rel='stylesheet'>";
  return cb();
}

exports.eejsBlock_body = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_table_of_contents/templates/toc.ejs", {}, module);
  return cb();
}


exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content += "<script src='/static/plugins/ep_table_of_contents/static/js/toc.js'></script>";
  args.content += "<script src='/static/plugins/ep_table_of_contents/static/js/scrollTo.js'></script>";
  return cb();
}



exports.eejsBlock_editbarMenuRight = function (hook_name, args, cb) {
  args.content = eejs.require("ep_table_of_contents/templates/editbarButtons.ejs") + args.content;
  return cb();
}

