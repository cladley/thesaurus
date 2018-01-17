const assert = require('assert');
const thesaurusFetcher = require('../thesaurus-fetcher');

suite("thesaurusFetcher()", function() {
  test("return a list of synonyms for a word", function(done){
    thesaurusFetcher('container')
      .then(words => {
        assert(Array.isArray(words), []);
        done();
      });
  });
});
