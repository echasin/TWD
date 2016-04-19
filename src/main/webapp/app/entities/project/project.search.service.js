(function() {
    'use strict';

    angular
        .module('jetsApp')
        .factory('ProjectSearch', ProjectSearch);

    ProjectSearch.$inject = ['$resource'];

    function ProjectSearch($resource) {
        var resourceUrl =  'api/_search/projects/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
