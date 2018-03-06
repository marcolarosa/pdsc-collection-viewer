'use strict';

module.exports = DataService;

DataService.$inject = [
  '$rootScope',
  '$log',
  '$http',
  'configuration',
  'xmlToJsonService',
  'eafParserService',
  'trsParserService',
  'ixtParserService',
  'flextextParserService',
  'lodash'
];
function DataService(
  $rootScope,
  $log,
  $http,
  configuration,
  xmlToJson,
  eaf,
  trs,
  ixt,
  ftp,
  lodash
) {
  var ds = {
    imageTypes: ['jpg', 'jpeg', 'png'],
    videoTypes: ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'webm'],
    audioTypes: ['mp3', 'webm', 'ogg', 'oga'],
    documentTypes: ['pdf'],
    getItem: getItem,
    data: {}
  };
  return ds;

  // Given a collectionId and itemId - get the
  //  item data.
  function getItem(collectionId, itemId) {
    const itemIdentifier = configuration.datasource.itemIdentifier
      .replace('{{collectionId}}', collectionId)
      .replace('{{itemId}}', itemId);

    const url = configuration.datasource.getItem.replace(
      '{{itemId}}',
      itemIdentifier
    );
    $log.info(`ds getItem ${url}`);

    if (ds.data[collectionId] && ds.data[collectionId][itemId]) {
      return Promise.resolve(ds.data[collectionId][itemId]);
    } else {
      return $http
        .get(url, {transformResponse: parseOAI})
        .then(processResponse)
        .catch(handleError);
    }

    function processResponse(resp) {
      resp.data.data.collectionId = collectionId;
      resp.data.data.collectionLink =
        configuration.datasource.collections + '/' + collectionId;
      resp.data.data.itemId = itemId;

      // store the object in the service and let the metadata
      //  controller know it's ready to go
      if (!ds.data[collectionId]) {
        ds.data[collectionId] = {};
      }
      ds.data[collectionId][itemId] = resp.data.data;

      // and return it to the caller which is expecting a promise
      return resp.data.data;
    }

    function handleError(err) {
      $log.error("dataService: error, couldn't get", url);
    }

    function parseOAI(d) {
      var tree = parseXML(d);

      try {
        tree = tree['OAI-PMH'].GetRecord.record.metadata['olac:olac'];

        return {data: createItemDataStructure(tree)};
      } catch (e) {
        return {data: ''};
      }

      function parseXML(doc) {
        var parser = new DOMParser();

        // parse the xml document
        var xmldoc = parser.parseFromString(doc, 'text/xml');

        // return it as JSON
        return xmlToJson.convert(xmldoc);
      }
    }
  }

  // handler to process item lists:
  //  - knows how to handle images sets, audio and video sets,
  //  document sets: pdf and xml
  function constructItemList(type, tree) {
    var selector;
    if (type === 'images') {
      selector = ds.imageTypes;
    } else if (type === 'video') {
      selector = ds.videoTypes;
    } else if (type === 'audio') {
      selector = ds.audioTypes;
    } else if (type === 'documents') {
      selector = ds.documentTypes;
    } else if (type === 'eaf') {
      selector = 'eaf';
    } else if (type === 'trs') {
      selector = 'trs';
    } else if (type === 'ixt') {
      selector = 'ixt';
    } else if (type === 'flextext') {
      selector = 'flextext';
    }

    if (!lodash.isArray(tree['dcterms:tableOfContents'])) {
      tree['dcterms:tableOfContents'] = [tree['dcterms:tableOfContents']];
    }
    var items = lodash.compact(
      lodash.map(tree['dcterms:tableOfContents'], function(d) {
        var i = d['#text'];
        var ext = i.split('.').pop();
        if (
          ext !== undefined &&
          selector !== undefined &&
          selector.indexOf(ext.toLowerCase()) !== -1
        ) {
          return d['#text'];
        }
      })
    );

    if (
      ['audio', 'video', 'eaf', 'trs', 'ixt', 'flextext'].indexOf(type) !== -1
    ) {
      // audio and video can exist in multiple formats; so, group the data
      //  by name and then return an array of arrays - sorting by item name
      return lodash(items)
        .chain()
        .groupBy(function(d) {
          return lodash.last(d.split('/')).split('.')[0];
        })
        .value();
    } else {
      return items;
    }
  }

  // Given a tree of XML as JSON, create a data structure for the item
  function createItemDataStructure(tree) {
    if (!lodash.isArray(tree['dc:identifier'])) {
      tree['dc:identifier'] = [tree['dc:identifier']];
    }
    if (!lodash.isArray(tree['dc:contributor'])) {
      tree['dc:contributor'] = [tree['dc:contributor']];
    }
    var data = {
      openAccess: true,
      identifier: lodash.map(tree['dc:identifier'], function(d) {
        return d['#text'];
      }),
      title: get(tree, 'dc:title'),
      date: get(tree, 'dcterms:created'),
      description: get(tree, 'dc:description'),
      citation: get(tree, 'dcterms:bibliographicCitation'),
      contributor: lodash.map(tree['dc:contributor'], function(d) {
        return {
          name: d['#text'],
          role: d['@attributes']['olac:code']
        };
      }),
      images: constructItemList('images', tree),
      video: constructItemList('video', tree),
      audio: constructItemList('audio', tree),
      eaf: constructItemList('eaf', tree),
      trs: constructItemList('trs', tree),
      ixt: constructItemList('ixt', tree),
      flextext: constructItemList('flextext', tree),
      documents: constructItemList('documents', tree),
      rights: get(tree, 'dcterms:accessRights')
    };
    // if the item is closed - set a flag to make it easier to work with in the view
    if (data.rights.match('Closed.*')) {
      data.openAccess = false;
    }

    data.thumbnails = generateThumbnails(data.images);
    data.audioVisualisations = generateAudioVisualisations(data.audio);
    getTranscriptions('eaf', data);
    getTranscriptions('trs', data);
    getTranscriptions('ixt', data);
    getTranscriptions('flextext', data);
    return data;

    // helper to extract a value for 'thing'
    //  not every item has every datapoint
    function get(tree, thing) {
      try {
        return tree[thing]['#text'];
      } catch (e) {
        return '';
      }
    }
  }

  function generateThumbnails(images) {
    return lodash.map(images, function(d) {
      var name = d.split('/').pop();
      var thumbName =
        name.split('.')[0] + '-thumb-PDSC_ADMIN.' + name.split('.')[1];
      return d.replace(name, thumbName);
    });
  }

  function generateAudioVisualisations(audio) {
    // generate the audio visualisation object keyed on name
    var audioVisualisations = lodash.map(audio, function(d) {
      var name = d[0].split('/').pop();
      var audioVisName = name.split('.')[0] + '-soundimage-PDSC_ADMIN.jpg';
      return d[0].replace(name, audioVisName);
    });
    audioVisualisations = lodash(audioVisualisations)
      .chain()
      .groupBy(function(d) {
        return d
          .split('/')
          .pop()
          .split('.')[0]
          .split('-soundimage')[0];
      })
      .value();

    lodash.each(audioVisualisations, function(d, i) {
      audioVisualisations[i] = d[0];
    });
    return audioVisualisations;
  }

  function getTranscriptions(type, data) {
    var transform, what;
    if (type === 'eaf') {
      transform = parseEAF;
      what = data.eaf;
    } else if (type === 'trs') {
      transform = parseTRS;
      what = data.trs;
    } else if (type === 'ixt') {
      transform = parseIxt;
      what = data.ixt;
    } else if (type === 'flextext') {
      transform = parseFlextext;
      what = data.flextext;
    } else {
      return;
    }

    // for each XML file in xml - kick off a retrieval
    //  each file is grabbed and parsed and the URL is then replaced
    //   with the JSON data structure of the document
    lodash.each(what, function(d, i) {
      what[i] = {};
      lodash.each(d, function(url) {
        $http
          .get(url, {transformResponse: transform, withCredentials: true})
          .then(
            function(resp) {
              if (lodash.isEmpty(resp.data.data)) {
                delete what[i];
              } else {
                var name = url.split('/').pop();
                what[i][name] = resp.data.data;
              }
            },
            function() {
              $log.error("ParadisecService: error, couldn't get", url);
            }
          );
      });
    });

    function parseEAF(d) {
      return {data: eaf.parse(parseXML(d))};
    }

    function parseTRS(d) {
      return {data: trs.parse(parseXML(d))};
    }

    function parseIxt(d) {
      return {data: ixt.parse(parseXML(d))};
    }

    function parseFlextext(d) {
      return {data: ftp.parse(parseXML(d))};
    }
  }
}
