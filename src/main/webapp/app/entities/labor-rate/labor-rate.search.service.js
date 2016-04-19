(function() {
    'use strict';

    angular
        .module('jetsApp')
        .factory('LaborRateSearch', LaborRateSearch);

    LaborRateSearch.$inject = ['$resource'];

    function LaborRateSearch($resource) {
        var resourceUrl =  'api/_search/labor-rates/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
