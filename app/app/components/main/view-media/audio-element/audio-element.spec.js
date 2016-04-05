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
});
