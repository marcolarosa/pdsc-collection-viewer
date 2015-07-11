'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:videoElement
 * @description
 * # videoElement
 */
angular.module('pdscApp')
  .directive('videoElement', function () {
    return {
      templateUrl: 'views/video-element.html',
      restrict: 'E',
      scope: {
          name: '=',
          itemData: '=',
          transcription: '='
      },
      link: function postLink(scope, element, attrs) {
          scope.$watch('transcription', function() {
              if (!_.isEmpty(scope.transcription.eaf)) {
                  _.each(scope.transcription.eaf, function(value, key) {
                      if (key.match(scope.transcription.collectionId + '-' + scope.transcription.itemId)) {
                          if (scope.transcription.eaf[key].length > 1) scope.trs = scope.transcription.eaf[key];
                      }
                  });
              }
              if (!scope.trs && !_.isEmpty(scope.transcription.trs)) {
                  _.each(scope.transcription.trs, function(value, key) {
                      if (key.match(scope.transcription.collectionId + '-' + scope.transcription.itemId)) {
                          if (scope.transcription.trs[key].length > 1) scope.trs = scope.transcription.trs[key];
                      }
                  });
              }
          }, true);

          // defaults
          scope.mediaReadyToPlay = false;

          // required by the directive which watches for the
          //  element to be ready - this makes the media element visible
          scope.mediaReady = function() {
              scope.mediaReadyToPlay = true;
          }

          // play a fragment
          scope.playFragment = function(start, end) {
              // seek to start.time
              var videoElement = document.getElementById(scope.name);
              videoElement.currentTime = start.time;

              // hit play
              videoElement.play();

              // then set a timeout to pause at end.time
              $timeout(function() {
                  videoElement.pause();
              }, (end.time - start.time) * 1000);
          }
      }
    };
  });
