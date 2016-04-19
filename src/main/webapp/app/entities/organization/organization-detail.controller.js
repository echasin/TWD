(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('OrganizationDetailController', OrganizationDetailController);

    OrganizationDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Organization', 'Person'];

    function OrganizationDetailController($scope, $rootScope, $stateParams, entity, Organization, Person) {
        var vm = this;
        vm.organization = entity;
        vm.load = function (id) {
            Organization.get({id: id}, function(result) {
                vm.organization = result;
            });
        };
        var unsubscribe = $rootScope.$on('jetsApp:organizationUpdate', function(event, result) {
            vm.organization = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
