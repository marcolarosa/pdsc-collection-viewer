'use strict';

angular.module('pdsc')
  .directive('videoElement', [ 
    '$timeout', 
    '_',
    function ($timeout, _) {
    return {
      templateUrl: 'app/components/main/view-media/video-element/video-element.html',
      restrict: 'E',
      scope: {
          name: '=',
          mediaSrc: '=',
          itemData: '='
      },
      link: function postLink(scope) {
          scope.$watch('itemData', function() {
              if (!_.isEmpty(scope.itemData.eaf)) {
                  _.each(scope.itemData.eaf, function(value, key) {
                      if (key.match(scope.itemData.collectionId + '-' + scope.itemData.itemId)) {
                          if (scope.itemData.eaf[key].length > 1) {
                              scope.trs = scope.itemData.eaf[key];
                          }
                      }
                  });
              }
              if (!scope.trs && !_.isEmpty(scope.itemData.trs)) {
                  _.each(scope.itemData.trs, function(value, key) {
                      if (key.match(scope.itemData.collectionId + '-' + scope.itemData.itemId)) {
                          if (scope.itemData.trs[key].length > 1) {
                              scope.trs = scope.itemData.trs[key];
                          }
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
          };

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
          };
      }
    };
  }]);
