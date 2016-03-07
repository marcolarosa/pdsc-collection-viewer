'use strict';

angular.module('pdsc')
  .directive('scaleAndCenter', [ 
    '$timeout', 
    function ($timeout) {
    return {
      template: '',
      restrict: 'A',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          element.on('load', function() {
              $timeout(function() {
                  scope.$emit('image-loaded');
              },1);
          });
      }
    };
  }]);
