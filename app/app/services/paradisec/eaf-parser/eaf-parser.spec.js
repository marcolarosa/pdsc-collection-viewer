'use strict';

var paradisec, eaf, td, $httpBackend, itemData;

var setup = function(collectionId, itemId, extraData) {
  // load the service's module
  beforeEach(module('pdsc'));

  // instantiate service
  beforeEach(inject(function (_paradisec_, _eafParser_, _xmlData_, _$httpBackend_) {
    paradisec = _paradisec_;
    eaf = _eafParser_;
    td = _xmlData_;
    $httpBackend = _$httpBackend_;

    var host = 'http://catalog.paradisec.org.au';
    var path = '/oai/item?verb=GetRecord&identifier=oai:paradisec.org.au:' + collectionId + '-' + itemId + '&metadataPrefix=olac';
    var url = host + path;
    $httpBackend.whenGET(url).respond(td[collectionId][itemId]);
    $httpBackend.expectGET(url);

    if (extraData) {
        path = '/repository/' + collectionId + '/' + itemId + '/' + extraData;
        url = host + path;
        $httpBackend.whenGET(url).respond(td.eaf[collectionId][itemId]);
        $httpBackend.expectGET(url);
    }
    itemData = paradisec.getItem(collectionId, itemId);
    $httpBackend.flush();
    itemData = itemData.$$state.value;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
};

describe('Service: eaf-parser', function () {
  setup('AC2', 'VUNUN105');
  it('should return nothing', function() {
      expect(itemData).toBe('');
  });
});
