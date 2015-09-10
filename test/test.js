var expect = require('chai').expect;
var fs = require('fs');
var wktnrss = require('../');
var util = require('util');
var path = require('path');

// TODO Mock to avoid using network and file "En-us-shoe.ogg"
describe("Scraper", function() {
  it("Should scrap a file", function(done) {
    this.timeout(10000);
    wktnrss.scrap('shoe', __dirname, 'en', function(err, data){
      var fn = function () {fs.readFileSync(path.resolve(__dirname, 'En-us-shoe.ogg'), null);}
      expect(fn).to.not.throw(err);
      done();
    });
  });
});
