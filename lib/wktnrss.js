"use strict";
var SoundFile = require('./soundfile');
var https = require('https');
var fs = require('fs');
var jsonPath = require('JSONPath');


exports.getSound = function(word, wikiLangCode, searchLang){

  // Well, it is better to have something to look for
  if(!word) throw new Error('Word must be defined');

  // Default values, if parameters have not been defined
  wikiLangCode = wikiLangCode || "en";
  searchLang = searchLang || "English";

  var file = "";

  // find the file name
  // locate the file
  // retrieve it

console.log(file);
}

// Find the file name
var find = function(word, wikiLangCode, searchLang){

  console.log("Finding: " + word);

  var data = "";
  var err = null;
  var fileName = "";

  // Build the query - media files are "images". See https://www.mediawiki.org/wiki/API:Main_page
  var url = "https://" + wikiLangCode + ".wiktionary.org/w/api.php?action=query&prop=images&format=json&iwurl=l&rawcontinue=&titles=" + word;
  console.log("Querying: " + url);

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

      while(i < images.length && !found){
        fileName = new String(images[i]);

        // We found one
        if (fileName.indexOf('.ogg') != -1 || fileName.indexOf('.ogv') != -1){
          found = true;
          console.log("Found: " + fileName);
        }
        i++;
      }

    });
  }).on('error', function(err) {
      console.log("Got error: " + err.message);
  });
  return fileName;

}

// Locate the file
var locate = function(file){

  console.log("locating: " + file);
  var data = "";

  // Get the URL
  var url = "https://" + wikiLangCode + ".wiktionary.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&iwurl=l&rawcontinue=&titles=" + file;
  console.log("Querying:" + url);

  https.get(url, function(res) {
    console.log("Got response: " + res.statusCode);
    var data = "";
    res.on('data', function(chunk) {
      data += chunk;
    });

    // Once we got all the data, parse it
    res.on('end', function() {
      console.log(data);

    });
  });
  return data;
}

  // Retrieve
  var retrieve = function(file){}
