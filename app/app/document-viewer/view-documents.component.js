'use strict';

module.exports = {
  template: require('./view-documents.component.html'),
  bindings: {},
  controller: Controller,
  controllerAs: 'vm'
};

Controller.$inject = [
  '$rootScope',
  '$scope',
  '$state',
  'dataService',
  '$sce',
  '$window',
  'lodash',
  'pdfjs'
];
function Controller(
  $rootScope,
  $scope,
  $state,
  dataService,
  $sce,
  $window,
  lodash,
  pdfjs
) {
  var vm = this;

  var canvasId = 'the-canvas';
  var broadcastListener;

  vm.$onInit = init;
  vm.$onDestroy = destroy;
  vm.nextDocument = nextDocument;
  vm.previousDocument = previousDocument;
  vm.zoomIn = zoomIn;
  vm.zoomOut = zoomOut;
  vm.nextPage = nextPage;
  vm.previousPage = previousPage;
  vm.firstPage = firstPage;
  vm.lastPage = lastPage;

  function init() {
    broadcastListener = $rootScope.$on('item data loaded', loadItem);

    vm.config = {
      showDocuments: true,
      showItemInformation: false,
      pdfInfo: {},
      current: 0,
      scale: 1,
      currentPage: 1
    };
    loadItem();
  }

  function destroy() {
    broadcastListener();
  }

  function loadItem() {
    vm.loadingData = true;
    const collectionId = $state.params.collectionId;
    const itemId = $state.params.itemId;
    vm.loadingData = true;
    dataService.getItem(collectionId, itemId).then(processResponse);

    function processResponse(resp) {
      vm.item = resp;
      if (!lodash.isEmpty(vm.item)) {
        vm.documents = vm.item.documents.map(document =>
          document.split('/').pop()
        );
        if (!$state.params.documentId) {
          $state.go('main.documentInstance', {documentId: vm.documents[0]});
        }
        const documentId = $state.params.documentId;
        vm.config.current = vm.documents.indexOf(documentId);

        vm.loadingData = false;
        loadDocument();
      }
    }
  }

  // is a specific instance being requested? If so - strip the others
  //  from the set. Support the instance being defined by the name
  // if (vm.instanceId) {
  //   // it's not undefined
  //   vm.itemData.documents = _.filter(vm.itemData.documents, function(d) {
  //     return d.match(vm.instanceId);
  //   });
  // }

  function loadDocument() {
    //
    // Fetch the PDF document from the URL using promises
    //
    pdfjs.imageResourcePath = 'images/';
    pdfjs.cMapUrl = 'cmaps/';
    pdfjs.cMapPacked = true;
    pdfjs.disableWorker = true;
    pdfjs.disableRange = true;

    var what = {
      url: $sce.trustAsResourceUrl(vm.item.documents[vm.config.current]),
      withCredentials: true
    };

    // first page
    //  pages count from 1 - NOT 0
    // When loading a document, always start at the beginning

    if (!what.url) {
      return;
    }
    pdfjs.getDocument(what).then(function(pdf) {
      vm.pdf = pdf;
      getDocumentMetadata();

      loadPage();
    });

    function getDocumentMetadata() {
      vm.pdf.getMetadata().then(function(data) {
        $scope.$apply(function() {
          vm.config.pdfInfo.totalPages = vm.pdf.numPages;
          vm.config.pdfInfo.metadata = data;
        });
      });
    }
  }

  function loadPage() {
    // Using promise to fetch the page
    vm.pdf.getPage(vm.config.currentPage).then(function(page) {
      var viewport = page.getViewport(vm.config.scale);

      //
      // Prepare canvas using PDF page dimensions
      //
      var canvas = document.getElementById(canvasId);
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      //
      // Render PDF page into canvas context
      //
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  }

  function jump() {
    lodash.each(vm.documents, (document, idx) => {
      if (vm.config.current === idx) {
        $state.go('main.documentInstance', {documentId: document});
      }
    });
  }

  function nextDocument() {
    if (vm.config.current === vm.item.documents.length - 1) {
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

  function zoomIn() {
    vm.config.scale += 0.5;
    if (vm.config.scale > 3) {
      vm.config.scale = 3;
    }
    loadPage();
  }

  function zoomOut() {
    vm.config.scale -= 0.5;
    if (vm.config.scale < 0.5) {
      vm.config.scale = 0.5;
    }
    loadPage();
  }

  function nextPage() {
    if (vm.config.currentPage === vm.pdf.numPages) {
      return;
    }
    vm.config.currentPage += 1;
    loadPage();
  }

  function previousPage() {
    if (vm.config.currentPage === 1) {
      return;
    }
    vm.config.currentPage -= 1;
    loadPage();
  }

  function firstPage() {
    vm.config.currentPage = 1;
    loadPage();
  }

  function lastPage() {
    vm.config.currentPage = vm.pdf.numPages;
    loadPage();
  }
}
