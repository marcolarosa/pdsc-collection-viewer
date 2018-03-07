'use strict';

module.exports = angular
  .module('pdsc.imageViewer', [])
  .component('pdscImageViewerComponent', require('./view-image-set.component'))
  .directive('showWhenReady', require('./show-when-ready.directive'));
