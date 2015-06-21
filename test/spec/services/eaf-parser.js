'use strict';

describe('Service: eafParser', function () {

  // load the service's module
  beforeEach(module('pdscApp'));

  // instantiate service
  var eafParser;
  beforeEach(inject(function (_eafParser_) {
    eafParser = _eafParser_;
  }));

  it('should do something', function () {
    expect(!!eafParser).toBe(true);
  });

});
