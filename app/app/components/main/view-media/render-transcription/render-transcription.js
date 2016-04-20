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

          var transcript = _.compact(_.map(scope.transcription, function(v) { 
              if (v.value || v.referenceValue) {
                  return v; 
              }
          }));
          if (!_.isEmpty(transcript)) {
              scope.transcript = transcript;
          }
      }
    };
  }]);
