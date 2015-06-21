'use strict';

/**
 * @ngdoc service
 * @name pdscApp.trsParser
 * @description
 * # trsParser
 * Service in the pdscApp.
 */
angular.module('pdscApp')
  .service('trsParser', [ function () {

      var trsParser = {};

      // parse a TRS XML file and return an object keyed on timeslot id
      trsParser.parse = function(data) {

          // ignore the html representations
          if (data.html) return;

          // extract the speakers and group by id
          var speakers = _.map(data.Trans[1].Speakers.Speaker, function(d) {
              return {
                  'id': d['@attributes']['id'],
                  'name': d['@attributes']['name']
              }
          });
          speakers = _.groupBy(speakers, function(d) { return d.id; });

          var turns = [];
          var data;
          _.each(data.Trans[1].Episode.Section.Turn, function(d) {
              // extract the speaker for use ater
              var spkr = d['@attributes']['speaker'];

              // extract the text
              var texts = _.map(d['#text'], function(e) { return e.trim(); });
              texts = _.without(texts, '');
              
              if (_.isArray(d['Sync'])) {
                  var syncs = _.map(d['Sync'], function(e) {
                      return e['@attributes']['time'];
                  })
              } else if (_.isObject(d['Sync'])) {
                  syncs = [ d['Sync']['@attributes']['time'] ];
              }
              data = _.zip(syncs, texts);

              data = _.map(data, function(d) {
                  return {
                      'id': d[0],
                      'time': d[0],
                      'value': d[1],
                      'referenceValue': '',
                      'speaker': spkr
                  }
              })
              turns.push(data);
          });
          data = _.groupBy(_.flatten(turns), function(d) { return d.id; });

          // finally, collapse it into an array of objects
          data = _.map(data, function(d) { return d[0]; });

          return data;

          // data is an array of objects in ascending order
          // [
          //    {
          //        'id': ....,
          //        'referenceValue': ....,
          //        'time': ....,
          //        'value': ....,
          //        'speaker': ....
          //    }
          //    ...
          //  ]
      }

      return trsParser;
  }]);
