'use strict';

angular.module('pdsc')
  .directive('renderTranscription', [ 
    '$location', 
    '$anchorScroll', 
    '_',
    function ($location, $anchorScroll, _) {
    return {
      templateUrl: 'app/components/main/view-media/render-transcription/render-transcription.html',
      restrict: 'E',
      scope: {
          transcription: '=',
          eopas: '=',
          currentTime: '=',
          name: '@',
          play: '&'
      },
      link: function postLink(scope) {
          scope.highlight = {};
          scope.st = false;
          scope.se = false;

          scope.$watch('currentTime', function() {
              if (scope.currentTime) {
                  var d;
                  if (scope.transcript) {
                      d = scope.transcript;
                  } else if (scope.eopas) {
                      d = scope.eopas;
                  }
                  var transformed = _.map(d, function(t) {
                      if (t.time > scope.currentTime) { 
                          return 1;
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

          scope.$watch('transcription', function() {
              if (scope.transcription === undefined) { 
                  return;
              }
              scope.availableTranscripts = _.keys(scope.transcription);
              scope.selectedTranscript = scope.availableTranscripts[0];
              scope.loadTranscript();
              if (scope.availableTranscripts.length > 1) {
                  scope.transcriptsSelector = true;
              }
          }, true);

          scope.$watch('eopas', function() {
              if (scope.eopas === undefined) {
                  return;
              }
              scope.availableInterlinearTexts = _.keys(scope.eopas);
              scope.selectedInterlinearText = scope.availableInterlinearTexts[0];
              scope.loadInterlinearText();
              if (scope.availableInterlinearTexts.length > 1) {
                  scope.interlinearTextsSelector = true;
              }
          }, true);

          scope.loadInterlinearText = function() {
              scope.interlinearText = scope.eopas[scope.selectedInterlinearText];
          };

          scope.loadTranscript = function() {
              scope.transcript = scope.transcription[scope.selectedTranscript];
          };
      }
    };
  }]);
