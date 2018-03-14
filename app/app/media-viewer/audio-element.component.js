'use strict';

module.exports = {
  template: require('./audio-element.component.html'),
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
    vm.loginRequired = false;
  }

  function destroy() {}

  // function playFragment(start, end) {
  //   // seek to start.time
  //   var audioElement = document.getElementById(vm.element.name);
  //   audioElement.currentTime = start.time;
  //
  //   // hit play
  //   audioElement.play();
  //
  //   // then set a timeout to pause at end.time
  //   $timeout(function() {
  //     audioElement.pause();
  //   }, (end.time - start.time) * 1000);
  // }

  // function loadItem() {
  //   var url =
  //     '/' +
  //     $state.params.collectionId +
  //     '/' +
  //     $state.params.itemId +
  //     '/' +
  //     vm.element.name;
  //   $location.url(url);
  // }
}
