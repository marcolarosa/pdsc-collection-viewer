'use strict';

/**
 * @ngdoc function
 * @name pdscApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pdscApp
 */
angular.module('pdscApp')
  .controller('MainCtrl', [ '$scope', '$log', '$routeParams', 'configuration', 'paradisec',
    function ($scope, $log, $routeParams, conf, paradisec) {
        $scope.loadImageViewer = false;

        $log.debug("MainCtrl: $routeParams", $routeParams);
        var collectionId = _.has($routeParams, 'collectionId') ? $routeParams.collectionId : undefined;
        var itemId       = _.has($routeParams, 'itemId')       ? $routeParams.itemId       : undefined;
        var instanceId   = _.has($routeParams, 'itemInstance') ? $routeParams.itemInstance : '1';
        $log.debug("MainCtrl: project:", conf.deployment, "and collectionId:", collectionId, "and itemId:", itemId);

        if (collectionId && itemId) {
            if (conf.deployment === 'paradisec') {
                var d = paradisec.getItem('paradisec', collectionId, itemId);
                d.then(function(resp) {
                    if (!_.isEmpty(resp.images)) {
                        $scope.loadImageViewer = true;
                        $scope.itemData = resp;
                        $scope.instanceId = instanceId;
                    }
                });

            } else if (conf.deployment === 'esrc') {
            } else if (conf.deployment === 'alveo') {
            } else {
                $log.error("MainCtrl: unknown project", conf.deployment)
            }
        } else {
            $log.debug("MainCtrl: unknown datasource");
        }
  }]);
