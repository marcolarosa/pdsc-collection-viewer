'use strict';

module.exports = {
  template: require('./render-thumbnail-filmstrip.component.html'),
  bindings: {
    item: '<',
    selectedItem: '=',
    isOpen: '<',
    jump: '&'
  },
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  '$state',
  '$timeout',
  '$location',
  '$anchorScroll',
  '$mdSidenav'
];
function Controller($state, $timeout, $location, $anchorScroll, $mdSidenav) {
  var vm = this;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.loadImage = loadImage;

  function init() {
    vm.thumbnails = vm.item.thumbnails.map((thumb, idx) => {
      return {
        id: idx,
        source: thumb,
        name: thumb
          .split('/')
          .pop()
          .split('-thumb')[0]
      };
    });
    highlightSelectedItem();
  }

  function destroy() {}

  function highlightSelectedItem() {
    vm.thumbnails = vm.thumbnails.map((thumb, idx) => {
      thumb.selected =
        idx === vm.selectedItem ? 'filmstrip-highlight-current' : '';
      return thumb;
    });

    // scroll the thumbnails
    $timeout(function() {
      var old = $location.hash();
      $location.hash(vm.selectedItem);
      $anchorScroll();
      $location.hash(old);
    }, 1000);
  }

  function loadImage(image) {
    $state.go('main.imageInstance', {imageId: image});
  }
}
