'use strict';

angular.module('pdsc')
  .directive('storeHeight', [ 'configuration', '$window', 
    function (conf, $window) {
    return {
      template: '',
      restrict: 'A',
      scope: {
          element: '@'
      },
      link: function postLink(scope, element) {
          var storeHeight = function() {
              conf.header[scope.element] = parseInt(element[0].clientHeight);
          };
          storeHeight();

          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                  storeHeight();
              });
          });

      }
    };
  }]);
