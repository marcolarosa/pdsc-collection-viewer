'use strict';

describe('Directive: storeHeight', function () {
    var $compile, $window, conf, $rootScope, scope, element;

    beforeEach(module('pdsc'));
    beforeEach(module('my.templates'));

    beforeEach(inject(function (_$compile_, _$window_, _configuration_, _$rootScope_) {
        $compile = _$compile_;
        $window = _$window_;
        conf = _configuration_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();

        element = $compile('<div store-height element="toolbar"></div')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }));

    it('should set a value for conf.header.toolbar', function() {
        expect(conf.header.toolbar).toBeDefined();
    });

    it('should set the height of the toolbar', function() {
        expect(conf.header.toolbar).toBe(0);
    });



});
