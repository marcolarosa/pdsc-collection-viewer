'use strict';

const {includes, map} = require('lodash');

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
  '$anchorScroll',
  '$state'
];
function Controller(
  dataService,
  $timeout,
  $q,
  $location,
  $anchorScroll,
  $state
) {
  var vm = this;
  // '_',
  // '$timeout',
  // '$routeParams',
  // '$location',
  // '$anchorScroll',

  var timeUpdateListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.queueTranscription = queueTranscription;
  vm.play = play;

  function init() {
    timeUpdateListener = dataService.listenForMediaElementBroadcast(
      scrollTranscription
    );
    vm.transcriptions = {};
    vm.transcriptionsByName = {};
    let queue = [];

    if (vm.element.eaf && !vm.transcriptions.eaf) {
      vm.transcriptions.eaf = {};
      queue.push('eaf');
    }
    if (vm.element.trs && !vm.transcriptions.trs) {
      vm.transcriptions.trs = {};
      queue.push('trs');
    }
    if (vm.element.ixt && !vm.transcriptions.ixt) {
      vm.transcriptions.ixt = {};
      queue.push('ixt');
    }
    if (vm.element.flextext && !vm.transcriptions.flextext) {
      vm.transcriptions.flextext = {};
      queue.push('flextext');
    }
    vm.loadingTranscriptions = true;
    var chain = $q.when();
    queue.forEach(function(t) {
      chain = chain.then(chainTranscription(t));
    });

    if (!$state.params.transcription) {
      queueTranscription[queue[0]];
    }

    return chain.then(() => {
      vm.loadingTranscriptions = false;
      select();
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
    let name;
    const load = map(vm.element[type], transcription => {
      return dataService.loadTranscription(type, transcription).then(resp => {
        vm.transcriptions[type][transcription.name] = resp;
        vm.transcriptionsByName[transcription.name] = resp;
      });
    });
    return Promise.all(load);
  }

  function destroy() {
    timeUpdateListener();
  }

  function select() {
    $timeout(() => {
      if ($state.params.transcription) {
        vm.selectedTranscription =
          vm.transcriptionsByName[$state.params.transcription];
        vm.selectedType = $state.params.transcription.split('.').pop();
        vm.selectedTranscriptionName = $state.params.transcription;
      }
      if (includes(['eaf', 'trs'], vm.selectedType)) {
        vm.showTranscription = true;
        vm.showInterlinearText = false;
      } else if (includes(['ixt', 'flextext'], vm.selectedType)) {
        vm.showTranscription = false;
        vm.showInterlinearText = true;
      }
    }, 10);
  }

  function queueTranscription(what) {
    vm.selectedType = what;
    vm.selectedTranscriptionName = vm.element[vm.selectedType][0].name;
    vm.selectedTranscription =
      vm.transcriptionsByName[vm.selectedTranscriptionName];
    $location.search('transcription', vm.selectedTranscriptionName);
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

  function play(range) {
    dataService.broadcastPlayFrom(range);
  }
}
