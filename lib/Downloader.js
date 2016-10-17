'use strict'

var download = require('download')
var fs = require('fs');

var urlencode = require('urlencode')
var File = require('vinyl')

function Downloader() {}

// Retrieve: actually grab and download the audio file
// The data in the callback is a vinyl github.com/wearefractal/vinyl
Downloader.prototype.download = function (url, location, callback) {
  var file = new File({
    path: urlencode.decode(url)
  })

  var error = null
  var response = null
  var vinyl = null
  download(url, location).then(response => {
    vinyl = new File({
      path: location + file.basename,
      basename: file.basename,
      contents: new Buffer(response)
    })
    callback(error, vinyl)
  }).catch(err => {
    error = err
  })
}

var downloader = new Downloader()
module.exports = downloader
