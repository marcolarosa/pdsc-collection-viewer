'use strict';

var $compile, $rootScope, $timeout, element, scope, $mdSidenav;

var setup = function(collectionId, itemId) {
    beforeEach(module('pdsc'));
    beforeEach(module('my.templates'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, _data_, _$mdSidenav_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $mdSidenav = _$mdSidenav_;
        scope = $rootScope.$new();
        scope.itemData = _data_[collectionId][itemId];
        element = $compile('<view-image-set item-data="itemData"></view-image-set>')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }));
};

describe('Directive: viewImageSet - one image in set', function () {
    setup('AC2', '1');
    it('should disable the pagination and thumbnail controls', function() {
        scope.figureOutPaginationControls();
        expect(scope.showNext).toBe(false);
        expect(scope.showPrevious).toBe(false);
        expect(scope.disableThumbnailView).toBe(true);
    });

});

describe('Directive: viewImageSet - multiple images in set', function() {
    setup('AC2', '6');
    it('should show the correct pagination and thumbnail controls at item 0 in the set', function() {
        scope.figureOutPaginationControls();
        expect(scope.showNext).toBe(true);
        expect(scope.showPrevious).toBe(false);
        expect(scope.disableThumbnailView).toBe(false);
    });

    it('should show the correct pagination and thumbail controls at the last item in the set', function() {
        scope.current = scope.itemData.images.length - 1;
        scope.figureOutPaginationControls();
        expect(scope.showNext).toBe(false);
        expect(scope.showPrevious).toBe(true);
        expect(scope.disableThumbnailView).toBe(false);
    });

    it('should show the correct pagination and thumbail controls in the middle of the set', function() {
        scope.current = 1;
        scope.figureOutPaginationControls();
        expect(scope.showNext).toBe(true);
        expect(scope.showPrevious).toBe(true);
        expect(scope.disableThumbnailView).toBe(false);
    });

    it('should advance current by 1', function() {
        scope.current = 0;
        scope.next();
        expect(scope.current).toBe(1);
    });

    it('end of set so next should do nothing', function() {
        scope.current = scope.itemData.images.length - 1;
        scope.next();
        expect(scope.current).toBe(scope.itemData.images.length - 1);
    });

    it('should roll back 1', function() {
        scope.current = 1;
        scope.previous();
        expect(scope.current).toBe(0);
    });

    it('start of set so previous should do nothing', function() {
        scope.current = 0;
        scope.previous();
        expect(scope.current).toBe(0);
    });

    it('should jump to the beginning', function() {
        scope.jumpToStart();
        expect(scope.current).toBe(0);
    });

    it('should jump to the end', function() {
        scope.jumpToEnd();
        expect(scope.current).toBe(scope.itemData.images.length - 1);
    });

    it('should rotate left by 90 degrees', function() {
        scope.rotateLeft();
        expect(scope.currentRotation).toBe(-90);
    });
    
    it('should rotate right by 90 degrees', function() {
        scope.rotateRight();
        expect(scope.currentRotation).toBe(90);
    });

    it('should zoom in by one step', function() {
        var scale = scope.currentScale;
        scope.zoomIn();
        expect(scope.currentScale).toBe(scale + scope.scaleStep);
    });

    it('should zoom out by one step', function() {
        var scale = scope.currentScale;
        scope.zoomOut();
        expect(scope.currentScale).toBe(scale - scope.scaleStep);
    });

    it('should not zoom in past a scale of 3', function() {
        scope.currentScale = 3;
        scope.zoomIn();
        expect(scope.currentScale).toBe(3);
    });

    it('should not zoom out past a scale of 0.2', function() {
        scope.currentScale = 0.2;
        scope.zoomOut();
        expect(scope.currentScale).toBe(0.2);
    });

    it('should set transformOrigin to "left top"', function() {
        scope.currentRotation = 0;
        scope.setTransformOrigin();
        expect(scope.transformOrigin).toBe('left top');

        scope.currentRotation = 360;
        scope.setTransformOrigin();
        expect(scope.transformOrigin).toBe('left top');

        scope.currentRotation = -360;
        scope.setTransformOrigin();
        expect(scope.transformOrigin).toBe('left top');
    });

    it('should set transformOrigin to "center center"', function() {
        scope.currentRotation = 90;
        scope.setTransformOrigin();
        expect(scope.transformOrigin).toBe('center center');
    });

    it('should toggle the filmstrip view', function() {
        scope.toggleFilmstrip();
        expect($mdSidenav('thumbnailFilmstrip').isOpen()).toBe(true);
    });

    it('should close the sidnav and load the next image', function() {
        scope.current = 0;
        scope.toggleFilmstrip();
        scope.current = 2;
        scope.$digest();
        expect($mdSidenav('thumbnailFilmstrip').isOpen()).toBe(false);
    });

});
