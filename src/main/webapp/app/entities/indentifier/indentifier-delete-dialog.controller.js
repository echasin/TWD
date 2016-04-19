(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('IndentifierDeleteController',IndentifierDeleteController);

    IndentifierDeleteController.$inject = ['$uibModalInstance', 'entity', 'Indentifier'];

    function IndentifierDeleteController($uibModalInstance, entity, Indentifier) {
        var vm = this;
        vm.indentifier = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Indentifier.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
