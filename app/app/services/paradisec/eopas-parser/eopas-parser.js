'use strict';

angular.module('pdsc')
  .service('eopasParser', [ '_',
    function (_) {

      var eopasParser = {};

      // parse an eopas XML file and return an object keyed on timeslot id
      eopasParser.parse = function(data) {
          var text = _.map(data.eopas.interlinear.phrase, function(d) {
              var words = _.map(d.wordlist.word, function(w) {
                  console.log(w.text, w.morphemelist);
                  _.each(w.morphemelist, function(m) {
                      if (_.isPlainObject(m)) {
                          m = [m];
                      }
                      console.log(m);
                  });
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
              }
          });
          console.log(data.eopas.interlinear.phrase);
          console.log(text);
      };

      return eopasParser;
  }]);
