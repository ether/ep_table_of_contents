exports.aceEditEvent = function (hook_name, args, cb) {
  if(!args.callstack.docTextChanged) return;
  if(args.callstack.type === "setup") return;
  if(args.rep){
    tableOfContents.update(args.rep);
    tableOfContents.showPosition(args.rep);
  }
  if(!args.callstack.docTextChanged) return false; // we should only run this if the pad contents is changed..
}
