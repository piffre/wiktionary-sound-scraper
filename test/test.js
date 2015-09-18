'use strict'

var fs = require('fs')
var path = require('path')

var expect = require('chai').expect

var scraper = require('../')

// TODO Mock to avoid using network and file "En-us-shoe.ogg"
describe('Scraper', function () {
  this.timeout(50000)

  // TODO: use opt obj {location:'__dirname', lang:'en', name:'', ext:'mp3'}
  var opts = {location:__dirname, lang: 'en', name: '', ext: '.mp3'}

  it('Should fail because of missing word parameter', function (done) {
    var opts = {}
    scraper.scrap(undefined, opts, function (err, data) {
      expect(err).to.be.an('Error')
      done()
    })
  })

  it('Should scrap a file (en)', function (done) {
    var opts = {}
    scraper.scrap('shoe', opts, function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(__dirname, 'En-us-shoe.ogg'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })

  it('Should scrap a file (ru)', function (done) {
    var opts = {lang: 'ru'}
    scraper.scrap('слон', opts, function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(__dirname, 'Ru-слон.ogg'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })

  it('Should scrap a file and rename it', function (done) {
    var opts = {name: 'file'}
    scraper.scrap('shoe', opts, function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(__dirname, 'file.ogg'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })

  it('Should scrap a file to another directory', function (done) {
    var folder = __dirname + '/downloads/'
    var opts = {location: folder}
    scraper.scrap('shoe', opts, function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(folder, 'En-us-shoe.ogg'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })

  it('Should scrap a file and convert it', function (done) {
    var opts = {ext: '.mp3'}
    scraper.scrap('shoe', opts, function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(__dirname, 'En-us-shoe.mp3'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })

  it('Should fail and a return proper error (word does not exist)', function (done) {
    scraper.scrap('èèèe@@@%*',{}, function (err, data) {
      expect(err).to.be.an('Error')
      done()
    })
  })

  it('Should scrap a file, move it to another folder, rename it, and convert it (fr)', function (done) {
    var folder = __dirname + '/downloads/'
    var opts = {location:folder, lang: 'fr', name: 'joujou', ext: '.mp3'}
    scraper.scrap('jouet', opts, function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(folder, 'joujou.mp3'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })




})
