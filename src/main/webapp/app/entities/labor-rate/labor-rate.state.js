(function() {
    'use strict';

    angular
        .module('jetsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('labor-rate', {
            parent: 'entity',
            url: '/labor-rate?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jetsApp.laborRate.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/labor-rate/labor-rates.html',
                    controller: 'LaborRateController',
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
                    $translatePartialLoader.addPart('laborRate');
                    $translatePartialLoader.addPart('laborCategory');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('labor-rate-detail', {
            parent: 'entity',
            url: '/labor-rate/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jetsApp.laborRate.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/labor-rate/labor-rate-detail.html',
                    controller: 'LaborRateDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('laborRate');
                    $translatePartialLoader.addPart('laborCategory');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'LaborRate', function($stateParams, LaborRate) {
                    return LaborRate.get({id : $stateParams.id});
                }]
            }
        })
        .state('labor-rate.new', {
            parent: 'labor-rate',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/labor-rate/labor-rate-dialog.html',
                    controller: 'LaborRateDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                ratePerHour: null,
                                laborCategory: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('labor-rate', null, { reload: true });
                }, function() {
                    $state.go('labor-rate');
                });
            }]
        })
        .state('labor-rate.edit', {
            parent: 'labor-rate',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/labor-rate/labor-rate-dialog.html',
                    controller: 'LaborRateDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['LaborRate', function(LaborRate) {
                            return LaborRate.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('labor-rate', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('labor-rate.delete', {
            parent: 'labor-rate',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/labor-rate/labor-rate-delete-dialog.html',
                    controller: 'LaborRateDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['LaborRate', function(LaborRate) {
                            return LaborRate.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('labor-rate', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
