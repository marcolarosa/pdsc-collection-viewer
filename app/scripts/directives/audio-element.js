'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:audioElement
 * @description
 * # audioElement
 */
angular.module('pdscApp')
  .directive('audioElement', [ '$timeout', function ($timeout) {
    return {
      templateUrl: 'views/audio-element.html',
      restrict: 'E',
      scope: {
          name: '=',
          itemData: '=',
          transcription: '=',
      },
      link: function postLink(scope, element, attrs) {
          // defaults
          scope.mediaReadyToPlay = false;

          scope.$watch('transcription', function() {
              if (!_.isEmpty(scope.transcription.eaf)) {
                  if (scope.transcription.eaf[scope.name] && scope.transcription.eaf[scope.name].length > 1) {
                      scope.trs = scope.transcription.eaf[scope.name];
                  } else {
                      _.each(scope.transcription.eaf, function(value, key) {
                          if (key.match(scope.transcription.collectionId + '-' + scope.transcription.itemId)) { 
                              if (scope.transcription.eaf[key].length > 1) scope.trs = scope.transcription.eaf[key];
                          }
                      });
                  }
              }
              if (!_.isEmpty(scope.transcription.trs)) {
                  if (scope.transcription.trs[scope.name] && scope.transcription.trs[scope.name].length > 1) {
                      scope.trs = scope.transcription.trs[scope.name];
                  } else {
                      _.each(scope.transcription.trs, function(value, key) {
                          if (key.match(scope.transcription.collectionId + '-' + scope.transcription.itemId)) { 
                              if (scope.transcription.trs[key].length > 1) scope.trs = scope.transcription.trs[key];
                          }
                      });
                  }
              }
          }, true);

          // required by the directive which watches for the 
          //  element to be ready - this makes the media element visible
          scope.mediaReady = function() {
              scope.mediaReadyToPlay = true;
          }

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
          }
      }
    };
  }]);
