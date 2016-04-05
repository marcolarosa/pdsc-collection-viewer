'use strict';

describe('Service: supporters', function () {

  // load the service's module
  beforeEach(module('pdsc'));

  // instantiate service
  var xmlToJson, doc, json;
  beforeEach(inject(function (_xmlToJson_) {
    xmlToJson = _xmlToJson_;

    doc = "<element>" + 
          "    <child>" +
          "       <second text='something'>value</second>" +
          "    </child>" +
          "</element>";

    json = xmlToJson.convert(doc);
  }));

  it('should do something', function() {
      console.log(json);
  });



});
