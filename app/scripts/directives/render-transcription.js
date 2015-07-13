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
          currentTime: '=',
          name: '@',
          play: '&'
      },
      link: function postLink(scope, element, attrs) {
          scope.highlight = {};
          scope.$watch('currentTime', function() {
              if (scope.currentTime) {
                  var transformed = _.map(scope.transcript, function(t) {
                      if (t.time > scope.currentTime) { 
                          return 1 
                      } else {
                          return 0;
                      }
                      
                  });
                  scope.selectedIndex = _.indexOf(transformed, 1, true) - 1;
                  var o = $location.hash();
                  $location.hash(scope.name + '_' + scope.selectedIndex);
                  $anchorScroll();
                  $location.hash(o);

              }
          });

          // show or hide the transcription?
          scope.st = false;

          var transcript = _.compact(_.map(scope.transcription, function(v) { if (v.value || v.referenceValue) return v; }));
          if (!_.isEmpty(transcript)) scope.transcript = transcript;

      }
    };
  }]);
