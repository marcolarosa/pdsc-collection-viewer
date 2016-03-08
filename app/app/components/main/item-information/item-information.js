'use strict';

angular.module('pdsc')
  .directive('itemInformation', [ 
    '$location', 
    '$timeout', 
    function ($location, $timeout) {
        return {
          templateUrl: 'app/components/main/item-information/item-information.html',
          restrict: 'E',
          scope: {
              itemData: '=',
          },
          link: function postLink(scope) {
              scope.url = $location.absUrl();
          }
        };
  }]);
