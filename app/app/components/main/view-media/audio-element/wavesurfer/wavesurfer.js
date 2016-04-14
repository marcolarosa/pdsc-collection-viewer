'use strict';

angular.module('pdsc')
  .directive('wavesurfer', [ 
    '$timeout', 
    '_',
    function ($timeout, _) {
    return {
      templateUrl: '',
      restrict: 'E',
      scope: {
          itemData: '=',
      },
      link: function postLink(scope) {
      }
    };
  }]);
