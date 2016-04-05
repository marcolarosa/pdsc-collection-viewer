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
        scope.trs = scope.itemData.trs[scope.name];
        scope.currentTime = 0;

        element = $compile('<render-transcription transcription="trs" name="name" current-time="currentTime"></render-transcription')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }));
};

describe('Directive: render transcription', function () {
    setup('AC2', '2', 'AC2-2-001');
    it('should start with the transcription hidden', function() {
        expect(scope.st).toBe(false);
    });

    it('should create the transcript variable on the scope', function() {
        expect(scope.transcript).toBeDefined();
    });
    it('the transcript variable should have two elements', function() {
        expect(scope.transcript.length).toBe(2);
    });
});
