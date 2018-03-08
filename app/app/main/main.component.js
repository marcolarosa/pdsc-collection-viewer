'use strict';

module.exports = {
  template: require('./main.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  '$state',
  '$transitions',
  '$rootScope',
  'dataService',
  '$mdSidenav',
  'lodash'
];

function Controller(
  $state,
  $transitions,
  $rootScope,
  dataService,
  $mdSidenav,
  lodash
) {
  var vm = this;

  var onSuccessHandler;

  vm.showItemInformation = false;
  vm.levelUp = false;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.toggleItemInformation = toggleItemInformation;
  vm.loadViewer = loadViewer;

  function init() {
    onSuccessHandler = $transitions.onSuccess({}, function(transition) {
      if (transition.$to().name === 'main') {
        loadItem();
      }
    });
    loadItem();
  }

  function destroy() {
    onSuccessHandler();
  }

  function loadItem() {
    vm.collectionId = $state.params.collectionId;
    vm.itemId = $state.params.itemId;
    vm.loadingData = true;
    return dataService.getItem(vm.collectionId, vm.itemId).then(resp => {
      vm.itemData = resp;
      console.log(vm.itemData);
      vm.loadingData = false;
      vm.loadViewer();
    });
  }

  function toggleItemInformation() {
    $mdSidenav('left').toggle();
  }

  function loadViewer() {
    // load the required viewer if we're at the item root
    if (lodash.includes(['main', 'main.images'], $state.current.name)) {
      if (vm.itemData.images) {
        let image = vm.itemData.images[0]
          .split('/')
          .pop()
          .split('.')[0];
        $state.go('main.imagesInstance', {imageId: image});
      } else if (vm.itemData.documents) {
        $state.go('main.documents');
      } else {
        $state.go('main.media');
      }
    }
  }
}
