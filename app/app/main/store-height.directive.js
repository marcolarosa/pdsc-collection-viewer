'use strict';

module.exports = [
  'configuration',
  '$window',
  (configuration, $window) => {
    return {
      template: '',
      restrict: 'A',
      scope: {
        element: '@'
      },
      link: (scope, element) => {
        storeHeight();

        // handle window resize events
        var w = angular.element($window);
        w.bind('resize', function() {
          scope.$apply(function() {
            storeHeight();
          });
        });

        function storeHeight() {
          configuration.header[scope.element] = parseInt(
            element[0].clientHeight
          );
        }
      }
    };
  }
];
