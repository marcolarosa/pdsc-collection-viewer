'use strict';

/**
 * @ngdoc filter
 * @name pdscApp.filter:isEmpty
 * @function
 * @description
 * # isEmpty
 * Filter in the pdscApp.
 */
angular.module('pdscApp')
  .filter('isEmpty', function () {
    return function (input) {
        return _.isEmpty(input) ? false : true;
    };
  });
