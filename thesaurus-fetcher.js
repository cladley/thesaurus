const fetch = require('node-fetch');
const cheerio = require('cheerio')
const randomAgent = require('random-fake-useragent');

const THESAURUS_URL = `https://www.powerthesaurus.org/{WORD}/synonyms`;
const WORD_ROW_SELECTOR = '.pt-list-terms__item';
const WORD_SELECTOR = '.pt-thesaurus-card__term-title a';

function getWordsFor(word) {
  const thesaurusUrl = THESAURUS_URL.replace('{WORD}', word);

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
      rej(`An error occurred fetching results for ${word}`);
    });
  });
}

module.exports = getWordsFor;
