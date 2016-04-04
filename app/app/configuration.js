'use strict';

angular.module('pdsc')
  .constant('configuration', {

      // Styling the app
      //  Limited styling is supported - see config/app.css

      // The datasources.
      //  The viewer is predicated on the idea that a service can be queried for metadata of an item (which is part
      //  of a collection) and the application can build a datastructure containing some of the item metadata and the
      //  content that it defines (images, audio and video).
      //
      //  In this section, define methods and configuration snippets required to query and process a datasource, then,
      //  add a service for that datasource in scripts/services. Probably best to follow the paradisec.js example.
      //
      //  Once you have the code to process your datasource (noting that you MUST produce a datastructure as the
      //  paradisec example - see createItemDataStructure()), integrate it into scripts/controllers/main.js.
      "datasource": {
          "collections": "http://catalog.paradisec.org.au/collections",
          "itemIdentifier": "oai:paradisec.org.au:{{collectionId}}-{{itemId}}",
          "getItem": "http://catalog.paradisec.org.au/oai/item?verb=GetRecord&identifier={{itemId}}&metadataPrefix=olac",
      },
      "header": {
      }
  });
