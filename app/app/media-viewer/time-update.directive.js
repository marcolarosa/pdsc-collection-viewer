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
  element.on('timeupdate', function(time) {
    scope.$apply(function() {
      scope.currentTime = time.currentTarget.currentTime;
    });
  });
}
