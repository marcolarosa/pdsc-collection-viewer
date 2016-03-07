'use strict';

angular.module('pdsc')
  .controller('MainCtrl', [ 
    '$scope', 
    '$log', 
    '$routeParams', 
    'configuration', 
    'paradisec',
    function ($scope, $log, $routeParams, conf, paradisec) {
        $scope.showItemInformation = false;
        $scope.levelup = false;

        $log.debug("MainCtrl: $routeParams", $routeParams);
        var collectionId    = _.has($routeParams, 'collectionId') ? $routeParams.collectionId : undefined;
        var itemId          = _.has($routeParams, 'itemId')       ? $routeParams.itemId       : undefined;
        $scope.instanceId   = _.has($routeParams, 'itemInstance') ? $routeParams.itemInstance : undefined;
        $log.debug("MainCtrl: project:", conf.deployment, "and collectionId:", collectionId, "and itemId:", itemId);

        if (collectionId && itemId) {
            if (conf.deployment === 'paradisec') {
                var d = paradisec.getItem('paradisec', collectionId, itemId);
                d.then(function(resp) {
                    $scope.itemData = resp;
                    $scope.whichViewer($scope.itemData);
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

        // determine which viewer to load based on the route configuration
        $scope.whichViewer = function(data) {
            // is a specific instance defined? if so, use this to determine which
            //  viewer to load.
            if ($scope.instanceId) {
                // is it an image?
                if (! _.isEmpty(data.images)) {
                    var m = _.filter(data.images, function(d) {
                        return d.match($scope.instanceId);
                    })

                    if (!_.isEmpty(m)) { 
                        // blank off the others - we're focussing just on this one item
                        data.documents = [];
                        data.audio = [];
                        data.video = [];
                        $scope.loadViewer('images', true);
                    }
                }

                // is it a document?
                if (! _.isEmpty(data.documents)) {
                    var m = _.filter(data.documents, function(d) {
                        return d.match($scope.instanceId);
                    })

                    if (!_.isEmpty(m)) {
                        // blank off the others - we're focussing just on this one item
                        data.images = [];
                        data.audio = [];
                        data.video = [];
                        $scope.loadViewer('documents', true);
                    }
                }

                // is it an audio file?
                if (! _.isEmpty(data.audio)) {
                    var m = _.filter(data.audio, function(d,k) {
                        return k.match($scope.instanceId);
                    })

                    if (!_.isEmpty(m)) {
                        // blank off the others - we're focussing just on this one item
                        data.images = [];
                        data.documents = [];
                        data.video = [];
                        $scope.loadViewer('media', true);
                    }
                }

                // is it a video file?
                if (! _.isEmpty(data.video)) {
                    var m = _.filter(data.video, function(d, k) {
                        return k.match($scope.instanceId);
                    })

                    if (!_.isEmpty(m)) {
                        // blank off the others - we're focussing just on this one item
                        data.images = [];
                        data.documents = [];
                        data.audio = [];
                        $scope.loadViewer('media', true);
                    }
                }

                // we're focussed in on one specific item so enable the level up toggle
                $scope.levelup = '#/' + collectionId + '/' + itemId;
            } else {

                //  Otherwise - images > documents > media
                if (! _.isEmpty(data.images)) {
                    $scope.loadViewer('images');
                } else if (! _.isEmpty(data.documents)) {
                    $scope.loadViewer('documents');
                } else {
                    $scope.loadViewer('media');
                }
            }
        }

        // load an appropriate viewer
        $scope.loadViewer = function(dataType, specificInstanceLoaded) {
            // some of the viewers need to know the header height so they
            //  can size themselves accordingly
            $scope.headerHeight = document.getElementById('header').clientHeight;

            // always ditch info when loading a viewer
            $scope.showItemInformation = false;

            // now load the required viewer
            if (dataType === 'images') {
                $scope.loadImageViewer = true;
                $scope.loadMediaPlayer = false;
                $scope.loadDocumentViewer = false;
            } else if (dataType === 'documents') {
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
