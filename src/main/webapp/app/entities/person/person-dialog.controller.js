(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('PersonDialogController', PersonDialogController);

    PersonDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Person', 'Organization', 'Project'];

    function PersonDialogController ($scope, $stateParams, $uibModalInstance, entity, Person, Organization, Project) {
        var vm = this;
        vm.person = entity;
        vm.organizations = Organization.query();
        vm.projects = Project.query();
        vm.load = function(id) {
            Person.get({id : id}, function(result) {
                vm.person = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('jetsApp:personUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.person.id !== null) {
                Person.update(vm.person, onSaveSuccess, onSaveError);
            } else {
                Person.save(vm.person, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
