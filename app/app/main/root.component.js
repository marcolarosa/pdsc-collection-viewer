'use strict';

const configuration = require('./configuration');
const {groupBy, sortBy} = require('lodash');

module.exports = {
  template: require('./root.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$state', '$transitions', '$window', 'dataService'];
function Controller($state, $transitions, $window, dataService) {
  var vm = this;

  var onBeforeHandler;

  vm.showErrorMessage = false;
  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    vm.mode = configuration.datasource.mode;
    onBeforeHandler = $transitions.onBefore({}, function(transition) {
      viewSetup(transition.$to().name);
    });
    viewSetup($state.current.name);
  }

  function viewSetup(stateName) {
    if (stateName === 'root' && vm.mode === 'online') {
      $window.location.href = 'http://catalog.paradisec.org.au';
    } else {
      dataService.libraryBoxLoader().then(response => {
        vm.collections = groupBy(response, 'collectionId');
      });
    }
  }

  function destroy() {
    onBeforeHandler();
  }
}
