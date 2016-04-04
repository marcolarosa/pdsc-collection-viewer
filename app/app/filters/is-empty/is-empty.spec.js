'use strict';

describe('Filter: is-empty', function () {
    var isEmpty;

    beforeEach(module('pdsc'));
    beforeEach(inject(function(_$filter_) {
        isEmpty = _$filter_('isEmpty');
    }));

    it('should return true', function() {
        expect(isEmpty([])).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty()).toBe(true);
    });

    it('should return false', function() {
        expect(isEmpty('marco')).toBe(false);
        var something = 'banana';
        expect(isEmpty(something)).toBe(false);
    });
});
