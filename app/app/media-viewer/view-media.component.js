'use strict';

const {isEmpty, keys, each} = require('lodash');

module.exports = {
  template: require('./view-media.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  '$state',
  '$rootScope',
  'dataService',
  '$timeout',
  '$location'
];
function Controller($state, $rootScope, dataService, $timeout, $location) {
  var vm = this;

  var broadcastListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.previousItem = previousItem;
  vm.nextItem = nextItem;

  function init() {
    broadcastListener = $rootScope.$on('item data loaded', loadItem);
    vm.config = {
      current: 0,
      item: null,
      showItemInformation: false
    };
    loadItem();
  }

  function destroy() {
    broadcastListener();
  }

  function loadItem() {
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    vm.showMedia = false;
    vm.loadingData = true;
    dataService.getItem(collectionId, itemId).then(processResponse);

    function processResponse(resp) {
      vm.loadingData = false;
      if (isEmpty(resp)) {
        return;
      }
      vm.item = resp;
      if (isEmpty(vm.item.media)) {
        return $state.go('main');
      }

      vm.media = vm.item.media.map(m => m.name);

      if (!$state.params.mediaId) {
        $location.search({});
        $state.go('main.media.instance', {mediaId: vm.media[0]});
      }
      $timeout(() => {
        const mediaId = $state.params.mediaId;
        vm.config.current = vm.media.indexOf(mediaId);
        vm.config.item = vm.item.media[vm.config.current];
      });
    }
  }

  function jump() {
    each(vm.media, (item, idx) => {
      if (vm.config.current === idx) {
        $location.search({});
        vm.config.item = null;
        $timeout(() => {
          vm.config.item = vm.item.media[vm.config.current];
          $state.go('main.media.instance', {mediaId: item});
        });
      }
    });
  }

  function nextItem() {
    if (vm.config.current === vm.item.media.length - 1) {
      return;
    }
    vm.config.current += 1;
    jump();
  }

  function previousItem() {
    if (vm.config.current === 0) {
      return;
    }
    vm.config.current -= 1;
    jump();
  }
}
