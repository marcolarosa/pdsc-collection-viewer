'use strict';

angular.module('pdsc')
  .filter('isEmpty', [
    '_',
    function (_) {
    return function (input) {
        return _.isEmpty(input) ? false : true;
    };
  }]);
