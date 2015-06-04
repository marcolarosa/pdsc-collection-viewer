'use strict';

/**
 * @ngdoc filter
 * @name pdscApp.filter:extension
 * @function
 * @description
 * # extension
 * Filter in the pdscApp.
 */
angular.module('pdscApp')
  .filter('extension', function () {
    return function (input) {
        var c = input.split('/').pop();
        return c.split('.')[1];
    };
  });
