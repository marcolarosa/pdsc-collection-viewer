'use strict';

describe('Service: authenticator', function () {

  // load the service's module
  beforeEach(module('pdscApp'));

  // instantiate service
  var authenticator;
  beforeEach(inject(function (_authenticator_) {
    authenticator = _authenticator_;
  }));

  it('should do something', function () {
    expect(!!authenticator).toBe(true);
  });

});
