'use strict';

describe('Directive: timeUpdate', function () {

  // load the directive's module
  beforeEach(module('pdscApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<time-update></time-update>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the timeUpdate directive');
  }));
});
