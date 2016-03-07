'use strict';

angular.module('pdsc')
  .filter('stripTime', function () {
    return function (input) {
      return input.split('#')[0];
    };
  });
