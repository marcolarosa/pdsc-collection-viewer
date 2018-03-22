'use strict';

module.exports = angular
  .module('pdsc.transcriptionViewer', [])
  .component(
    'pdscTranscriptionViewerComponent',
    require('./view-transcriptions.component')
  );
