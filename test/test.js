'use strict'

var fs = require('fs')
var path = require('path')

var expect = require('chai').expect
var nock = require('nock')
var urlencode = require('urlencode')

var scraper = require('../')

// TODO Delete files after tests
// TODO test wrong parameters
// TODO DRY!

describe('Scraper', function () {
  beforeEach(function () {
    nock.cleanAll()
    nock.disableNetConnect()
  })
  afterEach(function () {
    nock.cleanAll()
    nock.enableNetConnect()
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
  var fileURL = 'https://upload.wikimedia.org/'
  var searchFile = __dirname + '/samples/shoe-search-reply.json'
  var emptySearchFile = __dirname + '/samples/empty-search-reply.json'
  var locateFile = __dirname + '/samples/shoe-locate-reply.json'
  var file = __dirname + '/samples/En-us-shoe.ogg'

  it('Should handle error from ffmpeg due to wrong file format', function (done) {
    var opts = {
      ext: '#*)°mp3'
    }
    var word = 'shoe'
    nock('https://en.wiktionary.org')
      .get(searchPath + word)
      .replyWithFile(200, searchFile)
    nock('https://en.wiktionary.org')
      .get(locatePath + word)
      .replyWithFile(200, locateFile)
    nock(fileURL)
      .get(searchPath + word)
      .replyWithFile(200, file)
    scraper.scrap(word, opts, function (err, data) {
      expect(err).not.to.be.null
      done()
    })
  })

  it('Should scrap, move, and convert', function (done) {
    var folder = __dirname + '/downloads/'
    var opts = {
      location: folder,
      lang: 'fr',
      ext: '.mp3'
    }
    var word = 'shoe'
    nock('https://fr.wiktionary.org')
      .get(searchPath + word)
      .replyWithFile(200, searchFile)
    nock('https://fr.wiktionary.org')
      .get(locatePath + urlencode.encode('File:en-us-shoe.ogg'))
      .replyWithFile(200, locateFile)
    nock(fileURL)
      .get('/wikipedia/commons/4/44/En-us-shoe.ogg')
      .replyWithFile(200, file)
    var ext = path.extname('En-us-shoe.ogg')
    var basename = path.basename('En-us-shoe.ogg', ext)
    scraper.scrap(word, opts, function (err, data) {
      var fn = function () {
        fs.readFileSync(path.resolve(opts.location, basename + opts.ext), null)
      }
      expect(fn).to.not.throw()
      expect(err).to.be.null
      done()
    })
  })

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
    var word = 'shoe'
    nock('https://fr.wiktionary.org')
      .get(searchPath + word)
      .replyWithFile(200, searchFile)
    nock('https://fr.wiktionary.org')
      .get(locatePath + urlencode.encode('File:en-us-shoe.ogg'))
      .replyWithFile(200, locateFile)
    nock(fileURL)
      .get('/wikipedia/commons/4/44/En-us-shoe.ogg')
      .replyWithFile(200, file)
    scraper.scrap(word, {}, function (err, data) {
      expect(err).not.to.be.empty
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

  it('Should handle a wrong number of parameters', function (done) {
    var err = scraper.scrap('e')
    expect(err).to.be.an('Error')
    done()
  })

  it('Should return a proper error (word does not exist)', function (done) {
    var word = 'èèèe@@@%*'
    nock('https://en.wiktionary.org')
      .get(searchPath + urlencode.encode(word))
      .replyWithFile(200, emptySearchFile)
    scraper.scrap('èèèe@@@%*', {}, function (err, data) {
      expect(err).to.be.an('Error')
      expect(data).to.be.null
      done()
    })
  })

})
