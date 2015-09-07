var expect = require('chai').expect;
var wktnrss = require('../lib/wktnrss');

describe('wiktionary-sound-scraper', function(){
  describe("getSound", function() {
    it("Should have a function to get the sound", function() {
      expect(wktnrss.getSound).to.be.a('function');
    });
  })
});

describe('wiktionary-sound-scraper', function(){
  describe("getSound", function() {
    it("Should return a file", function(done) {
      var sound = wktnrss.getSound('shoe','en','en');
      expect(sound).to.be.a('SoundFile');
      expect(sound).to.have.property('name').that.is.not.empty;
      expect(sound).to.have.property('length').that.is.not.empty;
      expect(sound).to.have.property('path').that.is.not.empty;
      expect(sound).to.have.property('type').that.is.not.empty;
      done();
    });
  })
});
