'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:itemInformation
 * @description
 * # itemInformation
 */
angular.module('pdscApp')
  .directive('itemInformation', [ '$window', function ($window) {
    return {
      templateUrl: 'views/item-information.html',
      restrict: 'E',
      scope: {
          itemData: '=',
          show: '=',
          close: '&',
          alwaysOpen: '@'
      },
      link: function postLink(scope, element, attrs) {
          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
              })
          });

          var sizeThePanels = function() {
              scope.height = $window.innerHeight;
              scope.width = $window.innerWidth;
              scope.panelHeight = $window.innerHeight;

              if (_.truthy(scope.alwaysOpen)) {
                  scope.backgroundStyle = {};
                  scope.contentStyle = { 
                      'margin': '0px 15px',
                      'padding': '15px',
                      'border-radius': '2px',
                      'box-shadow': '5px 5px 4px #888888'
                  };
              } else {
                  scope.backgroundStyle = {
                      'position': 'fixed',
                      'top': '0',
                      'left': '0',
                      'width': $window.innerWidth,
                      'height': $window.innerHeight,
                      'background-color': '#ccc',
                      'z-index': '100',
                      'opacity': '0.3',
                  }
                  scope.contentStyle = {
                      'position': 'fixed',
                      'top': $window.innerHeight * 0.01 + 'px',
                      'left': $window.innerWidth * 0.01 + 'px',
                      'width': $window.innerWidth * 0.4 + 'px', 
                      'height': $window.innerHeight * 0.9 + 'px',
                      'z-index': '110',
                      'border-radius': '2px',
                      'box-shadow': '5px 5px 4px #888888',
                      'padding': '15px'
                  }
              }
          }
          sizeThePanels();

      }
    };
  }]);
