'use strict';

angular.module('pdsc')
  .directive('fragmentCitation', [ 
    '$location', 
    'Clipboard',
    function ($location, Clipboard) {
    return {
      templateUrl: 'app/components/main/view-media/render-transcription/fragment-citation/fragment-citation.html',
      restrict: 'E',
      scope: {
          itemData: '=',
          name: '=',
          type: '@',
          selection: '=',
          fragmentData: '='
      },
      link: function postLink(scope) {
          scope.$watch('selection', function() {
              scope.updateUrl();
          });

          scope.updateUrl = function() {
              if (scope.itemData) {
                  var url;
                  url =  $location.absUrl().split($location.url())[0] + '/';
                  url += scope.itemData.collectionId + '/' + scope.itemData.itemId + '/' + scope.name;
                  url += '?type=' + scope.type + '&selected=' + scope.selection + '&segment=' + scope.fragmentData.id;
                  scope.fragmentCitation = url;
              }
          };
      }
    };
  }]);
