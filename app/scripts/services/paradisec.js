'use strict';

/**
 * @ngdoc service
 * @name pdscApp.paradisec
 * @description
 * # paradisec
 * Service in the pdscApp.
 */
angular.module('pdscApp')
  .service('paradisec', [ '$log', '$http', 'xml', 'configuration', function ($log, $http, xml, conf) {

      function getNodes(d) {
          var parser = new DOMParser();

          // parse the xml document
          var xmldoc = parser.parseFromString(d, "text/xml");

          // convert it to JSON
          var tree = xml.toJson(xmldoc);

          // get a handle to the actual tree of data inside the OAI guff
          tree = tree['OAI-PMH']['GetRecord']['record']['metadata']['olac:olac'];

          // assemble and return the item data structure
          return { 'data': createItemDataStructure(tree)}
      }

      function get(tree, thing) {
          // not every item has every datapoint
          try {
              return tree[thing]['#text'];
          } catch (e) {
              return '';
          }
      }

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
          }
      
          var items = _.compact(_.map(tree['dcterms:tableOfContents'], function(d) {
              var i = d['#text'];
              var ext = i.split('.').pop();
              if (ext !== undefined && selector !== undefined && selector.indexOf(ext.toLowerCase()) !== -1) {
                  return d['#text'];
              }
          }))

          if (type === 'audio' || type === 'video') {
              // audio and video can exist in multiple formats; so, group the data
              //  by name and then return an array of arrays - sorting by item name 
              return _(items).chain()
                             .groupBy(function(d) { return _.last(d.split('/')).split('.')[0]; })
                             .value();
          } else {
            return items;
          }
      }

      function createItemDataStructure(tree) {
          if (! _.isArray(tree['dc:identifier'])) tree['dc:identifier'] = [ tree['dc:identifier'] ];
          if (! _.isArray(tree['dc:contributor'])) tree['dc:contributor'] = [ tree['dc:contributor'] ];
          console.log(tree);
          return {
              'identifier': _.map(tree['dc:identifier'], function(d) {
                  return d['#text'];
              }),
              'title': get(tree, 'dc:title'),
              'description': get(tree, 'dc:description'),
              'citation': get(tree, 'dcterms:bibliographicCitation'),
              'contributor': _.map(tree['dc:contributor'], function(d) {
                  return { 
                      'name': d['#text'],
                      'role': d['@attributes']['olac:code']
                  }
              }),
              'images': constructItemList('images', tree),
              'video': constructItemList('video', tree),
              'audio': constructItemList('audio', tree),
              'documents': constructItemList('documents', tree),
              'rights': get(tree, 'dcterms:accessRights')
          };
      }

      function getItem(project, collectionId, itemId) {
          var itemIdentifier = conf.datasource[project].itemIdentifier;
          itemIdentifier = itemIdentifier.replace('{{collectionId}}', collectionId).replace('{{itemId}}', itemId);

          var url = conf.datasource[project].getItem;
          url = url.replace('{{itemId}}', itemIdentifier);
          $log.debug("ParadisecService: getItem", url, itemIdentifier);

          return $http.get(url, { transformResponse: getNodes }).then(function(resp) {
              $log.debug("ParadisecService: getItem response", resp.data.data);
              resp.data.data.collectionId = collectionId;
              resp.data.data.collectionLink = conf.datasource[project].collections + '/' + collectionId;
              resp.data.data.itemId = itemId;
              return resp.data.data;
          }, 
          function(resp) {
              $log.error("ParadisecService: error, couldn't get", url);
          });
      }

      var paradisec = {
          imageTypes:    [ 'jpg', 'png' ],
          videoTypes:    [ 'mp4', 'webm', 'ogg', 'ogv' ],
          audioTypes:    [ 'mp3', 'webm', 'ogg', 'oga' ],
          documentTypes: [ 'pdf' ],
          getItem: getItem
      }
      return paradisec;
  }]);
