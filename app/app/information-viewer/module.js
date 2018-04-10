'use strict';

module.exports = angular
  .module('pdsc.informationViewer', [])
  .component(
    'pdscInformationViewerComponent',
    require('./view-information.component')
  )
  .component(
    'pdscItemInformationComponent',
    require('./item-information.component')
  );
