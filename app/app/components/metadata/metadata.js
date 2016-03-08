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
            if (conf.deployment === 'paradisec') {
                $scope.itemData = paradisec.itemData;
            } else if (conf.deployment === 'esrc') {
            } else if (conf.deployment === 'alveo') {
            } else {
                $log.error('MainCtrl: unknown project', conf.deployment);
            }
      });
  }]);
