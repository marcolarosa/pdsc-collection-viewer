'use strict';

describe('Service: paradisec', function () {

  // load the service's module
  beforeEach(module('pdscApp'));

  // instantiate service
  var paradisec;
  beforeEach(inject(function (_paradisec_) {
    paradisec = _paradisec_;
  }));

  it('should do something', function () {
    expect(!!paradisec).toBe(true);
  });

});
