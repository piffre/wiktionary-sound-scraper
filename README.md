# Wiktionary sound scraper
[![Build Status](https://travis-ci.org/piffre/wiktionary-sound-scraper.svg?branch=master)](https://travis-ci.org/piffre/wiktionary-sound-scraper)
[![Dependencies Status](https://david-dm.org/piffre/wiktionary-sound-scraper.svg)](https://david-dm.org/piffre/wiktionary-sound-scraper)
[![Coverage Status](https://coveralls.io/repos/piffre/wiktionary-sound-scraper/badge.svg?branch=master&service=github)](https://coveralls.io/github/piffre/wiktionary-sound-scraper?branch=master)

[npm](https://www.npmjs.com) module to download and convert sounds from [wiktionary.org](https://wiktionary.org).

Helpful when you have a long list of words and you want to know how they sound.

## How to use
### Install the module
```bash
  $ npm install wiktionary-sound-scraper --save
```
### Conversion
[ffmpeg](https://www.ffmpeg.org/) is necessary to convert files.
Files on wiktionary are in .ogg or .ogv
### Play with it
```js
var scraper = require('wiktionary-sound-scraper')

var folder = __dirname + '/downloads/'
var opts = {location: folder, lang: 'fr', ext: '.mp3'}

scraper.scrap('shoe', opts, function (err, vinyl) {
  if (err) console.log('Didn\'t work: ' + err)
  else console.log('Here comes the file: ' + vinyl.path)
})
```
## Examples
There are some in the `examples` folder, including one how to scrap words from a `.csv` file.

## Doc
### scrap(word, options, callback)
#### word
* Type: `String`
* Mandatory
* Word to look for.

#### options
* Type: `Object`
* Mandatory but can be an empty object (ie.:`{}`)

#### options.folder
* Type: `Object`
* Optional
* Default: `__dirname`
* Folder to download the file to, will be created if necessary.

#### options.lang
* Type: `String`
* Optional
* Default: `'en'`
* The wiktionary to search in (eg.: `'de'` for de.wiktionary.org).

#### options.ext
* Type: `String`
* Optional
* Default: `null`
* Extension, eg. `'.mp3'`.

#### callback
* Type: `Function`
* Mandatory
* Function called once the operation has been performed.
* Takes two arguments:
* `err`: if an error occured
* `vinyl`: [vinyl](https://github.com/wearefractal/vinyl) file built at the end

## Feedbacks, please!
[Pull requests](https://github.com/piffre/wiktionary-sound-scraper/pulls) and [issues](https://github.com/piffre/wiktionary-sound-scraper/issues/new) are here for that!
