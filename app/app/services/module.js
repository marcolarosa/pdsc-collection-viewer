'use strict';

module.exports = angular
  .module('pdsc.services', [])
  .service('dataService', require('./data-service.service'))
  .service('firebaseService', require('./firebase.service'))
  .service('eafParserService', require('./eaf-parser.service'))
  .service('flextextParserService', require('./flextext-parser.service'))
  .service('ixtParserService', require('./ixt-parser.service'))
  .service('trsParserService', require('./trs-parser.service'))
  .service('xmlToJsonService', require('./xml-to-json.service'))
  .service('xmlTestDataService', require('./xml-data-loader.service'));
