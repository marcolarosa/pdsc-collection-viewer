'use strict';

angular
  .module('pdsc', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'moment',
    'underscore',
    'pdfjs',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:collectionId?/:itemId/:itemInstance?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
