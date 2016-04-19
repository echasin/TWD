(function() {
    'use strict';

    angular
        .module('jetsApp')
        .controller('WorklogController', WorklogController);

    WorklogController.$inject = ['$scope', '$state', 'Worklog', 'WorklogSearch'];

    function WorklogController ($scope, $state, Worklog, WorklogSearch) {
        var vm = this;
        vm.worklogs = [];
        vm.loadAll = function() {
            Worklog.query(function(result) {
                vm.worklogs = result;
            });
        };

        vm.search = function () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            WorklogSearch.query({query: vm.searchQuery}, function(result) {
                vm.worklogs = result;
            });
        };
        vm.loadAll();
        
    }
})();
