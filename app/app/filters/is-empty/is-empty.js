'use strict';

angular.module('pdsc')
  .filter('isEmpty', function () {
    return function (input) {
        return _.isEmpty(input) ? false : true;
    };
  });
