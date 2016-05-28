'use strict';

angular.module('pdsc')
  .service('flextextParser', [ '_',
    function (_) {

      var flextextParser = {};

      // parse an eopas XML file and return an object keyed on timeslot id
      flextextParser.parse = function(data) {
          var text = _.map(data.document['interlinear-text'].paragraphs.paragraph, function(p) {
              var words = _.map(p.phrases.phrase.words.word, function(w) {


                  try {
                      if (!_.isArray(w.morphemes.morph)) {
                          w.morphemes.morph = [ w.morphemes.morph ];
                      }
                  } catch(e) {
                      return {};
                  }
                  var word = _.map(w.morphemes.morph, function(m) {
                      try {
                          return {
                              morpheme: m.item[2]['#text'],
                              gloss: m.item[3]['#text']
                          }
                      } catch(e) {
                          // bad data...
                      }
                  });
                  try {
                      w = {
                          text: w.morphemes.morph[0].item[0]['#text'],
                          words: word
                      }
                  } catch(e) {
                      // bad data...
                  }
                  return w;
              });

              return {
                  id: p.phrases.phrase['@attributes']['begin-time-offset'],
                  transcription: p.phrases.phrase.item[0]['#text'],
                  translation: p.phrases.phrase.item[1]['#text'],
                  time: p.phrases.phrase['@attributes']['begin-time-offset'],
                  words: words
              }
          });
          return text;
      };

      return flextextParser;
  }]);
