'use strict';

describe('Controller Tests', function() {

    describe('Indentifier Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockIndentifier, MockPerson;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockIndentifier = jasmine.createSpy('MockIndentifier');
            MockPerson = jasmine.createSpy('MockPerson');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Indentifier': MockIndentifier,
                'Person': MockPerson
            };
            createController = function() {
                $injector.get('$controller')("IndentifierDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'jetsApp:indentifierUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
