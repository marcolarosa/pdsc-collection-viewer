'use strict';

module.exports = FlextextParserService;

FlextextParserService.$inject = ['lodash'];

function FlextextParserService(lodash) {
  var flextextParser = {};

  // parse an eopas XML file and return an object keyed on timeslot id
  flextextParser.parse = function(data) {
    var text = lodash.map(
      data.document['interlinear-text'].paragraphs.paragraph,
      function(p) {
        var words = lodash.map(p.phrases.phrase.words.word, function(w) {
          try {
            if (!lodash.isArray(w.morphemes.morph)) {
              w.morphemes.morph = [w.morphemes.morph];
            }
          } catch (e) {
            return {};
          }
          var word = lodash.map(w.morphemes.morph, function(m) {
            try {
              return {
                text: m.item[0]['#text'],
                morpheme: m.item[2]['#text'],
                gloss: m.item[3]['#text']
              };
            } catch (e) {
              // bad data...
            }
          });
          try {
            w = {
              words: word
            };
          } catch (e) {
            // bad data...
          }
          return w;
        });

        return {
          id: p.phrases.phrase['@attributes']['begin-time-offset'],
          transcription: p.phrases.phrase.item[0]['#text'],
          translation: p.phrases.phrase.item[1]['#text'],
          time: {
            begin: parseFloat(
              p.phrases.phrase['@attributes']['begin-time-offset']
            )
          },
          words: words
        };
      }
    );
    return text;
  };

  return flextextParser;
}
