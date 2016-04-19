(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('PortfolioDialogController', PortfolioDialogController);

    PortfolioDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Portfolio', 'Project'];

    function PortfolioDialogController ($scope, $stateParams, $uibModalInstance, entity, Portfolio, Project) {
        var vm = this;
        vm.portfolio = entity;
        vm.projects = Project.query();
        vm.load = function(id) {
            Portfolio.get({id : id}, function(result) {
                vm.portfolio = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('jetsApp:portfolioUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.portfolio.id !== null) {
                Portfolio.update(vm.portfolio, onSaveSuccess, onSaveError);
            } else {
                Portfolio.save(vm.portfolio, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
