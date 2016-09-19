'use strict'

var async = require('async')
var urlencode = require('urlencode')

var downloader = require('./lib/Downloader')
var locator = require('./lib/Locator')
var searcher = require('./lib/Searcher')
var converter = require('./lib/Converter')

function Scraper () {}

// var opts = {location:folder, lang: 'fr', basename: 'new', ext: '.mp3'}
// TODO: allow 'word' to be an array
Scraper.prototype.scrap = function scrap (word, opts, callback) {
  // Args check
  if (arguments.length !== 3) {
    return new Error('Wrong number of arguments')
  }
  if (typeof (word) !== 'string' ||
      typeof (opts) !== 'object' ||
      typeof (callback) !== 'function') {
    return callback(new Error('Wrong argument type'), null)
  }
  
  word = urlencode(word)
  var location = opts.location ? opts.location : __dirname
  var lang = opts.lang ? opts.lang : 'en'
  var basename = opts.basename ? opts.basename : null
  var ext = opts.ext ? opts.ext : null

  async.waterfall([
    function (cbk) {
      searcher.search(word, lang, function (err, fileName) {
        if (err) return cbk(err, null)
        else cbk(null, fileName)
      })
    },
    function (fileName, cbk) {
      locator.locate(fileName, lang, function (err, url) {
        if (err) return cbk(err, null)
        else cbk(null, url)
      })
    },
    function (url, cbk) {
      downloader.download(url, location, basename, function (err, vinyl) {
        if (err) return cbk(err, null)
        else cbk(err, vinyl)
      })
    },
    function (ivinyl, cbk) {
      var error = null
      var finalVinyl = ivinyl
      if (ext) {
        converter.convert(ivinyl, ext, function (err, ovinyl) {
          if (err) error = err
          else finalVinyl = ovinyl
          cbk(error, finalVinyl)
          return
        })
      } else {
         cbk(error, finalVinyl)
         return
      }
    }
  ], function (err, data) {
    callback(err, data)
    return
  })
}

var scraper = new Scraper()
module.exports = scraper
