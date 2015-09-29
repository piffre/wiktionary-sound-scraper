var scraper = require('../index.js')

// Scraping one word
var word = 'слон'
scraper.scrap(word, __dirname, 'ru', '', function (err, data) {
  console.log('Done')
  if (err) console.log(err)
})
