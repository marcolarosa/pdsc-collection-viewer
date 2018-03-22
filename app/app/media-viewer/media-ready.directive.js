'use strict';

module.exports = [
  '$timeout',
  'dataService',
  ($timeout, dataService) => {
    return {
      template: '',
      restrict: 'A',
      link: function(scope, element) {
        $timeout(() => {
          if (!scope.vm.mediaReadyToPlay) {
            scope.vm.loginRequired = true;
            dataService.userLoggedIn = false;
          }
        }, 5000);
        element.on('canplaythrough', () => {
          scope.$apply(function() {
            scope.vm.mediaReadyToPlay = true;
            scope.vm.loginRequired = false;
            dataService.userLoggedIn = true;
          });
        });
      }
    };
  }
];
