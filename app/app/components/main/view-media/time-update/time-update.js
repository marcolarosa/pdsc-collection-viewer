'use strict';

angular.module('pdsc')
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
