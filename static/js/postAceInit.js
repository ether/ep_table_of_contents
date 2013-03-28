exports.postAceInit = function(){
  /* on click */
  $('#options-toc').on('click', function() {
    if($('#options-toc').is(':checked')) {
      tableOfContents.enable(); // enables line tocping
   } else {
      $('#options-toc').attr('checked',false);
      tableOfContents.disable(); // disables line tocping
    }
  });
  if($('#options-toc').is(':checked')) {
    tableOfContents.enable();
  } else {
    tableOfContents.disable();
  }

  var urlContainstocTrue = (tableOfContents.getParam("toc") == "true"); // if the url param is set
   if(urlContainstocTrue){
    $('#options-toc').attr('checked','checked');
    tableOfContents.enable();
  }else if (tableOfContents.getParam("toc") == "false"){
    $('#options-toc').attr('checked',false);
    tableOfContents.disable();
  }
}
