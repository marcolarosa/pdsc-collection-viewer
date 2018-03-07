'use strict';

module.exports = {
  template: require('./item-information.component.html'),
  bindings: {
    itemData: '<'
    // close: '&'
  },
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$location'];
function Controller($location) {
  var vm = this;

  vm.$onInit = init;
  function init() {
    vm.url = $location.absUrl();
  }
}
