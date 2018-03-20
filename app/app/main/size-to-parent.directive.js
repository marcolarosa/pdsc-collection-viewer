'use strict';

module.exports = [
  'configuration',
  '$window',
  (configuration, $window) => {
    return {
      template: '',
      restrict: 'A',
      link: function(scope) {
        sizeThePanel();
        var w = angular.element($window);
        w.bind('resize', function() {
          scope.$apply(function() {
            sizeThePanel();
          });
        });

        function sizeThePanel() {
          scope.vm.panelStyle = {
            position: 'relative',
            'max-width': `${window.innerWidth - 15}px`,
            'max-height': '800px',
            overflow: 'scroll'
          };
        }
      }
    };
  }
];
