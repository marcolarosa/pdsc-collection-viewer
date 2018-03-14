'use strict';

module.exports = [
  '$timeout',
  $timeout => {
    return {
      template: '',
      restrict: 'A',
      link: function(scope, element) {
        $timeout(() => {
          if (!scope.vm.mediaReadyToPlay) {
            scope.vm.loginRequired = true;
          }
        }, 2000);
        element.on('canplaythrough', () => {
          scope.$apply(function() {
            scope.vm.mediaReadyToPlay = true;
          });
        });
      }
    };
  }
];
