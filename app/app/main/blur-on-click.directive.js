'use strict';

module.exports = () => {
  return {
    template: '',
    restrict: 'A',
    scope: {},
    link: Linker
  };
};

Linker.$inject = ['scope', 'element'];
function Linker(scope, element) {
  element.bind('click', function() {
    element.blur();
  });
}
