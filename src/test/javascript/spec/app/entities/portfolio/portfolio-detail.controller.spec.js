'use strict';

describe('Controller Tests', function() {

    describe('Portfolio Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPortfolio;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPortfolio = jasmine.createSpy('MockPortfolio');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Portfolio': MockPortfolio
            };
            createController = function() {
                $injector.get('$controller')("PortfolioDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'jetsApp:portfolioUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
