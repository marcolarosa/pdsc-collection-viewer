'use strict';

angular.module('pdsc')
  .service('paradisec', [ 
        '$rootScope', 
        '$log', 
        '$http', 
        'xmlToJson',
        'configuration', 
        'eafParser', 
        'trsParser',
        '_',
        function ($rootScope, $log, $http, xmlToJson, conf, eaf, trs, _) {

      // generic xml parser - pass in XML : get back JSON
      function parseXML(doc) {
          var parser = new DOMParser();

          // parse the xml document
          var xmldoc = parser.parseFromString(doc, 'text/xml');

          // return it as JSON
          return xmlToJson.convert(xmldoc);
      }

      // parse an OAI feed and create a JSON data structure for the app to use
      function parseOAI(d) {
          var tree = parseXML(d);

          // get a handle to the actual tree of data inside the OAI guff
          try {
              tree = tree['OAI-PMH'].GetRecord.record.metadata['olac:olac'];

              // assemble and return the item data structure
              return { 'data': createItemDataStructure(tree)};
          } catch(e) {
              return { 'data': '' };
          }
      }

      // parse an EAF document and create a JSON data structure for the app to use
      function parseEAF(d) {
          // assemble and return the item data structure
          return { 'data': eaf.parse(parseXML(d))};
      }

      // parse a TRS document and create a JSON data structure for the app to use
      function parseTRS(d) {
          // assemble and return the item data structure
          return { 'data': trs.parse(parseXML(d))};
      }

      // handler to extract a value for 'thing'
      function get(tree, thing) {
          // not every item has every datapoint
          try {
              return tree[thing]['#text'];
          } catch (e) {
              return '';
          }
      }

      // handler to process item lists:
      //  - knows how to handle images sets, audio and video sets,
      //  document sets: pdf and xml
      function constructItemList(type, tree) {
          var selector;
          if (type === 'images') {
              selector = paradisec.imageTypes;
          } else if (type === 'video') {
              selector = paradisec.videoTypes;
          } else if (type === 'audio') {
              selector = paradisec.audioTypes;
          } else if (type === 'documents') {
              selector = paradisec.documentTypes;
          } else if (type === 'eaf') {
              selector = 'eaf';
          } else if (type === 'trs') {
              selector = 'trs';
          }
      
          if (!_.isArray(tree['dcterms:tableOfContents'])) {
              tree['dcterms:tableOfContents'] = [ tree['dcterms:tableOfContents'] ];
          }
          var items = _.compact(_.map(tree['dcterms:tableOfContents'], function(d) {
              var i = d['#text'];
              var ext = i.split('.').pop();
              if (ext !== undefined && selector !== undefined && selector.indexOf(ext.toLowerCase()) !== -1) {
                  return d['#text'];
              }
          }));

          if ([ 'audio', 'video', 'eaf', 'trs' ].indexOf(type) !== -1) {
              // audio and video can exist in multiple formats; so, group the data
              //  by name and then return an array of arrays - sorting by item name 
              return _(items).chain()
                             .groupBy(function(d) { return _.last(d.split('/')).split('.')[0]; })
                             .value();
          } else {
            return items;
          }
      }

      // Given a tree of XML as JSON, create a data structure for the item
      function createItemDataStructure(tree) {
          if (! _.isArray(tree['dc:identifier'])) {
              tree['dc:identifier'] = [ tree['dc:identifier'] ];
          }
          if (! _.isArray(tree['dc:contributor'])) {
              tree['dc:contributor'] = [ tree['dc:contributor'] ];
          }
          var data = {
              'openAccess': true,
              'identifier': _.map(tree['dc:identifier'], function(d) {
                  return d['#text'];
              }),
              'title': get(tree, 'dc:title'),
              'date': get(tree, 'dcterms:created'),
              'description': get(tree, 'dc:description'),
              'citation': get(tree, 'dcterms:bibliographicCitation'),
              'contributor': _.map(tree['dc:contributor'], function(d) {
                  return { 
                      'name': d['#text'],
                      'role': d['@attributes']['olac:code']
                  };
              }),
              'images': constructItemList('images', tree),
              'video': constructItemList('video', tree),
              'audio': constructItemList('audio', tree),
              'eaf': constructItemList('eaf', tree),
              'trs': constructItemList('trs', tree),
              'documents': constructItemList('documents', tree),
              'rights': get(tree, 'dcterms:accessRights')
          };
          // if the item is closed - set a flag to make it easier to work with in the view
          if (data.rights.match('Closed.*')) {
              data.openAccess = false;
          }

          // generate the thumbnails array
          data.thumbnails = _.map(data.images, function(d) {
              var name = d.split('/').pop();
              var thumbName = name.split('.')[0] + '-thumb-PDSC_ADMIN.' + name.split('.')[1];
              return d.replace(name, thumbName);
          });

          // generate the audio visualisation object keyed on name
          data.audioVisualisations = _.map(data.audio, function(d) {
              var name = d[0].split('/').pop();
              var audioVisName = name.split('.')[0] + '-soundimage-PDSC_ADMIN.jpg'; 
              return d[0].replace(name, audioVisName);
          });
          data.audioVisualisations = _(data.audioVisualisations).chain()
                             .groupBy(function(d) { return d.split('/').pop().split('.')[0].split('-soundimage')[0]; })
                             .value();
          _.each(data.audioVisualisations, function(d, i) {
              data.audioVisualisations[i] = d[0];
          });

          // for each XML file in xml - kick off a retrieval
          //  each file is grabbed and parsed and the URL is then replaced
          //   with the JSON data structure of the document
          _.each(data.eaf, function(d, i) {
              var url = d[0];
              $http.get(url, { transformResponse: parseEAF, withCredentials: true }).then(function(resp) {
                  // success
                  if (_.isEmpty(resp.data.data)) {
                      delete data.eaf[i];
                  } else {
                       data.eaf[i] = resp.data.data;
                  }
              },
              function() {
                  // failure
                  $log.error('ParadisecService: error, couldn\'t get', url);
              });
          });
          _.each(data.trs, function(d, i) {
              var url = d[0];
              $http.get(url, { transformResponse: parseTRS, withCredentials: true }).then(function(resp) {
                  // success
                  if (_.isEmpty(resp.data.data)) {
                      delete data.trs[i];
                  } else {
                      data.trs[i] = resp.data.data;
                  }
              },
              function() {
                  // failure
                  $log.error('ParadisecService: error, couldn\'t get', url);
              });
          });

          return data;
      }

      // Given a collectionId and itemId - get the 
      //  item data.
      function getItem(collectionId, itemId) {
          var itemIdentifier = conf.datasource.itemIdentifier;
          itemIdentifier = itemIdentifier.replace('{{collectionId}}', collectionId).replace('{{itemId}}', itemId);

          var url = conf.datasource.getItem;
          url = url.replace('{{itemId}}', itemIdentifier);
          $log.debug('ParadisecService: getItem', url, itemIdentifier);

          return $http.get(url, { transformResponse: parseOAI }).then(function(resp) {
              $log.debug('ParadisecService: getItem response', resp.data.data);
              resp.data.data.collectionId = collectionId;
              resp.data.data.collectionLink = conf.datasource.collections + '/' + collectionId;
              resp.data.data.itemId = itemId;

              // store the object in the service and let the metadata
              //  controller know it's ready to go
              paradisec.itemData = resp.data.data;
              //$rootScope.$broadcast('item-data-ready');

              // and return it to the caller which is expecting a promise
              return resp.data.data;
          }, 
          function() {
              $log.error('ParadisecService: error, couldn\'t get', url);
          });
      }

      var paradisec = {
          imageTypes:    [ 'jpg', 'jpeg', 'png' ],
          videoTypes:    [ 'mp4', 'webm', 'ogg', 'ogv', 'mov', 'webm' ],
          audioTypes:    [ 'mp3', 'webm', 'ogg', 'oga' ],
          documentTypes: [ 'pdf' ],
          getItem: getItem,
          itemData: {}
      };
      return paradisec;
  }]);
