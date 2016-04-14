'use strict';

angular.module('pdsc')
  .directive('itemInformation', [ 
    '$location', 
    function ($location) {
        return {
          templateUrl: 'app/components/main/item-information/item-information.html',
          restrict: 'E',
          scope: {
              itemData: '=',
              close: '&'
          },
          link: function postLink(scope) {
              scope.url = $location.absUrl();
          }
        };
  }]);
