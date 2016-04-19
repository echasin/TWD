(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('WorklogDeleteController',WorklogDeleteController);

    WorklogDeleteController.$inject = ['$uibModalInstance', 'entity', 'Worklog'];

    function WorklogDeleteController($uibModalInstance, entity, Worklog) {
        var vm = this;
        vm.worklog = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Worklog.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
