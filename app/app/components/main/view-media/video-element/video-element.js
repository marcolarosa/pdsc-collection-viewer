'use strict';

angular.module('pdsc')
  .directive('videoElement', [ 
    '$timeout', 
    '_',
    '$location',
    function ($timeout, _, $location) {
    return {
      templateUrl: 'app/components/main/view-media/video-element/video-element.html',
      restrict: 'E',
      scope: {
          name: '=',
          mediaSrc: '=',
          itemData: '='
      },
      link: function postLink(scope) {
          scope.mediaReadyToPlay = false;
          scope.interlinear = {};

          scope.$watch('itemData', function() {
              if (!_.isEmpty(scope.itemData.eaf)) {
                  scope.trs = scope.itemData.eaf[scope.name];
              }
              if (!_.isEmpty(scope.itemData.trs)) {
                  scope.trs = scope.itemData.trs[scope.name];
              }
              if (!_.isEmpty(scope.itemData.ixt)) {
                  _.extend(scope.interlinear, scope.itemData.ixt[scope.name]);
              }
              if (!_.isEmpty(scope.itemData.flextext)) {
                  _.extend(scope.interlinear, scope.itemData.flextext[scope.name]);
              }
          }, true);

          // defaults
          scope.mediaReadyToPlay = false;

          // required by the directive which watches for the
          //  element to be ready - this makes the media element visible
          scope.mediaReady = function() {
              scope.mediaReadyToPlay = true;
          };

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
          };

          scope.loadItem = function() {
              var url = '/' + scope.itemData.collectionId + '/' + scope.itemData.itemId + '/' + scope.name;
              $location.url(url);
          }

      }
    };
  }]);
