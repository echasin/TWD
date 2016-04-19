(function() {
    'use strict';

    angular
        .module('jetsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('indentifier', {
            parent: 'entity',
            url: '/indentifier?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jetsApp.indentifier.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/indentifier/indentifiers.html',
                    controller: 'IndentifierController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('indentifier');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('indentifier-detail', {
            parent: 'entity',
            url: '/indentifier/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jetsApp.indentifier.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/indentifier/indentifier-detail.html',
                    controller: 'IndentifierDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('indentifier');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Indentifier', function($stateParams, Indentifier) {
                    return Indentifier.get({id : $stateParams.id});
                }]
            }
        })
        .state('indentifier.new', {
            parent: 'indentifier',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/indentifier/indentifier-dialog.html',
                    controller: 'IndentifierDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                value: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('indentifier', null, { reload: true });
                }, function() {
                    $state.go('indentifier');
                });
            }]
        })
        .state('indentifier.edit', {
            parent: 'indentifier',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/indentifier/indentifier-dialog.html',
                    controller: 'IndentifierDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Indentifier', function(Indentifier) {
                            return Indentifier.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('indentifier', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('indentifier.delete', {
            parent: 'indentifier',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/indentifier/indentifier-delete-dialog.html',
                    controller: 'IndentifierDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Indentifier', function(Indentifier) {
                            return Indentifier.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('indentifier', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
