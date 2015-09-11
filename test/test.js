'use strict'

var expect = require('chai').expect
var fs = require('fs')
var scraper = require('../')
var path = require('path')

// TODO Mock to avoid using network and file "En-us-shoe.ogg"
describe('Scraper', function () {
  this.timeout(5000)
  it('Should fail because of missing language and word parameters', function (done) {
    scraper.scrap(undefined, '', undefined, undefined, function (err, data) {
      expect(err).to.be.an('Error')
      done()
    })
  })
  it('Should scrap a file', function (done) {
    scraper.scrap('shoe', __dirname, 'en', '', function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(__dirname, 'En-us-shoe.ogg'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })
  it('Should scrap a file and rename it', function (done) {
    scraper.scrap('shoe', __dirname, 'en', 'file.ogg', function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(__dirname, 'file.ogg'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })
  it('Should fail and a return proper error (file does not exist)', function (done) {
    scraper.scrap('Word that does not exist in Wiktionary', __dirname, 'en', '', function (err, data) {
      expect(err).to.be.an('Error')
      done()
    })
  })
  it('Should scrap a file from another language and rename it', function (done) {
    scraper.scrap('jouet', __dirname, 'fr', 'jouet.ogg', function (err, data) {
      var fn = function () { fs.readFileSync(path.resolve(__dirname, 'jouet.ogg'), null) }
      expect(fn).to.not.throw(err)
      done()
    })
  })
})
