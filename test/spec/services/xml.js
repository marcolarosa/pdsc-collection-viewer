'use strict';

describe('Service: xml', function () {

  // load the service's module
  beforeEach(module('pdscApp'));

  // instantiate service
  var xml;
  beforeEach(inject(function (_xml_) {
    xml = _xml_;
  }));

  it('should do something', function () {
    expect(!!xml).toBe(true);
  });

});
