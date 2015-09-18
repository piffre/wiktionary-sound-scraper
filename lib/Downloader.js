'use strict'

var URL = require('url')

var Download = require('download')
var urlencode = require('urlencode')

function Downloader () {
  // Retrieve: actually grab and download the audio file
  // The data in the callback is a vinyl
  Downloader.prototype.download = function (url, location, name, callback) {
    // Making sure we have a readable file name
    if (!name) name = urlencode.decode(URL.parse(url).pathname.split('/').pop())

    new Download()
      .get(url)
      .dest(location)
      .rename(name)
      .run(done)

    function done (err, vinyl) {
      var scrappedObj = null
      if (!err) scrappedObj = vinyl[0]
      callback(err, scrappedObj)
    }
  }
}
var downloader = new Downloader()
module.exports = downloader
