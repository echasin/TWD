(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('IndentifierDetailController', IndentifierDetailController);

    IndentifierDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Indentifier', 'Person'];

    function IndentifierDetailController($scope, $rootScope, $stateParams, entity, Indentifier, Person) {
        var vm = this;
        vm.indentifier = entity;
        vm.load = function (id) {
            Indentifier.get({id: id}, function(result) {
                vm.indentifier = result;
            });
        };
        var unsubscribe = $rootScope.$on('jetsApp:indentifierUpdate', function(event, result) {
            vm.indentifier = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
