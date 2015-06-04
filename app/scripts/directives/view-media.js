'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:viewMedia
 * @description
 * # viewMedia
 */
angular.module('pdscApp')
  .directive('viewMedia', [ '$routeParams', function ($routeParams) {
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
          scope.time = '';

          // is a specific instance being requested?
          //  If so, strip the others from the set.
          if (scope.instanceId) {
              // it's not undefined
              var k = scope.instanceId;

              // since we're choosing only one; we can now honour start / end params
              if ($routeParams.start && $routeParams.end) {
                  scope.time = '#t=' + $routeParams.start + ',' + $routeParams.end;
              } else if ($routeParams.start && !$routeParams.end) {
                  scope.time = '#t=' + $routeParams.start; 
              } else if (!$routeParams.start && $routeParams.end) {
                  scope.time = '#t=,' + $routeParams.end; 
              } else {
                  scope.time = '';
              }

              // process the audio elements - extracting the specific instance if matching
              if (!_.isEmpty(scope.itemData.audio)) {
                scope.itemData.audio = _.pick(scope.itemData.audio, k);
                _.each(scope.itemData.audio, function(d,k) {
                    d = _.map(d, function(e) {
                        return e + scope.time;
                    })
                    scope.itemData.audio[k] = d;
                })
              }

              // process the video elements - extracting the specific instance if matching
              if (!_.isEmpty(scope.itemData.video)) {
                  scope.itemData.video = _.pick(scope.itemData.video, k);
                  _.each(scope.itemData.video, function(d,k) {
                      d = _.map(d, function(e) {
                          return e + scope.time;
                      })
                      scope.itemData.video[k] = d;
                  })
              }


          }

          // are we dealing with audio or video?
          if (!_.isEmpty(scope.itemData.video)) scope.loadVideoPlayer = true;
          if (!_.isEmpty(scope.itemData.audio)) scope.loadAudioPlayer = true;

      }
    };
  }]);
