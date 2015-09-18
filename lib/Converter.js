'use strict'

var spawn = require('child_process').spawn
var path = require('path')

function Converter () {}

// ffmpeg must be installed, and accessible
Converter.prototype.convert = function (ipath, ext, cbk) {
  var opath = path.parse(path.normalize(ipath))
  opath.ext = ext
  opath.base = opath.name + ext
  opath = path.format(opath)
  // Conversion (-i), replacement of any existing file (-y)
  var cmd = spawn('ffmpeg', ['-y', '-i', ipath, opath])
  cmd.on('close', function (code) {
    var err = null
    if (code) err = new Error('Error while converting')
    cbk(err, opath)
  })
}

var converter = new Converter()
module.exports = converter
