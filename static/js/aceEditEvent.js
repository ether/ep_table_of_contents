exports.aceEditEvent = function (hook_name, args, cb) {
  if(args.rep){
    tableOfContents.showPosition(args.rep);
  }
  if(!args.callstack.docTextChanged) return false; // we should only run this if the pad contents is changed..
}
