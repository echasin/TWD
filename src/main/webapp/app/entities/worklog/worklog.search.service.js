(function() {
    'use strict';

    angular
        .module('jetsApp')
        .factory('WorklogSearch', WorklogSearch);

    WorklogSearch.$inject = ['$resource'];

    function WorklogSearch($resource) {
        var resourceUrl =  'api/_search/worklogs/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
