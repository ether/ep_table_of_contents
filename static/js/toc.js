$('#tocButton').click(function(){
  $('#toc').toggle();
});

var tableOfContents = {

  enable: function(){
    $('#toc').show().css("width", "180px");
    $('#editorcontainer').css("right", "200px");
    $('#editorcontainer').css("width", "auto");
    this.update()
  },

  disable: function(){
    $('#toc').hide();
    $('#editorcontainer').css("width", "100%");

  },

  // Find Tags
  findTags: function(){
    var toc = {};
    var count = 0;
    var hs = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div").children("h1, h2, h3, h4, h5, h6");;
    $(hs).each(function(){
      var tag = this.nodeName.toLowerCase();
      var newY = $(this).context.offsetTop + "px";
      var linkText = $(this).text(); // get the text for the link
      var focusId = $(this).parent()[0].id; // get the id of the link
      toc[count] = {
        tag : tag,
        y : newY,
        text : linkText,
        focusId : focusId
      }
      count++;
    });

    $.each(toc, function(h, v){ // for each item we should display
      var TOCString = "<a title='"+v.text+"' class='tocItem toc"+v.tag+"' data-class='toc"+v.tag+"' onClick=\"tableOfContents.scroll('"+v.y+"');\" data-offset='"+v.y+"'>"+v.text+"</a>";
      $('#tocItems').append(TOCString);
    });

  },
  

  // get HTML
  getPadHTML: function(){
    if($('#options-toc').is(':checked')) {
      $('#tocItems').html("");
      tableOfContents.findTags();
    }
  },

  update: function(){
    tableOfContents.getPadHTML();
  },

  scroll: function(newY){
    var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
    var $outerdocHTML = $outerdoc.parent();
    $outerdoc.animate({scrollTop: newY});
    $outerdocHTML.animate({scrollTop: newY}); // needed for FF
  },
  getParam: function(sname)
  {
    var params = location.search.substr(location.search.indexOf("?")+1);
    var sval = "";
    params = params.split("&");
    // split param and value into individual pieces
    for (var i=0; i<params.length; i++)
    {
      temp = params[i].split("=");
      if ( [temp[0]] == sname ) { sval = temp[1]; }
    }
    return sval;
  }

};


