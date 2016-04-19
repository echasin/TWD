(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Project', 'Person'];

    function ProjectDetailController($scope, $rootScope, $stateParams, entity, Project, Person) {
        var vm = this;
        vm.project = entity;
        vm.load = function (id) {
            Project.get({id: id}, function(result) {
                vm.project = result;
            });
        };
        var unsubscribe = $rootScope.$on('jetsApp:projectUpdate', function(event, result) {
            vm.project = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
