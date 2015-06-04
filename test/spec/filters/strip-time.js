'use strict';

describe('Filter: stripTime', function () {

  // load the filter's module
  beforeEach(module('pdscApp'));

  // initialize a new instance of the filter before each test
  var stripTime;
  beforeEach(inject(function ($filter) {
    stripTime = $filter('stripTime');
  }));

  it('should return the input prefixed with "stripTime filter:"', function () {
    var text = 'angularjs';
    expect(stripTime(text)).toBe('stripTime filter: ' + text);
  });

});
