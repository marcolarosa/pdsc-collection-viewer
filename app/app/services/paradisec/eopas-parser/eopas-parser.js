'use strict';

angular.module('pdsc')
  .service('eopasParser', [ '_',
    function (_) {

      var eopasParser = {};

      // parse an eopas XML file and return an object keyed on timeslot id
      eopasParser.parse = function(data) {
          var text = _.map(data.eopas.interlinear.phrase, function(d) {
              var words = _.map(d.wordlist.word, function(w) {
                  try {
                      if (!_.isArray(w.morphemelist.morpheme)) {
                          w.morphemelist.morpheme = [ w.morphemelist.morpheme ];
                      }
                  } catch(e) {
                      return {};
                  }
                  var word = _.map(w.morphemelist.morpheme, function(m) {
                      return {
                          'morpheme': m.text[0]['#text'],
                          'gloss': m.text[1]['#text']
                      };
                  });
                  w = {
                      'text': w.text['#text'],
                      'words': word
                  };
                  return w;
              });
              return {
                'transcription': d.transcription['#text'],
                'translation': d.translation['#text'],
                'time': d['@attributes'].startTime,
                'words': words
              };
          });
          return text;
      };

      return eopasParser;
  }]);
