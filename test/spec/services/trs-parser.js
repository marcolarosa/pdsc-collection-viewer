'use strict';

describe('Service: trsParser', function () {

  // load the service's module
  beforeEach(module('pdscApp'));

  // instantiate service
  var trsParser;
  beforeEach(inject(function (_trsParser_) {
    trsParser = _trsParser_;
  }));

  it('should do something', function () {
    expect(!!trsParser).toBe(true);
  });

});
