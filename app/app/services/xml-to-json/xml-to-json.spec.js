'use strict';

describe('Service: xml-to-json', function () {

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

    var parser = new DOMParser();
    var xmldoc = parser.parseFromString(doc, 'text/xml');
    json = xmlToJson.convert(xmldoc);
  }));

  it('should parse into a json object', function() {
      expect(json).toBeDefined();
  });

  it('should have a root element called element', function() {
      expect(json.element).toBeDefined();
  });

  it('should have have sub sub element', function() {
      expect(json.element.child.second).toBeDefined();
      expect(json.element.child.second['@attributes'].text).toBe('something');
  });

});
