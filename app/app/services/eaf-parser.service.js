'use strict';

const {
  flatten,
  flattenDeep,
  compact,
  groupBy,
  orderBy,
  map,
  isArray,
  isObject,
  each,
  keys,
  trim
} = require('lodash');
module.exports = EAFParserService;

EAFParserService.$inject = [];
function EAFParserService() {
  const eafParser = {
    parse
  };
  return eafParser;
}

function parse(data) {
  const timeslots = parseTimeSlots(data);
  if (!isArray(data.ANNOTATION_DOCUMENT.TIER)) {
    data.ANNOTATION_DOCUMENT.TIER = [data.ANNOTATION_DOCUMENT.TIER];
  }
  let annotations = mapParentAnnotations(data);
  let childAnnotations = mapChildAnnotations(data, annotations);
  let annotation, children;

  annotations = annotations.map(a => {
    children = childAnnotations.filter(c => a.id === c.id);
    annotation = Object.assign({}, a);
    each(children, c => {
      annotation.value = Object.assign({}, annotation.value, c.value);
    });
    annotation.value = map(annotation.value, v => v);

    annotation.time.begin = timeslots[annotation.time.begin][0].time;
    annotation.time.end = timeslots[annotation.time.end][0].time;
    return annotation;
  });
  annotations = orderBy(annotations, a => a.time.begin);
  return annotations;
}

function parseTimeSlots(data) {
  // extract the time slots and group then by id
  const timeslots = map(data.ANNOTATION_DOCUMENT.TIME_ORDER.TIME_SLOT, function(
    d
  ) {
    // TIME_VALUE needs to be divided by 1000
    //  to give seconds.milliseconds
    return {
      id: d['@attributes'].TIME_SLOT_ID,
      time: parseFloat(d['@attributes'].TIME_VALUE / 1000)
    };
  });
  return groupBy(timeslots, function(d) {
    return d.id;
  });
}

function mapParentAnnotations(data) {
  let annotation, annotationData;
  let annotations = [];
  each(data.ANNOTATION_DOCUMENT.TIER, tier => {
    try {
      if (!tier['@attributes'].PARENT_REF) {
        annotations = [...annotations, flattenDeep(processParentTier(tier))];
        // } else {
        //   processChildTier(tier, annotations);
      }
    } catch (e) {
      console.log(JSON.stringify(tier, null, 2));
    }
  });
  return flattenDeep(annotations);

  function processParentTier(tier) {
    if (isObject(tier.ANNOTATION)) {
      tier.ANNOTATION = [tier.ANNOTATION];
    }
    tier.ANNOTATION = flattenDeep(tier.ANNOTATION);
    return tier.ANNOTATION.map(a => {
      annotation = a.ALIGNABLE_ANNOTATION;
      annotationData = {
        id: annotation['@attributes'].ANNOTATION_ID,
        tierId: tier['@attributes'].TIER_ID,
        time: {
          begin: annotation['@attributes'].TIME_SLOT_REF1,
          end: annotation['@attributes'].TIME_SLOT_REF2
        },
        value: {
          [tier['@attributes'].TIER_ID]: {
            language: tier['@attributes'].DEFAULT_LOCALE,
            text: trim(annotation.ANNOTATION_VALUE['#text'])
          }
        }
      };
      return annotationData;
    });
  }
}

function mapChildAnnotations(data, annotations) {
  let childAnnotations = [];
  each(data.ANNOTATION_DOCUMENT.TIER, tier => {
    try {
      if (tier['@attributes'].PARENT_REF) {
        childAnnotations = [
          ...childAnnotations,
          flattenDeep(processChildTier(tier))
        ];
      }
    } catch (e) {
      console.log(JSON.stringify(tier, null, 2));
    }
  });
  return flattenDeep(childAnnotations);

  function processChildTier(tier) {
    let annotation;
    if (isObject(tier.ANNOTATION)) {
      tier.ANNOTATION = [tier.ANNOTATION];
    }
    tier.ANNOTATION = flattenDeep(tier.ANNOTATION);
    const annotations = tier.ANNOTATION.map(a => {
      annotation = a.REF_ANNOTATION;
      return {
        id: annotation['@attributes'].ANNOTATION_REF,
        value: {
          [tier['@attributes'].TIER_ID]: {
            language: tier['@attributes'].DEFAULT_LOCALE,
            text: trim(annotation.ANNOTATION_VALUE['#text'])
          }
        }
      };
    });
    return annotations;
  }
}

// function parseTiers(tiers) {
//   // extract the annotations
//   var annotations = [];
//   if (!isArray(data.ANNOTATION_DOCUMENT.TIER)) {
//     data.ANNOTATION_DOCUMENT.TIER = [data.ANNOTATION_DOCUMENT.TIER];
//   }
//   each(data.ANNOTATION_DOCUMENT.TIER, function(d) {
//     var a = map(d.ANNOTATION, function(e) {
//       if (e.ALIGNABLE_ANNOTATION) {
//         return {
//           id: e.ALIGNABLE_ANNOTATION['@attributes'].ANNOTATION_ID,
//           ts1: e.ALIGNABLE_ANNOTATION['@attributes'].TIME_SLOT_REF1,
//           ts2: e.ALIGNABLE_ANNOTATION['@attributes'].TIME_SLOT_REF2,
//           value: e.ALIGNABLE_ANNOTATION.ANNOTATION_VALUE['#text'],
//           type: 'alignableAnnotation',
//           speaker: ''
//         };
//       } else if (e.REF_ANNOTATION) {
//         return {
//           id: e.REF_ANNOTATION['@attributes'].ANNOTATION_ID,
//           ref: e.REF_ANNOTATION['@attributes'].ANNOTATION_REF,
//           value: e.REF_ANNOTATION.ANNOTATION_VALUE['#text'],
//           type: 'referenceAnnotation'
//         };
//       }
//     });
//     annotations.push(compact(a));
//   });
//
//   // group the annotations by type
//   annotations = groupBy(flatten(annotations), function(d) {
//     return d.type;
//   });
//
//   // then group the alignable annotations by id:
//   annotations.alignableAnnotation = groupBy(
//     annotations.alignableAnnotation,
//     function(d) {
//       return d.id;
//     }
//   );
//
//   // iterate over the reference annotations and join the data into the alignable annotations
//   each(annotations.referenceAnnotation, function(d) {
//     try {
//       annotations.alignableAnnotation[d.ref][0].referenceValue =
//         d.value || undefined;
//     } catch (e) {}
//   });
//
//   // iterate over the alignable annotations and join the data into the timeslot data
//   each(annotations.alignableAnnotation, function(d) {
//     timeslots[d[0].ts1][0].value = d[0].value;
//     timeslots[d[0].ts1][0].referenceValue = d[0].referenceValue;
//     timeslots[d[0].ts1][0].speaker = d[0].speaker;
//   });
//
//   // finally, collapse it into an array of objects
//   timeslots = map(timeslots, function(d) {
//     return d[0];
//   });
//
//   // free up some memory;
//   delete annotations.alignableAnnotation;
//   delete annotations.referenceAnnotation;
//   return timeslots;
//
//   // timeslots is an array of objects in ascending order
//   // [
//   //    {
//   //        'id': ....,
//   //        'referenceValue': ....,
//   //        'time': ....,
//   //        'value': ....,
//   //        'speaker': ....
//   //    }
//   //    ...
//   //  ]
// }
