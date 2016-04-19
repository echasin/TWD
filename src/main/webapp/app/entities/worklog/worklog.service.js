(function() {
    'use strict';
    angular
        .module('jetsApp')
        .factory('Worklog', Worklog);

    Worklog.$inject = ['$resource'];

    function Worklog ($resource) {
        var resourceUrl =  'api/worklogs/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
