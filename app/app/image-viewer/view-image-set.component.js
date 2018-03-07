'use strict';

module.exports = {
  template: require('./view-image-set.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  '$state',
  '$log',
  '$window',
  '$location',
  '$anchorScroll',
  '$timeout',
  'dataService',
  'lodash',
  '$mdSidenav'
];

function Controller(
  $state,
  $log,
  $window,
  $location,
  $anchorScroll,
  $timeout,
  dataService,
  lodash,
  $mdSidenav
) {
  var vm = this;

  vm.$onInit = init;
  vm.$onDestroy = destroy;

  function init() {
    vm.config = {
      disableThumbnailView: false,
      scaleStep: 0.2,
      isOpen: false,
      current: null
    };
    loaditem();
  }

  function destroy() {}

  function loaditem() {
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    vm.loadingData = true;
    dataService.getItem(collectionId, itemId).then(processResponse);

    function processResponse(resp) {
      vm.item = resp;
      vm.images = lodash.map(
        vm.item.images,
        image =>
          image
            .split('/')
            .pop()
            .split('.')[0]
      );

      vm.loadImage();
      vm.loadingData = false;
    }
  }

  vm.loadImage = function() {
    // vm.config.currentScale = 1;
    // vm.config.currentRotation = 0;
    vm.showImage = false;
    $timeout(function() {
      vm.showProgress = true;
    }, 500);
    setCurrentImage();
    vm.image = vm.item.images[vm.config.current];
    vm.figureOutPaginationControls();
    //vm.highlightThumbnail();
  };

  function setCurrentImage() {
    const imageId = $state.params.imageId;
    lodash.each(vm.images, (image, idx) => {
      if (image === imageId) {
        vm.config.current = idx;
      }
    });
  }

  function jump() {
    lodash.each(vm.images, (image, idx) => {
      if (vm.config.current === idx) {
        $state.go('main.imagesInstance', {imageId: image});
      }
    });
  }

  vm.figureOutPaginationControls = function() {
    // only 1 image? disable both controls
    if (vm.item.images.length === 1) {
      vm.showNext = false;
      vm.showPrevious = false;

      // and disable thumbnail view as it's useless
      vm.disableThumbnailView = true;
      return;
    }

    // otherwise - toggle the controls as required
    if (vm.current === 0) {
      // show next not previous
      vm.showNext = true;
      vm.showPrevious = false;
    } else if (vm.current === vm.item.images.length - 1) {
      // show previous not next
      vm.showNext = false;
      vm.showPrevious = true;
    } else {
      // show both
      vm.showNext = true;
      vm.showPrevious = true;
    }
  };

  // page to next image
  vm.next = function() {
    if (vm.config.current === vm.item.images.length - 1) {
      return;
    }
    vm.config.current += 1;
    jump();
  };

  // page to previous image
  vm.previous = function() {
    if (vm.config.current === 0) {
      return;
    }
    vm.config.current -= 1;
    jump();
  };

  // jump to first image
  vm.jumpToStart = function() {
    vm.config.current = 0;
    jump();
  };

  // jump to last image
  vm.jumpToEnd = function() {
    vm.config.current = vm.item.images.length - 1;
    jump();
  };

  // // rotate left
  // vm.rotateLeft = function() {
  //   vm.config.currentRotation -= 90;
  //   vm.setTransform();
  // };
  //
  // // rotate right
  // vm.rotateRight = function() {
  //   vm.config.currentRotation += 90;
  //   vm.setTransform();
  // };
  //
  // vm.setTransformOrigin = function() {
  //   switch (vm.config.currentRotation) {
  //     case 0:
  //       vm.config.transformOrigin = 'left top';
  //       break;
  //     case -360:
  //       vm.config.transformOrigin = 'left top';
  //       break;
  //     case 360:
  //       vm.config.transformOrigin = 'left top';
  //       break;
  //     default:
  //       vm.config.transformOrigin = 'center center';
  //       break;
  //   }
  // };
  //
  // // set transform
  // vm.setTransform = function() {
  //   vm.setTransformOrigin();
  //   var transformation =
  //     'rotate(' +
  //     vm.config.currentRotation +
  //     'deg) scale(' +
  //     vm.config.currentScale +
  //     ')';
  //   vm.transform = {
  //     '-webkit-transform': transformation,
  //     //'-webkit-transform-origin': vm.transformOrigin,
  //     '-moz-transform': transformation,
  //     //'-moz-transform-origin': vm.transformOrigin,
  //     '-ms-transform': transformation,
  //     //'-ms-transform-origin': vm.transformOrigin,
  //     '-o-transform': transformation,
  //     //'-o-transform-origin': vm.transformOrigin,
  //     transform: transformation,
  //     //'transform-origin': vm.transformOrigin,
  //     '-webkit-transition': '0.3s ease-in-out',
  //     '-moz-transition': '0.3s ease-in-out',
  //     '-ms-transition': '0.3s ease-in-out',
  //     '-o-transition': '0.3s ease-in-out',
  //     transition: '0.3s ease-in-out'
  //   };
  // };

  // toggle the filmstrip view
  vm.toggleFilmstrip = function() {
    $mdSidenav('thumbnailFilmstrip').toggle();
  };
}
