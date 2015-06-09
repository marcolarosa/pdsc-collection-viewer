'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:itemInformation
 * @description
 * # itemInformation
 */
angular.module('pdscApp')
  .directive('itemInformation', [ '$location', '$timeout', function ($location, $timeout) {
    return {
      templateUrl: 'views/item-information.html',
      restrict: 'E',
      scope: {
          itemData: '=',
      },
      link: function postLink(scope, element, attrs) {

          scope.url = $location.absUrl();

          $timeout(function() {
              scope.show = true;
          }, 80);
      }
    };
  }]);
