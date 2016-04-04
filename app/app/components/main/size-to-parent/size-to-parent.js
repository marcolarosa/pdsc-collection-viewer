'use strict';

angular.module('pdsc')
  .directive('sizeToParent', [ '$window', 'configuration', '$timeout', 
    function ($window, conf, $timeout) {
    return {
      template: '',
      restrict: 'A',
      scope: {
      },
      link: function postLink(scope, element) {
          scope.panelStyle = {
              'position': 'relative',
              'height': $window.innerHeight - conf.header.toolbar - 
                            conf.header.headline - conf.header.controls + 'px',
              'overflow': 'scroll'
          }
          console.log(scope.panelStyle);
          console.log(element);
      }
    };
  }]);
