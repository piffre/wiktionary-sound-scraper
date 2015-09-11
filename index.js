'use strict'
var https = require('https')
var jsonPath = require('JSONPath')
var Download = require('download')
var urlencode = require('urlencode')
var URL = require('url')


function Scraper () {
  // Only this one function is exposed
  Scraper.prototype.scrap = function scrap (word, location, lang, name, callback) {
    // Well, it is better to have something to look for
    if (!word || !location) {
      callback(Error('Word and location be defined'))
      return
    }

    if (lang === undefined || name === undefined || callback === undefined) {
      callback(Error('Parameters are necessary, use empty strings'))
      return
    }

    word = urlencode(word)
    lang = lang || 'en'

    // Search, locate, retrieve
    // Error management at each stage
    search(word, lang, function (err, fileName) {
      if (err) { callback(err, null) } else {
        locate(fileName, lang, function (err, url) {
          if (err) { callback(err, null) } else {
            retrieve(url, lang, location, name, callback)
          }
        })
      }
    })
  }

  // Search: identify the name of first audio file on wiki page corresponding to the word
  function search (word, lang, callback) {
    // Build the query - media files are "images". See https://www.mediawiki.org/wiki/API:Main_page
    var url = 'https://' + lang + '.wiktionary.org/w/api.php?action=query&prop=images&format=json&iwurl=l&rawcontinue=&titles=' + word

    // Get the data
    https.get(url, function (res) {
      var data = ''

      // Assemble data as it comes
      res.on('data', function (chunk) {
        data += chunk
      })

      // Once we got all the data, parse it
      res.on('end', function () {
        // Get the list of media files in the page
        var images = jsonPath.eval(JSON.parse(data), 'query.pages.*.images.*.title')
        // Look for a sound (.ogg or .ogv) - stop at the first one
        var i = 0
        var found = false
        var fileName = null
        while (i < images.length && !found) {
          fileName = images[i] + ''
          // We found one
          if (fileName.indexOf('.ogg') !== -1 || fileName.indexOf('.ogv') !== -1) {
            found = true
          }
          i++
        }
        var err = null
        if (!found) {
          fileName = null
          err = new Error("Can't find a page corresponding to the word")
        }
        callback(err, fileName)
      })
    }).on('error', function (err) {
      callback(err, null)
    })
  }

  // Locate: discover the url of the file based on its name
  function locate (file, lang, callback) {
    // Build the query - media files are "images". See https://www.mediawiki.org/wiki/API:Main_page
    var url = 'https://' + lang + '.wiktionary.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&iwurl=l&rawcontinue=&titles=' + urlencode(file)
      https.get(url, function (res) {
      var data = ''

      res.on('data', function (chunk) {
        data += chunk
      })

      res.on('end', function () {
        // JSON e.g.: https://en.wiktionary.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&iwurl=l&rawcontinue=&titles=File:en-us-shoe.ogg
        var fileUrl = jsonPath.eval(JSON.parse(data), 'query.pages[-1].imageinfo..url')
        var err = null
        if (!fileUrl) {
          err = new new Error("Can't locate the file")
          fileUrl = null
        } else {
          fileUrl = fileUrl.toString()
        }
        callback(err, fileUrl)
      })
    }).on('error', function (err) {
      callback(err, null)
    })
  }

  // Retrieve: actually grab and download the audio file
  function retrieve (url, lang, location, name, callback) {
    // Making sure we have a readable file name
    if (!name) name = urlencode.decode(URL.parse(url).pathname.split('/').pop())

    new Download()
      .get(url)
      .dest(location)
      .rename(name)
      .run(callback)
  }
}

var scraper = new Scraper()
module.exports = scraper
