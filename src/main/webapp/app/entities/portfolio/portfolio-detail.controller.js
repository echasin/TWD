(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('PortfolioDetailController', PortfolioDetailController);

    PortfolioDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Portfolio'];

    function PortfolioDetailController($scope, $rootScope, $stateParams, entity, Portfolio) {
        var vm = this;
        vm.portfolio = entity;
        vm.load = function (id) {
            Portfolio.get({id: id}, function(result) {
                vm.portfolio = result;
            });
        };
        var unsubscribe = $rootScope.$on('jetsApp:portfolioUpdate', function(event, result) {
            vm.portfolio = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
