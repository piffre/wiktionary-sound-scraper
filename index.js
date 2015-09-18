'use strict'

var async = require('async')
var urlencode = require('urlencode')

var downloader = require('./lib/Downloader')
var locator = require('./lib/Locator')
var searcher = require('./lib/Searcher')

function Scraper () {
  // TODO: use opt obj {location:'__dirname', lang:'en', name:'', ext:'mp3'}
  // TODO: allow word to be an array
  Scraper.prototype.scrap = function scrap (word, location, lang, name, callback) {
    if (!word || !location) {
      callback(new Error('Word and location be defined'))
      return
    }
    if (lang === undefined || name === undefined || callback === undefined) {
      callback(new Error('Parameters are necessary, use empty strings'))
      return
    }
    word = urlencode(word)
    lang = lang || 'en'
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
        downloader.download(url, location, name, function (err, data) {
          cbk(err, data)
        })
      }
    ], function (err, data) {
      callback(err, data)
    })
  }
}
var scraper = new Scraper()
module.exports = scraper
