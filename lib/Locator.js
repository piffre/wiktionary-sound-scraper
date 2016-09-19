'use strict'

var https = require('https')

var jsonPath = require('JSONPath')
var urlencode = require('urlencode')

function Locator() {}

Locator.prototype.locate = function (file, lang, callback) {
  // TODO Use URL object
  // Locate: discover the url of the file based on its name
  // Build the query - media files are "images". See https://www.mediawiki.org/wiki/API:Main_page
  var url = 'https://' +
    lang +
    '.wiktionary.org/w/api.php' +
    '?action=query' +
    '&prop=imageinfo' +
    '&iiprop=url' +
    '&format=json' +
    '&iwurl=l' +
    '&rawcontinue=' +
    '&titles=' +
    urlencode(file)
  var err = null
  https.get(url, function (res) {
    var data = ''
    res.on('data', function (chunk) {
      data += chunk
    })
    res.on('end', function () {
      // JSON e.g.: https://en.wiktionary.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&iwurl=l&rawcontinue=&titles=File:en-us-shoe.ogg
      try {
        var fileUrl = jsonPath.eval(
          JSON.parse(data),
          'query.pages[-1].imageinfo..url')
        callback(err, fileUrl.toString())
        return
      } catch (e) {
        err = new Error('Wrong response from Wiktionary')
        callback(err, null)
        return
      }
    })
  }).on('error', function (err) {
    callback(err, null)
    return
  })
}

var locator = new Locator()
module.exports = locator
