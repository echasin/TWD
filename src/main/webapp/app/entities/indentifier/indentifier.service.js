(function() {
    'use strict';
    angular
        .module('jetsApp')
        .factory('Indentifier', Indentifier);

    Indentifier.$inject = ['$resource'];

    function Indentifier ($resource) {
        var resourceUrl =  'api/indentifiers/:id';

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
