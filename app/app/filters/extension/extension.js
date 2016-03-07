'use strict';

angular.module('pdsc')
  .filter('extension', function () {
    return function (input) {
        var c = input.split('/').pop();
        return c.split('.')[1];
    };
  });
