'use strict';

angular.module('pdsc')
  .controller('MetadataCtrl', [ 
    '$rootScope', 
    '$scope', 
    'configuration', 
    'paradisec', 
    function ($rootScope, $scope, conf, paradisec) {
      $rootScope.$on('item-data-ready', function() {
          $scope.itemData = paradisec.itemData;
      });
  }]);
