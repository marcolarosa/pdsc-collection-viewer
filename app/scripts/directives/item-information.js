'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:itemInformation
 * @description
 * # itemInformation
 */
angular.module('pdscApp')
  .directive('itemInformation', [ '$timeout', function ($timeout) {
    return {
      templateUrl: 'views/item-information.html',
      restrict: 'E',
      scope: {
          itemData: '=',
      },
      link: function postLink(scope, element, attrs) {
          $timeout(function() {
              scope.show = true;
          }, 80);
      }
    };
  }]);
