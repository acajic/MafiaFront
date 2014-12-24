var app = angular.module('mafiaApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.pointsAssign', 'timer', 'ui.minLengthNumber', 'ui.dateLocale', 'uniqque_filter', 'ngQuickDate', 'angularUtils.directives.dirDisqus', 'ui.acInput', 'ui.acHighlightText']);

app.config(function ($routeProvider, $locationProvider) {
    'use strict';

    // $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/cities/email_confirmation/:emailConfirmationCode', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/cities', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/register', {
        controller: 'RegisterController',
        templateUrl: 'app/partials/register.html'
    }).when('/profile', {
        controller: 'UserProfileController',
        templateUrl: 'app/partials/userProfile.html',
        resolve: {
            validate: function($q, $location, $route, authService) {
                var userMePromise = authService.userMe(false);

                $q.all(userMePromise).then(function(userMe) {
                    // everything ok
                }, function(reason) {
                    $location.path('/cities');
                });

            }
        }
    }).when('/cities/:cityId/details', {
        controller: 'CityCreateOrUpdateController',
        templateUrl: 'app/partials/city/details.html'
    }).when('/cities/create', {
        controller: 'CityCreateOrUpdateController',
        templateUrl: 'app/partials/city/createOrUpdate.html'
    }).when('/cities/:cityId/update', {
        controller: 'CityCreateOrUpdateController',
        templateUrl: 'app/partials/city/createOrUpdate.html'
    }).when('/cities/:cityId', {
        controller: 'CityController',
        templateUrl: 'app/partials/city/city.html'
    }).when('/cities/:cityId/discussion', {
        controller: 'CityDiscussionController',
        templateUrl: 'app/partials/city/cityDiscussion.html'
    }).when('/admin', {
        controller: 'AdminController',
        templateUrl: 'app/partials/admin/admin.html',
        resolve: {
            validate: function($q, $location, $route, authService) {
                var userMePromise = authService.userMe(false);

                return userMePromise.then(function(userMe) {
                    if (!userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_READ]) {
                        $location.path('/cities');
                    }
                });
            }
        }
    }).when('/admin/user/:user_id', {
        controller: 'AdminUserController',
        templateUrl: 'app/partials/admin/user.html',
        resolve: {
            validate: function($q, $location, $route, authService) {
                var userMePromise = authService.userMe(false);

                return userMePromise.then(function(userMe) {
                    if (!userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_READ]) {
                        $location.path('/cities');
                    }
                });
            }
        }
    }).when('/admin/city/:city_id', {
        controller: 'AdminCityController',
        templateUrl: 'app/partials/admin/city.html',
        resolve: {
            validate: function($q, $location, $route, authService) {
                var userMePromise = authService.userMe(false);

                return userMePromise.then(function(userMe) {
                    if (!userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_READ]) {
                        $location.path('/cities');
                    }
                });
            }
        }
    }).when('/admin/initial_app_role/new', {
        controller: 'AdminInitialAppRoleController',
        templateUrl: 'app/partials/admin/new_initial_app_role.html',
        resolve: {
            validate: function($q, $location, $route, authService) {
                var userMePromise = authService.userMe(false);

                return userMePromise.then(function(userMe) {
                    if (!userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE]) {
                        $location.path('/cities');
                    }
                });
            }
        }
    }).when('/admin/initial_app_role/:initial_app_role_id', {
        controller: 'AdminInitialAppRoleController',
        templateUrl: 'app/partials/admin/initial_app_role.html',
        resolve: {
            validate: function($q, $location, $route, authService) {
                var userMePromise = authService.userMe(false);

                return userMePromise.then(function(userMe) {
                    if (!userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE]) {
                        $location.path('/cities');
                    }
                });
            }
        }
    }).otherwise({redirectTo:'/cities'})


});