'use strict'

var fs = require('fs')
var path = require('path')

var expect = require('chai').expect
var nock = require('nock')
var urlencode = require('urlencode')

var scraper = require('../')

// TODO Delete files after tests
// TODO test wrong parameters

describe('Scraper', function () {
  this.timeout(50000)
  beforeEach(function () {
    nock.cleanAll()
  })
  var searchPath = '/w/api.php' +
                    '?action=query' +
                    '&prop=images' +
                    '&format=json' +
                    '&iwurl=l' +
                    '&rawcontinue=' +
                    '&titles='
  var locatePath = '/w/api.php' +
                    '?action=query' +
                    '&prop=imageinfo' +
                    '&iiprop=url' +
                    '&format=json' +
                    '&iwurl=l' +
                    '&rawcontinue=' +
                    '&titles='
  var searchFile = __dirname + '/samples/shoe-search-reply.json'
  var locateFile = __dirname + '/samples/shoe-locate-reply.json'

  it('Should handle a wrong answer when searching', function (done) {
    nock('https://en.wiktionary.org')
      .get(searchPath + 'shoe')
      .reply(200, '%%%')
    var opts = {}
    scraper.scrap('shoe', opts, function (err, data) {
      expect(err).to.be.an('Error')
      expect(data).to.be.null
      done()
    })
  })
  it('Should handle a wrong answer when locating file', function (done) {
    nock('https://en.wiktionary.org')
      .get(searchPath + 'shoe')
      .replyWithFile(200, searchFile)
    nock('https://en.wiktionary.org')
        .get(locatePath + urlencode.encode('File:en-us-shoe.ogg'))
        .reply(200, '%%%')
    var opts = {}
    scraper.scrap('shoe', opts, function (err, data) {
      expect(err).to.be.an('Error')
      expect(data).to.be.null
      done()
    })
  })

  it('Should handle an error when searching', function (done) {
    nock('https://en.wiktionary.org')
      .get(searchPath + 'shoe')
      .replyWithError('ERROR')
    var opts = {}
    scraper.scrap('shoe', opts, function (err, data) {
      expect(err).to.be.an('Error')
      expect(data).to.be.null
      done()
    })
  })
  it('Should handle an error when locating file', function (done) {
    nock('https://en.wiktionary.org')
      .get(searchPath + 'shoe')
      .replyWithFile(200, searchFile)
    nock('https://en.wiktionary.org')
        .get(locatePath + urlencode.encode('File:en-us-shoe.ogg'))
        .replyWithError('ERROR')
    var opts = {}
    scraper.scrap('shoe', opts, function (err, data) {
      expect(err).to.be.an('Error')
      expect(data).to.be.null
      done()
    })
  })
  it('Should handle an error when downloading', function (done) {
    nock('https://en.wiktionary.org')
      .get(searchPath + 'shoe')
      .replyWithFile(200, searchFile)
    nock('https://en.wiktionary.org')
      .get(locatePath + urlencode.encode('File:en-us-shoe.ogg'))
      .replyWithFile(200, locateFile)
    nock('https://upload.wikimedia.org')
      .get('/wikipedia/commons/4/44/En-us-shoe.ogg')
      .replyWithError('ERROR')
    var opts = {}
    scraper.scrap('shoe', opts, function (err, data) {
      expect(err).not.to.be.empty
      expect(data).to.be.null
      done()
    })
  })
  it('Should handle an error when downloading', function (done) {
    nock('https://en.wiktionary.org')
      .get(searchPath + 'shoe')
      .replyWithError('ERROR')
    var opts = {}
    scraper.scrap('shoe', opts, function (err, data) {
      expect(err).to.be.an('Error')
      expect(data).to.be.null
      done()
    })
  })

  it('Should handle missing word parameter', function (done) {
    var opts = {}
    scraper.scrap(null, opts, function (err, data) {
      expect(err).to.be.an('Error')
      expect(data).to.be.null
      done()
    })
  })

  it('Should scrap a file (ru)', function (done) {
    var opts = {lang: 'ru'}
    scraper.scrap('слон', opts, function (err, data) {
      var fn = function () { fs.readFileSync(data.path, null) }
      expect(err).to.be.null
      expect(fn).to.not.throw()
      done()
    })
  })

  it('Should return a proper error (word does not exist)', function (done) {
    scraper.scrap('èèèe@@@%*', {}, function (err, data) {
      expect(err).to.be.an('Error')
      expect(data).to.be.null
      done()
    })
  })

  it('Should scrap, move, rename, and convert (fr)', function (done) {
      var folder = __dirname + '/downloads/'
      var opts = {location: folder, lang: 'fr', basename: 'joujou', ext: '.mp3'}
      scraper.scrap('jouet', opts, function (err, data) {
        var fileName = opts.basename + opts.ext
        var fn = function () {
          fs.readFileSync(path.resolve(opts.location, fileName), null)
        }
        expect(err).to.be.null
        expect(fn).to.not.throw()
        done()
      })
    })

})
