'use strict';

module.exports = angular
  .module('clipboard', [])
  .factory('clipboard', function() {
    return require('clipboard');
  });
