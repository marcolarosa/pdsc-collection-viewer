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
  scope.vm.showImage = false;
  element.on('load', function() {
    scope.$apply(function() {
      scope.vm.showProgress = false;
      scope.vm.imageStyle = {
        width: '600px',
        'max-width': '600px',
        overflow: 'auto'
      };
      // let viewer = $('.pannable-image').ImageViewer();
      scope.vm.showImage = true;
    });
  });
}
