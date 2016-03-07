'use strict';

angular.module('pdsc')
  .directive('audioElement', [ 
    '$timeout', 
    '_',
    function ($timeout, _) {
    return {
      templateUrl: 'app/components/main/view-media/audio-element/audio-element.html',
      restrict: 'E',
      scope: {
          name: '=',
          itemData: '=',
          transcription: '=',
      },
      link: function postLink(scope) {
          // defaults
          scope.mediaReadyToPlay = false;

          scope.$watch('transcription', function() {
              if (!_.isEmpty(scope.transcription.eaf)) {
                  if (scope.transcription.eaf[scope.name] && scope.transcription.eaf[scope.name].length > 1) {
                      scope.trs = scope.transcription.eaf[scope.name];
                  }
              }
              if (!_.isEmpty(scope.transcription.trs)) {
                  if (scope.transcription.trs[scope.name] && scope.transcription.trs[scope.name].length > 1) {
                      scope.trs = scope.transcription.trs[scope.name];
                  }
              }
          }, true);

          // required by the directive which watches for the 
          //  element to be ready - this makes the media element visible
          scope.mediaReady = function() {
              scope.mediaReadyToPlay = true;
          };

          // play a fragment
          scope.playFragment = function(start, end) {
              // seek to start.time
              var audioElement = document.getElementById(scope.name);
              audioElement.currentTime = start.time;

              // hit play
              audioElement.play();

              // then set a timeout to pause at end.time
              $timeout(function() {
                  audioElement.pause();
              }, (end.time - start.time) * 1000);
          };
      }
    };
  }]);
