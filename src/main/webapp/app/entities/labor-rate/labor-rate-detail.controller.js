(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('LaborRateDetailController', LaborRateDetailController);

    LaborRateDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'LaborRate'];

    function LaborRateDetailController($scope, $rootScope, $stateParams, entity, LaborRate) {
        var vm = this;
        vm.laborRate = entity;
        vm.load = function (id) {
            LaborRate.get({id: id}, function(result) {
                vm.laborRate = result;
            });
        };
        var unsubscribe = $rootScope.$on('jetsApp:laborRateUpdate', function(event, result) {
            vm.laborRate = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
