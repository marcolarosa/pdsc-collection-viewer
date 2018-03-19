'use strict';

module.exports = [
  '$timeout',
  $timeout => {
    return {
      template: '',
      restrict: 'A',
      link: function(scope, element) {
        element.ready(() => {
          scope.$apply(function() {
            $timeout(() => {
              scope.vm.scrollTranscription();
            }, 500);
          });
        });
      }
    };
  }
];
