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

        element = $compile('<audio-element name="name" media-src="src" item-data="itemData"></audio-element>')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }));
};

