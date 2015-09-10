"use strict";
var https = require('https');
var fs = require('fs');
var jsonPath = require('JSONPath');
var download = require('download');
var util = require('util');

function Scraper(){

  // Only this one function is exposed
  Scraper.prototype.scrap = function scrap(word, location, lang, callback){

    // Well, it is better to have something to look for
    if(!word) throw new Error('Word must be defined');
    if(!location) throw new Error('Word location be defined');

    // Default value
    lang = lang || "en";
    var file = "";

    // TODO: Avoid/limit callback cascade

    // Search for the file name
    search(word, lang, function(err, data){

      // Locate the file
      if(data && !err) locate(data, lang, function(err, data){

        // Retrieve it
        if(data && !err) retrieve(data, lang, location, callback);

      });
    });
  }

  // Search: identify the name of first audio file on wiki page corresponding to the word
  function search(word, lang, callback){

    var data = "";
    var err = null;
    var fileName = "";

    // Build the query - media files are "images". See https://www.mediawiki.org/wiki/API:Main_page
    var url = "https://" + lang + ".wiktionary.org/w/api.php?action=query&prop=images&format=json&iwurl=l&rawcontinue=&titles=" + word;

    // Get the data
    https.get(url, function(res) {

      // Assemble data as it comes
      res.on('data', function(chunk) {
        data += chunk;
      });

      // Once we got all the data, parse it
      res.on('end', function() {

        // Get the list of media files in the page
        var images = jsonPath.eval(JSON.parse(data), "query.pages.*.images.*.title");

        // Look for a sound (.ogg or .ogv) - stop at the first one
        var i = 0;
        var found = false;
        var fileName = "";

        while(i < images.length && !found){
          fileName = new String(images[i]);

          // We found one
          if (fileName.indexOf('.ogg') != -1 || fileName.indexOf('.ogv') != -1){
            found = true;
          }
          i++;
        }

        if (!found) fileName = "";
        callback(err, fileName);
      });

    }).on('error', function(err) {
      callback(err, data);
    });
  }

  // Locate: discover the url of the file based on its name
  function locate(file, lang, callback){

    var data = "";
    var err = null;

    // Build the query - media files are "images". See https://www.mediawiki.org/wiki/API:Main_page
    var url = "https://" + lang + ".wiktionary.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&iwurl=l&rawcontinue=&titles=" + file;

    https.get(url, function(res) {
      var data = "";

      res.on('data', function(chunk) {
        data += chunk;
      });

      res.on('end', function() {
        // JSON e.g.: https://en.wiktionary.org/w/api.php?action=query&prop=images&format=json&titles=shoe
        var url = jsonPath.eval(JSON.parse(data), "query.pages[-1].imageinfo..url");
        callback(err, url.toString());
      });

    }).on('error', function(err) {
      callback(err, data);
    });
  }

  // Retrieve: actually grab and download the audio file
  function retrieve(url, lang, location, callback){

    new download()
    .get(url)
    .dest(location)
    .run(callback);
  }
}

// No need to create an instance outside of the module
var scraper = new Scraper();
module.exports = scraper;
