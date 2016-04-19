(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('PortfolioDeleteController',PortfolioDeleteController);

    PortfolioDeleteController.$inject = ['$uibModalInstance', 'entity', 'Portfolio'];

    function PortfolioDeleteController($uibModalInstance, entity, Portfolio) {
        var vm = this;
        vm.portfolio = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Portfolio.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
