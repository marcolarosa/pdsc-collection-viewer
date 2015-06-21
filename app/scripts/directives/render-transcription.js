'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:renderTranscription
 * @description
 * # renderTranscription
 */
angular.module('pdscApp')
  .directive('renderTranscription', [ '$location', '$anchorScroll', function ($location, $anchorScroll) {
    return {
      templateUrl: 'views/render-transcription.html',
      restrict: 'E',
      scope: {
          transcription: '=',
          instanceId: '@',
          showTranscription: '@',
          scrollTo: '@'
      },
      link: function postLink(scope, element, attrs) {
          // show or hide the transcription?
          scope.st = scope.showTranscription;

          // if scrollTo is set - scroll to that element
          if (scope.scrollTo) {
              var o = $location.hash();
              $location.hash(scope.scrollTo);
              $anchorScroll();
              $location.hash(o);
          }

          scope.play = function(k) {
              var timeStart = scope.transcription[k].time;
              var timeEnd = scope.transcription[k+1].time;

              if (!$location.path().match(scope.instanceId)) {
                  $location.path($location.path() + '/' + scope.instanceId);
              }
              $location.search({
                  'start': timeStart,
                  'end': timeEnd
              });
          }

      }
    };
  }]);
