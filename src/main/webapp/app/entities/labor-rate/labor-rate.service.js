(function() {
    'use strict';
    angular
        .module('jetsApp')
        .factory('LaborRate', LaborRate);

    LaborRate.$inject = ['$resource'];

    function LaborRate ($resource) {
        var resourceUrl =  'api/labor-rates/:id';

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
