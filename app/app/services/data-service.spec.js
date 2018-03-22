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

describe('Service: paradisec - test single image item', function () {
    setup('AC2', 'VUNU105');
    it('image - should return a JSON object with the data', function() {
        expect(itemData).toBeDefined();
    });
});

describe('Service: paradisec - test multi image item', function () {
    setup('AC2', 'ETHGS102');
    it('images - should return a JSON object with the data', function() {
        expect(itemData).toBeDefined();
    });
});

describe('Service: paradisec - test audio item', function () {
    setup('AA2', '003');
    it('audio - should return a JSON object with the data', function() {
        expect(itemData).toBeDefined();
    });
});

describe('Service: paradisec - test video item', function () {
    setup('NT5', 'DickLauto');
    it('video - should return a JSON object with the data', function() {
        expect(itemData).toBeDefined();
    });
});

describe('Service: paradisec - test audio + eaf', function () {
    setup('NT10', 'W13', 'NT10-W13-A.eaf');
    it('audio + eaf - should return a JSON object with the data', function() {
        expect(itemData).toBeDefined();
        expect(itemData.eaf).toBeDefined();
    });
});

describe('Service: paradisec - test audio + trs', function () {
    setup('BN1', '001', 'BN1-001-A.trs');
    it('audio + trs - should return a JSON object with the data', function() {
        expect(itemData).toBeDefined();
        expect(itemData.trs).toBeDefined();
    });
});

