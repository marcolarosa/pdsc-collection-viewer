'use strict';

/**
 * @ngdoc overview
 * @name pdscApp
 * @description
 * # pdscApp
 *
 * Main module of the application.
 */
angular
  .module('pdscApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/collection/:collectionId?', {
          templateUrl: 'views/collection.html',
          controller: 'CollectionCtrl'
      })
      .when('/item/:itemId?', {
          templateUrl: 'views/item.html',
          controller: 'ItemCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
