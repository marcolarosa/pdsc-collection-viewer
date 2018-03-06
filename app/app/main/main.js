'use strict';

module.exports = {
  template: require('./main.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  '$state',
  '$log',
  'configuration',
  'dataService',
  'lodash',
  '$mdSidenav'
];

function Controller(
  $state,
  $log,
  configuration,
  dataService,
  lodash,
  $mdSidenav
) {
  var vm = this;

  vm.showItemInformation = false;
  vm.levelUp = false;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.toggleItemInformation = toggleItemInformation;
  vm.whichViewer = whichViewer;
  vm.loadViewer = loadViewer;

  function init() {
    vm.collectionId = $state.params.collectionId;
    vm.itemId = $state.params.itemId;
    vm.instanceId = $state.params.instanceId;
    $log.info(vm.collectionId, ' ::: ', vm.itemId, ' ::: ', vm.instanceId);
    loadItemData();
  }

  function destroy() {}

  function loadItemData() {
    dataService.getItem(vm.collectionId, vm.itemId).then(resp => {
      vm.itemData = resp;
      console.log(vm.itemData);
      vm.whichViewer();
    });
  }

  // show / hide item information panel
  function toggleItemInformation() {
    $mdSidenav('left').toggle();
  }

  function filter(what) {
    if (_.isPlainObject(what)) {
      var values = _.map(what, function(d) {
        return d;
      });
      what = _.flatten(values);
    }
    var m = _.filter(what, function(d) {
      return d.match(vm.instanceId);
    });
    if (_.isEmpty(m)) {
      return false;
    } else {
      return true;
    }
  }

  // determine which viewer to load based on the route configuration
  function whichViewer() {
    // is a specific instance defined? if so, use this to determine which
    //  viewer to load.
    if (vm.instanceId) {
      if (filter(vm.itemData.images)) {
        vm.itemData.documents = [];
        vm.itemData.audio = [];
        vm.itemData.video = [];
        vm.loadViewer('images');
      } else if (filter(vm.itemData.documents)) {
        vm.itemData.images = [];
        vm.itemData.audio = [];
        vm.itemData.video = [];
        vm.loadViewer('documents');
      } else if (filter(vm.itemData.audio)) {
        vm.itemData.images = [];
        vm.itemData.documents = [];
        vm.itemData.video = [];
        vm.loadViewer('media');
      } else if (filter(vm.itemData.video)) {
        vm.itemData.images = [];
        vm.itemData.documents = [];
        vm.itemData.audio = [];
        vm.loadViewer('media');
      }

      // we're focussed in on one specific item so enable the level up toggle
      vm.levelup = '#/' + vm.collectionId + '/' + vm.itemId;
    } else {
      //  Otherwise - images > documents > media
      if (!_.isEmpty(vm.itemData.images)) {
        vm.loadViewer('images');
      } else if (!_.isEmpty(vm.itemData.documents)) {
        vm.loadViewer('documents');
      } else {
        vm.loadViewer('media');
      }
    }
  }

  // load an appropriate viewer
  function loadViewer(dataType) {
    // some of the viewers need to know the header height so they
    //  can size themselves accordingly
    //vm.headerHeight = document.getElementById('header').clientHeight;

    // always ditch info when loading a viewer
    vm.showItemInformation = false;

    // now load the required viewer
    if (dataType === 'images') {
      vm.loadImageViewer = true;
      vm.loadMediaPlayer = false;
      vm.loadDocumentViewer = false;
    } else if (dataType === 'documents') {
      vm.loadImageViewer = false;
      vm.loadMediaPlayer = false;
      vm.loadDocumentViewer = true;
    } else if (dataType === 'media') {
      vm.loadImageViewer = false;
      vm.loadMediaPlayer = true;
      vm.loadDocumentViewer = false;
    }
  }
}
