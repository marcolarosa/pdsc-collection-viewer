'use strict';

const {isEmpty, each, map} = require('lodash');

module.exports = {
  template: require('./view-information.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$state', '$rootScope', 'dataService', '$scope'];

function Controller($state, $rootScope, dataService, $scope) {
  var vm = this;

  var broadcastListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    broadcastListener = $rootScope.$on('item data loaded', loadItem);
    loadItem();
  }

  function destroy() {
    broadcastListener();
  }

  function loadItem() {
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    vm.showImage = false;
    vm.loadingData = true;
    dataService.getItem(collectionId, itemId).then(processResponse);

    function processResponse(resp) {
      vm.loadingData = false;
      if (isEmpty(resp)) {
        return;
      }
      $scope.$apply(() => {
        vm.item = resp;
      });
    }
  }
}
