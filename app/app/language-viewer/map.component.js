'use strict';

const leaflet = require('leaflet');
const esriLeaflet = require('esri-leaflet');
delete leaflet.Icon.Default.prototype._getIconUrl;
leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

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
    const map = leaflet.map('language-viewer-map').setView(vm.coords[0], 5);
    const markers = vm.coords.map(c => leaflet.marker(c).addTo(map));
    console.log(markers);
    esriLeaflet.basemapLayer('Topographic').addTo(map);
  }

  function destroy() {}
}
