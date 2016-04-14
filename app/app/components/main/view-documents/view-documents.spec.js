'use strict';

describe('Directive: viewDocuments', function () {
    var $compile, $rootScope, $timeout, element, scope, data;

    beforeEach(module('pdsc'));
    beforeEach(module('my.templates'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, _data_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        scope = $rootScope.$new();
        data = _data_;
        scope.itemData = data.AC2['3'];
        element = $compile('<view-documents item-data="itemData" instance-id="instanceId"></item-documents')(scope);
        scope.$digest();
        scope = element.isolateScope();
    }));

});
