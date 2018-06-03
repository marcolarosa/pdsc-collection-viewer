'use strict';

module.exports = {
  template: require('./video-element.component.html'),
  bindings: {
    element: '<'
  },
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$state', '$timeout', '$location', 'dataService'];
function Controller($state, $timeout, $location, dataService) {
  var vm = this;

  var playFromListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    playFromListener = dataService.listenForPlayFrom(playFragment);
    vm.mediaReadyToPlay = false;
    vm.loginRequired = false;
  }

  function destroy() {
    playFromListener();
  }

  function playFragment() {
    const start = dataService.playFrom.start;
    const end = dataService.playFrom.end;
    var videoElement = document.getElementById(vm.element.name);
    videoElement.currentTime = start;

    // hit play
    videoElement.play();

    // then set a timeout to pause at end.time
    $timeout(function() {
      videoElement.pause();
    }, (end - start) * 1000);
  }
}
