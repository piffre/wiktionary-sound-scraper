# Wiktionary sound scraper
[![Build Status](https://travis-ci.org/piffre/wiktionary-sound-scraper.svg?branch=master)](https://travis-ci.org/piffre/wiktionary-sound-scraper)
[![Dependencies Status](https://david-dm.org/piffre/wiktionary-sound-scraper.svg)](https://david-dm.org/piffre/wiktionary-sound-scraper)
[![Coverage Status](https://coveralls.io/repos/piffre/wiktionary-sound-scraper/badge.svg?branch=master&service=github)](https://coveralls.io/github/piffre/wiktionary-sound-scraper?branch=master)

A very simple [npm](https://www.npmjs.com) module to download sounds from [wiktionary.org](https://wiktionary.org). Helpful when you have a long list of words and you want to know how they sound.

Disclaimer: the module is basic, it will download the first .ogg or .ogv file found.

## How to use

### Install the module
```bash
  $ npm install --save wiktionary-sound-scraper
```
### Play with it
```js
var scraper = require('wiktionary-sound-scraper')

var folder = __dirname + '/downloads/'
var opts = {location: folder, lang: 'fr', basename: 'shoe-sound', ext: '.mp3'}

scraper.scrap('shoe', opts, function (err, vinyl) {
  if (err) console.log('Didn\'t work: ' + err)
  else console.log('Here comes the file: ' + vinyl.path)
})
```
## scrap


All the parameters are necessary:
* word to look for
* directory to download in
* language of the wiktionary (e.g.: 'es', 'de', 'it'...)
* name of the file as you want it to be renamed once download (pass '' to avoid renaming)
* callback function

## Want it to do more? Have comments?
Please, [pull requests](https://github.com/piffre/wiktionary-sound-scraper/pulls) and [issues](https://github.com/piffre/wiktionary-sound-scraper/issues/new) are here for that!
