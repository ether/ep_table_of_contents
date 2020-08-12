exports.aceEditEvent = function (hook_name, args, cb) {
  if(args.callstack && args.callstack.type === "idleWorkTimer") return false; // dont do anything on idle work timer, wait for changes..
//  if(args.callstack && args.callstack.type === "handleClick") return false; // dont do anything on idle work timer, wait for changes..
//  if(args.callstack && args.callstack.type === "handleKeyEvent") return false; // dont do anything on idle work timer, wait for changes..

  // if(!args.callstack || !args.callstack.docTextChanged) return false; // we should only run this if the pad contents is changed..

  if(args.rep){
    tableOfContents.showPosition(args.rep);
  }

  if ($('#toc:visible').length > 0) {
    tableOfContents.update();
  }

}
