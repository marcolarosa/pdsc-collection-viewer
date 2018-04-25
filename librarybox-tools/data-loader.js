'use strict';

const request = require('request-promise-native');
const util = require('util');
const fs = require('fs');
const {compact, flattenDeep} = require('lodash');
const {
  createItemDataStructure
} = require('../app/app/services/data-service-lib');
const xmlToJson = require('../app/app/services/xml-to-json.service');
const DOMParser = require('xmldom').DOMParser;
const shell = require('shelljs');

const args = require('yargs')
  .option('viewer', {
    describe: 'The full path to the collection viewer distributable',
    demandOption: true
  })
  .option('data-path', {
    describe: 'The full path to the data folders',
    demandOption: true
  })
  .option('library-box-path', {
    describe: 'The full path to the library box disk',
    demandOption: true
  })
  .help().argv;

run(args);
async function run(args) {
  let items;
  prepareTarget(args['library-box-path']);
  installCollectionViewer(args['viewer'], args['library-box-path']);
  let collections = flattenDeep(walkDataPath(args['data-path']));
  collections = await Promise.all(
    collections.map(async collection => {
      const cid = collection.collectionId;
      const iid = collection.itemId;
      return {
        ...collection,
        data: await loadItemData(cid, iid)
      };
    })
  );
  collections.forEach(collection => {
    collection = processImages(
      args['data-path'],
      args['library-box-path'],
      collection
    );
    collection = processTranscriptions(
      args['data-path'],
      args['library-box-path'],
      collection
    );
    collection = processMedia(
      args['data-path'],
      args['library-box-path'],
      collection
    );
    collection = processDocuments(
      args['data-path'],
      args['library-box-path'],
      collection
    );
    delete collection.dataPath;
    console.log(`INFO: ${collection.collectionId}/${collection.itemId}: Done`);
    console.log(`INFO: ${collection.collectionId}/${collection.itemId}:`);
    console.log('');
  });
  fs.writeFileSync(
    `${args['library-box-path']}/Shared/index.json`,
    JSON.stringify(collections),
    'utf8'
  );
}

function prepareTarget(target) {
  console.log('INFO: Preparing LibraryBox');
  shell.mkdir('-p', `${target}/Content`);
  shell.rm('-rf', `${target}/Content/*`);
  shell.mkdir('-p', `${target}/Shared`);
  shell.rm('-rf', `${target}/Shared/*`);
  shell.mkdir('-p', `${target}/Shared/repository`);
}

function installCollectionViewer(viewer, target) {
  console.log('INFO: Installing Collection Viewer');
  shell.cp('-r', `${viewer}/*`, `${target}/Content/`);
}

function setup(target, collection) {
  const cid = collection.collectionId;
  const iid = collection.itemId;
  target = `${target}/Shared/repository/${cid}/${iid}`;
  shell.mkdir('-p', target);
  return {cid, iid, target};
}

function processImages(source, targetPath, collection) {
  let name;
  const {cid, iid, target} = setup(targetPath, collection);
  console.log(`INFO: ${cid}/${iid}: Copying Images`);
  collection.data.images = collection.data.images.map(file => {
    try {
      return copyToTarget({cid, iid, source, target, file});
    } catch (e) {}
  });

  collection.data.thumbnails = collection.data.thumbnails.map(file => {
    try {
      return copyToTarget({cid, iid, source, target, file});
    } catch (e) {}
  });
  collection.data.images = compact(collection.data.images);
  collection.data.thumbnails = compact(collection.data.thumbnails);
  return collection;
}

function processDocuments(source, targetPath, collection) {
  let name;
  const {cid, iid, target} = setup(targetPath, collection);
  console.log(`INFO: ${cid}/${iid}: Copying Documents`);
  collection.data.documents = collection.data.documents.map(file => {
    try {
      return copyToTarget({cid, iid, source, target, file});
    } catch (e) {}
  });

  collection.data.documents = compact(collection.data.documents);
  return collection;
}

function processTranscriptions(source, targetPath, collection) {
  let name;
  const {cid, iid, target} = setup(targetPath, collection);
  console.log(`INFO: ${cid}/${iid}: Copying Transcriptions`);

  collection.data.transcriptions = collection.data.transcriptions.map(file => {
    try {
      const url = copyToTarget({cid, iid, source, target, file: file.url});
      return {
        name: file.name,
        url
      };
    } catch (e) {}
  });
  collection.data.transcriptions = compact(collection.data.transcriptions);
  return collection;
}

function processMedia(source, targetPath, collection) {
  let name;
  const {cid, iid, target} = setup(targetPath, collection);
  console.log(`INFO: ${cid}/${iid}: Copying Media`);
  collection.data.media = collection.data.media.map(media => {
    media.files = media.files.map(file => {
      try {
        return copyToTarget({cid, iid, source, target, file});
      } catch (e) {}
    });
    media.files = compact(media.files);
    ['eaf', 'trs', 'ixt', 'flextext'].forEach(t => {
      media[t] = media[t].map(file => {
        try {
          const url = copyToTarget({cid, iid, source, target, file: file.url});
          return {
            name: file.name,
            url
          };
        } catch (e) {}
      });
      media[t] = compact(media[t]);
    });
    return media;
  });
  return collection;
}

function copyToTarget({cid, iid, source, target, file}) {
  const name = file.split('/').pop();
  if (shell.test('-f', `${source}/${cid}/${iid}/${name}`)) {
    shell.cp(`${source}/${cid}/${iid}/${name}`, `${target}/${name}`);
    return `/Shared/repository/${file.split('repository/')[1]}`;
  } else {
    console.error(`ERROR: Referenced file missing: ${cid}/${iid}/${name}`);
    throw new Error();
  }
}

function walkDataPath(path) {
  console.log('INFO: Loading data');
  let collections, items;
  try {
    collections = fs.readdirSync(path).map(collection => {
      if (fs.statSync(`${path}/${collection}`).isDirectory()) {
        items = compact(mapItems(`${path}/${collection}`));
        return items.map(item => {
          return {
            collectionId: collection,
            itemId: item,
            dataPath: `${path}/${collection}/${item}`
          };
        });
      }
    });
    collections = compact(collections);
    return collections;
  } catch (error) {
    console.log(error);
  }

  function mapItems(path) {
    let items = fs.readdirSync(`${path}`);
    return items.map(item => {
      if (fs.statSync(`${path}/${item}`).isDirectory()) {
        return item;
      }
    });
  }
}

function loadItemData(collectionId, itemId) {
  const datasource = {
    collections: 'http://catalog.paradisec.org.au/collections',
    itemIdentifier: 'oai:paradisec.org.au:{{collectionId}}-{{itemId}}',
    getItem:
      'http://catalog.paradisec.org.au/oai/item?verb=GetRecord&identifier={{itemId}}&metadataPrefix=olac'
  };

  const itemIdentifier = datasource.itemIdentifier
    .replace('{{collectionId}}', collectionId)
    .replace('{{itemId}}', itemId);
  const url = datasource.getItem.replace('{{itemId}}', itemIdentifier);
  return request.get(url).then(response => parseOAI(response).data);

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
}
