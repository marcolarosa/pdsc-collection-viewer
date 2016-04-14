'use strict';

angular.module('pdsc')
  .directive('wavesurfer', [ 
    'wavesurfer',
    '_',
    '$http',
    function (wavesurfer, _, $http) {
    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
          name: '@',
          itemData: '=',
      },
      link: function postLink(scope, element) {
          var wav = _.find(scope.itemData.audio[scope.name], function(audio) {
              return audio.match('.wav');
          });
          if (wav) {
              console.log(wav);
              /*
              var ws = wavesurfer.create({
                  container: angular.element(element)[0],
                  waveColor: 'violet',
                  progressColor: 'purple'
              });
              $http.get(wav, { withCredentials: true }).then(function(resp) {
                  console.log('here');
                  console.log(resp);
              }, function(error) {
                  console.log('or here');
                  console.log(error);
              });
              */
          }
      }
    };
  }]);
