'use strict';

const hljs = require('highlight.js');

require('./app.states');
require('./main/module');
require('./services/module');
require('./filters/module');
require('./file-viewer/module');
require('./image-viewer/module');
require('./information-viewer/module');
require('./language-viewer/module');
require('./document-viewer/module');
require('./transcription-viewer/module');
require('./media-viewer/module');
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
    'highlightjs',
    'pdsc.routes',
    'pdsc.main',
    'pdsc.services',
    'pdsc.filters',
    'pdsc.fileViewer',
    'pdsc.imageViewer',
    'pdsc.informationViewer',
    'pdsc.languageViewer',
    'pdsc.documentViewer',
    'pdsc.transcriptionViewer',
    'pdsc.mediaViewer'
  ])
  .config(Configure);

Configure.$inject = ['$mdThemingProvider', '$locationProvider'];
function Configure($mdThemingProvider, $locationProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('orange');

  $locationProvider.hashPrefix('');
  // $locationProvider.html5mode(true);
}
