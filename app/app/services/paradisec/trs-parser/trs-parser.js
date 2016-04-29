'use strict';

angular.module('pdsc')
  .service('trsParser', [ '_',
    function (_) {

      var trsParser = {};

      // parse a TRS XML file and return an object keyed on timeslot id
      trsParser.parse = function(data) {

          // ignore the html representations
          if (data.html) {
              return;
          }

          // extract the speakers and group by id
          var speakers;
          if (data.Trans[1].Speakers) {
              speakers = _.map(data.Trans[1].Speakers.Speaker, function(d) {
                  return {
                      'id': d['@attributes'].id,
                      'name': d['@attributes'].name
                  };
              });
              speakers = _.groupBy(speakers, function(d) { return d.id; });
          } else {
              speakers = {};
          }

          var turns = [];
          if (!_.isArray(data.Trans[1].Episode.Section.Turn)) {
              data.Trans[1].Episode.Section.Turn = [data.Trans[1].Episode.Section.Turn];
          }

          _.each(data.Trans[1].Episode.Section.Turn, function(d) {
              var spkr;
              // extract the speaker for use later
              if (d['@attributes']) {
                  spkr = d['@attributes'].speaker;
              } else {
                  spkr = '';
              }

              // extract the text
              var texts = _.map(d['#text'], function(e) { return e.trim(); });
              texts = _.without(texts, '');
              
              var syncs;
              if (_.isArray(d.Sync)) {
                  syncs = _.map(d.Sync, function(e) {
                      return e['@attributes'].time;
                  });
              } else if (_.isObject(d.Sync)) {
                  syncs = [ d.Sync['@attributes'].time ];
              }
              var transdata = _.zip(syncs, texts);

              transdata = _.map(transdata, function(d) {
                  return {
                      'id': d[0] ? d[0] : 0,
                      'time': d[0] ? d[0] : 0,
                      'value': d[1],
                      'referenceValue': '',
                      'speaker': spkr
                  };
              });
              turns.push(transdata);
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
      };

      return trsParser;
  }]);
