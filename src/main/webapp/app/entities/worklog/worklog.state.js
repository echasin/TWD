(function() {
    'use strict';

    angular
        .module('jetsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('worklog', {
            parent: 'entity',
            url: '/worklog',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jetsApp.worklog.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/worklog/worklogs.html',
                    controller: 'WorklogController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('worklog');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('worklog-detail', {
            parent: 'entity',
            url: '/worklog/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'jetsApp.worklog.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/worklog/worklog-detail.html',
                    controller: 'WorklogDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('worklog');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Worklog', function($stateParams, Worklog) {
                    return Worklog.get({id : $stateParams.id});
                }]
            }
        })
        .state('worklog.new', {
            parent: 'worklog',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/worklog/worklog-dialog.html',
                    controller: 'WorklogDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                hours: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('worklog', null, { reload: true });
                }, function() {
                    $state.go('worklog');
                });
            }]
        })
        .state('worklog.edit', {
            parent: 'worklog',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/worklog/worklog-dialog.html',
                    controller: 'WorklogDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Worklog', function(Worklog) {
                            return Worklog.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('worklog', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('worklog.delete', {
            parent: 'worklog',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/worklog/worklog-delete-dialog.html',
                    controller: 'WorklogDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Worklog', function(Worklog) {
                            return Worklog.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('worklog', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
