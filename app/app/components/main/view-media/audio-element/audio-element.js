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
          mediaSrc: '=',
          itemData: '=',
      },
      link: function postLink(scope) {
          // defaults
          scope.mediaReadyToPlay = false;

          scope.$watch('itemData', function() {
              if (!_.isEmpty(scope.itemData.eaf)) {
                  scope.trs = scope.itemData.eaf[scope.name];
              }
              if (!_.isEmpty(scope.itemData.trs)) {
                  scope.trs = scope.itemData.trs[scope.name];
              }
              if (!_.isEmpty(scope.itemData.ixt)) {
                  scope.interlinear = scope.itemData.ixt[scope.name];
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
