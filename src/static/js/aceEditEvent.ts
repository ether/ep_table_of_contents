/* global tableOfContents */
'use strict';


declare var tableOfContents:any

type AceEditEvent = {
    callstack:{
        type:string
    },
    rep:{
    }
}


export const aceEditEvent = (hookName:string, args:AceEditEvent) => {
  // dont do anything on idle work timer, wait for changes..
  if (args.callstack && args.callstack.type === 'idleWorkTimer') return false;
  if (args.rep) {
    tableOfContents.showPosition(args.rep);
  }

  if ($('#toc:visible').length > 0) {
    tableOfContents.update();
  }
};
