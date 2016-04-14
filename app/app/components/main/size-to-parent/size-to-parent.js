'use strict';

angular.module('pdsc')
  .directive('sizeToParent', [ '$window', 'configuration', 
    function ($window, conf) {
    return {
      template: '',
      restrict: 'A',
      link: function postLink(scope) {

          var sizeThePanel = function() {
              scope.panelStyle = {
                  'position': 'relative',
                  'height': $window.innerHeight - conf.header.toolbar - 
                                conf.header.headline - conf.header.controls - 30 + 'px',
                  'overflow': 'scroll'
              };
          };
          sizeThePanel();

          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                  sizeThePanel();
              });
          });

      }
    };
  }]);
