(function() {
    'use strict';
    angular
        .module('jetsApp')
        .factory('Portfolio', Portfolio);

    Portfolio.$inject = ['$resource'];

    function Portfolio ($resource) {
        var resourceUrl =  'api/portfolios/:id';

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
