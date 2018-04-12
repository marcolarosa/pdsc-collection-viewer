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
  // [u'', u'definitely endangered', u'critically endangered', u'safe', None, u'severely endangered', u'extinct', u'vulnerable']

  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    vm.loadingData = true;
    broadcastListener = $rootScope.$on('item data loaded', loadItem);
    loadItem();
  }

  function destroy() {
    broadcastListener();
  }

  function loadItem() {
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    dataService.getItem(collectionId, itemId).then(processResponse);

    function processResponse(resp) {
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

      getLanguageData();
    }
  }

  function getLanguageData() {
    const languageData = firebaseService.getLanguageData(
      $state.params.languageId
    );
    languageData.on('value', data => setData(data));

    function setData(data) {
      $scope.$apply(() => {
        vm.loadingData = false;
        vm.data = data.val();
        console.log(vm.data);
      });
    }
  }
}
