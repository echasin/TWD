'use strict';

describe('Controller Tests', function() {

    describe('Organization Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockOrganization, MockPerson;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockOrganization = jasmine.createSpy('MockOrganization');
            MockPerson = jasmine.createSpy('MockPerson');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Organization': MockOrganization,
                'Person': MockPerson
            };
            createController = function() {
                $injector.get('$controller')("OrganizationDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'jetsApp:organizationUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
