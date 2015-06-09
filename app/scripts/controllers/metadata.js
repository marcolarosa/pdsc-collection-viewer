'use strict';

/**
 * @ngdoc function
 * @name pdscApp.controller:MetadataCtrl
 * @description
 * # MetadataCtrl
 * Controller of the pdscApp
 */
angular.module('pdscApp')
  .controller('MetadataCtrl', [ '$rootScope', '$scope', 'configuration', 'paradisec', 
        function ($rootScope, $scope, conf, paradisec) {

      $rootScope.$on('item-data-ready', function() {
            if (conf.deployment === 'paradisec') {
                $scope.itemData = paradisec.itemData;
            } else if (conf.deployment === 'esrc') {
            } else if (conf.deployment === 'alveo') {
            } else {
                $log.error("MainCtrl: unknown project", conf.deployment)
            }
      });
  }]);
