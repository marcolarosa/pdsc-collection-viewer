'use strict';

angular.module('pdsc')
  .directive('notifyReady', [ 
    '$timeout', 
    function ($timeout) {
    return {
      template: '',
      restrict: 'A',
      scope: {
      },
      link: function postLink(scope, element) {
          element.on('load', function() {
              $timeout(function() {
                  scope.$emit('image-loaded');
              },1);
          });
      }
    };
  }]);
