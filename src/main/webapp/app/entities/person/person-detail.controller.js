(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('PersonDetailController', PersonDetailController);

    PersonDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Person', 'Organization', 'Project'];

    function PersonDetailController($scope, $rootScope, $stateParams, entity, Person, Organization, Project) {
        var vm = this;
        vm.person = entity;
        vm.load = function (id) {
            Person.get({id: id}, function(result) {
                vm.person = result;
            });
        };
        var unsubscribe = $rootScope.$on('jetsApp:personUpdate', function(event, result) {
            vm.person = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
