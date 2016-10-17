var scraper = require('../index.js')

// Scrap one word
var word = 'слон'
var opts = {
  location: __dirname,
  lang: 'ru',
  ext: '.mp3'
}
scraper.scrap(word, opts, function (err, data) {
  console.log('Done')
  if (err) console.log(err)
})
