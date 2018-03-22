'use strict';

const {isEmpty} = require('lodash');

module.exports = Controller;

Controller.$inject = ['$rootScope', '$scope', 'dataService', '$state'];
function Controller($rootScope, $scope, dataService, $state) {
  $rootScope.$on('item data loaded', loadItem);

  function loadItem() {
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    dataService.getItem(collectionId, itemId).then(processResponse);

    function processResponse(resp) {
      if (isEmpty(resp)) {
        return;
      }
      $scope.item = resp;
    }
  }
}
