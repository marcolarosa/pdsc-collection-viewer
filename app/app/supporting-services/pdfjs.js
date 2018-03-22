'use strict';

module.exports = angular.module('pdfjs', []).factory('pdfjs', function() {
  return require('pdfjs-dist');
});
