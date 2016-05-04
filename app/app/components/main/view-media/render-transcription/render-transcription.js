'use strict';

angular.module('pdsc')
  .directive('renderTranscription', [ 
    '$location', 
    '$anchorScroll', 
    '_',
    '$timeout',
    function ($location, $anchorScroll, _, $timeout) {
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
          scope.selected = {};
          scope.available = {};

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
              scope.available.transcripts = _.keys(scope.transcription).sort();
              scope.selected.transcript = scope.available.transcripts[0];
              scope.load('transcript');
              if (scope.available.transcripts.length > 1) {
                  scope.transcriptsSelector = true;
              }
          }, true);

          scope.$watch('eopas', function() {
              if (scope.eopas === undefined) {
                  return;
              }
              scope.available.interlinear = _.keys(scope.eopas).sort();
              scope.selected.interlinear = scope.available.interlinear[0];
              scope.load('interlinear');
              if (scope.available.interlinear.length > 1) {
                  scope.interlinearTextsSelector = true;
              }
          }, true);

          scope.load = function(what) {
              $timeout(function() {
                  if (what === 'transcript') {
                    scope.transcript = scope.transcription[scope.selected.transcript];
                  } else if (what === 'interlinear') {
                    scope.interlinearText = scope.eopas[scope.selected.interlinear];
                  }
              }, 100);
          };

      }
    };
  }]);
