'use strict'

var Download = require('download')
var urlencode = require('urlencode')
var File = require('vinyl')

function Downloader () {}

// Retrieve: actually grab and download the audio file
// The data in the callback is a vinyl github.com/wearefractal/vinyl
Downloader.prototype.download = function (url, location, basename, callback) {
  // We use github.com/hparra/gulp-rename
  // basename is different vinyl ('file.js') and gulp-rename ('file')
  var file = new File({path: urlencode.decode(url)})
  var name = ''
  if (basename) name = basename + file.extname
  else name = file.basename
  // There should be only one vinyl at the end, not a table of them
  function done (err, vinyls) {
    var vinyl = null
    if (!err) vinyl = vinyls[0]
    callback(err, vinyl)
  }
  // Launch download, using github.com/kevva/download
  new Download()
    .get(url)
    .dest(location)
    .rename(name)
    .run(done)
}

var downloader = new Downloader()
module.exports = downloader
