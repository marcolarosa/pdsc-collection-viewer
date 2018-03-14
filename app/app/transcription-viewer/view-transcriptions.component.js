'use strict';

const {isEmpty, each} = require('lodash');

module.exports = {
  template: require('./view-transcriptions.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$state', '$rootScope', 'dataService', 'hljs'];
function Controller($state, $rootScope, dataService, hljs) {
  var vm = this;

  var broadcastListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.nextDocument = nextDocument;
  vm.previousDocument = previousDocument;

  function init() {
    broadcastListener = $rootScope.$on('item data loaded', loadItem);
    vm.config = {
      current: 0
    };

    loadItem();
  }

  function destroy() {
    broadcastListener();
  }

  function loadItem() {
    vm.loadingData = true;
    delete vm.data;
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    dataService.getItem(collectionId, itemId).then(processResponse);

    function processResponse(resp) {
      vm.loadingData = false;
      if (isEmpty(resp)) {
        return;
      }

      vm.item = resp;
      vm.transcriptions = vm.item.transcriptions.map(transcription =>
        transcription.split('/').pop()
      );
      if (!$state.params.transcriptionId) {
        return $state.go('main.transcriptionInstance', {
          transcriptionId: vm.transcriptions[0]
        });
      }
      const transcriptionId = $state.params.transcriptionId;
      vm.config.current = vm.transcriptions.indexOf(transcriptionId);

      const type = vm.transcriptions[vm.config.current].split('.').pop();
      const item = {};
      item[type] = vm.item.transcriptions[vm.config.current];
      dataService.loadTranscription(type, item, 'xml').then(data => {
        hljs.configure({
          tabReplace: '    ',
          useBr: true
        });
        data = hljs.highlight('xml', data).value;
        vm.data = data;
        hljs.initHighlighting();
      });
    }
  }

  function jump() {
    each(vm.transcriptions, (transcription, idx) => {
      if (vm.config.current === idx) {
        return $state.go('main.transcriptionInstance', {
          transcriptionId: transcription
        });
      }
    });
  }

  function nextDocument() {
    if (vm.config.current === vm.item.transcriptions.length - 1) {
      return;
    }
    vm.config.current += 1;
    jump();
  }

  function previousDocument() {
    if (vm.config.current === 0) {
      return;
    }
    vm.config.current -= 1;
    jump();
  }
}
