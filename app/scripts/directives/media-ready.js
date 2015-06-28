'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:mediaReady
 * @description
 * # mediaReady
 */
angular.module('pdscApp')
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
