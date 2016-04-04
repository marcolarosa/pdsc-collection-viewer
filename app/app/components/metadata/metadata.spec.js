'use strict';

var $controller, $rootScope, $scope, paradisec, configuration, data;
function setup() {
      beforeEach(module('pdsc'));
      beforeEach(inject(function (
        _$controller_, _$rootScope_, _configuration_, _paradisec_, _data_
      ) {
          $controller = _$controller_;
          $rootScope = _$rootScope_;
          $scope = _$rootScope_;
          paradisec = _paradisec_;
          configuration = _configuration_;
          data = _data_;

          $controller('MetadataCtrl', { 
              '$rootScope': $rootScope,
              '$scope': $scope,
              'configuration': configuration,
              'paradisec': paradisec,
          });
      }));

      afterEach(function() {
      });
}

describe('Controller: MetadataCtrl', function () {

  describe('test setting the data on the scope', function() {
      setup();

      it('should should set the data on the scope', function() {
          paradisec.itemData = data.AC2['1'];
          $rootScope.$broadcast('item-data-ready');
          expect($scope.itemData).toBe(paradisec.itemData);
      });
  });

});
