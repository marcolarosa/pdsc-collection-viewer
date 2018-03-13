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

Controller.$inject = ['dataService', '$timeout', '$q'];
function Controller(dataService, $timeout, $q) {
  var vm = this;
  // '_',
  // '$timeout',
  // '$routeParams',
  // '$location',
  // '$anchorScroll',
  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.select = select;

  function init() {
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
    console.log(queue);
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

  function destroy() {}

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

  // vm.$watch('currentTime', function() {
  //   if (vm.currentTime) {
  //     var d;
  //     if (vm.transcript) {
  //       d = vm.transcript;
  //     } else if (vm.interlinearText) {
  //       d = vm.interlinearText;
  //     }
  //     var transformed = _.map(d, function(t) {
  //       if (t.time > vm.currentTime) {
  //         return 1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //     vm.selectedIndex = _.indexOf(transformed, 1, true) - 1;
  //     var o = $location.hash();
  //     $location.hash(vm.selectedIndex);
  //     $anchorScroll();
  //     $location.hash(o);
  //   }
  // });

  function set() {
    if ($routeParams.type && $routeParams.segment && $routeParams.selected) {
      if ($routeParams.type === 'transcript') {
        vm.st = true;
        vm.selected.transcript = $routeParams.selected;
      } else if ($routeParams.type === 'interlinear') {
        vm.se = true;
        vm.selected.interlinear = $routeParams.selected;
      }
      vm.currentTime = $routeParams.segment;
    } else {
      if (vm.available.transcripts) {
        vm.selected.transcript = vm.available.transcripts[0];
      }
      if (vm.available.interlinear) {
        vm.selected.interlinear = vm.available.interlinear[0];
      }
    }
  }

  // vm.$watch(
  //   'transcription',
  //   function() {
  //     if (vm.transcription === undefined) {
  //       return;
  //     }
  //     vm.available.transcripts = _.keys(vm.transcription).sort();
  //     vm.set();
  //     vm.load('transcript');
  //     if (vm.available.transcripts.length > 1) {
  //       vm.transcriptsSelector = true;
  //     }
  //   },
  //   true
  // );
  //
  // vm.$watch(
  //   'interlinear',
  //   function() {
  //     if (vm.interlinear === undefined) {
  //       return;
  //     }
  //     vm.available.interlinear = _.keys(vm.interlinear).sort();
  //     vm.set();
  //     vm.load('interlinear');
  //     if (vm.available.interlinear.length > 1) {
  //       vm.interlinearTextsSelector = true;
  //     }
  //   },
  //   true
  // );

  function load(what) {
    $timeout(function() {
      if (what === 'transcript') {
        if ($routeParams.segment) {
          var data = vm.transcription[vm.selected.transcript];
          vm.transcript = _.compact(
            _.map(data, function(d) {
              if (d.id === $routeParams.segment) {
                return d;
              }
            })
          );
        } else {
          vm.transcript = vm.transcription[vm.selected.transcript];
        }
      } else if (what === 'interlinear') {
        if ($routeParams.segment) {
          var data = vm.interlinear[vm.selected.interlinear];
          vm.interlinearText = _.compact(
            _.map(data, function(d) {
              if (d.id === $routeParams.segment) {
                return d;
              }
            })
          );
        } else {
          vm.interlinearText = vm.interlinear[vm.selected.interlinear];
        }
      }
    }, 100);
  }
}
