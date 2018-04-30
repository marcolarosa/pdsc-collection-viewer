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
const inquirer = require('inquirer');

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
  await promptViewerBuilt();
  await promptContinue(args);
  const target = `${args['library-box-path']}/LibraryBox`;
  const viewer = args['viewer'];
  const dataPath = args['data-path'];
  if (!shell.test('-d', target)) {
    console.log(`
    ${target} does not seem to exist. Have you specified the mountpoint
    of the LibraryBox disk correctly? If so, does that disk have a folder
    'LibraryBox'?
    `);
    process.exit();
  }
  prepareTarget(target);
  installCollectionViewer(viewer, target);
  const collections = await loadData(dataPath);
  collections.forEach(collection => {
    collection = processImages(dataPath, target, collection);
    collection = processTranscriptions(dataPath, target, collection);
    collection = processMedia(dataPath, target, collection);
    collection = processDocuments(dataPath, target, collection);
    delete collection.dataPath;
    console.log(`INFO: ${collection.collectionId}/${collection.itemId}: Done`);
    console.log(`INFO: ${collection.collectionId}/${collection.itemId}:`);
    console.log('');
  });
  fs.writeFileSync(
    `${target}/www/repository/index.json`,
    JSON.stringify(collections),
    'utf8'
  );
}

async function promptViewerBuilt() {
  console.log(`
    A version of the viewer needs to be built for installation on the LibraryBox.

    This only needs to be done once in a given session (ie today). If you're
    installing a brand new LibraryBox or updating the content of one created
    some time ago you probably want to rebuild the viewer first so that you
    install the latest version.
  `);
  const response = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'promptViewerBuilt',
      message:
        'Have you recently built the viewer for installation on the LibraryBox?'
    }
  ]);
  if (!response.promptViewerBuilt) {
    console.log(`
      Please build the viewer vis: 'npm run build:deploy-librarybox'.
      When complete, re-run this script and hit enter to select 'Yes'
    `);
    process.exit();
  }
}

async function promptContinue(args) {
  console.log(`
    The LibraryBox is mounted at: ${args['library-box-path']}.

    Ensure this is correct as this script will try to cleanup (remove) any
    existing data at the paths:
    - ${args['library-box-path']}/LibraryBox/www
  `);
  const response = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'promptContinue',
      message: 'Do you wish to continue?',
      default: false
    }
  ]);
  if (!response.promptContinue) {
    console.log(`
      ok - exiting
    `);
    process.exit();
  }
}

function prepareTarget(target) {
  console.log('INFO: Preparing LibraryBox');
  shell.exec(`rm -rf ${target}/www`);
  shell.mkdir('-p', `${target}/www/repository`);
  shell.mkdir('-p', `${target}/www/cgi-bin`);
}

function installCollectionViewer(viewer, target) {
  console.log('INFO: Installing Collection Viewer');
  shell.cp('-r', `${viewer}/*`, `${target}/www/`);
}

async function loadData(data) {
  let collections = flattenDeep(walkDataPath(data));
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
  return collections;
}

function setup(target, collection) {
  const cid = collection.collectionId;
  const iid = collection.itemId;
  target = `${target}/www/repository/${cid}/${iid}`;
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
    return `/repository/${file.split('repository/')[1]}`;
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
