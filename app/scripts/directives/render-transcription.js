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
          name: '@',
          play: '&'
      },
      link: function postLink(scope, element, attrs) {
          // show or hide the transcription?
          scope.st = false;

          // watch itemData and when it looks like we have the data
          //  we need; kick off whatever we need to do
          scope.$watch('transcription', function(n,o) {
              var eaf = scope.transcription.eaf[scope.name];
              var trs = scope.transcription.trs[scope.name];

              var transcript;
              if (!_.isEmpty(eaf) && _.isObject(eaf)) {
                  transcript = _.compact(_.map(eaf, function(v) { if (v.value || v.referenceValue) return v; }));

              } else if (!_.isEmpty(trs) && _.isObject(trs)) {
                  transcript = _.compact(_.map(trs, function(v) { if (v.value || v.referenceValue) return v; }));

              }
              if (!_.isEmpty(transcript)) scope.transcript = transcript;
          }, true);

      }
    };
  }]);
