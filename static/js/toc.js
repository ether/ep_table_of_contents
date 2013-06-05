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
    // below is VERY slow
    var divs = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div");
    $(divs).each(function(){
      var tag = "" || $(this).context.firstChild.nodeName; 
      tag = tag.toLowerCase();
      if(tag == "h1" || tag == "h2" || tag == "h3"){
        var newY = $(this).context.offsetTop + "px";
        var linkText = $(this).text(); // get the text for the link
        var focusId = $(this).parent()[0].id; // get the id of the link
        var tagType = tag;
        // lazy programmer is lazy
        var TOCString = "<a class='tocItem toc"+tagType+"' data-class='toc"+tagType+"' onClick=\"tableOfContents.scroll('"+newY+"');\" data-offset='"+newY+"'>"+linkText+"</a>";
        $('#tocItems').append(TOCString);
      }
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


