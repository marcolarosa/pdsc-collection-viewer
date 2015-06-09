'use strict';

describe('Controller: MetadataCtrl', function () {

  // load the controller's module
  beforeEach(module('pdscApp'));

  var MetadataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetadataCtrl = $controller('MetadataCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
