'use strict';

module.exports = () => {
  return {
    template: '',
    restrict: 'A',
    link: Linker
  };
};

Linker.$inject = ['scope', 'element'];
function Linker(scope, element) {
  element.on('load', function() {
    scope.$apply(() => {
      scope.vm.imageStyle = {
        width: '600px',
        'max-width': '600px',
        overflow: 'auto'
      };
      // let viewer = $('.pannable-image').ImageViewer();
      scope.vm.showImage = true;
    });
  });
  element.on('error', function(err) {
    scope.$apply(() => {
      scope.vm.showImage = true;
      scope.vm.showError = true;
    });
  });
}
