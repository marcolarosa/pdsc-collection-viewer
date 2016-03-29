'use strict';

angular.module('pdsc')
  .controller('MetadataCtrl', [ 
    '$rootScope', 
    '$scope', 
    'configuration', 
    'paradisec', 
    '$log',
    function ($rootScope, $scope, conf, paradisec, $log) {

      $rootScope.$on('item-data-ready', function() {
          $scope.itemData = paradisec.itemData;
      });
  }]);
