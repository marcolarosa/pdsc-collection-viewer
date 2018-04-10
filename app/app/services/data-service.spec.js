'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
const expect = chai.expect;

const itemDataSchema = require('./schema/item-data.schema');
let itemData, $httpBackend;

describe('Data Service test OLAC feed processing - ', () => {
  function setup(collectionId, itemId) {
    angular.mock.module('pdsc');
    angular.mock.inject(function(
      _dataService_,
      _xmlTestDataService_,
      _$httpBackend_
    ) {
      const dataService = _dataService_;
      const xmlTestDataService = _xmlTestDataService_;
      $httpBackend = _$httpBackend_;

      let url = `http://catalog.paradisec.org.au/oai/item`;
      url += `?verb=GetRecord&identifier=oai:paradisec.org.au:`;
      url += `${collectionId}-${itemId}&metadataPrefix=olac`;

      const datafile = `${collectionId}-${itemId}.xml`;
      $httpBackend.whenGET(url).respond(xmlTestDataService[datafile]);
      $httpBackend.expectGET(url);

      dataService
        .getItem(collectionId, itemId)
        .then(response => (itemData = response));

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  }

  function verifyItemDataStructure() {
    expect(itemData).to.be.jsonSchema(itemDataSchema);
  }

  it('should process AA2-003 correctly', async () => {
    await setup('AA2', '003');
    // console.log(JSON.stringify(itemData, null, 2));
    verifyItemDataStructure();
    expect(itemData.collectionId).to.equal('AA2');
    expect(itemData.itemId).to.equal('003');
    expect(itemData.images.length).to.equal(0);
    expect(itemData.thumbnails.length).to.equal(0);
    expect(itemData.documents.length).to.equal(0);
    expect(itemData.media.length).to.equal(2);
    expect(itemData.transcriptions.length).to.equal(0);
    expect(itemData.media.map(m => m.name)).to.deep.equal([
      'AA2-003-A',
      'AA2-003-B'
    ]);
  });

  it('should process AC1-013 correctly', async () => {
    await setup('AC1', '013');
    // console.log(JSON.stringify(itemData, null, 2));
    verifyItemDataStructure();
    expect(itemData.collectionId).to.equal('AC1');
    expect(itemData.itemId).to.equal('013');
    expect(itemData.images.length).to.equal(3);
    expect(itemData.thumbnails.length).to.equal(3);
    expect(itemData.documents.length).to.equal(0);
    expect(itemData.media.length).to.equal(2);
    expect(itemData.transcriptions.length).to.equal(1);
    expect(itemData.media.map(m => m.name)).to.deep.equal([
      'AC1-013-A',
      'AC1-013-B'
    ]);
  });

  it('should process AC2-VUNU105 correctly', async () => {
    await setup('AC2', 'VUNU105');
    // console.log(JSON.stringify(itemData, null, 2));
    verifyItemDataStructure();
    expect(itemData.collectionId).to.equal('AC2');
    expect(itemData.itemId).to.equal('VUNU105');
    expect(itemData.images.length).to.equal(1);
    expect(itemData.thumbnails.length).to.equal(1);
    expect(itemData.documents.length).to.equal(1);
    expect(itemData.media.length).to.equal(0);
    expect(itemData.transcriptions.length).to.equal(0);
  });

  it('should process BN1-001 correctly', async () => {
    await setup('BN1', '001');
    // console.log(JSON.stringify(itemData, null, 2));
    verifyItemDataStructure();
    expect(itemData.collectionId).to.equal('BN1');
    expect(itemData.itemId).to.equal('001');
    expect(itemData.images.length).to.equal(0);
    expect(itemData.thumbnails.length).to.equal(0);
    expect(itemData.documents.length).to.equal(0);
    expect(itemData.media.length).to.equal(1);
    expect(itemData.transcriptions.length).to.equal(1);
  });

  it('should process NT1-98007 correctly', async () => {
    await setup('NT1', '98007');
    // console.log(JSON.stringify(itemData, null, 2));
    verifyItemDataStructure();
    expect(itemData.collectionId).to.equal('NT1');
    expect(itemData.itemId).to.equal('98007');
    expect(itemData.images.length).to.equal(31);
    expect(itemData.thumbnails.length).to.equal(31);
    expect(itemData.documents.length).to.equal(0);
    expect(itemData.media.length).to.equal(2);
    expect(itemData.transcriptions.length).to.equal(6);
    expect(itemData.media.map(m => m.type)).to.deep.equal(['audio', 'audio']);
  });

  it('should process NT5-DickLauto correctly', async () => {
    await setup('NT5', 'DickLauto');
    // console.log(JSON.stringify(itemData, null, 2));
    verifyItemDataStructure();
    expect(itemData.collectionId).to.equal('NT5');
    expect(itemData.itemId).to.equal('DickLauto');
    expect(itemData.images.length).to.equal(0);
    expect(itemData.thumbnails.length).to.equal(0);
    expect(itemData.documents.length).to.equal(0);
    expect(itemData.media.length).to.equal(1);
    expect(itemData.transcriptions.length).to.equal(0);
    expect(itemData.media.map(m => m.type)).to.deep.equal(['video']);
    expect(itemData.media[0].name).to.equal('NT5-DickLauto-Vid2');
  });

  it('should process NT10-W13 correctly', async () => {
    await setup('NT10', 'W13');
    // console.log(JSON.stringify(itemData, null, 2));
    verifyItemDataStructure();
    expect(itemData.collectionId).to.equal('NT10');
    expect(itemData.itemId).to.equal('W13');
    expect(itemData.images.length).to.equal(0);
    expect(itemData.thumbnails.length).to.equal(0);
    expect(itemData.documents.length).to.equal(0);
    expect(itemData.media.length).to.equal(1);
    expect(itemData.transcriptions.length).to.equal(1);
    expect(itemData.media.map(m => m.type)).to.deep.equal(['audio']);
    expect(itemData.media[0].name).to.equal('NT10-W13-A');
  });
});

describe.only('Data Service test transcription processing - ', () => {
  function setup(collectionId, itemId, datafile) {
    angular.mock.module('pdsc');
    angular.mock.inject(function(
      _dataService_,
      _xmlTestDataService_,
      _$httpBackend_
    ) {
      const dataService = _dataService_;
      const xmlTestDataService = _xmlTestDataService_;
      $httpBackend = _$httpBackend_;

      let url = `http://catalog.paradisec.org.au/repository`;
      url += `/${collectionId}/${itemId}/${datafile}`;
      const type = datafile.split('.').pop();
      const item = {
        name: datafile,
        url: url
      };

      $httpBackend.whenGET(url).respond(xmlTestDataService[datafile]);
      $httpBackend.expectGET(url);

      dataService
        .loadTranscription(type, item)
        .then(response => (itemData = response));

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  }

  function verifyItemDataStructure() {
    expect(itemData).to.be.jsonSchema(itemDataSchema);
  }

  it('should process AC1-013-B.eaf correctly', async () => {
    await setup('AC1', '013', 'AC1-013-B.eaf');
    console.log(JSON.stringify(itemData, null, 2));
    // verifyItemDataStructure();
    // expect(itemData.collectionId).to.equal('AA2');
    // expect(itemData.itemId).to.equal('003');
    // expect(itemData.images.length).to.equal(0);
    // expect(itemData.thumbnails.length).to.equal(0);
    // expect(itemData.documents.length).to.equal(0);
    // expect(itemData.media.length).to.equal(2);
    // expect(itemData.transcriptions.length).to.equal(0);
    // expect(itemData.media.map(m => m.name)).to.deep.equal([
    //   'AA2-003-A',
    //   'AA2-003-B'
    // ]);
  });
});
