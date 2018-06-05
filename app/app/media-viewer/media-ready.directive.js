'use strict';

module.exports = [
  '$timeout',
  'dataService',
  ($timeout, dataService) => {
    return {
      template: '',
      restrict: 'A',
      link: function(scope, element) {
        element.on('canplaythrough', () => {
          scope.$apply(function() {
            scope.vm.mediaReadyToPlay = true;
          });
        });
      }
    };
  }
];
