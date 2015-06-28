'use strict';

describe('Directive: videoElement', function () {

  // load the directive's module
  beforeEach(module('pdscApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<video-element></video-element>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the videoElement directive');
  }));
});
