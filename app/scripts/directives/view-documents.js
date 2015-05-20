'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:viewDocuments
 * @description
 * # viewDocuments
 */
angular.module('pdscApp')
  .directive('viewDocuments', function () {
    return {
      templateUrl: 'views/view-documents.html',
      restrict: 'E',
      scope: {
          itemData: '=',
      },
      link: function postLink(scope, element, attrs) {
          scope.showDocuments = true;
          scope.showItemInformation = false;

      }
    };
  });
