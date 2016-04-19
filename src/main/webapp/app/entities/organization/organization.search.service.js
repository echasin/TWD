(function() {
    'use strict';

    angular
        .module('jetsApp')
        .factory('OrganizationSearch', OrganizationSearch);

    OrganizationSearch.$inject = ['$resource'];

    function OrganizationSearch($resource) {
        var resourceUrl =  'api/_search/organizations/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
