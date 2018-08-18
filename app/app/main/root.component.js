"use strict";

const configuration = require("./configuration");
const { groupBy, sortBy, isEmpty } = require("lodash");
const {
    groupByIdentifier,
    groupByGenre,
    groupBySpeaker
} = require("services/data-service-lib");

module.exports = {
    template: require("./root.component.html"),
    bindings: {},
    controller: Controller,
    controllerAs: "vm"
};

Controller.$inject = ["$state", "$transitions", "$window", "dataService"];
function Controller($state, $transitions, $window, dataService) {
    var vm = this;

    var onBeforeHandler;

    vm.showErrorMessage = false;
    vm.$onInit = init;
    vm.$onDestroy = destroy;

    function init() {
        vm.mode = configuration.datasource.mode;
        onBeforeHandler = $transitions.onBefore({}, function(transition) {
            viewSetup(transition.$to().name);
        });
        viewSetup($state.current.name);
    }

    function viewSetup(stateName) {
        if (stateName === "root" && vm.mode === "online") {
            $window.location.href = "http://catalog.paradisec.org.au";
        } else {
            dataService.libraryBoxLoader().then(response => {
                vm.data = groupByIdentifier(response);
                vm.genreData = isEmpty(groupByGenre(response))
                    ? false
                    : groupByGenre(response);
                vm.speakerData = isEmpty(groupBySpeaker(response))
                    ? false
                    : groupBySpeaker(response);
                switch (response[0].index.type) {
                    case "id":
                        vm.activeTabIndex = 0;
                        break;
                    case "genre":
                        vm.activeTabIndex = 1;
                        break;
                    case "speaker":
                        vm.activeTabIndex = 2;
                        break;
                }
            });
        }
    }

    function destroy() {
        onBeforeHandler();
    }
}
