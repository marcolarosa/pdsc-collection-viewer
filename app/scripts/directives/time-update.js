'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:timeUpdate
 * @description
 * # timeUpdate
 */
angular.module('pdscApp')
  .directive('timeUpdate', function () {
    return {
      template: '',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
          element.on('timeupdate', function(time) {
              scope.$apply(function() {
                  scope.currentTime = time.currentTarget.currentTime;
              });
          });
      }
    };
  });
