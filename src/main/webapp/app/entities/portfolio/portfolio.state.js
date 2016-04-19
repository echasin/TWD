(function() {
    'use strict';

    angular
        .module('jetsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('portfolio', {
            parent: 'entity',
            url: '/portfolio?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jetsApp.portfolio.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/portfolio/portfolios.html',
                    controller: 'PortfolioController',
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
                    $translatePartialLoader.addPart('portfolio');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('portfolio-detail', {
            parent: 'entity',
            url: '/portfolio/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jetsApp.portfolio.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/portfolio/portfolio-detail.html',
                    controller: 'PortfolioDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('portfolio');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Portfolio', function($stateParams, Portfolio) {
                    return Portfolio.get({id : $stateParams.id});
                }]
            }
        })
        .state('portfolio.new', {
            parent: 'portfolio',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/portfolio/portfolio-dialog.html',
                    controller: 'PortfolioDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                identifierJson: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('portfolio', null, { reload: true });
                }, function() {
                    $state.go('portfolio');
                });
            }]
        })
        .state('portfolio.edit', {
            parent: 'portfolio',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/portfolio/portfolio-dialog.html',
                    controller: 'PortfolioDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Portfolio', function(Portfolio) {
                            return Portfolio.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('portfolio', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('portfolio.delete', {
            parent: 'portfolio',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/portfolio/portfolio-delete-dialog.html',
                    controller: 'PortfolioDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Portfolio', function(Portfolio) {
                            return Portfolio.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('portfolio', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
