(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('LaborRateDialogController', LaborRateDialogController);

    LaborRateDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'LaborRate'];

    function LaborRateDialogController ($scope, $stateParams, $uibModalInstance, entity, LaborRate) {
        var vm = this;
        vm.laborRate = entity;
        vm.load = function(id) {
            LaborRate.get({id : id}, function(result) {
                vm.laborRate = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('jetsApp:laborRateUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.laborRate.id !== null) {
                LaborRate.update(vm.laborRate, onSaveSuccess, onSaveError);
            } else {
                LaborRate.save(vm.laborRate, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
