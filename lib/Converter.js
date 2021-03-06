'use strict'

var spawn = require('child_process').spawn
var File = require('vinyl')

function Converter () {}

// ffmpeg must be installed, and accessible
Converter.prototype.convert = function (ivinyl, ext, cbk) {
  var ovinyl = new File({path: ivinyl.path})
  ovinyl.extname = ext
  // Conversion (-i), replacement of any existing file (-y)
  var cmd = spawn('ffmpeg', ['-y', '-i', ivinyl.path, ovinyl.path])
  cmd.on('close', function (code) {
    var err = null
    if (code) {
      err = new Error('Error while converting, with code ' + code)
      ovinyl = null
    }
    cbk(err, ovinyl)
    return
  })
}
var converter = new Converter()
module.exports = converter
