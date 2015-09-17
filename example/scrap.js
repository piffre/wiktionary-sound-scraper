var scraper = require('../index.js')
var converter = require('./converter.js')
var fs = require('fs')
var async = require('async')
var _ = require('lodash')

// Scraping one word
/*
var word = 'слон'
scraper.scrap(word, __dirname, 'ru', '', function (err, data) {
  console.log('Done')
  if (err) console.log(err)
})
*/

// Scraping and converting from a csv list

scrapCSV(__dirname + '/list-ru-2.csv')

function scrapCSV (file) {
  async.waterfall([
    function (callback) {
      fs.readFile(file, function (err, string) {
        callback(err, string)
      })
    },
    function (string, callback) {
      parse(string, function (err, words) {
        callback(err, words)
      })
    },
    function (words, callback) {
      scrapConv(words, function (err, files) {
        callback(err, files)
      })
    }
  ], function (err, files) {
    if (!err) displayResults(files)
  })
}

function displayResults (results) {
  var failure = 0
  var success = 0
  results.forEach(function clean (element, index, array) {
    var status = element.error ? 'failure' : 'success'
    if (element.error) failure++
    else success++
    console.log(element.word + ': ' + status)
  })
  console.log('total: ' + results.length)
  console.log('success: ' + success)
  console.log('failure: ' + failure)
}

function parse (str, cbk) {
  var words = str.toString().toLowerCase()
  // Accents for pronounciation
  var replacement = [
    {old: 'а́', new: 'а'},
    {old: 'е́', new: 'е'},
    {old: 'о́', new: 'о'},
    {old: 'у́', new: 'у'},
    {old: 'я́', new: 'я'},
    {old: 'и́', new: 'и'},
    {old: 'ю́', new: 'ю'},
    {old: 'ы́', new: 'ы'}
  ]
  replacement.forEach(function clean (element, index, array) {
    var reg = new RegExp(element.old, 'g')
    words = words.replace(reg, element.new)
  })
  words = _.unique(words.split(','))
  words.forEach(function clean (element, index, array) {
    words[index] = element.trim()
  })
  cbk(null, words)
}

function scrapConv (words, cbk) {
  var results = []
  // We use forEachOf to keep the context
  async.forEachOf(
    words
    , function (value, key, done) {
      scraper.scrap(value, __dirname, 'ru', '', function scraped (err, vin) {
        results[key] = {word: value, vinyl: null, error: null}
        if (err) results[key].error = err
        else {
          results[key].vinyl = vin
          converter.convert(results[key].vinyl.path, '.mp3', function converted (err, opath) {
            if (!err) results[key].vinyl.path = opath
          })
        }
        done()
      })
    }
    , function browsed () {
      cbk(null, results)
    }
  )
}
