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
    var toc = {}; // The main object we will use
    var tocL = {}; // A per line record of each TOC item
    var count = 0;
    var delims = ["h1","h2","h3","h4","h5","h6",".h1",".h2",".h3",".h4",".h5",".h6"];
    if(clientVars.plugins.plugins.ep_context){
      if(clientVars.plugins.plugins.ep_context.styles){
        var styles = clientVars.plugins.plugins.ep_context.styles;
        $.each(styles, function(k, style){
          var contextStyle = "context"+style.toLowerCase();
          delims.push(contextStyle);
        });
      }
    }
    delims = delims.join(",");
    var hs = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div").children(delims);
    $(hs).each(function(){
      // Remember lineNumber is -1 what a user sees
      var lineNumber = $(this).parent().prevAll().length;
      var tag = this.nodeName.toLowerCase();
      var newY = $(this).context.offsetTop + "px";
      var linkText = $(this).text(); // get the text for the link
      var focusId = $(this).parent()[0].id; // get the id of the link

      if(tag == "span"){
        tag = $(this).attr("class").replace(/.*(h[1-6]).*/, "$1");
        linkText = linkText.replace(/\s*#*/, '');
      }

      // Create an object of lineNumbers that include the tag
      tocL[lineNumber] = tag;

      // Does the previous line already have this delim?
      // If so do nothing..
      if(tocL[lineNumber-1]){
        if(tocL[lineNumber-1] === tag) return;
      }

      toc[count] = {
        tag : tag,
        y : newY,
        text : linkText,
        focusId : focusId,
        lineNumber : lineNumber
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


