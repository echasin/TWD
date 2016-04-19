(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('WorklogDetailController', WorklogDetailController);

    WorklogDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Worklog'];

    function WorklogDetailController($scope, $rootScope, $stateParams, entity, Worklog) {
        var vm = this;
        vm.worklog = entity;
        vm.load = function (id) {
            Worklog.get({id: id}, function(result) {
                vm.worklog = result;
            });
        };
        var unsubscribe = $rootScope.$on('jetsApp:worklogUpdate', function(event, result) {
            vm.worklog = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
