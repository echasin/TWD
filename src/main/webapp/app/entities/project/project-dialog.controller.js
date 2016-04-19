(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('ProjectDialogController', ProjectDialogController);

    ProjectDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Project'];

    function ProjectDialogController ($scope, $stateParams, $uibModalInstance, entity, Project) {
        var vm = this;
        vm.project = entity;
        vm.load = function(id) {
            Project.get({id : id}, function(result) {
                vm.project = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('jetsApp:projectUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.project.id !== null) {
                Project.update(vm.project, onSaveSuccess, onSaveError);
            } else {
                Project.save(vm.project, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
