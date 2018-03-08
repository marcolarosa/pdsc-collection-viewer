'use strict';

module.exports = angular
  .module('pdsc.documentViewer', [])
  .component(
    'pdscDocumentViewerComponent',
    require('./view-documents.component')
  );
