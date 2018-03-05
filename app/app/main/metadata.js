'use strict';

module.exports = MetadataCtrl;

MetadataCtrl.$inject = ['$rootScope', '$scope', 'dataService'];
function MetadataCtrl($rootScope, $scope, dataService) {
  $rootScope.$on('item-data-ready', function() {
    $scope.itemData = dataService.itemData;
  });
}
