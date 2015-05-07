'use strict';

/**
 * @ngdoc function
 * @name pdscApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the pdscApp
 */
angular.module('pdscApp')
  .controller('ItemCtrl', [ '$scope', '$log', '$routeParams', 'paradisec',
    function ($scope, $log, $routeParams, paradisec) {

        $log.debug("ItemCtrl: $routeParams", $routeParams);
        var project      = _.has($routeParams, 'project')      ? $routeParams.project      : undefined;
        var collectionId = _.has($routeParams, 'collectionId') ? $routeParams.collectionId : undefined;
        var itemId       = _.has($routeParams, 'itemId')       ? $routeParams.itemId       : undefined;
        var instanceId   = _.has($routeParams, 'itemInstance') ? $routeParams.itemInstance : '1';
        $log.debug("ItemCtrl: project:", project, "and collectionId:", collectionId, "and itemId:", itemId);

        if (project && collectionId && itemId) {
            if (project === 'paradisec') {
                var d = paradisec.getItem(project, collectionId, itemId);
                d.then(function(resp) { 
                    $scope.itemData = resp; 
                    $scope.instanceId = instanceId;
                });

            } else if (project === 'esrc') {
            } else if (project === 'alveo') {
            } else {
                $log.error("ItemCtrl: unknown project", project)
            }
        } else {
            $log.debug("ItemCtrl: unknown datasource");
        }
      

  }]);
