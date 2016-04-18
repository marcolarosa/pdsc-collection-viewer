'use strict';

angular.module('pdsc')
  .service('eopasParser', [ '_',
    function (_) {

      var eopasParser = {};

      // parse an eopas XML file and return an object keyed on timeslot id
      eopasParser.parse = function(data) {
      };

      return eopasParser;
  }]);
