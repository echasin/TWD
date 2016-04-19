(function() {
    'use strict';

    angular
        .module('jetsApp')
        .factory('IndentifierSearch', IndentifierSearch);

    IndentifierSearch.$inject = ['$resource'];

    function IndentifierSearch($resource) {
        var resourceUrl =  'api/_search/indentifiers/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
