'use strict';

module.exports = {
  template: require('./video-element.component.html'),
  bindings: {
    element: '<'
  },
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$state', '$timeout', '$location'];
function Controller($state, $timeout, $location) {
  var vm = this;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  // vm.playFragment = playFragment;
  // vm.loadItem = loadItem;

  function init() {
    vm.mediaReadyToPlay = false;
  }

  function destroy() {}

  // function playFragment(start, end) {
  //   // seek to start.time
  //   var videoElement = document.getElementById(scope.name);
  //   videoElement.currentTime = start.time;
  //
  //   // hit play
  //   videoElement.play();
  //
  //   // then set a timeout to pause at end.time
  //   $timeout(function() {
  //     videoElement.pause();
  //   }, (end.time - start.time) * 1000);
  // };
  //
  // function loadItem() {
  //   var url =
  //     '/' +
  //     scope.itemData.collectionId +
  //     '/' +
  //     scope.itemData.itemId +
  //     '/' +
  //     scope.name;
  //   $location.url(url);
  // };
}
