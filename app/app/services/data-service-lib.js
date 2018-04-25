'use strict';

const xmlToJson = require('./xml-to-json.service');
const {
  includes,
  isEmpty,
  compact,
  isArray,
  each,
  map,
  flattenDeep
} = require('lodash');
const lodash = require('lodash');

module.exports = {
  parseOAI,
  parseXML,
  createItemDataStructure
};

const types = {
  imageTypes: ['jpg', 'jpeg', 'png'],
  videoTypes: ['mp4', 'ogg', 'ogv', 'mov', 'webm'],
  audioTypes: ['mp3', 'ogg', 'oga'],
  documentTypes: ['pdf']
};

function parseOAI(d) {
  var tree = parseXML(d);

  try {
    tree = tree['OAI-PMH'].GetRecord.record.metadata['olac:olac'];
    return {data: createItemDataStructure(tree)};
  } catch (e) {
    return {data: ''};
  }
}

function parseXML(doc, as) {
  var parser = new DOMParser();
  var xmldoc = parser.parseFromString(doc, 'text/xml');
  if (as === 'xml') {
    return doc;
  }
  return xmlToJson.convert(xmldoc);
}

function createItemDataStructure(tree) {
  if (!isArray(tree['dc:identifier'])) {
    tree['dc:identifier'] = [tree['dc:identifier']];
  }
  if (!isArray(tree['dc:contributor'])) {
    tree['dc:contributor'] = [tree['dc:contributor']];
  }
  var data = {
    openAccess: true,
    identifier: tree['dc:identifier'].map(d => {
      return d['#text'];
    }),
    title: get(tree, 'dc:title'),
    date: get(tree, 'dcterms:created'),
    description: get(tree, 'dc:description'),
    citation: get(tree, 'dcterms:bibliographicCitation'),
    contributor: tree['dc:contributor'].map(d => {
      return {
        name: d['#text'],
        role: d['@attributes']['olac:code']
      };
    }),
    images: constructItemList('images', tree),
    documents: constructItemList('documents', tree),
    media: processMedia(tree),
    rights: get(tree, 'dcterms:accessRights')
  };

  data.transcriptions = flattenDeep(
    data.media.map(m => {
      return compact([m.eaf, m.trs, m.ixt, m.flextext]);
    })
  ).sort();

  // if the item is closed - set a flag to make it easier to work with in the view
  if (data.rights.match('Closed.*')) {
    data.openAccess = false;
  }

  data.thumbnails = generateThumbnails(data.images);
  data.audioVisualisations = generateAudioVisualisations(data.audio);
  return data;

  function processMedia(tree) {
    const audio = constructItemList('audio', tree);
    const video = constructItemList('video', tree);
    const eaf = processMediaItem('eaf', tree);
    const trs = processMediaItem('trs', tree);
    const ixt = processMediaItem('ixt', tree);
    const flextext = processMediaItem('flextext', tree);

    let media = [];
    each(audio, (files, key) => {
      media.push(createMediaItemDataStructure(key, files, 'audio'));
    });
    each(video, (files, key) => {
      media.push(createMediaItemDataStructure(key, files, 'video'));
    });
    return media;

    function processMediaItem(key, tree) {
      let item = constructItemList(key, tree);
      each(item, (v, k) => {
        item[k] = map(v, url => {
          return {
            name: url.split('/').pop(),
            url: url
          };
        });
      });
      return item;
    }

    function createMediaItemDataStructure(key, files, type) {
      return {
        name: key,
        type: type,
        files: files,
        eaf: eaf[key] ? eaf[key] : [],
        trs: trs[key] ? trs[key] : [],
        ixt: ixt[key] ? ixt[key] : [],
        flextext: flextext[key] ? flextext[key] : []
      };
    }
  }

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

function constructItemList(type, tree) {
  var selector;
  if (type === 'images') {
    selector = types.imageTypes;
  } else if (type === 'video') {
    selector = types.videoTypes;
  } else if (type === 'audio') {
    selector = types.audioTypes;
  } else if (type === 'documents') {
    selector = types.documentTypes;
  } else if (type === 'eaf') {
    selector = 'eaf';
  } else if (type === 'trs') {
    selector = 'trs';
  } else if (type === 'ixt') {
    selector = 'ixt';
  } else if (type === 'flextext') {
    selector = 'flextext';
  }

  if (!isArray(tree['dcterms:tableOfContents'])) {
    tree['dcterms:tableOfContents'] = [tree['dcterms:tableOfContents']];
  }
  var items = compact(
    tree['dcterms:tableOfContents'].map(d => {
      var i = d['#text'];
      var ext = i.split('.').pop();
      if (
        ext !== undefined &&
        selector !== undefined &&
        includes(selector, ext.toLowerCase())
      ) {
        return d['#text'];
      }
    })
  );

  if (includes(['audio', 'video', 'eaf', 'trs', 'ixt', 'flextext'], type)) {
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

function generateThumbnails(images) {
  return images.map(d => {
    var name = d.split('/').pop();
    var thumbName =
      name.split('.')[0] + '-thumb-PDSC_ADMIN.' + name.split('.')[1];
    return d.replace(name, thumbName);
  });
}

function generateAudioVisualisations(audio) {
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
