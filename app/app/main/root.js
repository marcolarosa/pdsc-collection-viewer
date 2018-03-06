'use strict';

module.exports = {
  template: require('./root.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$state', '$transitions'];

function Controller($state, $transitions) {
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
    vm.showErrorMessage = stateName === 'root' ? true : false;
  }

  function destroy() {
    onBeforeHandler();
  }
}
