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
  element.on('canplaythrough', () => {
    scope.$apply(function() {
      scope.vm.mediaReadyToPlay = true;
    });
  });
  element.on('abort', err => {
    scope.$apply(() => {
      console.log(err);
    });
  });
}
