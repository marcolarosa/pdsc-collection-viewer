'use strict';

angular.module('pdsc')
  .directive('mediaReady', function () {
    return {
      template: '',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
          element.on('canplaythrough', function() {
              scope.$apply(function() {
                scope.mediaReady();
              });
          });
      }
    };
  });
