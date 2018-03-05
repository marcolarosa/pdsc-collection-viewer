'use strict';

describe('Filter: trust-as-html', function () {
    var trustAsHtml;

    beforeEach(module('pdsc'));
    beforeEach(inject(function(_$filter_) {
        trustAsHtml = _$filter_('trustAsHtml');
    }));

    it('should return something', function() {
        expect(trustAsHtml('http://some.resource.html')).toBeDefined();
    });

});
