"use strict";

const { isEmpty, each } = require("lodash");

module.exports = {
  template: require("./view-transcriptions.component.html"),
  bindings: {},
  controller: Controller,
  controllerAs: "vm"
};

Controller.$inject = [
  "$state",
  "$rootScope",
  "dataService",
  "hljs",
  "$timeout",
  "$scope"
];
function Controller($state, $rootScope, dataService, hljs, $timeout, $scope) {
  var vm = this;

  var broadcastListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.jump = jump;

  function init() {
    broadcastListener = $rootScope.$on("item data loaded", loadItem);
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
      if (isEmpty(vm.item.transcriptions)) {
        return $state.go("main");
      }

      if (!$state.params.transcriptionId) {
        $timeout(() => {
          $state.go("main.transcriptions.instance", {
            transcriptionId: vm.item.transcriptions[0].name
          });
        });
      }
      $timeout(() => {
        loadTranscription();
      });
    }
  }

  function loadTranscription() {
    vm.selectedTranscription = vm.item.transcriptions.filter(
      t => t.name === $state.params.transcriptionId
    )[0];
    const type = vm.selectedTranscription.name.split(".").pop();
    const item = vm.selectedTranscription;
    dataService.loadTranscription(type, item, "xml").then(data => {
      hljs.configure({
        tabReplace: "    ",
        useBr: true
      });
      data = hljs.highlight("xml", data).value;
      vm.data = data;
      hljs.initHighlighting();
    });
  }

  function jump() {
    $timeout(() => {
      $state.go("main.transcriptions.instance", {
        transcriptionId: vm.selectedTranscription.name
      });
    });
    $timeout(() => {
      loadTranscription();
    });
  }
}
