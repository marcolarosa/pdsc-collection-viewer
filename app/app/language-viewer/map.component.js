'use strict';

const leaflet = require('leaflet');
const esriLeaflet = require('esri-leaflet');

module.exports = {
  template: require('./map.component.html'),
  bindings: {
    coords: '<'
  },
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [];
function Controller() {
  var vm = this;

  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    console.log(leaflet);
    const map = leaflet.map('language-viewer-map').setView(vm.coords[0], 5);
    const marker = leaflet.marker(vm.coords[0]).addTo(map);
    esriLeaflet.basemapLayer('Topographic').addTo(map);
  }

  function destroy() {}
}
