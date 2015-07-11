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

          var transcript = _.compact(_.map(scope.transcription, function(v) { if (v.value || v.referenceValue) return v; }));
          if (!_.isEmpty(transcript)) scope.transcript = transcript;

      }
    };
  }]);
