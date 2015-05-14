'use strict';

/**
 * @ngdoc filter
 * @name pdscApp.filter:trustAsHtml
 * @function
 * @description
 * # trustAsHtml
 * Filter in the pdscApp.
 */
angular.module('pdscApp')
  .filter('trustAsHtml', [ '$sce', function ($sce) {
    return function (input) {
        return $sce.trustAsResourceUrl(input);
    };
  }]);
