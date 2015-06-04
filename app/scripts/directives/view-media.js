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
          itemData: '=',
          instanceId: '=',
      },
      link: function postLink(scope, element, attrs) {
          scope.showMedia = true;
          scope.loadVideoPlayer = false;
          scope.loadAudioPlayer = false;

          // is a specific instance being requested?
          //  If so, strip the others from the set.
          if (scope.instanceId) {
              // it's not undefined
              var k = scope.instanceId;
              if (!_.isEmpty(scope.itemData.audio)) scope.itemData.audio = _.pick(scope.itemData.audio, k);
              if (!_.isEmpty(scope.itemData.video)) scope.itemData.video = _.pick(scope.itemData.video, k);
          }

          // are we dealing with audio or video?
          if (!_.isEmpty(scope.itemData.video)) scope.loadVideoPlayer = true;
          if (!_.isEmpty(scope.itemData.audio)) scope.loadAudioPlayer = true;

      }
    };
  });
