'use strict';

module.exports = angular.module('highlightjs', []).factory('hljs', function() {
  return require('highlight.js');
});
