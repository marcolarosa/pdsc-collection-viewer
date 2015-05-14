'use strict';

/**
 * @ngdoc service
 * @name pdscApp.configuration
 * @description
 * # configuration
 * Constant in the pdscApp.
 */
angular.module('pdscApp')
  .constant('configuration', {

      "deployment": "paradisec",

      "datasource": {
          "paradisec": {
              "collections": "http://catalog.paradisec.org.au/collections",
              "itemIdentifier": "oai:paradisec.org.au:{{collectionId}}-{{itemId}}",
              "getItem": "http://catalog.pdsc/oai/item?verb=GetRecord&identifier={{itemId}}&metadataPrefix=olac",
              "getCollection": "http://catalog.pdsc/oai/item?verb=GetRecord&identifier={{collectionId}}-{{itemId}}&metadataPrefix=olac"
          },
          "esrc": {
              "getItem": "http://data.esrc.unimelb.edu.au/ead/{{dataset}}/item/{{itemId}}/xml",
              "getCollection": "http://data.esrc.unimelb.edu.au/ead/{{dataset}}/series/{{collectionId}}/xml"
          },
          "alveo": {
          }
      }
  });
