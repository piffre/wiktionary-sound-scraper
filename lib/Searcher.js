'use strict'

var https = require('https')
var jsonPath = require('JSONPath')

function Searcher() {}

// Search: identify the name of first audio file on wiki page corresponding to the word
Searcher.prototype.search = function (word, lang, callback) {
  // Build the query - media files are "images". See https://www.mediawiki.org/wiki/API:Main_page
  var url = 'https://' +
    lang +
    '.wiktionary.org' +
    '/w/api.php' +
    '?action=query' +
    '&prop=images' +
    '&format=json' +
    '&iwurl=l' +
    '&rawcontinue=' +
    '&titles=' +
    word
  var err = null

  // Get the data
  https.get(url, function (res) {
    var data = ''

    // Assemble data as it comes
    res.on('data', function (chunk) {
      data += chunk
    })

    // Once we got all the data, parse it
    res.on('end', function () {
      try {
        // Get the list of media files in the page
        var images = jsonPath.eval(
          JSON.parse(data),
          'query.pages.*.images.*.title')
      } catch (e) {
        err = new Error('Wrong response from Wiktionary')
        callback(err, null)
        return
      }
      // Look for a sound (.ogg or .ogv) - stop at the first one
      var i = 0
      var found = false
      var fileName = null
      while (i < images.length && !found) {
        fileName = images[i] + ''
          // We found one
        if (fileName.indexOf('.ogg') !== -1 ||
          fileName.indexOf('.ogv') !== -1) {
          found = true
        }
        i++
      }
      if (!found) {
        fileName = null
        err = new Error("Can't find a page corresponding to the word")
      }
      callback(err, fileName)
      return
    })
  }).on('error', function (err) {
    callback(err, null)
    return
  })
}

var searcher = new Searcher()
module.exports = searcher
