'use strict';

module.exports = angular
  .module('pdsc.routes', ['ui.router'])
  .config(CollectionViewerRoutes);

CollectionViewerRoutes.$inject = ['$urlRouterProvider', '$stateProvider'];

function CollectionViewerRoutes($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('root', {
    url: '/',
    component: 'pdscCollectionViewerRootComponent'
  });

  $stateProvider.state('main', {
    url: '/{collectionId}/{itemId}',
    component: 'pdscCollectionViewerMainComponent'
  });

  $stateProvider.state('main.images', {
    url: '/images',
    component: 'pdscImageViewerComponent'
  });
  $stateProvider.state('main.images.instance', {
    url: '/:imageId'
  });

  $stateProvider.state('main.documents', {
    url: '/documents',
    component: 'pdscDocumentViewerComponent'
  });
  $stateProvider.state('main.documentInstance', {
    url: '/documents/:documentId',
    component: 'pdscDocumentViewerComponent'
  });

  $stateProvider.state('main.transcriptions', {
    url: '/transcriptions',
    component: 'pdscTranscriptionViewerComponent'
  });
  $stateProvider.state('main.transcriptionInstance', {
    url: '/transcriptions/:transcriptionId',
    component: 'pdscTranscriptionViewerComponent'
  });

  $stateProvider.state('main.media', {
    url: '/media',
    component: 'pdscMediaViewerComponent'
  });
  $stateProvider.state('main.media.instance', {
    url: '/:mediaId?transcription&segment'
  });
}
