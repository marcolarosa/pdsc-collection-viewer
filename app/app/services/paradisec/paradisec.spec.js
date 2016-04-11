'use strict';

var paradisec, td, $httpBackend, itemData;

var setup = function(collectionId, itemId, extraData) {
  // load the service's module
  beforeEach(module('pdsc'));

  // instantiate service
  beforeEach(inject(function (_paradisec_, _xmlData_, _$httpBackend_) {
    paradisec = _paradisec_;
    td = _xmlData_;
    $httpBackend = _$httpBackend_;

    var host = 'http://catalog.paradisec.org.au';
    var path = '/oai/item?verb=GetRecord&identifier=oai:paradisec.org.au:' + collectionId + '-' + itemId + '&metadataPrefix=olac';
    var url = host + path;
    $httpBackend.whenGET(url).respond(td[collectionId][itemId]);
    $httpBackend.expectGET(url);

    if (extraData) {
        var path = '/repository/' + collectionId + '/' + itemId + '/' + extraData;
        var url = host + path;
        $httpBackend.whenGET(url).respond(td.eaf[collectionId][itemId]);
        $httpBackend.expectGET(url);
    }
    itemData = paradisec.getItem(collectionId, itemId);
    $httpBackend.flush();
    itemData = itemData["$$state"].value;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
}

describe('Service: paradisec', function () {
  it('images - should return a JSON object with the data', function() {
      setup('AC2', 'VUNU105');
      expect(itemData).toBeDefined();
  });
  it('images - should return a JSON object with the data', function() {
      setup('AC2', 'ETHGS102');
      expect(itemData).toBeDefined();
  });
  it('audio - should return a JSON object with the data', function() {
      setup('AA2', '003');
      expect(itemData).toBeDefined();
  });
  it('video - should return a JSON object with the data', function() {
      setup('NT5', 'DickLauto');
      expect(itemData).toBeDefined();
  });
  it('audio + eaf - should return a JSON object with the data', function() {
      setup('NT10', 'W13', 'NT10-W13-A.eaf');
      expect(itemData).toBeDefined();
      expect(itemData.eaf).toBeDefined();
  });
  it('should return nothing', function() {
      setup('AC2', 'VUNUN105');
      expect(itemData).toBe('');
  });

});
