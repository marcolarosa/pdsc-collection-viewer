'use strict';

module.exports = {
  template: require('./root.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$state', '$transitions', '$window'];

function Controller($state, $transitions, $window) {
  var vm = this;

  var onBeforeHandler;

  vm.showErrorMessage = false;
  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    onBeforeHandler = $transitions.onBefore({}, function(transition) {
      viewSetup(transition.$to().name);
    });
    viewSetup($state.current.name);
  }

  function viewSetup(stateName) {
    if (stateName === 'root') {
      $window.location.href = 'http://catalog.paradisec.org.au';
    }
  }

  function destroy() {
    onBeforeHandler();
  }
}
