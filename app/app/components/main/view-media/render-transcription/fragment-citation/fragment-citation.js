'use strict';

angular.module('pdsc')
  .directive('fragment-citation', [ 
    '$location', 
    function ($location) {
    return {
      templateUrl: 'app/components/main/view-media/render-transcription/fragment-citation/fragment-citation.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope) {
      }
    };
  }]);
