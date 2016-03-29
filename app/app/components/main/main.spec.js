'use strict';

var $controller, $scope, $routeParams, $log, paradisec, configuration, data;
function setup(collectionId, itemId) {
      beforeEach(module('pdsc'));
      beforeEach(inject(function (
        _$controller_, _$rootScope_, _$log_, _configuration_, _paradisec_, _, _data_
      ) {
          $controller = _$controller_;
          $scope = _$rootScope_;
          $routeParams = {};
          $log = _$log_; 
          paradisec = _paradisec_;
          configuration = _configuration_;
          data = _data_;

          $scope.itemData = data[collectionId][itemId];
          $controller('MainCtrl', { 
              '$scope': $scope,
              '$log': $log,
              '$routeParams': $routeParams,
              'configuration': configuration,
              'paradisec': paradisec,
              '_': _
          });
      }));
}

describe('Controller: MainCtrl', function () {

  describe('test imageviewer loading', function() {
      setup('AC2', 'VUNU105');
      it('should set the collection and item id\'s on the scope', function() {
          expect($scope.collectionId).toBe($routeParams.collectionId);
          expect($scope.itemId).toBe($routeParams.itemId);
      });
      it('should select the image viewer', function() {
          $scope.whichViewer();
          expect($scope.loadImageViewer).toBe(true);
      });
  });

  describe('test media player loading', function() {
      setup('AA2', '003');
      it('should select the media player', function() {
          $scope.whichViewer();
          expect($scope.loadMediaPlayer).toBe(true);
      });

  });


});
