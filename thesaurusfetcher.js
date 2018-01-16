const fetch = require('node-fetch');
const url = require('url');
const cheerio = require('cheerio')

const THESAURUS_URL = 'https://www.powerthesaurus.org';

function getWordsFor(word) {
  const thesaurusUrl = url.resolve(THESAURUS_URL, word);

  return new Promise((res, rej) => {
    fetch(thesaurusUrl)
      .then(result => {
        return result.text();
      })
      .then(htmlString => {
        const page = cheerio.load(htmlString);
        const words =  page('tr.theentry').map((index, element) => {
          return page(element).find('td.abbdef a').first().text()
        }).get();
        res(words);
      })
      .catch(error => {
        rej(`An error occured fetching results for ${word}`);
      });
  });
}

module.exports = getWordsFor;
