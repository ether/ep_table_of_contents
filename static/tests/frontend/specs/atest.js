describe("Headings", function(){
  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  // Create Pad
   // Create some H1, H2 content
    // Enable TOC and ensure H1 and H2 content is listed
     // Click on TOC content and ensure screen is scrolled to it
      // Delete H2 and ensure it's removed from TOC
       // Refresh page and ensure TOC content is there

  it("makes text h1 on click and ensure TOC is working properly", function(done) {

    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    chrome$("#options-toc").click();
    expect( ( chrome$("#tocItems").html().length ) !== 0 ).to.be(false);

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    //get the headings button and click it
    var $heading = chrome$("#heading-selection");
    $heading.val("0");
    $heading.change();

    //ace creates a new dom element when you press a button, so just get the first text element again
    var $newFirstTextElement = inner$("div").first();

    // is there a <h1> element now?
    var isH1 = $newFirstTextElement.find("h1").length === 1; 

    //ace creates a new dom element when you press a button, so just get the first text element again
    var $newThirdTextElement = inner$("div:nth-child(3)");

    //select this text element
    $newThirdTextElement.sendkeys('{selectall}');

    //get the headings button and click it
    var $heading = chrome$("#heading-selection");
    $heading.val("1");
    $heading.change();

    // is there a <h2> element now?
    $newThirdTextElement = inner$("div:nth-child(3)");
    var isH2 = $newThirdTextElement.find("h2").length === 1;

    //expect it to be h2
    expect(isH2).to.be(true);

    //make sure the text hasn't changed
    expect($newFirstTextElement.text()).to.eql($firstTextElement.text());

    expect( ( chrome$("#tocItems").html().length ) !== 0 ).to.be(true);

    done();
  });
});
