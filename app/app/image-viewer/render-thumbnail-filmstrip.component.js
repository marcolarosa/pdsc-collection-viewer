'use strict';

module.exports = {
  template: require('./render-thumbnail-filmstrip.component.html'),
  bindings: {
    items: '<',
    selectedItem: '='
  },
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = ['$timeout', '$location', '$anchorScroll', '$mdSidenav'];
function Controller($timeout, $location, $anchorScroll, $mdSidenav) {
  var vm = this;

  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    vm.smallImages = _.map(vm.items.thumbnails, function(d, i) {
      return {
        id: i,
        source: d
      };
    });
  }

  vm.$watch('selectedItem', function() {
    vm.highlightSelectedItem();
  });

  vm.$watch('isOpen()', function(n) {
    if (n) {
      vm.highlightSelectedItem();
    }
  });

  function isOpen() {
    return $mdSidenav('thumbnailFilmstrip').isOpen();
  }

  function highlightSelectedItem() {
    vm.smallImages = _.map(vm.smallImages, function(d, i) {
      if (i === vm.selectedItem) {
        d.selected = 'filmstrip-highlight-current';
      } else {
        delete d.selected;
      }
      return d;
    });

    // scroll the thumbnails
    $timeout(function() {
      var old = $location.hash();
      $location.hash(vm.selectedItem);
      $anchorScroll();
      $location.hash(old);
    }, 500);
  }

  function jumpTo(i) {
    vm.selectedItem = i;
  }
}
