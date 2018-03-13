'use strict';

const {includes} = require('lodash');

module.exports = {
  template: require('./render-transcription.component.html'),
  bindings: {
    element: '<'
  },
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  'dataService',
  '$timeout',
  '$q',
  '$location',
  '$anchorScroll'
];
function Controller(dataService, $timeout, $q, $location, $anchorScroll) {
  var vm = this;
  // '_',
  // '$timeout',
  // '$routeParams',
  // '$location',
  // '$anchorScroll',

  var timeUpdateListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.select = select;

  function init() {
    timeUpdateListener = dataService.listenForMediaElementBroadcast(
      scrollTranscription
    );
    vm.transcriptions = {};
    let queue = [];

    if (vm.element.eaf && !vm.transcriptions.eaf) {
      queue.push('eaf');
      // loadTranscription('eaf');
    }
    if (vm.element.trs && !vm.transcriptions.trs) {
      queue.push('trs');
      // loadTranscription('trs');
    }
    if (vm.element.ixt && !vm.transcriptions.ixt) {
      queue.push('ixt');
      // loadTranscription('ixt');
    }
    if (vm.element.flextext && !vm.transcriptions.flextext) {
      queue.push('flextext');
      // loadTranscription('flextext');
    }
    vm.loadingTranscriptions = true;
    var chain = $q.when();
    queue.forEach(function(t) {
      chain = chain.then(chainTranscription(t));
    });
    return chain.then(() => {
      vm.loadingTranscriptions = false;
      vm.select(queue.shift());
    });

    function chainTranscription(item) {
      return function() {
        return loadTranscription(item);
      };
    }

    // vm.highlight = {};
    // vm.selected = {};
    // vm.available = {};
    // vm.showTranscription = true;
    // vm.showInterlinear = true;
    // vm.isPlaying = false;
  }

  function loadTranscription(type) {
    return dataService.loadTranscription(type, vm.element).then(resp => {
      vm.transcriptions[type] = resp;
    });
  }

  function destroy() {
    timeUpdateListener();
  }

  function select(what) {
    vm.selectedTranscription = {};
    $timeout(() => {
      vm.selected = what;
      if (includes(['eaf', 'trs'], what)) {
        vm.showTranscription = true;
        vm.showInterlinearText = false;
      } else if (includes(['ixt', 'flextext'], what)) {
        vm.showTranscription = false;
        vm.showInterlinearText = true;
      }
      vm.selectedTranscription = vm.transcriptions[what];
    }, 10);
  }

  function scrollTranscription() {
    var transformed = _.map(vm.selectedTranscription, function(t) {
      if (t.time > dataService.mediaElementTime) {
        return 1;
      } else {
        return 0;
      }
    });
    vm.selectedIndex = _.indexOf(transformed, 1, true) - 1;
    var o = $location.hash();
    $location.hash(vm.selectedIndex);
    $anchorScroll();
    $location.hash(o);
  }
}
