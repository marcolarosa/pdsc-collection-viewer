'use strict';

var $compile, $rootScope, element, scope;

var setup = function(collectionId, itemId, name) {
    beforeEach(module('pdsc'));
    beforeEach(module('my.templates'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _data_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        scope = $rootScope.$new();
        scope.itemData = _data_[collectionId][itemId];
        scope.name = name;
        scope.src = scope.itemData.audio[scope.name];

        element = $compile('<video-element name="name" media-src="src" item-data="itemData"></video-element>')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }));
};

describe('Directive: video element', function () {
    setup('AC2', '4', 'AC2-4-001');
    it('should have trs transcription data', function() {
        expect(scope.trs).toBe(scope.itemData.trs['AC2-4-001']);
    });
});

describe('Directive: video element', function () {
    setup('AC2', '5', 'AC2-5-001');
    it('should have eaf transcription data', function() {
        expect(scope.trs).toBe(scope.itemData.eaf['AC2-5-002']);
    });
});

describe('Directive: video element', function () {
    setup('AC2', '5', 'AC2-5-002');
    it('should enable the media when it\'s ready to play', function() {
        scope.mediaReady();
        expect(scope.mediaReadyToPlay).toBe(true);
    });
});
