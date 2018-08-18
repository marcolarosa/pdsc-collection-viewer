"use strict";

const configuration = require("app/main/configuration");
const { isEmpty, each, map } = require("lodash");

module.exports = {
    template: require("./view-files.component.html"),
    bindings: {},
    controller: Controller,
    controllerAs: "vm"
};

Controller.$inject = [
    "$state",
    "$rootScope",
    "$scope",
    "$location",
    "$timeout",
    "dataService"
];

function Controller(
    $state,
    $scope,
    $rootScope,
    $location,
    $timeout,
    dataService
) {
    var vm = this;

    var broadcastListener;

    vm.$onInit = init;
    vm.$onDestroy = destroy;

    function init() {
        vm.mode = configuration.datasource.mode;
        console.log(vm.mode);
        vm.loadingData = true;
        broadcastListener = $rootScope.$on("item data loaded", loadItem);
        loadItem();
    }

    function destroy() {
        broadcastListener();
    }

    function loadItem() {
        const collectionId = $state.params.collectionId;
        const itemId = $state.params.itemId;
        dataService.getItem(collectionId, itemId).then(processResponse);

        function processResponse(resp) {
            vm.loadingData = false;
            if (isEmpty(resp)) {
                return;
            }
            $scope.$apply(() => {
                vm.item = resp;
                vm.item.images = vm.item.images.map(i => i.split("/").pop());
                vm.item.documents = vm.item.documents.map(i =>
                    i.split("/").pop()
                );
                vm.hasAudio = vm.item.media.filter(m => m.type === "audio");
                vm.hasVideo = vm.item.media.filter(m => m.type === "video");
            });
        }
    }
}
