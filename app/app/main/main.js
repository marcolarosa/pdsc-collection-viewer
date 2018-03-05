'use strict';

module.exports = {
  template: require('./main.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  'Scope',
  '$log',
  '$routeParams',
  'configuration',
  'paradisec',
  'lodash',
  '$mdSidenav'
];

function Controller(
  $scope,
  $log,
  $routeParams,
  configuration,
  paradisec,
  lodash,
  $mdSidenav
) {
  console.log('init');
}

// angular.module('pdsc')
//   .controller('MainCtrl', [
//     '$scope',
//     '$log',
//     '$routeParams',
//     'configuration',
//     'paradisec',
//     '_',
//     '$mdSidenav',
//     function ($scope, $log, $routeParams, conf, paradisec, _, $mdSidenav) {
//         $scope.showItemInformation = false;
//         $scope.levelup = false;
//
//         $log.debug('MainCtrl: $routeParams', $routeParams);
//         $scope.collectionId = _.has($routeParams, 'collectionId') ? $routeParams.collectionId : undefined;
//         $scope.itemId       = _.has($routeParams, 'itemId')       ? $routeParams.itemId       : undefined;
//         $scope.instanceId   = _.has($routeParams, 'itemInstance') ? $routeParams.itemInstance : undefined;
//         $log.debug('MainCtrl: ', $scope.collectionId, ' ::: ', $scope.itemId, ' ::: ', $scope.instanceId);
//
//         if ($scope.collectionId && $scope.itemId) {
//             var d = paradisec.getItem($scope.collectionId, $scope.itemId);
//             d.then(function(resp) {
//                 $scope.itemData = resp;
//                 $scope.whichViewer();
//             });
//         } else {
//             $log.debug('MainCtrl: unknown datasource');
//         }
//
//         // show / hide item information panel
//         $scope.toggleItemInformation = function() {
//             $mdSidenav('left').toggle();
//         };
//
//         var filter = function(what) {
//             if (_.isPlainObject(what)) {
//                 var values = _.map(what, function(d) {
//                     return d;
//                 });
//                 what = _.flatten(values);
//             }
//             var m = _.filter(what, function(d) {
//                 return d.match($scope.instanceId);
//             });
//             if (_.isEmpty(m)) {
//                 return false;
//             } else {
//                 return true;
//             }
//         };
//
//         // determine which viewer to load based on the route configuration
//         $scope.whichViewer = function() {
//             // is a specific instance defined? if so, use this to determine which
//             //  viewer to load.
//             if ($scope.instanceId) {
//                 if (filter($scope.itemData.images)) {
//                     $scope.itemData.documents = [];
//                     $scope.itemData.audio = [];
//                     $scope.itemData.video = [];
//                     $scope.loadViewer('images');
//                 } else if (filter($scope.itemData.documents)) {
//                     $scope.itemData.images = [];
//                     $scope.itemData.audio = [];
//                     $scope.itemData.video = [];
//                     $scope.loadViewer('documents');
//                 } else if (filter($scope.itemData.audio)) {
//                     $scope.itemData.images = [];
//                     $scope.itemData.documents = [];
//                     $scope.itemData.video = [];
//                     $scope.loadViewer('media');
//                 } else if (filter($scope.itemData.video)) {
//                     $scope.itemData.images = [];
//                     $scope.itemData.documents = [];
//                     $scope.itemData.audio = [];
//                     $scope.loadViewer('media');
//                 }
//
//                 // we're focussed in on one specific item so enable the level up toggle
//                 $scope.levelup = '#/' + $scope.collectionId + '/' + $scope.itemId;
//             } else {
//                 //  Otherwise - images > documents > media
//                 if (! _.isEmpty($scope.itemData.images)) {
//                     $scope.loadViewer('images');
//                 } else if (! _.isEmpty($scope.itemData.documents)) {
//                     $scope.loadViewer('documents');
//                 } else {
//                     $scope.loadViewer('media');
//                 }
//             }
//         };
//
//         // load an appropriate viewer
//         $scope.loadViewer = function(dataType) {
//             // some of the viewers need to know the header height so they
//             //  can size themselves accordingly
//             //$scope.headerHeight = document.getElementById('header').clientHeight;
//
//             // always ditch info when loading a viewer
//             $scope.showItemInformation = false;
//
//             // now load the required viewer
//             if (dataType === 'images') {
//                 $scope.loadImageViewer = true;
//                 $scope.loadMediaPlayer = false;
//                 $scope.loadDocumentViewer = false;
//             } else if (dataType === 'documents') {
//                 $scope.loadImageViewer = false;
//                 $scope.loadMediaPlayer = false;
//                 $scope.loadDocumentViewer = true;
//             } else if (dataType === 'media') {
//                 $scope.loadImageViewer = false;
//                 $scope.loadMediaPlayer = true;
//                 $scope.loadDocumentViewer = false;
//             }
//         };
//   }]);
