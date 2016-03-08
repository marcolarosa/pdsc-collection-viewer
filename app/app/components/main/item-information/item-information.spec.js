'use strict';

describe('Directive: itemInformation', function () {
    var $compile, $rootScope, $timeout, element, scope;

    beforeEach(module('pdsc'));
    beforeEach(module('my.templates'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        scope = $rootScope.$new();
        scope.itemData = {
            collectionId: 'AC2',
            itemId: 'VUNU105',
            contributor: [
                { name: 'Arthur Capell', role: 'compiler' },
                { name: 'Arthur Capell', role: 'researcher' }
            ],
        };
        element = $compile('<item-information item-data="itemData"></item-information')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }));

    it('should set the url on the scope', function() {
        expect(scope.url).toBe('http://server/');
    });
    it('should have some item data', function() {
        expect(scope.itemData).toBeDefined();
    });

});
