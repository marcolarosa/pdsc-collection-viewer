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
  )
  .component(
    'pdscItemInformationComponent',
    require('./item-information.component')
  )
  .directive('sizeToParent', require('./size-to-parent.directive'))
  .directive('blurOnClick', require('./blur-on-click.directive'))
  .directive('storeHeight', require('./store-height.directive'));