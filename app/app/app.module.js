'use strict';

angular
  .module('pdsc', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'moment',
    'underscore',
    'pdfjs',
    'ngMaterial',
  ])
  .config(function ($routeProvider, $mdThemingProvider) {
    $routeProvider
      .when('/:collectionId?/:itemId/:itemInstance?', {
        templateUrl: 'app/components/main/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange');
  });
