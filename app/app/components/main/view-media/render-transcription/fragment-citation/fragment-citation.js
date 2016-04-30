'use strict';

angular.module('pdsc')
  .directive('fragmentCitation', [ 
    '$location', 
    'clipboard',
    function ($location, clipboard) {
    return {
      templateUrl: 'app/components/main/view-media/render-transcription/fragment-citation/fragment-citation.html',
      restrict: 'E',
      scope: {
          type: '@',
          fragmentData: '=',
          selected: '='
      },
      link: function postLink(scope) {
          scope.hidden = true;

          scope.fragmentCitation = $location.absUrl() + '?type=' + scope.type + '&selected=' + scope.selected + '&segment=' + scope.fragmentData.id;
      }
    };
  }]);
