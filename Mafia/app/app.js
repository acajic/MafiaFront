var app = angular.module('mafiaApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.pointsAssign', 'timer', 'ui.minLengthNumber', 'uniqque_filter', 'ngQuickDate']);

app.config(function ($routeProvider, $locationProvider) {
    'use strict';

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
        templateUrl: 'app/partials/city/createOrUpdate.html',
        resolve: {
            validate: function($q, $location, $route, citiesService, authService) {
                var cityId = $route.current.params['cityId'];

                var citiesPromise = citiesService.getCities(false);
                var userMePromise = authService.userMe(false);

                $q.all([citiesPromise, userMePromise]).then(function(result) {
                    var cities = result[0];
                    var userMe = result[1];

                    var city = $.grep(cities, function (city) {
                        return city.id == cityId;
                    })[0];

                    if (city.user_creator_id == userMe.id) {
                        // user is creator of selected city
                    } else {
                        // user is NOT creator of selected city
                        $location.path('/cities');
                    }
                }, function(reason) {
                    $location.path('/cities');
                });

            }
        }
    }).when('/cities/:cityId', {
        controller: 'CityController',
        templateUrl: 'app/partials/city/city.html',
        resolve: {
            validate: function($q, $location, $route, citiesService, authService) {
                var cityId = $route.current.params['cityId'];

                var citiesPromise = citiesService.getCities(false);
                var userMePromise = authService.userMe(false);

                return $q.all([citiesPromise, userMePromise], function(result) {
                    var cities = result[0];
                    var userMe = result[1];

                    var city = $.grep(cities, function (someCity) {
                        return someCity.id == cityId;
                    })[0];

                    if (!city) {
                        $location.path('/cities');
                    }

                    var resident = $.grep(city.residents, function (someResident) {
                        return someResident.user_id == userMe.id;
                    })[0];

                    if (!resident) {
                        $location.path('/cities');
                    }

                    if (!city.active) {
                        $location.path('/cities');
                    }

                }, function(reason) {
                    $location.path('/cities');
                });
            }
        }

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
    }).otherwise({redirectTo:'/cities'})


});