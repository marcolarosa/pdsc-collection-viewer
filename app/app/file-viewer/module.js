'use strict';

import './file-viewer.css';

module.exports = angular
  .module('pdsc.fileViewer', [])
  .component('pdscFileViewerComponent', require('./view-files.component'));
