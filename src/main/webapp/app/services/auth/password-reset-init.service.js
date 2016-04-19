(function() {
    'use strict';

    angular
        .module('jetsApp')
        .factory('PasswordResetInit', PasswordResetInit);

    PasswordResetInit.$inject = ['$resource'];

    function PasswordResetInit($resource) {
        var service = $resource('api/account/reset_password/init', {}, {});

        return service;
    }
})();
