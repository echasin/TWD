(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('IndentifierDialogController', IndentifierDialogController);

    IndentifierDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Indentifier', 'Person'];

    function IndentifierDialogController ($scope, $stateParams, $uibModalInstance, entity, Indentifier, Person) {
        var vm = this;
        vm.indentifier = entity;
        vm.persons = Person.query();
        vm.load = function(id) {
            Indentifier.get({id : id}, function(result) {
                vm.indentifier = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('jetsApp:indentifierUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.indentifier.id !== null) {
                Indentifier.update(vm.indentifier, onSaveSuccess, onSaveError);
            } else {
                Indentifier.save(vm.indentifier, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
