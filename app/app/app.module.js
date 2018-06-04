'use strict';

const hljs = require('highlight.js');

require('./app.states');
require('./main/module');
require('./services/module');
require('./filters/module');
require('./file-viewer/module');
require('./image-viewer/module');
require('./information-viewer/module');
require('./document-viewer/module');
require('./transcription-viewer/module');
require('./media-viewer/module');
require('./supporting-services/module');

import AngularApollo from 'angular1-apollo';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';

angular
  .module('pdsc', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ui.router',
    'ngSanitize',
    'angular-apollo',
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
    'pdsc.documentViewer',
    'pdsc.transcriptionViewer',
    'pdsc.mediaViewer'
  ])
  .config(Configure);

Configure.$inject = [
  '$mdThemingProvider',
  '$locationProvider',
  'apolloProvider'
];
function Configure($mdThemingProvider, $locationProvider, apolloProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('orange');

  $locationProvider.hashPrefix('');

  const client = new ApolloClient({
    link: new HttpLink({
      uri: 'http://catalog.paradisec.org.au/graphql',
      credentials: 'include'
    }),
    cache: new InMemoryCache()
  });

  apolloProvider.defaultClient(client);
  // $locationProvider.html5mode(true);
}
