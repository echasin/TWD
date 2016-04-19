'use strict';

describe('Controller Tests', function() {

    describe('LaborRate Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockLaborRate;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockLaborRate = jasmine.createSpy('MockLaborRate');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'LaborRate': MockLaborRate
            };
            createController = function() {
                $injector.get('$controller')("LaborRateDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'jetsApp:laborRateUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
