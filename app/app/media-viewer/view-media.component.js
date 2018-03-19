'use strict';

const {isEmpty, keys, each} = require('lodash');

module.exports = {
  template: require('./view-media.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$state', '$rootScope', 'dataService', '$timeout'];
function Controller($state, $rootScope, dataService, $timeout) {
  var vm = this;

  var broadcastListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.previousItem = previousItem;
  vm.nextItem = nextItem;

  function init() {
    vm.selectedTab = $state.params.transcription ? 1 : 0;
    broadcastListener = $rootScope.$on('item data loaded', loadItem);
    vm.config = {
      current: 0,
      item: null
    };
    $timeout(() => {
      vm.selectedTab = $state.params.transcription ? 1 : 0;
    }, 500);
    loadItem();
  }

  function destroy() {
    broadcastListener();
  }

  function loadItem() {
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    vm.showMedia = false;
    vm.loadingData = true;
    dataService.getItem(collectionId, itemId).then(processResponse);

    function processResponse(resp) {
      vm.loadingData = false;
      if (isEmpty(resp)) {
        return;
      }
      vm.item = resp;
      vm.media = vm.item.media.map(m => m.name);

      if (!$state.params.mediaId) {
        $timeout(() => {
          return $state.go('main.mediaInstance', {mediaId: vm.media[0]});
        });
      }
      const mediaId = $state.params.mediaId;
      vm.config.current = vm.media.indexOf(mediaId);
      vm.config.item = vm.item.media[vm.config.current];
    }
  }

  function jump() {
    each(vm.media, (item, idx) => {
      if (vm.config.current === idx) {
        return $state.go('main.mediaInstance', {mediaId: item});
      }
    });
  }

  function nextItem() {
    if (vm.config.current === vm.item.media.length - 1) {
      return;
    }
    vm.config.current += 1;
    jump();
  }

  function previousItem() {
    if (vm.config.current === 0) {
      return;
    }
    vm.config.current -= 1;
    jump();
  }

  // scope.loadVideoPlayer = false;
  // scope.loadAudioPlayer = false;
  // scope.time = '';
  //
  // // is a specific instance being requested?
  // //  If so, strip the others from the set.
  // if (scope.instanceId) {
  //   // it's not undefined
  //   var k = scope.instanceId;
  //
  //   // since we're choosing only one; we can now honour start / end params
  //   if ($routeParams.start && $routeParams.end) {
  //     scope.time = '#t=' + $routeParams.start + ',' + $routeParams.end;
  //   } else if ($routeParams.start && !$routeParams.end) {
  //     scope.time = '#t=' + $routeParams.start;
  //   } else if (!$routeParams.start && $routeParams.end) {
  //     scope.time = '#t=,' + $routeParams.end;
  //   } else {
  //     scope.time = '';
  //   }
  //
  //   // process the audio elements - extracting the specific instance if matching
  //   if (!_.isEmpty(scope.itemData.audio)) {
  //     scope.itemData.audio = _.pick(scope.itemData.audio, k);
  //     _.each(scope.itemData.audio, function(d, k) {
  //       d = _.map(d, function(e) {
  //         return e + scope.time;
  //       });
  //       scope.itemData.audio[k] = d;
  //     });
  //   }
  //
  //   // process the video elements - extracting the specific instance if matching
  //   if (!_.isEmpty(scope.itemData.video)) {
  //     scope.itemData.video = _.pick(scope.itemData.video, k);
  //     _.each(scope.itemData.video, function(d, k) {
  //       d = _.map(d, function(e) {
  //         return e + scope.time;
  //       });
  //       scope.itemData.video[k] = d;
  //     });
  //   }
  //
  //   // scroll to the specific transcription
  //   scope.scrollTo = $routeParams.start;
  // }
  //
  // // are we dealing with audio or video?
  // if (!_.isEmpty(scope.itemData.video)) {
  //   scope.loadVideoPlayer = true;
  // }
  // if (!_.isEmpty(scope.itemData.audio)) {
  //   scope.loadAudioPlayer = true;
  // }
}
