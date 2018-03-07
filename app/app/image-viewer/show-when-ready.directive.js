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
  let viewer;
  element.on('load', function() {
    if (viewer) {
      viewer = viewer.destroy();
    }
    scope.$apply(function() {
      scope.vm.showProgress = false;
      scope.vm.imageStyle = {
        height: '800px'
      };
      viewer = $('.pannable-image').ImageViewer();
      scope.vm.showImage = true;
    });
  });
}
