"use strict";

module.exports = TRSParserService;

TRSParserService.$inject = ["lodash"];
function TRSParserService(lodash) {
  var trsParser = {};

  // parse a TRS XML file and return an object keyed on timeslot id
  trsParser.parse = function(data) {
    // ignore the html representations
    if (data.html) {
      return;
    }
    if (data.parsererror && data.parsererror["#text"].match(/Error/)) {
      return;
    }

    // extract the speakers and group by id
    var speakers;
    if (data.Trans[1].Speakers) {
      speakers = lodash.map(data.Trans[1].Speakers.Speaker, function(d) {
        return {
          id: d["@attributes"].id,
          name: d["@attributes"].name
        };
      });
      speakers = lodash.groupBy(speakers, function(d) {
        return d.id;
      });
    } else {
      speakers = {};
    }

    var turns = [];
    if (!lodash.isArray(data.Trans[1].Episode.Section.Turn)) {
      data.Trans[1].Episode.Section.Turn = [data.Trans[1].Episode.Section.Turn];
    }

    lodash.each(data.Trans[1].Episode.Section.Turn, function(d) {
      var spkr;
      // extract the speaker for use later
      if (d["@attributes"]) {
        spkr = d["@attributes"].speaker;
      } else {
        spkr = "";
      }

      // extract the text
      var texts = lodash.map(d["#text"], function(e) {
        return e.trim();
      });
      texts = lodash.without(texts, "");

      var syncs;
      if (lodash.isArray(d.Sync)) {
        syncs = lodash.map(d.Sync, function(e) {
          return e["@attributes"].time;
        });
      } else if (lodash.isObject(d.Sync)) {
        syncs = [d.Sync["@attributes"].time];
      }
      var transdata = lodash.zip(syncs, texts);

      transdata = lodash.map(transdata, function(d) {
        return {
          id: d[0] ? d[0] : 0,
          time: {
            begin: d[0] ? d[0] : 0
          },
          value: d[1],
          referenceValue: "",
          speaker: spkr
        };
      });
      turns.push(transdata);
    });
    data = lodash.groupBy(lodash.flatten(turns), function(d) {
      return d.id;
    });

    // finally, collapse it into an array of objects
    data = lodash.map(data, function(d) {
      return d[0];
    });

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
}
