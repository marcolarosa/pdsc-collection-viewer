'use strict';

module.exports = angular
  .module('pdsc.main', [])
  .constant('configuration', require('./configuration'))
  .controller('MetadataCtrl', require('./metadata.js'))
  .component(
    'pdscCollectionViewerRootComponent',
    require('./root.component.js')
  )
  .component(
    'pdscCollectionViewerMainComponent',
    require('./main.component.js')
  );
