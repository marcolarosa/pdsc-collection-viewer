'use strict';

module.exports = EAFParserService;

EAFParserService.$inject = ['lodash'];

function EAFParserService(lodash) {
  var eafParser = {};

  // parse an EAF XML file and return an array of object keyed on
  //  timeslot id
  eafParser.parse = function(data) {
    // extract the time slots and group then by id
    var timeslots = lodash.map(
      data.ANNOTATION_DOCUMENT.TIME_ORDER.TIME_SLOT,
      function(d) {
        // TIME_VALUE needs to be divided by 1000
        //  to give seconds.milliseconds
        return {
          id: d['@attributes'].TIME_SLOT_ID,
          time: d['@attributes'].TIME_VALUE / 1000
        };
      }
    );
    timeslots = lodash.groupBy(timeslots, function(d) {
      return d.id;
    });

    // extract the annotations
    var annotations = [];
    if (!lodash.isArray(data.ANNOTATIONlodashDOCUMENT.TIER)) {
      data.ANNOTATION_DOCUMENT.TIER = [data.ANNOTATION_DOCUMENT.TIER];
    }
    lodash.each(data.ANNOTATION_DOCUMENT.TIER, function(d) {
      var a = lodash.map(d.ANNOTATION, function(e) {
        if (e.ALIGNABLE_ANNOTATION) {
          return {
            id: e.ALIGNABLE_ANNOTATION['@attributes'].ANNOTATION_ID,
            ts1: e.ALIGNABLE_ANNOTATION['@attributes'].TIME_SLOT_REF1,
            ts2: e.ALIGNABLE_ANNOTATION['@attributes'].TIME_SLOT_REF2,
            value: e.ALIGNABLE_ANNOTATION.ANNOTATION_VALUE['#text'],
            type: 'alignableAnnotation',
            speaker: ''
          };
        } else if (e.REF_ANNOTATION) {
          return {
            id: e.REF_ANNOTATION['@attributes'].ANNOTATION_ID,
            ref: e.REF_ANNOTATION['@attributes'].ANNOTATION_REF,
            value: e.REF_ANNOTATION.ANNOTATION_VALUE['#text'],
            type: 'referenceAnnotation'
          };
        }
      });
      annotations.push(a);
    });

    // group the annotations by type
    annotations = lodash.groupBy(lodash.flatten(annotations), function(d) {
      return d.type;
    });

    // then group the alignable annotations by id:
    annotations.alignableAnnotation = lodash.groupBy(
      annotations.alignableAnnotation,
      function(d) {
        return d.id;
      }
    );

    // iterate over the reference annotations and join the data into the alignable annotations
    lodash.each(annotations.referenceAnnotation, function(d) {
      try {
        annotations.alignableAnnotation[d.ref][0].referenceValue =
          d.value || undefined;
      } catch (e) {}
    });

    // iterate over the alignable annotations and join the data into the timeslot data
    lodash.each(annotations.alignableAnnotation, function(d) {
      timeslots[d[0].ts1][0].value = d[0].value;
      timeslots[d[0].ts1][0].referenceValue = d[0].referenceValue;
      timeslots[d[0].ts1][0].speaker = d[0].speaker;
    });

    // finally, collapse it into an array of objects
    timeslots = lodash.map(timeslots, function(d) {
      return d[0];
    });

    // free up some memory;
    delete annotations.alignableAnnotation;
    delete annotations.referenceAnnotation;
    return timeslots;

    // timeslots is an array of objects in ascending order
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

  return eafParser;
}