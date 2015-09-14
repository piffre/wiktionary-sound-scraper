var scraper = require('../index.js')
var fs = require('fs')
var async = require('async')

// Scraping one word
var word = 'слон'
scraper.scrap(word, __dirname, 'ru', '', function (err, data) {
  console.log('Done')
  if (err) console.log(err)
})

// Scraping a list from a .csv file
fs.readFile(__dirname + '/list-short-ru.csv', function read (err, data) {
  if (err) throw err
  var words = data.toString().toLowerCase().split(',')
  var results = []
  async.forEachOf(
    words
    , function (value, key, callback) {
      scraper.scrap(value, __dirname, 'ru', '', function scraped (err, vinyl) {
        results[key] = {word: value, path: null, error: null}
        // We don't send it to the callback
        if (err) {
          results[key].error = err
        } else {
          results[key].path = vinyl.path
        }
        callback()
      })
    }
    , function whenDone () {
      console.log('Done. Results:')
      results.forEach(function (value, index, array) {
        var error = 'no'
        if (value.error) error = 'yes'
        console.log(value.word + ': path: ' + value.path + '; error: ' + error)
      })
    }
  )
})
