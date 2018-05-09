'use strict';

module.exports = {
  template: require('./fragment-citation.component.html'),
  bindings: {
    selected: '<',
    element: '<',
    fragment: '<'
  },
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$location', '$state'];
function Controller($location, $state) {
  var vm = this;

  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    const url = $location.absUrl().split($location.url())[0];
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    const instanceId = vm.element.name;
    const selected = vm.selected.split('/').pop();
    const segment = vm.fragment.time.begin;
    vm.citation = `${url}/${collectionId}/${itemId}/media/${instanceId}?transcription=${selected}&segment=${segment}`;
  }

  function destroy() {}
}
