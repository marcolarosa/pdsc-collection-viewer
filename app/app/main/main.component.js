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
  '$log',
  'dataService',
  '$mdSidenav'
];

function Controller($state, $transitions, $log, dataService, $mdSidenav) {
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
        loadItemData();
      }
    });
  }

  function destroy() {
    onSuccessHandler();
  }

  function loadItemData() {
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    vm.loadingData = true;
    return dataService.getItem(collectionId, itemId).then(resp => {
      vm.itemData = resp;
      vm.loadingData = false;
      vm.loadViewer();
    });
  }

  // show / hide item information panel
  function toggleItemInformation() {
    $mdSidenav('left').toggle();
  }

  // load an appropriate viewer
  function loadViewer() {
    // some of the viewers need to know the header height so they
    //  can size themselves accordingly
    //vm.headerHeight = document.getElementById('header').clientHeight;

    // always ditch info when loading a viewer
    vm.showItemInformation = false;

    // now load the required viewer
    if (vm.itemData.images) {
      $state.go('main.images');
    } else if (vm.itemData.documents) {
      $state.go('main.documents');
    } else {
      $state.go('main.media');
    }
  }
}
