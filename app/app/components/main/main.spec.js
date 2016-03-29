'use strict';

var $controller, $scope, $routeParams, $log, paradisec, configuration, data;
function setup(collectionId, itemId, instanceId) {
      beforeEach(module('pdsc'));
      beforeEach(inject(function (
        _$controller_, _$rootScope_, _$log_, _configuration_, _paradisec_, _, _data_, _$routeParams_
      ) {
          $controller = _$controller_;
          $scope = _$rootScope_;
          $routeParams = _$routeParams_;
          $log = _$log_; 
          paradisec = _paradisec_;
          configuration = _configuration_;
          data = _data_;

          $routeParams.collectionId = collectionId;
          $routeParams.itemId = itemId;
          $routeParams.itemInstance = instanceId;

          $controller('MainCtrl', { 
              '$scope': $scope,
              '$log': $log,
              '$routeParams': $routeParams,
              'configuration': configuration,
              'paradisec': paradisec,
              '_': _
          });
          $scope.itemData = data[collectionId][itemId];
      }));

      afterEach(function() {
      });
}

describe('Controller: MainCtrl', function () {

  describe('test imageviewer loading', function() {
      setup('AC2', '1');
      it('should select the image viewer', function() {
          $scope.whichViewer();
          expect($scope.loadImageViewer).toBe(true);
      });
  });

  describe('test media player loading', function() {
      setup('AC2', '2');
      it('should select the media player for audio data', function() {
          $scope.whichViewer();
          expect($scope.loadMediaPlayer).toBe(true);
      });
  });
  describe('test media player loading', function() {
      setup('AC2', '4');
      it('should select the media player for video data', function() {
          $scope.whichViewer();
          expect($scope.loadMediaPlayer).toBe(true);
      });
  });

  describe('test document loading', function() {
      setup('AC2', '3');
      it('should select the document viewer', function() {
          $scope.whichViewer();
          expect($scope.loadDocumentViewer).toBe(true);
      });
  });

  describe('test loading a specific image', function() {
      setup('AC2', '1', 'AC2-1-001');
      it('should load the image viewer', function() {
          $scope.whichViewer();
          expect($scope.loadImageViewer).toBe(true);
      })
  });

  describe('test loading a specific document', function() {
      setup('AC2', '3', 'AC2-3-001');
      it('should load the document viewer', function() {
          $scope.whichViewer();
          expect($scope.loadDocumentViewer).toBe(true);
      })
  });

  describe('test loading a specific audio item', function() {
      setup('AC2', '2', 'AC2-2-001');
      it('should load the media player', function() {
          $scope.whichViewer();
          expect($scope.loadMediaPlayer).toBe(true);
      })
  });

  describe('test loading a specific video item', function() {
      setup('AC2', '4', 'AC2-4-001');
      it('should load the media player', function() {
          $scope.whichViewer();
          expect($scope.loadMediaPlayer).toBe(true);
      })
  });

  describe('generic tests', function() {
      setup('AC2', '1');
      it('should set the collection and item id\'s on the scope', function() {
          expect($scope.collectionId).toBe($routeParams.collectionId);
          expect($scope.itemId).toBe($routeParams.itemId);
      });

      it('should have item information hidden', function() {
          expect($scope.showItemInformation).toBe(false);
      })
      it('should show item information ', function() {
          $scope.toggleItemInformation();
          expect($scope.showItemInformation).toBe(true);
      })
  });





});
