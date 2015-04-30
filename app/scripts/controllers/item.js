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

        var project    = _.has($routeParams, 'project')    ? $routeParams.project    : undefined;
        var itemId     = _.has($routeParams, 'itemId')     ? $routeParams.itemId     : undefined;
        var instanceId = _.has($routeParams, 'instanceId') ? $routeParams.instanceId : undefined;
        $log.debug("ItemCtrl: project and itemId", project, itemId);

        if (project && itemId) {
            if (project === 'paradisec') {
                paradisec.getItem(project, itemId);
            } else if (project === 'esrc') {
            } else if (project === 'alveo') {
            } else {
                $log.error("ItemCtrl: unknown project", project)
            }
        } else {
            $log.debug("ItemCtrl: unknown datasource");
        }
      
  }]);
