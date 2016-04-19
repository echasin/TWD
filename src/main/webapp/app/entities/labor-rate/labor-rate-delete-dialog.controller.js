(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('LaborRateDeleteController',LaborRateDeleteController);

    LaborRateDeleteController.$inject = ['$uibModalInstance', 'entity', 'LaborRate'];

    function LaborRateDeleteController($uibModalInstance, entity, LaborRate) {
        var vm = this;
        vm.laborRate = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            LaborRate.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
