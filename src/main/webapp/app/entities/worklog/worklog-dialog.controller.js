(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('WorklogDialogController', WorklogDialogController);

    WorklogDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Worklog'];

    function WorklogDialogController ($scope, $stateParams, $uibModalInstance, entity, Worklog) {
        var vm = this;
        vm.worklog = entity;
        vm.load = function(id) {
            Worklog.get({id : id}, function(result) {
                vm.worklog = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('jetsApp:worklogUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.worklog.id !== null) {
                Worklog.update(vm.worklog, onSaveSuccess, onSaveError);
            } else {
                Worklog.save(vm.worklog, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
