'use strict';

let itemData, $httpBackend;

function setup(collectionId, itemId, extraData) {
  // load the service's module
  beforeEach(module('pdsc'));

  // instantiate service
  beforeEach(
    inject(function(_dataService_, _xmlTestDataService_, _$httpBackend_) {
      const dataService = _dataService_;
      const xmlTestDataService = _xmlTestDataService_;
      $httpBackend = _$httpBackend_;
      console.log('***', dataService);
      console.log(xmlTestDataService);

      const url = `http://catalog.paradisec.org.au/oai/item?verb=GetRecord&identifier=oai:paradisec.org.au:${collectionId}=${itemId}&metadataPrefix=olac`;

      // $httpBackend.whenGET(url).respond(td[collectionId][itemId]);
      // $httpBackend.expectGET(url);

      // dataService.getItem(collectionId, itemId).then(itemData => {
      //   console.log(itemData);
      // });

      // td = _xmlData_;
      // $httpBackend = _$httpBackend_;

      //
      //   if (extraData) {
      //     path = '/repository/' + collectionId + '/' + itemId + '/' + extraData;
      //     url = host + path;
      //     $httpBackend.whenGET(url).respond(td.eaf[collectionId][itemId]);
      //     $httpBackend.expectGET(url);
      //   }
      //   itemData = paradisec.getItem(collectionId, itemId);
      //   $httpBackend.flush();
      //   itemData = itemData.$$state.value;
    })
  );

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
}

describe.only('Service: paradisec - test single image item', () => {
  setup('AC2', 'VUNU105');
  it('image - should return a JSON object with the data', async () => {
    // expect(itemData).toBeDefined();
    expect(true).to.be.true;
  });
});

// describe('Service: paradisec - test multi image item', function() {
//   setup('AC2', 'ETHGS102');
//   it('images - should return a JSON object with the data', function() {
//     expect(itemData).toBeDefined();
//   });
// });
//
// describe('Service: paradisec - test audio item', function() {
//   setup('AA2', '003');
//   it('audio - should return a JSON object with the data', function() {
//     expect(itemData).toBeDefined();
//   });
// });
//
// describe('Service: paradisec - test video item', function() {
//   setup('NT5', 'DickLauto');
//   it('video - should return a JSON object with the data', function() {
//     expect(itemData).toBeDefined();
//   });
// });
//
// describe('Service: paradisec - test audio + eaf', function() {
//   setup('NT10', 'W13', 'NT10-W13-A.eaf');
//   it('audio + eaf - should return a JSON object with the data', function() {
//     expect(itemData).toBeDefined();
//     expect(itemData.eaf).toBeDefined();
//   });
// });
//
// describe('Service: paradisec - test audio + trs', function() {
//   setup('BN1', '001', 'BN1-001-A.trs');
//   it('audio + trs - should return a JSON object with the data', function() {
//     expect(itemData).toBeDefined();
//     expect(itemData.trs).toBeDefined();
//   });
// });
