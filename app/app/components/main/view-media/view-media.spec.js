'use strict';

var $compile, $rootScope, element, scope, $routeParams;

var setup = function(collectionId, itemId, instanceId) {
    beforeEach(module('pdsc'));
    beforeEach(module('my.templates'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _data_, _$routeParams_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $routeParams = _$routeParams_;

        scope = $rootScope.$new();
        scope.itemData = _data_[collectionId][itemId];
        scope.instanceId = instanceId;

        element = $compile('<view-media item-data="itemData" instance-id="instanceId"></view-media>')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }));
};

describe('Directive: view-media - one audio file in set', function () {
    setup('AC2', '2');
    it('should load the audio player', function() {
        expect(scope.loadAudioPlayer).toBe(true);
    });
});

describe('Directive: view-media - one video file in set', function() {
    setup('AC2', '4');
    it('should load the video player', function() {
        expect(scope.loadVideoPlayer).toBe(true);
    });
});

describe('Directive: view-media - load specific audio file', function() {
    setup('AC2', '2', 'AC2-2-001');
    it('should load the audio player', function() {
        expect(scope.loadAudioPlayer).toBe(true);
    });
});

describe('Directive: view-media - load specific video file', function() {
    setup('AC2', '4', 'AC2-4-001');
    it('should load the video player', function() {
        expect(scope.loadVideoPlayer).toBe(true);
    });
});

describe('Directive: view-media - load specific audio file with play times', function() {
    setup('AC2', '2', 'AC2-2-001');
    var instantiate = function() {
        element = $compile('<view-media item-data="itemData" instance-id="instanceId"></view-media>')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }

    it('should set start and end play time', function() {
        $routeParams.start = '0';
        $routeParams.end = '5';
        instantiate();

        expect(scope.loadAudioPlayer).toBe(true);
        expect(scope.time).toBe('#t=' + $routeParams.start + ',' + $routeParams.end);
    });
    it('should set start time only', function() {
        $routeParams.start = '0';
        instantiate();

        expect(scope.loadAudioPlayer).toBe(true);
        expect(scope.time).toBe('#t=' + $routeParams.start);
    });
    it('should set end time only', function() {
        $routeParams.end = '5';
        instantiate();

        expect(scope.loadAudioPlayer).toBe(true);
        expect(scope.time).toBe('#t=,' + $routeParams.end);
    });

});
