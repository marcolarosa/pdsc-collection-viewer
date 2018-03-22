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
    const segment = vm.fragment.time;
    vm.citation = `${url}/${collectionId}/${itemId}/media/${instanceId}?transcription=${selected}&segment=${segment}`;
  }

  function destroy() {}

  // http://catalog.paradisec.org.au/viewer/#/NT1/98007/NT1-98007-98007A
  // ?type=interlinear&selected=NT1-98007-98007A.eopas1.ixt&segment=562.497

  // http://cli:9000/#//NT1/98007/NT1-98007-98007A?selected=NT1-98007-98007A.eaf&segment=3.992

  // if (scope.itemData) {
  //   var url;
  //   url = $location.absUrl().split($location.url())[0] + '/';
  //   url +=
  //     scope.itemData.collectionId +
  //     '/' +
  //     scope.itemData.itemId +
  //     '/' +
  //     scope.name;
  //   url +=
  //     '?type=' +
  //     scope.type +
  //     '&selected=' +
  //     scope.selection +
  //     '&segment=' +
  //     scope.fragmentData.id;
  //   scope.fragmentCitation = url;
  // }
}
