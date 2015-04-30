'use strict';

describe('Controller: CollectionCtrl', function () {

  // load the controller's module
  beforeEach(module('pdscApp'));

  var CollectionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CollectionCtrl = $controller('CollectionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
