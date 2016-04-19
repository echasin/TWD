(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('OrganizationDialogController', OrganizationDialogController);

    OrganizationDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Organization', 'Person'];

    function OrganizationDialogController ($scope, $stateParams, $uibModalInstance, entity, Organization, Person) {
        var vm = this;
        vm.organization = entity;
        vm.persons = Person.query();
        vm.load = function(id) {
            Organization.get({id : id}, function(result) {
                vm.organization = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('jetsApp:organizationUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.organization.id !== null) {
                Organization.update(vm.organization, onSaveSuccess, onSaveError);
            } else {
                Organization.save(vm.organization, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
