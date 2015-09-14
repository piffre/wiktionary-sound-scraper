# Wiktionary sound scraper
[![Build Status](https://travis-ci.org/piffre/wiktionary-sound-scraper.svg?branch=master)](https://travis-ci.org/codtatochip/wiktionary-sound-scraper)
[![Dependencies Status](https://david-dm.org/piffre/wiktionary-sound-scraper.svg)](https://david-dm.org/codtatochip/wiktionary-sound-scraper)

A very simple [npm](https://www.npmjs.com) module to download sounds from [wiktionary.org](https://wiktionary.org). Helpful when you have a long list of words and you want to know how they sound.

Disclaimer: the module is basic, it will download the first .ogg or .ogv file found.

## How to use

### Install the module
```bash
  $ npm install wiktionary-sound-scraper
```
### Play with it
```js
var scraper = require('wiktionary-sound-scraper')
scraper.scrap('shoe', __dirname, 'en', 'file.ogg', function (err, data){})
```
All the parameters are necessary:
* word to look for
* directory to download in
* language of the wiktionary (e.g.: 'es', 'de', 'it'...)
* name of the file as you want it to be renamed once download (pass '' to avoid renaming)
* callback function

## Want it to do more? Have comments?
Please, [pull requests](https://github.com/piffre/wiktionary-sound-scraper/pulls) and [issues](https://github.com/piffre/wiktionary-sound-scraper/issues/new) are here for that!
