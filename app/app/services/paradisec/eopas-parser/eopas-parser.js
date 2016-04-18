'use strict';

angular.module('pdsc')
  .service('eopasParser', [ '_',
    function (_) {

      var eopasParser = {};

      // parse an eopas XML file and return an object keyed on timeslot id
      eopasParser.parse = function(data) {
          var text = _.map(data.eopas.interlinear.phrase, function(d) {
              var words = _.map(d.wordlist.word, function(w) {
                  if (!_.isArray(w.morphemelist.morpheme)) {
                      w.morphemelist.morpheme = [ w.morphemelist.morpheme ];
                  }
                  var word = _.map(w.morphemelist.morpheme, function(m) {
                      var a = m.text[0]['@attributes'].kind,
                          b = m.text[1]['@attributes'].kind;
                      return {
                          a: m.text[0]['#text'],
                          b: m.text[1]['#text']
                      };
                  });
                  word.text = w.text['#text'];
                  return word;
              });
              return {
                'transcription': d.transcription['#text'],
                'translation': d.translation['#text'],
                'metadata': {
                    'id': d['@attributes'].id,
                    'start': d['@attributes'].startTime,
                    'end': d['@attributes'].endTime
                },
                'words': words
              };
          });
          //console.log(data.eopas.interlinear.phrase);
          console.log(text);
      };

      return eopasParser;
  }]);
