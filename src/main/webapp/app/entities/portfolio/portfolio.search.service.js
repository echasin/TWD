(function() {
    'use strict';

    angular
        .module('jetsApp')
        .factory('PortfolioSearch', PortfolioSearch);

    PortfolioSearch.$inject = ['$resource'];

    function PortfolioSearch($resource) {
        var resourceUrl =  'api/_search/portfolios/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
