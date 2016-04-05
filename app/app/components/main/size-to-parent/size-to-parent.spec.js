'use strict';

describe('Directive: sizeToParent', function () {
    var $compile, $window, conf, $rootScope, scope, element;

    beforeEach(module('pdsc'));
    beforeEach(module('my.templates'));

    beforeEach(inject(function (_$compile_, _$window_, _configuration_, _$rootScope_) {
        $compile = _$compile_;
        $window = _$window_;
        conf = _configuration_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();

        conf.header.toolbar = 10;
        conf.header.headline = 10;
        conf.header.controls = 10;
        element = $compile('<div size-to-parent></div')(scope);
        scope.$digest();
    }));

    it('should set a scope variable called panelStyle', function() {
        expect(scope.panelStyle).toBeDefined();
    });

    it('should calculate the panel height correctly', function() {
        expect(scope.panelStyle.height).toBe('283px');
    });

});
