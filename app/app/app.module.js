'use strict';

require('./app.states');
require('./main/module');
require('./image-viewer/module');
require('./services/module');
require('./filters/module');
require('./supporting-services/module');

angular
  .module('pdsc', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ui.router',
    'ngSanitize',
    'moment',
    'lodash',
    'pdfjs',
    'ngMaterial',
    'clipboard',
    'pdsc.routes',
    'pdsc.main',
    'pdsc.services',
    'pdsc.filters',
    'pdsc.imageViewer'
  ])
  .config(Configure);

Configure.$inject = ['$mdThemingProvider', '$locationProvider'];

function Configure($mdThemingProvider, $locationProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('orange');

  $locationProvider.hashPrefix('');
}
