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

      "datasource": {
          "paradisec": {
              "getItem": "http://catalog.paradisec.org.au/oai/item?verb=GetRecord&identifier={{collectionId}}-{{itemId}}&metadataPrefix=olac"
              "getCollection": "http://catalog.paradisec.org.au/oai/item?verb=GetRecord&identifier={{collectionId}}-{{itemId}}&metadataPrefix=olac"
          },
          "esrc": {
              "getItem": "http://data.esrc.unimelb.edu.au/ead/{{dataset}}/item/{{itemId}}/xml"
              "getCollection": "http://data.esrc.unimelb.edu.au/ead/{{dataset}}/series/{{collectionId}}/xml"
          },
          "alveo": {
          }
      }
  });
