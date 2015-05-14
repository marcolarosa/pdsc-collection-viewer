'use strict';

describe('Filter: trustAsHtml', function () {

  // load the filter's module
  beforeEach(module('pdscApp'));

  // initialize a new instance of the filter before each test
  var trustAsHtml;
  beforeEach(inject(function ($filter) {
    trustAsHtml = $filter('trustAsHtml');
  }));

  it('should return the input prefixed with "trustAsHtml filter:"', function () {
    var text = 'angularjs';
    expect(trustAsHtml(text)).toBe('trustAsHtml filter: ' + text);
  });

});
