'use strict';

module.exports = angular
  .module('pdsc.imageViewer', [])
  .component('pdscImageViewerComponent', require('./view-image-set.component'))
  .component(
    'pdscImageViewerThumbnailStripComponent',
    require('./render-thumbnail-filmstrip.component')
  )
  .directive('showWhenReady', require('./show-when-ready.directive'));
