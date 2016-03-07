'use strict';

angular.module('pdsc')
  .directive('blurOnClick', function () {
    return {
      template: '',
      restrict: 'A',
      scope: {
      },
      link: function postLink(scope, element) {
          element.bind('click', function() {
              element.blur();
          });
      }
    };
  });
