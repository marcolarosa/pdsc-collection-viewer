'use strict';

const {isEmpty} = require('lodash');

module.exports = {
  template: require('./view-languages.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  '$state',
  '$rootScope',
  '$scope',
  '$location',
  '$timeout',
  'dataService',
  'firebaseService'
];

function Controller(
  $state,
  $rootScope,
  $scope,
  $location,
  $timeout,
  dataService,
  firebaseService
) {
  var vm = this;

  var broadcastListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    broadcastListener = $rootScope.$on('item data loaded', loadItem);
    loadItem();
    vm.database = firebaseService.getDatabase();
    const languageData = firebaseService.getLanguageData(
      $state.params.languageId
    );
    languageData.on('value', data => setData(data));
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
      vm.item = resp;
      if (isEmpty(vm.item.languages)) {
        return $state.go('main');
      }

      if (!$state.params.languageId) {
        $state.go('main.languages.instance', {
          languageId: vm.item.languages[0]
        });
      }
    }
  }

  function setData(data) {
    $scope.$apply(() => {
      vm.data = data.val();
      console.log(vm.data);
    });
  }
}
