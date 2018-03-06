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
  $stateProvider.state('root.main', {
    url: '{collectionId}/{itemId}',
    component: 'pdscCollectionViewerMainComponent'
  });
}
