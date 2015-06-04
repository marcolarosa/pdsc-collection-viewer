'use strict';

describe('Filter: extension', function () {

  // load the filter's module
  beforeEach(module('pdscApp'));

  // initialize a new instance of the filter before each test
  var extension;
  beforeEach(inject(function ($filter) {
    extension = $filter('extension');
  }));

  it('should return the input prefixed with "extension filter:"', function () {
    var text = 'angularjs';
    expect(extension(text)).toBe('extension filter: ' + text);
  });

});
