$('#tocButton').click(function(){
  $('#toc').toggle();
});

var tableOfContents = {

  // Find Tags
  findTags: function(tag){
    var toc = {};
    var tags = $('iframe.[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().children(tag);

    $(tags).each(function(){
      var linkText = $(this).text(); // get the text for the link
      var focusId = $(this).parent()[0].id; // get the id of the link
      var tagType = tag;

      var TOCString = "<a onClick=\"$('#"+focusId+"').scrollTo();\">"+linkText+"</a></br>";
      $('#tocItems').append(TOCString);

    });
  },

  // get HTML
  getPadHTML: function(){
    $('#tocItems').html("");
    var tags = [ "h1","h2","h3","h4","h5","h6" ];
    var all_headings = [];
  
    for(var i = 0; i < tags.length; i++){
      all_headings = tableOfContents.findTags(tags[i]);
    }
  },

  // Basically the init function
  update: function(){
    tableOfContents.getPadHTML();
  }

};


