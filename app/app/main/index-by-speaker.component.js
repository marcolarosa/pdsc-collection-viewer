"use strict";
const { groupBy, includes } = require("lodash");
const _ = require("lodash");

module.exports = {
    template: require("./index-by-speaker.component.html"),
    bindings: {
        collections: "<"
    },
    controller: Controller,
    controllerAs: "vm"
};

Controller.$inject = [];
function Controller() {
    var vm = this;

    vm.$onInit = init;
    vm.$onDestroy = destroy;

    function init() {}

    function destroy() {}
}
