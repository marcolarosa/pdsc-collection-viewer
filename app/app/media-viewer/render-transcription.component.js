'use strict';

const {includes, map, isEmpty} = require('lodash');

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

  var timeUpdateListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.queueTranscription = queueTranscription;
  vm.play = play;
  vm.scrollTranscription = scrollTranscription;

  vm.transcriptionOptions = ['eaf', 'trs', 'ixt', 'flextext'];

  function init() {
    timeUpdateListener = dataService.listenForMediaElementBroadcast(
      scrollTranscription
    );
    vm.transcriptions = {};
    vm.transcriptionsByName = {};
    const queue = determineTranscriptionsToLoad();

    if ($state.params.segment) {
      dataService.mediaElementTime = $state.params.segment;
    }

    var chain = $q.when();
    queue.forEach(function(t) {
      chain = chain.then(chainTranscription(t));
    });

    return chain.then(() => {
      if ($state.params.transcription) {
        vm.selectedTranscription =
          vm.transcriptionsByName[$state.params.transcription];
        vm.selectedType = $state.params.transcription.split('.').pop();
        vm.selectedTranscriptionName = $state.params.transcription;
        select();
      } else {
        queueTranscription(queue[0]);
      }
    });

    function determineTranscriptionsToLoad() {
      let queue = [];

      if (!isEmpty(vm.element.eaf) && !vm.transcriptions.eaf) {
        vm.transcriptions.eaf = {};
        queue.push('eaf');
      }
      if (!isEmpty(vm.element.trs) && !vm.transcriptions.trs) {
        vm.transcriptions.trs = {};
        queue.push('trs');
      }
      if (!isEmpty(vm.element.ixt) && !vm.transcriptions.ixt) {
        vm.transcriptions.ixt = {};
        queue.push('ixt');
      }
      if (!isEmpty(vm.element.flextext) && !vm.transcriptions.flextext) {
        vm.transcriptions.flextext = {};
        queue.push('flextext');
      }
      return queue;
    }

    function chainTranscription(item) {
      return function() {
        return loadTranscription(item);
      };
    }
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
    vm.loadingTranscriptions = true;
    vm.showTranscription = false;
    vm.showInterlinearText = false;
    $timeout(() => {
      // vm.selectedTranscription =
      //   vm.transcriptionsByName[$state.params.transcription];
      // vm.selectedType = $state.params.transcription.split('.').pop();
      // vm.selectedTranscriptionName = $state.params.transcription;
      if (includes(['eaf', 'trs'], vm.selectedType)) {
        vm.showTranscription = true;
        vm.showInterlinearText = false;
      } else if (includes(['ixt', 'flextext'], vm.selectedType)) {
        vm.showTranscription = false;
        vm.showInterlinearText = true;
      }
    }, 1000);
  }

  function queueTranscription(what, selected) {
    vm.selectedType = what;
    vm.selectedTranscriptionName = selected
      ? selected
      : vm.element[vm.selectedType][0].name;
    vm.selectedTranscription =
      vm.transcriptionsByName[vm.selectedTranscriptionName];
    $location.search('transcription', vm.selectedTranscriptionName);
    select();
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
