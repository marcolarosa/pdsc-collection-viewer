'use strict';

describe('Controller: MainCtrl', function () {
  var $controller, $scope, $routeParams, configuration;

  beforeEach(module('pdsc'));

  beforeEach(inject(function (
    _$controller_, _$rootScope_, _$log_, _$routeParams_, _configuration_, _paradisec_, _
  ) {
      $controller = _$controller_;
      $scope = _$rootScope_;
      $routeParams = _$routeParams_;
      configuration = _configuration_;

      $routeParams.collectionId = 'AC2';
      $routeParams.itemId = 'VUNU105';
      $controller('MainCtrl', { 
          '$scope': $scope,
          '$log': _$log_,
          '$routeParams': $routeParams,
          'configuration': configuration,
          'paradisec': _paradisec_,
          '_': _
      });

  }));
  it('should set the collection and item id\'s on the scope', function() {
      expect($scope.collectionId).toBe($routeParams.collectionId);
      expect($scope.itemId).toBe($routeParams.itemId);
  });
  it('should get the correct data for the item', function() {
      console.log($scope.itemData);
  });

});
