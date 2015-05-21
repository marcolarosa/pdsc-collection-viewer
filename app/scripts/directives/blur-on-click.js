'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:blurOnClick
 * @description
 * # blurOnClick
 */
angular.module('pdscApp')
  .directive('blurOnClick', function () {
    return {
      template: '',
      restrict: 'A',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          element.bind('click', function() {
              element.blur();
          });
      }
    };
  });
