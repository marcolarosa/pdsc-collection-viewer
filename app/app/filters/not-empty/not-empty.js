'use strict';

angular.module('pdsc')
  .filter('notEmpty', [
    '_',
    function (_) {
    return function (input) {
        return ! _.isEmpty(input) ? true : false;
    };
  }]);
