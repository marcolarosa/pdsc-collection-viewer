'use strict';

/**
 * @ngdoc filter
 * @name pdscApp.filter:stripTime
 * @function
 * @description
 * # stripTime
 * Filter in the pdscApp.
 */
angular.module('pdscApp')
  .filter('stripTime', function () {
    return function (input) {
      return input.split('#')[0];
    };
  });
