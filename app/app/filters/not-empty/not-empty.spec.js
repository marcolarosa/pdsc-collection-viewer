'use strict';

describe('Filter: not-empty', function () {
    var notEmpty;

    beforeEach(module('pdsc'));
    beforeEach(inject(function(_$filter_) {
        notEmpty = _$filter_('notEmpty');
    }));

    it('should return true', function() {
        expect(notEmpty([])).toBe(true);
        expect(notEmpty('')).toBe(true);
        expect(notEmpty()).toBe(true);
    });

    it('should return false', function() {
        expect(notEmpty('marco')).toBe(false);
        var something = 'banana';
        expect(notEmpty(something)).toBe(false);
    });
});
