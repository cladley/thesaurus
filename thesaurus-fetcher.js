const fetch = require('node-fetch');
const url = require('url');
const cheerio = require('cheerio')
const randomAgent = require('random-fake-useragent');

const THESAURUS_URL = 'https://www.powerthesaurus.org';
const WORD_ROW_SELECTOR = 'tr.theentry';
const WORD_SELECTOR = 'td.abbdef a';

function getWordsFor(word) {
  const thesaurusUrl = url.resolve(THESAURUS_URL, word);

  return new Promise((res, rej) => {
    fetch(thesaurusUrl, {
      method: 'GET',
      headers: {
        'user-agent': randomAgent.getRandom()
      }
    })
    .then(result => {
      return result.text();
    })
    .then(htmlString => {
      const page = cheerio.load(htmlString);
      const words = page(WORD_ROW_SELECTOR).map((index, element) => {
        return page(element).find(WORD_SELECTOR).first().text()
      }).get();
      res(words);
    })
    .catch(error => {
      rej(`An error occured fetching results for ${word}`);
    });
  });
}

module.exports = getWordsFor;
