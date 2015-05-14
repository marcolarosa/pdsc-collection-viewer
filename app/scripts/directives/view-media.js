'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:viewMedia
 * @description
 * # viewMedia
 */
angular.module('pdscApp')
  .directive('viewMedia', function () {
    return {
      templateUrl: 'views/view-media.html',
      restrict: 'E',
      scope: {
          itemData: '='
      },
      link: function postLink(scope, element, attrs) {
          scope.showMedia = true;
          scope.showItemInformation = false;
          scope.loadVideoPlayer = false;
          scope.loadAudioPlayer = false;

          // are we dealing with audio or video?
          if (!_.isEmpty(scope.itemData.video)) scope.loadVideoPlayer = true;
          if (!_.isEmpty(scope.itemData.audio)) scope.loadAudioPlayer = true;

          scope.toggleItemInformation = function() {
              scope.showItemInformation = !scope.showItemInformation;
          }
      }
    };
  });
