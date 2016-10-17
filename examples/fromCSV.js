var scraper = require('../index.js')
var fs = require('fs')
var async = require('async')
var _ = require('lodash')

// Scraping and converting from a csv list

scrapCSV(__dirname + '/csv/list')

var folder = __dirname + '/downloads/'
var opts = {
  location: folder,
  lang: 'en',
  ext: '.mp3'
}

function scrapCSV(file) {
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
      scrapMany(words, opts, function (err, files) {
        callback(err, files)
      })
    }
  ], function (err, files) {
    if (!err) displayResults(files)
  })
}

function displayResults(files) {
  var failure = 0
  var success = 0
  files.forEach(function clean(element, index, array) {
    if (element.error) failure++
      else success++
  })
  var rate = success / files.length * 100
  rate = Math.round(rate)
  console.log('--')
  console.log('total: ' + files.length)
  console.log('success: ' + success + ' (' + rate + '%)')
  console.log('failure: ' + failure + ' (' + (100 - rate) + '%)')
}

function parse(str, cbk) {
  var words = str.toString().toLowerCase()
    // Accents for pronounciation
  var replacement = [
    {
      old: 'а́',
      new: 'а'
    },
    {
      old: 'е́',
      new: 'е'
    },
    {
      old: 'о́',
      new: 'о'
    },
    {
      old: 'у́',
      new: 'у'
    },
    {
      old: 'я́',
      new: 'я'
    },
    {
      old: 'и́',
      new: 'и'
    },
    {
      old: 'ю́',
      new: 'ю'
    },
    {
      old: 'ы́',
      new: 'ы'
    }
  ]
  replacement.forEach(function clean(element, index, array) {
    var reg = new RegExp(element.old, 'g')
    words = words.replace(reg, element.new)
  })
  words = words.split(new RegExp('[;/]', 'g'))
  words = _.uniq(words)
  words.forEach(function clean(element, index, array) {
    words[index] = element.trim()
  })
  cbk(null, words)
}

function scrapMany(words, opts, cbk) {
  var results = []
    // We use forEachOf to keep the context
  async.forEachOf(
    words,
    function (value, key, done) {
      scraper.scrap(value, opts, function scraped(err, vin) {
        results[key] = {
          word: value,
          vinyl: null,
          error: null
        }
        var msg = value
        if (err) {
          results[key].error = err
          msg += ' [failure]'
        } else {
          results[key].vinyl = vin
          msg += ' [success]'
        }
        console.log(msg)
        done()
      })
    },
    function browsed() {
      cbk(null, results)
    }
  )
}
