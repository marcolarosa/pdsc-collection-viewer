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
        $scope.showItemInformation = false;

        $log.debug("MainCtrl: $routeParams", $routeParams);
        var collectionId = _.has($routeParams, 'collectionId') ? $routeParams.collectionId : undefined;
        var itemId       = _.has($routeParams, 'itemId')       ? $routeParams.itemId       : undefined;
        var instanceId   = _.has($routeParams, 'itemInstance') ? $routeParams.itemInstance : '1';
        $log.debug("MainCtrl: project:", conf.deployment, "and collectionId:", collectionId, "and itemId:", itemId);

        if (collectionId && itemId) {
            if (conf.deployment === 'paradisec') {
                var d = paradisec.getItem('paradisec', collectionId, itemId);
                d.then(function(resp) {
                    $scope.itemData = resp;
                    if (! _.isEmpty(resp.images)) {
                        $scope.loadViewer('images');
                    } else if (! _.isEmpty(resp.documents)) {
                        $scope.loadViewer('documents');
                    } else {
                        $scope.loadViewer('media');
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

        // show / hide item information panel
        $scope.toggleItemInformation = function() {
            $scope.showItemInformation = ! $scope.showItemInformation;
        }

        // toggle an appropriate viewer
        $scope.loadViewer = function(dataType) {
            // always ditch info when loading a viewer
            $scope.showItemInformation = false;

            // now load the required viewer
            if (dataType === 'images') {
                $scope.headerHeight = document.getElementById('header').clientHeight;
                $scope.loadImageViewer = true;
                $scope.loadMediaPlayer = false;
                $scope.loadDocumentViewer = false;
            } else if (dataType === 'documents') {
                $scope.headerHeight = document.getElementById('header').clientHeight;
                $scope.loadImageViewer = false;
                $scope.loadMediaPlayer = false;
                $scope.loadDocumentViewer = true;
            } else if (dataType === 'media') {
                $scope.loadImageViewer = false;
                $scope.loadMediaPlayer = true;
                $scope.loadDocumentViewer = false;
            }
        }

  }]);
