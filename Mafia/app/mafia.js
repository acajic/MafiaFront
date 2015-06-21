 
 
// app 
 
var app = angular.module('mafiaApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.pointsAssign', 'timer', 'ui.minLengthNumber', 'ui.dateLocale', 'uniqque_filter', 'ngQuickDate', 'angularUtils.directives.dirDisqus', 'ui.acInput', 'ui.acHighlightText', 'ui.acTimezonePicker', 'ui.acRelativeDate', 'angulartics', 'angulartics.google.analytics', 'ngSanitize']);

app.config(function ($routeProvider, $locationProvider) {
    'use strict';



    registerHomeUrls($routeProvider);

    $routeProvider.when('/unsubscribe', {
        controller: 'UnsubscribeController',
        templateUrl: 'app/partials/unsubscribe.html'
    }).when('/cities/email_confirmation/:emailConfirmationCode', {
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
        templateUrl: 'app/partials/admin/newInitialAppRole.html',
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
        templateUrl: 'app/partials/admin/initialAppRole.html',
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
    }).when('/admin/granted_app_role/new', {
        controller: 'AdminGrantedAppRoleController',
        templateUrl: 'app/partials/admin/grantedAppRole.html',
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
    }).when('/admin/granted_app_role/:granted_app_role_id', {
        controller: 'AdminGrantedAppRoleController',
        templateUrl: 'app/partials/admin/grantedAppRole.html',
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
    }).when('/admin/payment_log/new', {
        controller: 'AdminPaymentLogController',
        templateUrl: 'app/partials/admin/paymentLog.html',
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
    }).when('/admin/payment_log/:payment_log_id', {
        controller: 'AdminPaymentLogController',
        templateUrl: 'app/partials/admin/paymentLog.html',
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
    }).when('/admin/subscription_purchase/new', {
        controller: 'AdminSubscriptionPurchaseController',
        templateUrl: 'app/partials/admin/subscriptionPurchase.html',
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
    }).when('/admin/subscription_purchase/:subscription_purchase_id', {
        controller: 'AdminSubscriptionPurchaseController',
        templateUrl: 'app/partials/admin/subscriptionPurchase.html',
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
    }).when('/admin/game_purchase/new', {
        controller: 'AdminGamePurchaseController',
        templateUrl: 'app/partials/admin/gamePurchase.html',
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
    }).when('/admin/game_purchase/:game_purchase_id', {
        controller: 'AdminGamePurchaseController',
        templateUrl: 'app/partials/admin/gamePurchase.html',
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
    }).when('/admin/role_pick_purchase/new', {
        controller: 'AdminRolePickPurchaseController',
        templateUrl: 'app/partials/admin/rolePickPurchase.html',
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
    }).when('/admin/role_pick_purchase/:role_pick_purchase_id', {
        controller: 'AdminRolePickPurchaseController',
        templateUrl: 'app/partials/admin/rolePickPurchase.html',
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
    });
//    .otherwise({
//        redirectTo: '/cities'
//    });


    $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');

});


app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);




function registerHomeUrls(routeProvider) {
    routeProvider.when('/', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/cities', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/my', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/all', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/welcome', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/about', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/roles', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    }).when('/advanced', {
        controller: 'CitiesController',
        templateUrl: 'app/partials/cities.html'
    })
}


 
 
// appController 
 
app.controller('AppController', function ($scope) {
    "use strict";

    init();

    function init() {
    }

}); 
 
// citiesController 
 
app.controller('CitiesController',function ($scope, $route, $routeParams, $timeout, $location, citiesService, authService, modalService, layoutService) {
    "use strict";


    var pageIndexAllCities = 0;
    var pageSizeAllCities = 10;


    $scope.reloadAllCities = function(refresh) {
        refreshDateNow();

        $scope.isLoadingContentAllCities = true;
        $scope.showLoadAdditionalAllCitiesButton = false;

        if (refresh) {
            pageIndexAllCities = 0;
            $scope.allCities = [];
        }

        var citiesPromise = citiesService.getAllCities({}, pageIndexAllCities, pageSizeAllCities);


        citiesPromise.then(function(citiesResult) {
            $scope.isLoadingContentAllCities = false;
            if (citiesResult.length < pageSizeAllCities) {
                $scope.noMoreContentAllCities = true;
                $scope.showLoadAdditionalAllCitiesButton = false;
            } else {
                $scope.noMoreContentAllCities = false;
                $scope.showLoadAdditionalAllCitiesButton = true;
            }

            pageIndexAllCities++;
            $scope.allCities.push.apply($scope.allCities, citiesResult);
        }, function(reason) {
            $scope.isLoadingContentAllCities = false;
        });


    };

    $scope.allCitiesSearchAction = function() {

        var searchText = $scope.allCitiesFilterModel.searchText;
        if (searchText.length < 3) {
            $scope.allSearchCities = [];
            return;
        }
        var allCitiesForSearchTextPromise = citiesService.getAllCitiesForSearch(searchText);
        allCitiesForSearchTextPromise.then(function(results) {
            $scope.allSearchCities = results;
        }, function(reason) {
            // error handling ignored
        });

    };

    $scope.allCitiesIsSearchActiveWillChange = function() {
        // .selectedAllCities.rowId = null;
        if (!$scope.allCitiesFilterModel.isSearchActive) { // about to become TRUE
            $timeout(function() {
                $("#search-all-cities-ac-input input[type=text]").focus();
            }, 100);

        }
    };



    var pageIndexMyCities = 0;
    var pageSizeMyCities = 10;

    $scope.reloadMyCities = function(refresh) {
        refreshDateNow();

        $scope.isLoadingContentMyCities = true;
        $scope.showLoadAdditionalMyCitiesButton = false;

        if (refresh) {
            pageIndexMyCities = 0;
            $scope.myCities = [];
        }

        authService.userMe().then(function(userMe) {
            var citiesPromise = citiesService.getMyCities(pageIndexMyCities, pageSizeMyCities);


            citiesPromise.then(function(citiesResult) {
                $scope.isLoadingContentMyCities = false;
                if (citiesResult.length < pageSizeMyCities) {
                    $scope.noMoreContentMyCities = true;
                    $scope.showLoadAdditionalMyCitiesButton = false;
                } else {
                    $scope.noMoreContentMyCities = false;
                    $scope.showLoadAdditionalMyCitiesButton = true;
                }

                pageIndexMyCities++;
                $scope.myCities.push.apply($scope.myCities, citiesResult);
            }, function(reason) {

                $scope.isLoadingContentMyCities = false;
            });
        }, function(reason) {
            $scope.myCities = [];
            $scope.noMoreContentMyCities = true;
            $scope.isLoadingContentMyCities = false;
        });

    };

    $scope.myCitiesIsSearchActiveWillChange = function() {
        // $scope.selectedMyCities.rowId = null;
        if (!$scope.myCitiesFilterModel.isSearchActive) { // about to become TRUE
            $timeout(function() {
                $("#search-my-cities-ac-input input[type=text]").focus();
            }, 100);

        }
    };

    $scope.myCitiesSearchAction = function() {

        var searchText = $scope.myCitiesFilterModel.searchText;
        if (searchText.length < 3) {
            $scope.mySearchCities = [];
            return;
        }
        var myCitiesForSearchTextPromise = citiesService.getMyCitiesForSearch(searchText);
        myCitiesForSearchTextPromise.then(function(results) {
            $scope.mySearchCities = results;
        }, function(reason) {
            // error handling ignored
        });

    };

    $scope.newCity = function () {
        $scope.isOpeningNewCity = true;

        $timeout(function () {
            $location.path('/cities/create');
        }, 20);

    };

    $scope.editCity = function (city) {
        $scope.isPerformingCityOperation = true;

        $timeout(function () {
            $location.path('/cities/' + city.id + '/update');
        }, 20);
    };

    $scope.showCity = function(city) {
        $scope.isPerformingCityOperation = true;

        $timeout(function () {
            $location.path('/cities/' + city.id + "/details");
        }, 20);

    };

    $scope.enterCity = function(city) {
        $scope.isPerformingCityOperation = true;

        $timeout(function () {
            $location.path('/cities/' + city.id);
        }, 20);

    };

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.joinCity = function(city) {
        $scope.isPerformingCityOperation = true;


        var joinCityPromise = citiesService.joinCity(city.id, $scope.selectedCity.joinCityPassword);
        joinCityPromise.then(function(result) {
            var updatedCity = result.city;
            $timeout(function() {
                if (result.outcome == 1) {
                    $scope.alerts.push({type: "success", msg: "Successfully joined '" + updatedCity.name + "'."});
                } else if (result.outcome == 2) {
                    $scope.alerts.push({type: "success", msg: "Submitted request to join '" + updatedCity.name + "'. Game creator must approve your request."});
                } else if (result.outcome == 3) {
                    $scope.alerts.push({type: "success", msg: "You have already requested to join '" + updatedCity.name + "'. Game creator must approve your request."});
                }
                $scope.isPerformingCityOperation = false;
            });

            refreshCityId(city.id, updatedCity);

            $scope.selectedCity = updatedCity;
        }, function(reason) {
            $timeout(function() {
                $scope.alerts.push({type: "danger", msg: "Failed to join '" + city.name + "'."});
                $scope.isPerformingCityOperation = false;
            });

        });

    };

    $scope.acceptInvitationForCity = function(city) {

        $scope.isPerformingCityOperation = true;


        var acceptInvitationPromise = citiesService.acceptInvitation(city.id);
        acceptInvitationPromise.then(function(result) {
            var updatedCity = result;
            $timeout(function() {
                $scope.alerts.push({type: "success", msg: "Accepted invitation to join '" + updatedCity.name + "'."});
                $scope.isPerformingCityOperation = false;
            });



            refreshCityId(city.id, updatedCity);

            $scope.selectedCity = updatedCity;
        }, function(reason) {
            $timeout(function() {
                $scope.alerts.push({type: "danger", msg: "Failed to accept invitation to join '" + city.name + "'."});
                $scope.isPerformingCityOperation = false;
            });

        });




    };

    $scope.leaveCity = function(city) {
        $scope.isPerformingCityOperation = true;



        var leaveCityPromise = citiesService.leaveCity(city.id);
        leaveCityPromise.then(function(updatedCity) {
            $timeout(function() {
                $scope.alerts.push({type: "success", msg: "Successfully left '" + updatedCity.name + "'."});
                $scope.isPerformingCityOperation = false;
            });


            var indexMyCities = $scope.myCities.indexOfMatchFunction(function(someCity) {
                return someCity.id == city.id;
            });
            $scope.myCities.splice(indexMyCities, 1);

            var indexAllCities = $scope.allCities.indexOfMatchFunction(function(someCity) {
                return someCity.id == city.id;
            });

            if (indexAllCities < 0) {
                $scope.reloadAllCities(true);
            } else {
                $scope.allCities.splice(indexAllCities, 1, updatedCity);
            }

            $scope.selectedCity = updatedCity;
        }, function(reason) {
            $timeout(function() {
                $scope.alerts.push({type: "danger", msg: "Failed to leave '" + city.name + "'."});
                $scope.isPerformingCityOperation = false;
            });

        });
    };

    $scope.cancelJoinRequestForCity = function(city) {
        $scope.isPerformingCityOperation = true;


        var cancelJoinRequestPromise = citiesService.cancelJoinRequest(city.id);
        cancelJoinRequestPromise.then(function(updatedCity) {
            $timeout(function() {
                $scope.alerts.push({type: "success", msg: "No longer requesting to join '" + updatedCity.name + "'."});
                $scope.isPerformingCityOperation = false;
            });


            var indexMyCities = $scope.myCities.indexOfMatchFunction(function(someCity) {
                return someCity.id == city.id;
            });
            $scope.myCities.splice(indexMyCities, 1);

            var indexAllCities = $scope.allCities.indexOfMatchFunction(function(someCity) {
                return someCity.id == city.id;
            });

            if (indexAllCities < 0) {
                $scope.reloadAllCities(true);
            } else {
                $scope.allCities.splice(indexAllCities, 1, updatedCity);
            }

            $scope.selectedCity = updatedCity;
        }, function(reason) {
            $timeout(function() {
                $scope.alerts.push({type: "danger", msg: "Failed to cancel join request to '" + city.name + "'."});
                $scope.isPerformingCityOperation = false;
            });

        });
    };

    var refreshCityId = function(cityId, newCity) {
        var indexMyCities = $scope.myCities.indexOfMatchFunction(function(city) {
            return city.id == cityId;
        });

        if (indexMyCities < 0) {
            $scope.reloadMyCities(true);
        } else {
            $scope.myCities.splice(indexMyCities, 1, newCity);
        }

        var indexAllCities = $scope.allCities.indexOfMatchFunction(function(city) {
            return city.id == cityId;
        });

        if (indexAllCities < 0) {
            $scope.reloadAllCities(true);
        } else {
            $scope.allCities.splice(indexAllCities, 1, newCity);
        }
    };

    $scope.selectCity = function (city) {
//        var selectedCity = $.grep($scope.myCities, function (city) {
//            return city.id == newValue;
//        })[0];
        $scope.citySelected(city);
        var alreadySelected = $('.table-cities tr.selected');
        alreadySelected.removeClass("selected");
        var row = $('.table-cities:visible').find("[name='id'][value='" + city.id + "']").parent();
        row.addClass("selected");
    };


    $scope.citySelected = function (selectedCity) {
        $scope.selectedCity = selectedCity;
        if (selectedCity)
            $scope.joinCityPasswordMatch = (selectedCity.hashed_password || '').length == 0;
    };

    $scope.tabSelected = function (tabIndex) {
        $scope.citySelected(null);

        var newPath = null;
        switch(tabIndex) {
            case 0:
                newPath = $scope.staticPageSelected;
                break;
            case 1:
                newPath = 'my';
                break;
            case 2:
                newPath = 'all';
                break;
        }
        if (newPath != $location.path()) {
            $location.path(newPath, false);
        }


        var alreadySelected = $('.table-cities tr.selected');
        alreadySelected.removeClass("selected");
        // $scope.selectedAllCities.rowId = 0;
        // $scope.selectedMyCities.rowId = 0;
    };

    $scope.staticPageChange = function (pageName) {
        $scope.staticPageSelected = pageName;
        if ($scope.selectedTab[0]) {
            $location.path(pageName, false)
        }
    };


    function classNameForMyCitiesRow(city) {
        if (!city)
            return "";

        var classes = '';

        if (city.is_member)
            classes += "city-row-member";
        if (city.is_invited)
            classes += "city-row-invited";
        if (city.is_join_requested)
            classes += "city-row-join-requested";

        // if (city.id == $scope.selectedMyCities.rowId)
        //    classes += " selected";

        return classes;
    }

    function classNameForAllCitiesRow(city) {
        if (!city)
            return "";

        var classes = '';

        if (city.public)
            classes +=  "city-row-public";
        else
            classes +=  "city-row-private";

        //if (city.id == $scope.selectedAllCities.rowId)
        //    classes += " selected";

        return classes;
    }

    function showEnterButtonForCity(city) {
        return city && city.started_at && (city.is_member || city.is_owner);
    }


    function showPasswordFieldForCity(city) {
        if (!city)
            return false;

        return !city.is_member && !city.is_owner && !city.started_at && !city.public && (city.hashed_password || '').length > 0 && $scope.user.id;
    }

    function joinCityPasswordDidChange() {
        var salted_password = $scope.selectedCity.joinCityPassword + ($scope.selectedCity.password_salt || '');
        var generated_hashed_password = sha256_digest(salted_password);
        $scope.joinCityPasswordMatch = angular.equals(generated_hashed_password, $scope.selectedCity.hashed_password);
    }

    function showJoinButtonForCity(city) {
        return city && !city.started_at && !city.is_join_requested && !city.is_member && !city.is_invited && $scope.user.id;
    }


    function showAcceptInvitationButtonForCity(city) {
        return city && !city.started_at && city.is_invited && !city.is_member;
    }

    function showLeaveButtonForCity(city) {
        return city && !city.started_at && city.is_member && !city.is_owner;
    }

    function showCancelJoinRequestForCity(city) {
        return city && city.is_join_requested && !city.is_member;
    }


    function refreshDateNow() {
        $scope.dateNow = new Date();
    }

    $scope.$watch("user", function (newUser, oldUser) {
        $scope.selectedCity = null;
        // $scope.selectedAllCities = {};
        // $scope.selectedMyCities = {};

        if (!newUser || !newUser.id) {
            $scope.myCities = [];
            $scope.appPermissionCreateGamesGranted = false;
            return;
        }

        if (newUser.id != (oldUser ? oldUser.id : 0) && !$scope.isLoadingContentMyCities) {
            $scope.reloadMyCities(true);
            $scope.reloadAllCities(true);
        }


        if (newUser.app_role && newUser.app_role.app_permissions) {
            $scope.appPermissionCreateGamesGranted = newUser.app_role.app_permissions[APP_PERMISSION_CREATE_GAMES];
        } else {
            $scope.appPermissionCreateGamesGranted = null;
        }

    });


    init();

    function init() {
        layoutService.setHomeButtonVisible(false);
        layoutService.setAdminButtonVisible(true);

        $scope.allCitiesFilterModel = {
            public: true,
            private: true
        };
        $scope.allCities = [];

        $scope.myCitiesFilterModel = {
            isOwner: true,
            isMember: true,
            isJoinRequested: true,
            isInvited: true
        };
        $scope.myCities = [];


        $scope.staticPageIndex = 0;
        $scope.staticPageSelected = '';

        var routePath = $route.current.$$route ? $route.current.$$route.originalPath : '';

        $scope.selectedTab = new Array(3);
        if (routePath.indexOf('email_confirmation') >= 0) {
            var emailConfirmationCode = $routeParams["emailConfirmationCode"];
            if (emailConfirmationCode) {
                authService.emailConfirmation.code = emailConfirmationCode;
            }
        } else if (routePath == '/my') {
            $scope.selectedTab[1] = true;
        } else if (routePath == '/all') {
            $scope.selectedTab[2] = true;
        } else if (routePath == '/') {
            var isReturningUser = getCookie('isReturningUser');
            if (isReturningUser) {
                $scope.selectedTab[1] = true;
            } else {
                $scope.selectedTab[0] = true;
                setCookie('isReturningUser', true);
            }
        } else {
            $scope.selectedTab[0] = true;
        }


        $scope.reloadAllCities();
        $scope.reloadMyCities();

        $scope.classNameForMyCitiesRow = classNameForMyCitiesRow;
        $scope.classNameForAllCitiesRow = classNameForAllCitiesRow;
        $scope.showEnterButtonForCity = showEnterButtonForCity;

        $scope.showPasswordFieldForCity = showPasswordFieldForCity;

        $scope.joinCityPasswordDidChange = joinCityPasswordDidChange;
        $scope.showJoinButtonForCity = showJoinButtonForCity;
        $scope.showAcceptInvitationButtonForCity = showAcceptInvitationButtonForCity;
        $scope.showLeaveButtonForCity = showLeaveButtonForCity;
        $scope.showCancelJoinRequestForCity = showCancelJoinRequestForCity;

        
    }

}).filter('filterMyCities', function () {
    return function (cities, myCitiesFilterModel) {
        var myCities = [];

        angular.forEach(cities, function (city) {
            "use strict";

            if ((myCitiesFilterModel.isOwner && city.is_owner) ||
                (myCitiesFilterModel.isMember && city.is_member) ||
                (myCitiesFilterModel.isJoinRequested && city.is_join_requested) ||
                (myCitiesFilterModel.isInvited && city.is_invited)) {

                myCities.push(city);
            }

        });

        return myCities;
    }
}).filter('filterAllCities', function () {
    return function (cities, allCitiesFilterModel) {
        var allCities = [];

        angular.forEach(cities, function (city) {
            "use strict";

            if ((allCitiesFilterModel.public && city.public) ||
                (allCitiesFilterModel.private && !city.public)) {
                allCities.push(city);
            }

        });

        return allCities;
    }
}); 
 
// cityController 
 
app.controller('CityController', function ($scope, $routeParams, $q, $timeout, $location, citiesService, actionResultsService, residentsService, authService, layoutService) {
    "use strict";

    layoutService.setHomeButtonVisible(true);

    $scope.nextMoment = {};


    function initCity(cityId) {
        var tabActive = getCookie(kCitySelectedTabIndexCookieKey);
        if (!tabActive) {
            tabActive = {0: true, 1: false, 2: false};
        }
        $scope.tabActive = tabActive;

        var cityPromise = citiesService.getCity(cityId);

        var userMePromise = authService.userMe();
        // var roleIdPromise = getRoleId(cityId);

        $scope.isLoading = true;
        $q.all([cityPromise, userMePromise]).then(function(result) {


            var city = result[0];

            initCityHasRoles(city);



            var residentsById = {};
            angular.forEach(city.residents, function(someResident) {
                residentsById[someResident.id] = someResident;
            });
            city.residentsById = residentsById;

            var daysById = {};
            angular.forEach(city.days, function(someDay) {
                daysById[someDay.id] = someDay;
            });
            city.daysById = daysById;
            city.current_day = daysById[city.current_day.id];

            var rolesById = {};
            angular.forEach(city.city_has_roles, function(cityHasRole) {
                if (!rolesById[cityHasRole.role.id]) {
                    rolesById[cityHasRole.role.id] = {
                        role: cityHasRole.role,
                        quantity: 0
                    };
                }
                rolesById[cityHasRole.role.id].quantity += 1;
                includeImplicatedRoles(cityHasRole.role, rolesById);
            });
            city.rolesById = rolesById;

            $scope.city = city;

            var userMe = result[1];
            var userMeResidents = $.grep(city.residents, function(someResident) {
                return someResident.user_id == userMe.id;
            });
            if (userMeResidents.length > 0)
                $scope.resident = userMeResidents[0];



            $scope.dayNumberMax = city.current_day.number + 1;
            $scope.dayNumberMin = Math.max($scope.dayNumberMax - ACTION_RESULTS_DAYS_PER_PAGE, 0);

            if ($scope.resident) {
                var savedRole = $scope.resident.saved_role;
                if (savedRole && savedRole.id) {
                    $scope.resident.role = savedRole;
                    getActionResults(cityId, savedRole.id, $scope.dayNumberMin, $scope.dayNumberMax);
                } else if ($scope.resident) {
                    // user has probably manually deleted the cookie containing their role id
                    $scope.basicValidationErrors.push({msg: 'Select your role.' });
                    $scope.roleChooserEditMode = true;
                    $scope.isLoading = false;
                }
            } else {
                getActionResults(cityId, null, $scope.dayNumberMin, $scope.dayNumberMax);
            }

        }, function(reason) {
            $scope.isLoading = false;
        });
    }

    function includeImplicatedRoles(role, rolesById) {
        angular.forEach(role.implicated_roles, function (implicatedRole) {
            if (!rolesById[implicatedRole.id]) {
                rolesById[implicatedRole.id] = {
                    role: implicatedRole,
                    quantity: 0
                };
                includeImplicatedRoles(implicatedRole, rolesById);
            }
        });
    }


    function hasEarlierActionResults() {
        return $scope.dayNumberMin > 0;
    }

    function loadEarlierActionResults() {
        if ($scope.dayNumberMin > 0) {

            $scope.dayNumberMin = Math.max(0, $scope.dayNumberMin - ACTION_RESULTS_DAYS_PER_PAGE);
            $scope.dayNumberMax = $scope.dayNumberMin + ACTION_RESULTS_DAYS_PER_PAGE;
            $timeout(function() {
                $scope.isLoadingActionResults = true;
            });
            getActionResults($scope.city.id, $scope.resident.role.id, $scope.dayNumberMin, $scope.dayNumberMax);
        }
    }

    function hasMoreRecentActionResults() {
        if (!$scope.city)
            return false;

        return $scope.dayNumberMax <= $scope.city.current_day.number;
    }

    function loadMoreRecentActionResults() {
        if ($scope.dayNumberMax <= $scope.city.current_day.number) {
            $scope.dayNumberMax = Math.min($scope.dayNumberMax + ACTION_RESULTS_DAYS_PER_PAGE, $scope.city.current_day.number+1);
            $scope.dayNumberMin = $scope.dayNumberMax - ACTION_RESULTS_DAYS_PER_PAGE;
            $timeout(function() {
                $scope.isLoadingActionResults = true;
            });
            getActionResults($scope.city.id, $scope.resident.role.id, $scope.dayNumberMin, $scope.dayNumberMax);
        }
    }

    function getActionResults(cityId, roleId, dayNumberMin, dayNumberMax) {

        actionResultsService.getActionResults(cityId, roleId, dayNumberMin, dayNumberMax).then(function(result) {
            initActionResults(result);

            $timeout(function() {
                $scope.isLoading = false;
                $scope.isLoadingActionResults = false;
            });

        }, function(reason) {
            $timeout(function() {
                $scope.isLoading = false;
                $scope.isLoadingActionResults = false;
                angular.forEach(reason.httpObj.responseJSON, function(error) {
                    $scope.basicValidationErrors.push({type : 'danger', msg: error });
                });
            });
        });
    }

    function initActionResults(actionResults) {
        if (!actionResults)
            return;

        var actionResultsByType = {};
        angular.forEach(actionResults, function(someActionResult) {
            if (!actionResultsByType[someActionResult.action_result_type.id])
                actionResultsByType[someActionResult.action_result_type.id] = [];

            actionResultsByType[someActionResult.action_result_type.id].push(someActionResult);
        });

        actionResultsByType = actionResultsService.patchedActionResultsByType(actionResultsByType, $scope.actionResultsByType);

        if (actionResultsByType[ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS]) {

            var residentsResult = actionResultsByType[ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS][0];
            if (residentsResult) {
                angular.forEach(residentsResult.result.residents, function(someResidentStatus) {
                    $scope.city.residentsById[someResidentStatus.id].alive = someResidentStatus.alive;
                });
                $scope.residentsResult = residentsResult;
            }
        } else {
            console.error("Entered game, but not SelfGenerated Result Residents is present.");
        }
        $scope.actionResultsByType = actionResultsByType;

        var gameOverResults = actionResultsByType[ACTION_RESULT_TYPE_ID_GAME_OVER];
        if (gameOverResults) {
            var gameOverResult = gameOverResults[0];
            if (gameOverResult) {
                var winnerAffiliations = gameOverResult.result.winner_affiliations;
                // $scope.gameOverResult = gameOverResult;
                var gameOverDeclarationOfWinners = '';
                angular.forEach(winnerAffiliations, function(someAffiliation) {
                    gameOverDeclarationOfWinners += someAffiliation.name + ' won. ';
                });
                $scope.gameOverDeclarationOfWinners = gameOverDeclarationOfWinners;
            }
        }

        $scope.actionResults = actionResults;
    }

    function setCookieRoleId(cityId, userId, roleId) {
        var expirationDate = new Date();
        expirationDate = new Date(expirationDate.getTime() + 1000*60*60*24*7); // 7 days from now
        setCookie(cityRoleIdCookieKey(cityId, userId), roleId, expirationDate);
    }

    function initCityHasRoles(city) {
        $scope.rolesPerId = {};
        angular.forEach(city.city_has_roles, function(someCityHasRole) {
            $scope.rolesPerId[someCityHasRole.role_id] = someCityHasRole;
        });
    }

    function roleSelected(roleId) {
        var shouldRefreshActionResults = $scope.resident.role == null;
        $scope.resident.role = $scope.city.rolesById[roleId].role;
        if (shouldRefreshActionResults)
            getActionResults($scope.city.id, roleId, $scope.dayNumberMin, $scope.dayNumberMax);
        setCookieRoleId($scope.city.id, authService.user.id, roleId);
    }

    function closeBasicValidationAlert(index) {
        $scope.basicValidationErrors.splice(index, 1);
    }

    function handleAlert(alert) {
        $scope.generalMessages.push(alert);
    }

    function closeGeneralMessageAlert(index) {
        $scope.generalMessages.splice(index, 1);
    }

    function cityRoleIdCookieKey(cityId, userId) {
        if (!cityId)
            return null;

        if (!userId)
            return null;

        return 'city' + cityId + 'UserId' + userId + 'RoleId';
    }

    var kCitySelectedTabIndexCookieKey;

    function joinDiscussion() {
        $location.path('cities/'+ $scope.city.id + '/discussion');
    }

    init();

    function init() {
        var cityId = $routeParams["cityId"];

        kCitySelectedTabIndexCookieKey = 'city_' + cityId + '_active_tabs';

        initCity(cityId);

        $scope.refreshCountdownTicks = 0;

        $scope.basicValidationErrors = [];
        $scope.generalMessages = [];
        $scope.closeBasicValidationAlert = closeBasicValidationAlert;
        $scope.closeGeneralMessageAlert = closeGeneralMessageAlert;
        $scope.handleAlert = handleAlert;
        $scope.roleSelected = roleSelected;
        $scope.joinDiscussion = joinDiscussion;


        $scope.hasEarlierActionResults = hasEarlierActionResults;
        $scope.loadEarlierActionResults = loadEarlierActionResults;
        $scope.hasMoreRecentActionResults = hasMoreRecentActionResults;
        $scope.loadMoreRecentActionResults = loadMoreRecentActionResults;



        $scope.cityId = cityId;
        $scope.disqusUrl = $location.absUrl();
    }

});
 
 
// cityCreateOrUpdateController 
 
app.controller('CityCreateOrUpdateController', function ($scope, $routeParams, $timeout, citiesService, rolesService, rolePicksService,
                                                         gameEndConditionsService, selfGeneratedResultTypesService,
                                                         authService, usersService, $location, $q, $modal) {
    "use strict";

    var MIN_DAY_DURATION = 4;

    var originalCity = {};

    function back() {
        $location.path('/cities');
    }

    function amIOwner(city) {
        var userMe = $scope.userMe;

        if (userMe) {
            if (city) {
                if (city.user_creator_id == userMe.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
    }

    function isUserOwner(userId) {
        return $scope.city.user_creator_id == userId;
    }

    function isNew(city) {
        if (city && city.id) {
            return false;
        } else {
            return true;
        }

    }

    function showCreateButton(city) {
        if (!city)
            return false;

        return isNew(city);
    }

    function create() {
        var city = $scope.city;

        var createCityPromise = citiesService.createCity(city);
        $scope.disableCityControls = true;
        createCityPromise.then(function(createdCity) {
            $timeout(function() {
                $scope.disableCityControls = false;
            });


            citiesService.isNewCityCreated = true;
            $location.path('/cities/'+ createdCity.id +'/update');
        }, function(reason) {

            var message = 'Failed to create city. ';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    message += key + " " + reason.httpObj.responseJSON[key];
                }
            }

            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'danger', msg: message }];
            });

        });
    }

    function showStartButton(city) {
        return !isNew(city) && amIOwner(city) && !isStartedAndOngoing(city) && !isStartedAndPaused(city) && !city.finished_at;
    }

    function start() {
        if ($scope.remainingRoles != 0) {
            $scope.generalMessages.push({msg: 'You need to distribute the roles before starting a game.'});
            return;
        }

        $scope.disableCityControls = true;
        var startCityPromise = citiesService.startCity($scope.city.id);
        startCityPromise.then(function(cityAndUserResult) {
            var city = cityAndUserResult['city'];

            $timeout(function() {
                $scope.disableCityControls = false;
            });

            initDayCycles(city);
            angular.copy(city, originalCity);
            $scope.city = city;
            citiesService.cacheCity(city);

            $scope.generalMessages = [{type: 'success', msg: "Successfully started '" + city.name + "'."}];


            var user = cityAndUserResult['user'];
            angular.copy(user, $scope.userMe);

        }, function(reason) {
            var message = '';
            for (var key in reason.httpObj.responseJSON) {
                message += reason.httpObj.responseJSON[key] + '. ';
            }

            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to start city. ' + message }];
            });

        });
    }

    function showSaveButton(city) {
        return !isNew(city) && amIOwner(city);
    }

    function saveCity() {
        $scope.generalMessages = [];

        $scope.disableCityControls = true;
        var updateCityPromise = citiesService.updateCity($scope.city);
        updateCityPromise.then(function(updateResult) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages.push({type: 'success', msg: 'City successfully updated.' });
            });


            angular.copy($scope.city, originalCity);
        }, function(reason) {
            $timeout(function() {
                $scope.disableCityControls = false;
                angular.forEach(reason.httpObj.responseJSON, function(errorArray) {
                    angular.forEach(errorArray, function(error) {
                        $scope.generalMessages.push({type: 'danger', msg: error + '. '});
                    });

                });
            });

        });
    }

    function closeGeneralMessage(index) {
        $scope.generalMessages.splice(index, 1);
    }

    function showDeleteButton(city) {
        return !isNew(city) && amIOwner(city);
    }

    function deleteCity() {
        openDeletionModal();
    }

    function openDeletionModal() {

        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteCityModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function (password) {
            if (!password)
                return;

            var deleteCityPromise = citiesService.deleteCity($scope.city.id, password);
            deleteCityPromise.then(function() {
                $location.path('cities');
            }, function(reason) {
                $scope.generalMessages.push({type: 'danger', msg: "City is not deleted." });
            });

        }, function () {
        });
    }

    var DeleteCityModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.credentials = {
            password : ""
        };

        $scope.ok = function () {
            $modalInstance.close($scope.credentials.password);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    function isStartedAndOngoing() {
        var city = $scope.city;

        if (city) {
            return (city.active && !city.paused && !city.finished_at);
        } else {
            return false;
        }
    }

    function showPauseButton(city) {
        return isStartedAndOngoing(city) && amIOwner(city);
    }

    function pause() {
        $scope.disableCityControls = true;
        var pauseCityPromise = citiesService.pauseCity($scope.city.id);
        pauseCityPromise.then(function(cityUpdated) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'success', msg: 'City paused.' }];
            });

            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;
            angular.copy(cityUpdated,originalCity);


        }, function(reason) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to pause city.' }];
            });

        });
    }

    function isStartedAndPaused(city) {
        if (city) {
            return (city.active && city.paused && !city.finished_at);
        } else {
            return false;
        }
    }

    function showResumeButton(city) {
        return isStartedAndPaused(city) && amIOwner(city);
    }

    function resume() {
        $scope.disableCityControls = true;
        var resumeCityPromise = citiesService.resumeCity($scope.city.id);
        resumeCityPromise.then(function(cityUpdated) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'success', msg: 'City resumed.' }];
            });


            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;
            angular.copy(cityUpdated, originalCity);
        }, function(reason) {
            $timeout(function() {
                $scope.disableCityControls = false;
                angular.forEach(reason.httpObj.responseJSON, function(errorArray) {
                    angular.forEach(errorArray, function(error) {
                        $scope.generalMessages.push({type: 'danger', msg: 'Failed to resume city. ' + error });
                    });

                });
            });


        });
    }

    function showJoinCityPasswordField(city) {
        if (!city)
            return false;

        return !city.is_member && !city.started_at && !city.public && (city.hashed_password || '').length > 0 && $scope.userMe;
    }

    function joinCityPasswordDidChange() {
        var salted_password = $scope.city.password + ($scope.city.password_salt || '');
        var generated_hashed_password = sha256_digest(salted_password);
        $scope.joinCityPasswordMatch = angular.equals(generated_hashed_password, $scope.city.hashed_password);
    }

    function showJoinButton(city) {
        if (!city)
            return false;

        if ($scope.joinCityPasswordMatch === undefined)
            $scope.joinCityPasswordMatch = city.hashed_password == null || city.is_owner;

        return !isNew(city) && !city.started_at && !city.is_member && !city.is_join_requested && !city.is_invited && !city.finished_at && $scope.userMe;
    }

    function join() {
        $scope.disableCityControls = true;
        var joinPromise = citiesService.joinCity($scope.city.id, $scope.city.password);
        joinPromise.then(function(result) {
            var cityUpdated = result.city;
            $timeout(function() {
                $scope.disableCityControls = false;
            });

            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;

        }, function(reason) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to join city.' }];
            });

        });
    }

    function showCancelJoinRequest(city) {
        if (!city)
            return false;

        return !isNew(city) && !city.is_owner && !city.started_at && !city.is_member && city.is_join_requested;
    }

    function cancelJoinRequest() {
        $scope.disableCityControls = true;
        var cancelJoinRequestPromise = citiesService.cancelJoinRequest($scope.city.id);
        cancelJoinRequestPromise.then(function(cityUpdated) {
            $timeout(function() {
                $scope.disableCityControls = false;
            });

            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;

        }, function(reason) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to cancel join request.' }];
            });

        });
    }


    function showAcceptInvitation(city) {
        if (!city)
            return false;

        return !isNew(city) && !city.is_owner && !city.started_at && !city.is_member && city.is_invited;
    }

    function acceptInvitation() {
        $scope.disableCityControls = true;
        var acceptInvitationPromise = citiesService.acceptInvitation($scope.city.id);
        acceptInvitationPromise.then(function(cityUpdated) {
            $timeout(function() {
                $scope.disableCityControls = false;
            });

            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;

        }, function(reason) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to accept invitation.' }];
            });

        });
    }


    function showLeaveButton(city) {
        if (!city)
            return false;

        var resident = $.grep(city.residents, function(someResident) {
            return ($scope.userMe || {}).id == someResident.user_id;
        })[0];

        return !isNew(city) && !amIOwner(city) && !isStartedAndOngoing(city) && !isStartedAndPaused(city) && resident && !city.finished_at;
    }

    function leave() {
        $scope.disableCityControls = true;
        var leavePromise = citiesService.leaveCity($scope.city.id);
        leavePromise.then(function(cityUpdated) {
            $timeout(function() {
                $scope.disableCityControls = false;
            });

            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;

        }, function(reason) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to leave city.' }];
            });

        });

    }

    function showEnterButton(city) {
        if (!city)
            return false;

        var resident = $.grep(city.residents, function(someResident) {
            return ($scope.userMe || {}).id == someResident.user_id;
        })[0];

        return city.started_at && resident;
    }

    function enterCity() {
        $scope.disableCityControls = true;
        $timeout(function () {
            $scope.disableCityControls = false;
            $location.path('cities/'+$scope.city.id);
        }, 50);

    }

    function isCityUnmodified(city) {
        return angular.equals(city, originalCity);
    }


    var timerLastMidnightUTC = null;

    function initTimezone(city) {

        // var lastMidnight = date.getTime() - date.getHours()*60*60*1000 - date.getMinutes()*60*1000 - date.getSeconds()*1000 - date.getMilliseconds();
        var date = new Date();

        var timerLastMidnight = date.getTime() - date.getHours()*60*60*1000 - date.getMinutes()*60*1000 - date.getSeconds()*1000 - date.getMilliseconds();
        var timezoneOffset = date.getTimezoneOffset()*60*1000;
        timerLastMidnightUTC = timerLastMidnight - timezoneOffset;
        $scope.timerLastMidnightTimezoned = timerLastMidnightUTC - city.timezone*60*1000;

        /*
        var timezoneMinutes = city.timezone;
        var sign = timezoneMinutes?timezoneMinutes<0?-1:1:0;

        var timeDate = minutesToDate(timezoneMinutes);
        var signSymbol = sign >= 0 ? '+' : '-';
        $scope.timezone = {
            oldTimeDate : timeDate,
            oldSign : signSymbol,
            timeDate : timeDate,
            sign : signSymbol
        };
        */
    }

    $scope.$watch("city.timezone", function (newTimezone) {
        $scope.timerLastMidnightTimezoned = timerLastMidnightUTC - newTimezone*60*1000;
        if ($scope.timerLastMidnightTimezoned > (new Date()).getTime()) {
            $scope.timerLastMidnightTimezoned -= 24*60*60*1000;
        }
    });

    /*
    function timezoneChanged() {
        if ($scope.timezone.timeDate.getHours() > 12) {
            $scope.timezone.timeDate = $scope.timezone.oldTimeDate;
            return;
        }

        var sign = $scope.timezone.sign == '+' ? 1 : -1;
        var timezoneMinutes = $scope.timezone.timeDate.getHours() * 60 + $scope.timezone.timeDate.getMinutes();
        $scope.city.timezone = sign*timezoneMinutes;

        $scope.timezone.oldTimeDate = $scope.timezone.timeDate;
        $scope.timezone.oldSign = $scope.timezone.sign;
    }
    */

    function closeBasicValidationAlert(index) {
        $scope.basicValidationErrors.splice(index, 1);
    }

    function cancelInvitation(index) {
        var invitedUserId = $scope.city.invitations[index].user_id;
        $scope.isChangingUsers = true;
        citiesService.cancelInvitation($scope.city.id, invitedUserId).then(function(cityResult) {
            $timeout(function() {
                $scope.isChangingUsers = false;
                $scope.generalMessages = [{type: 'success', msg: 'Cancelled invitation for "' + $scope.city.invitations[index].username + '".' }];
                $scope.city.invitations.splice(index, 1);
                angular.copy($scope.city, originalCity);
            });
        }, function(reason) {
            $timeout(function() {
                $scope.isChangingUsers = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to cancel invitation for "' + $scope.city.invitations[index].username + '".' }];
            });

        });

    }


    function acceptJoinRequest(index) {
        var joinRequestUserId = $scope.city.join_requests[index].user_id;
        $scope.isChangingUsers = true;
        citiesService.acceptJoinRequest($scope.city.id, joinRequestUserId).then(function(cityResult) {
            $timeout(function() {
                $scope.isChangingUsers = false;
                $scope.generalMessages = [{type: 'success', msg: 'Accepted "' + $scope.city.join_requests[index].username + '".' }];

                $scope.city.residents = cityResult.residents;
                $scope.city.join_requests = cityResult.join_requests;

                angular.copy($scope.city, originalCity);
            });
        }, function(reason) {
            $timeout(function() {
                $scope.isChangingUsers = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to accept "' + $scope.city.join_requests[index].username + '".' }];
            });

        });

    }

    function rejectJoinRequest(index) {
        var joinRequestUserId = $scope.city.join_requests[index].user_id;
        $scope.isChangingUsers = true;
        citiesService.rejectJoinRequest($scope.city.id, joinRequestUserId).then(function(cityResult) {
            $timeout(function() {
                $scope.isChangingUsers = false;
                $scope.generalMessages = [{type: 'success', msg: 'Rejected "' + $scope.city.join_requests[index].username + '".' }];
                $scope.city.join_requests.splice(index, 1);
                angular.copy($scope.city, originalCity);
            });
        }, function(reason) {
            $timeout(function() {
                $scope.isChangingUsers = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to reject "' + $scope.city.join_requests[index].username + '".' }];
            });

        });

    }


    function kickResident(index) {
        var residentUserId = $scope.city.residents[index].user_id;
        $scope.isChangingUsers = true;
        citiesService.kickUser($scope.city.id, residentUserId).then(function(cityResult) {
            $timeout(function() {
                $scope.isChangingUsers = false;
                $scope.generalMessages = [{type: 'success', msg: 'Successfully kicked "' + $scope.city.residents[index].username + '".' }];
                $scope.city.residents.splice(index, 1);
                $scope.remainingRoles = remainingRoleCount($scope.city);
                angular.copy($scope.city, originalCity);
            });
        }, function(reason) {
            $timeout(function() {
                $scope.isChangingUsers = false;
                $scope.generalMessages = [{type: 'danger', msg: 'Failed to kick "' + $scope.city.residents[index].username + '".' }];
            });

        });

    }

    function openInviteModal() {

        var modalInstance = $modal.open({
            templateUrl: 'inviteModalContent.html',
            controller: InviteModalInstanceCtrl,
            resolve: {
                residents: function () {
                    return $scope.city.residents;
                }
            }
        });

        modalInstance.result.then(function (invitedUsers) {
            if (!invitedUsers)
                return;

            $scope.isChangingUsers = true;

            var invitePromise = citiesService.inviteUsers($scope.city.id, invitedUsers);
            invitePromise.then(function(result) {
                $timeout(function() {
                    $scope.isChangingUsers = false;
                });

                /*
                 var updatedCityResidents = result.updated_city_residents;
                 originalCity.residents = updatedCityResidents;
                 $scope.city.residents = updatedCityResidents;
                 */
                $scope.city.residents = result.city.residents;
                $scope.city.invitations = result.city.invitations;
                $scope.city.join_requests = result.city.join_requests;
                angular.copy(result.city, originalCity);



                if (result.already_joined_users && result.already_joined_users.length > 0) {
                    var alreadyJoinedUsers = result.already_joined_users;
                    var plural = alreadyJoinedUsers.length == 1 ? '' : 's';
                    var alreadyJoinedUsersMessage = 'User'+plural+' ';
                    angular.forEach(alreadyJoinedUsers, function(someUser) {
                        alreadyJoinedUsersMessage += someUser.username + ', ';
                    });
                    alreadyJoinedUsersMessage = alreadyJoinedUsersMessage.substring(0, alreadyJoinedUsersMessage.length - 2) + (alreadyJoinedUsers.length == 1 ? ' is ' : ' are ') + 'already joined to the game.';
                    $scope.generalMessages.push({type: 'success', msg: alreadyJoinedUsersMessage });
                }


                if (result.existing_users_joined && result.existing_users_joined.length > 0) {
                    var existingUsersJoined = result.existing_users_joined;
                    var plural = existingUsersJoined.length == 1 ? '' : 's';
                    var existingUsersJoinedMessage = 'Existing user'+plural+' ';
                    angular.forEach(existingUsersJoined, function(someUser) {
                        existingUsersJoinedMessage += someUser.username + ', ';
                    });
                    existingUsersJoinedMessage = existingUsersJoinedMessage.substring(0, existingUsersJoinedMessage.length - 2) + ' invited and automatically joined the game.';
                    $scope.generalMessages.push({type: 'success', msg: existingUsersJoinedMessage });
                }

                if (result.already_invited_users && result.already_invited_users.length > 0) {
                    var alreadyInvitedUsers = result.already_invited_users;
                    var plural = alreadyInvitedUsers.length == 1 ? '' : 's';
                    var alreadyInvitedUsersMessage = 'User'+plural+' ';
                    angular.forEach(alreadyInvitedUsers, function(someUser) {
                        alreadyInvitedUsersMessage += someUser.username + ', ';
                    });
                    alreadyInvitedUsersMessage = alreadyInvitedUsersMessage.substring(0, alreadyInvitedUsersMessage.length - 2) + (alreadyInvitedUsers.length == 1 ? ' is ' : ' are ') + 'already invited to the game.';
                    $scope.generalMessages.push({type: 'success', msg: alreadyInvitedUsersMessage });
                }

                if (result.existing_users_invited && result.existing_users_invited.length > 0) {
                    var existingUsersInvited = result.existing_users_invited;
                    var plural = existingUsersInvited.length == 1 ? '' : 's';
                    var existingUsersInvitedMessage = 'Existing user'+plural+' ';
                    angular.forEach(existingUsersInvited, function(someUser) {
                        existingUsersInvitedMessage += someUser.username + ', ';
                    });
                    existingUsersInvitedMessage = existingUsersInvitedMessage.substring(0, existingUsersInvitedMessage.length - 2) + ' invited to the game.';
                    $scope.generalMessages.push({type: 'success', msg: existingUsersInvitedMessage });
                }

                if (result.new_users_joined && result.new_users_joined.length > 0) {
                    var newUsersJoined = result.new_users_joined;
                    var plural = newUsersJoined.length == 1 ? '' : 's';
                    var newUsersJoinedMessage = 'New user' + plural + ' ';
                    angular.forEach(newUsersJoined, function(someUser) {
                        newUsersJoinedMessage += someUser.username + ', ';
                    });
                    newUsersJoinedMessage = newUsersJoinedMessage.substring(0, newUsersJoinedMessage.length - 2) + ' created and added to the game.';
                    $scope.generalMessages.push({type: 'success', msg: newUsersJoinedMessage });
                }

                if (result.new_users_invalid && result.new_users_invalid.length > 0 ) {
                    var newUsersInvalid = result.new_users_invalid;
                    var plural = newUsersInvalid.length == 1 ? '' : 's';
                    var newUsersInvalidMessage = 'Failed to create new user'+plural+': ';
                    angular.forEach(newUsersInvalid, function(someUser) {
                        newUsersInvalidMessage += someUser.username + ', ';
                    });
                    newUsersInvalidMessage = newUsersInvalidMessage.substring(0, newUsersInvalidMessage.length - 2) + '.';
                    $scope.generalMessages.push({type: 'danger', msg: newUsersInvalidMessage });
                }

                $scope.remainingRoles = remainingRoleCount($scope.city);
            }, function(reason) {
                $scope.isChangingUsers = false;
                $scope.generalMessages.push({type: 'danger', msg: "Server error, users not invited." });
            });

        }, function () {
            $scope.isChangingUsers = false;
        });
    }



    var InviteModalInstanceCtrl = function ($scope, $modalInstance, usersService, residents) {
        $scope.getUsersByUsername = function(username) {
            return usersService.getAllUsers({username: username});
        };

        $scope.getUsersByEmail = function(email) {
            return usersService.getAllUsers({email: email});
        };

        $scope.invitedUsers = [];

        $scope.setNewInvitedUser = function(newInvitedUser) {
            $scope.newInvitedUser = angular.copy(newInvitedUser);
        };

        var clearNewInvitedUser = function() {
            $scope.newInvitedUser = {
                id: null,
                username: '',
                email: ''
            };
        };

        clearNewInvitedUser();

        $scope.enterOnInviteInput = function() {
            $scope.addInvitedUser();
        };

        $scope.addInvitedUser = function () {
            if (!$scope.newInvitedUser.id) {
                if ($scope.newInvitedUser.email) {
                    if (!$scope.newInvitedUser.username || $scope.newInvitedUser.username.length == 0) {
                        $scope.newInvitedUser.username = $scope.newInvitedUser.email.substr(0,$scope.newInvitedUser.email.indexOf('@'));
                    }


                } else {
                    clearNewInvitedUser();
                    return;
                }
            }

            var alreadyInvited = $.grep($scope.invitedUsers, function(someUser) {
                return (someUser.id == $scope.newInvitedUser.id && $scope.newInvitedUser.id) || (someUser.email && someUser.email == $scope.newInvitedUser.email) || (someUser.username == $scope.newInvitedUser.username);
            });
            if (alreadyInvited.length > 0) {
                clearNewInvitedUser();
                return;
            }

            if ($scope.newInvitedUser.id) {
                $scope.invitedUsers.push(angular.copy($scope.newInvitedUser));
                clearNewInvitedUser();
            } else {
                var allowedEmailPatternsPromise = usersService.getAllowedEmailPatterns();
                allowedEmailPatternsPromise.then(function(allowedEmailPatterns) {
                    var allowed = false;
                    angular.forEach(allowedEmailPatterns, function(emailPattern) {
                        if (!allowed) {
                            var regex = new RegExp(emailPattern, 'i');
                            var matchResult = $scope.newInvitedUser.email.match(regex);
                            if (matchResult) {
                                allowed = true;
                            }
                        }
                    });

                    if (allowed) {
                        $scope.invitedUsers.push(angular.copy($scope.newInvitedUser));
                    } else {
                        $scope.inviteErrors = [];
                        $scope.inviteErrors.push({type: 'danger', msg:"Email '" + $scope.newInvitedUser.email + "' not accepted."});
                    }

                    clearNewInvitedUser();
                });
            }


        };

        $scope.closeInviteErrorMessage = function(index) {
            $scope.inviteErrors.splice(index, 1);
        };

        $scope.removeInvitedUser = function(index) {
            $scope.invitedUsers.splice(index, 1);
        };

        $scope.invite = function() {
            $modalInstance.close($scope.invitedUsers);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };




    /*
    var usersNotJoined = function(users, residents, invitations) {
        var usersNotJoined = angular.copy(users);
        angular.forEach(residents, function(someResident) {
            var index = usersNotJoined.indexOfMatchFunction(function(someUser) {
                return someUser.id == someResident.user_id;
            });
            if (index >= 0) {
                usersNotJoined.splice(index, 1);
            }
        });
        angular.forEach(invitations, function(someInvitation) {
            var index = usersNotJoined.indexOfMatchFunction(function(someUser) {
                return someUser.id == someInvitation.user_id;
            });
            if (index >= 0) {
                usersNotJoined.splice(index, 1);
            }
        });
        return usersNotJoined;
    };
    */


    function toggleShowAddDayCycle() {
        $scope.showAddDayCycle = !$scope.showAddDayCycle;
    }

    function minutesToDate(minutes) {
        // var sign = minutes?minutes<0?-1:1:0;
        minutes = Math.abs(minutes);

        var d = new Date();
        d.setHours( Math.floor(minutes / 60) );
        d.setMinutes( minutes % 60 );
        return d;
    }

    function removeDayCycle(index) {
        $scope.city.day_cycles.splice(index, 1);
    }

    var newDayCycle = {
        day_start : 0,
        day_start_date : new Date(),
        night_start : 0,
        night_start_date : new Date()
    };

    function minutesDifference(start, end) {
        if (end < start)
            end += 24*60;

        return end - start;
    }

    function momentInRange(moment, rangeStart, rangeEnd) {
        var isCircular = rangeStart > rangeEnd;

        if (isCircular) {
            rangeEnd += 24*60;
            if (moment < rangeStart)
                moment += 24*60;
        }

        return Math.min(moment - rangeStart, rangeEnd - moment)
    }

    function validateDayCycle(dayCycle, dayCycles) {
        var isValid = true;
        var dayCycleValidationErrors = [];

        if (minutesDifference(dayCycle.day_start, dayCycle.night_start) < MIN_DAY_DURATION) {
            dayCycleValidationErrors.push({type: 'danger', msg: 'Day cycle too short. Minimum ' + MIN_DAY_DURATION + ' minutes.' });
            $scope.dayCycleValidationErrors = dayCycleValidationErrors;
            return false;
        }

        for (var index in dayCycles) {
            var someDayCycle = dayCycles[index];

            var inRange = momentInRange(dayCycle.day_start, someDayCycle.day_start, someDayCycle.night_start);
            if (inRange > -MIN_DAY_DURATION) {
                if (inRange > 0)
                    dayCycleValidationErrors.push({type: 'danger', msg: 'New day cycle interferes with already existing day cycles.' });
                else
                    dayCycleValidationErrors.push({type: 'danger', msg: 'Creating a day cycle like this implies night time shorter than ' + MIN_DAY_DURATION + ' minutes.' });

                isValid = false;
                break;
            }

            inRange = momentInRange(dayCycle.night_start, someDayCycle.day_start, someDayCycle.night_start);
            if (inRange > -MIN_DAY_DURATION) {
                if (inRange > 0)
                    dayCycleValidationErrors.push({type: 'danger', msg: 'New day cycle interferes with already existing day cycles.' });
                else
                    dayCycleValidationErrors.push({type: 'danger', msg: 'Creating a day cycle like this implies night time shorter than ' + MIN_DAY_DURATION + ' minutes.' });


                isValid = false;
                break;
            }
        }

        $scope.dayCycleValidationErrors = dayCycleValidationErrors;
        return isValid;
    }

    function dayCycleChanged(index) {
        var dayCycle = $scope.city.day_cycles[index];
        var day_start = dayCycle.day_start;
        var night_start = dayCycle.night_start;

        dayCycle.day_start = dayCycle.day_start_date.getHours()*60 + dayCycle.day_start_date.getMinutes();
        dayCycle.night_start = dayCycle.night_start_date.getHours()*60 + dayCycle.night_start_date.getMinutes();

        var restOfDayCycles = [];
        angular.copy($scope.city.day_cycles, restOfDayCycles);
        restOfDayCycles.splice(index, 1);
        var isValid = validateDayCycle(dayCycle, restOfDayCycles);

        if (!isValid) {
            dayCycle.day_start_date = minutesToDate(day_start);
            dayCycle.night_start_date = minutesToDate(night_start);
        }

    }

    function addDayCycle() {
        $scope.newDayCycle.day_start = $scope.newDayCycle.day_start_date.getHours() * 60 + $scope.newDayCycle.day_start_date.getMinutes();
        $scope.newDayCycle.night_start = $scope.newDayCycle.night_start_date.getHours() * 60 + $scope.newDayCycle.night_start_date.getMinutes();

        var newDayCycle = angular.copy($scope.newDayCycle);


        var newIndex;
        var previousNightEndedMinutesAgo = 24*60;

        var isValid = validateDayCycle(newDayCycle, $scope.city.day_cycles);
        if (!isValid) {
            return;
        }


        for (var index = 0; index < $scope.city.day_cycles.length; index++) {
            var dayCycle = $scope.city.day_cycles[index];
            // new day cycle should entirely fit into one night of already existing day cycle
            var endedMinutesAgo = minutesDifference(dayCycle.night_start, newDayCycle.day_start);
            if (endedMinutesAgo < previousNightEndedMinutesAgo) {
                previousNightEndedMinutesAgo = endedMinutesAgo;
                newIndex = index+1;
                /*
                if (newDayCycle.day_start < dayCycle.day_start) {
                    newIndex = (index+1)%$scope.city.day_cycles.length;
                } else {
                    newIndex = index+1;
                }
                */

            }
        }

        $scope.city.day_cycles.splice(newIndex, 0, newDayCycle);
    }

    function closeDayCycleValidationAlert(index) {
        $scope.dayCycleValidationErrors.splice(index, 1);
    }

    function initTime(city) {
        var d = new Date();
        var timestampUtc = d.getTime() + d.getTimezoneOffset()*60*1000 + city.timezone*60*1000;
        d.setTime(timestampUtc);
        $scope.cityTime = timestampUtc;
    }

    function initDayCycles(city) {
        angular.forEach(city.day_cycles, function (day_cycle) {
            day_cycle['day_start_date'] = minutesToDate(day_cycle.day_start);
            day_cycle['night_start_date'] = minutesToDate(day_cycle.night_start);
        });
    }

    function initCityHasRoles(city, allRoles) {
        var roleQuantitiesPerRoleId = {};
        angular.forEach(allRoles, function(role) {
            if (role.is_starting_role) {
                var roleQuantity = {
                    role: role,
                    quantity: 0
                };

                roleQuantitiesPerRoleId[role.id] = roleQuantity;
            } else {
                // non-starting roles (like Zombie) are not included
            }
        });

        if (city) {
            angular.forEach(city.city_has_roles, function(cityHasRole) {
                if (roleQuantitiesPerRoleId[cityHasRole.role.id] !== undefined)
                    roleQuantitiesPerRoleId[cityHasRole.role.id].quantity += 1;
            });
        }

        var roleQuantities = [];
        for (var roleId in roleQuantitiesPerRoleId) {
            roleQuantities.push(roleQuantitiesPerRoleId[roleId]);
        }

        $scope.roleQuantities = roleQuantities;
        /*var cityHasRoles = [];
        for (var roleId in roleQuantitiesPerRoleId) {
            cityHasRoles.push(roleQuantitiesPerRoleId[roleId]);
        }


*/
        // city.city_has_roles = cityHasRoles;
    }

    function remainingRoleCount(city) {
        if (!city)
            return 0;

        var availableRoles = city.residents.length;
        var usedRoles = city.city_has_roles.length;

        return availableRoles - usedRoles;
    }

    $scope.roleQuantityDidChange = function (roleId, newQuantity) {

        var roleQuantity = $scope.roleQuantities[roleId-1];
        roleQuantity.quantity = newQuantity;
        var newRoleQuantities = $scope.roleQuantities;

        var city_has_roles = $scope.city.city_has_roles;

        var cityHasRolesByRoleId = {};
        angular.forEach(city_has_roles, function (cityHasRole) {
            if (!cityHasRolesByRoleId[cityHasRole.role.id]) {
                cityHasRolesByRoleId[cityHasRole.role.id] = [];
            }
            cityHasRolesByRoleId[cityHasRole.role.id].push(cityHasRole);
        });

        angular.forEach(newRoleQuantities, function(someRoleQuantity) {
            var city_has_roles_of_type = cityHasRolesByRoleId[someRoleQuantity.role.id] || [];

            while (city_has_roles_of_type.length < someRoleQuantity.quantity) {
                var last_city_has_role = city_has_roles_of_type[city_has_roles_of_type.length-1];
                if (!last_city_has_role) {
                    last_city_has_role = {
                        city_id : $scope.city.id,
                        role : someRoleQuantity.role,
                        action_types_params : {}
                    };
                    angular.forEach(someRoleQuantity.role.action_types, function(someActionType) {
                        if (Object.getOwnPropertyNames(someActionType.action_type_params).length != 0) {
                            last_city_has_role.action_types_params[someActionType.id] = someActionType.action_type_params;
                        }


                    });

                }
                var new_city_has_role = angular.copy(last_city_has_role);
                new_city_has_role.id = null;
                city_has_roles_of_type.push(new_city_has_role);
                city_has_roles.push(new_city_has_role);
            }
            while (city_has_roles_of_type.length > someRoleQuantity.quantity) {
                var last_city_has_role = city_has_roles_of_type[city_has_roles_of_type.length-1];
                city_has_roles_of_type.splice(city_has_roles_of_type.length-1, 1);
                var index = city_has_roles.indexOf(last_city_has_role);
                city_has_roles.splice(index, 1);
            }
        });
        $scope.city.city_has_roles = city_has_roles;
        $scope.remainingRoles = remainingRoleCount($scope.city);
    };




    function changeNewRolePickRole(role) {
        $scope.newRolePickRole = role;
    }

    function submitRolePick() {
        if (!$scope.newRolePickRole)
            return;

        var alreadyPickedIndex = $scope.city.role_picks.indexOfMatchFunction(function (rolePick) {
            return rolePick.role.id == $scope.newRolePickRole.id;
        });
        if (alreadyPickedIndex >= 0)
            return;


        $scope.isSubmittingRolePick = true;
        var createMyRolePickPromise = rolePicksService.createMyRolePick($scope.city, $scope.newRolePickRole);

        createMyRolePickPromise.then(function(createdRolePick) {
            $scope.city.role_picks.push(createdRolePick);
            $scope.isSubmittingRolePick = false;

            $scope.userMe.role_picks.push(createdRolePick);
        }, function(reason) {
            $scope.isSubmittingRolePick = false;
        });
    }

    function deleteRolePick(rolePick) {
        $scope.deletingRolePickId = rolePick.id;
        rolePicksService.deleteRolePickById(rolePick.id).then(function() {
            var index = $scope.city.role_picks.indexOf(rolePick);
            $scope.city.role_picks.splice(index, 1);
            $scope.deletingRolePickId = null;

            index = $scope.userMe.role_picks.indexOfMatchFunction(function (rolePick) {
                return rolePick.id == rolePick.id;
            });
            if (index >= 0) {
                $scope.userMe.role_picks.splice(index, 1);
            }

        }, function(reason) {
            $scope.deletingRolePickId = null;
        });

    }

    function initRoles(city, allRoles) {
        $scope.remainingRoles = remainingRoleCount(city);
        initCityHasRoles(city, allRoles);
    }


    function initGameEndConditions(city) {
        angular.forEach(city.game_end_conditions, function(gameEndCondition) {
            $scope.checkedGameEndConditions[gameEndCondition.id] = true;
        });
    }

    function getCheckedGameEndConditions() {
        var checkedGameEndConditions = [];
        angular.forEach($scope.allGameEndConditions, function(someGameEndCondition) {
            if ($scope.checkedGameEndConditions[someGameEndCondition.id])
                checkedGameEndConditions.push(someGameEndCondition);
        });
        return checkedGameEndConditions;
    }

    var toggleGameEndCondition = function(gameEndConditionId) {
        var gameEndCondition = $.grep($scope.city.game_end_conditions, function(someGameEndCondition) {
            return someGameEndCondition.id = gameEndConditionId;
        })[0];

        if (gameEndCondition) {
            // exclusion
            if ($scope.city.game_end_conditions.length == 1) {
                // one must always remain
                $scope.checkedGameEndConditions[gameEndCondition.id] = true;
                return;
            } else {
                var index = $scope.city.game_end_conditions.indexOf(gameEndCondition);
                $scope.city.game_end_conditions.splice(index, 1);
            }
        } else {
            gameEndCondition = $.grep($scope.allGameEndConditions,function(someGameEndCondition) {
                return someGameEndCondition.id = gameEndConditionId;
            })[0];
            $scope.city.game_end_conditions.push(gameEndCondition);
        }
    };

    function initSelfGeneratedResultTypes(city) {
        angular.forEach(city.self_generated_result_types, function(selfGeneratedResultType) {
            $scope.checkedSelfGeneratedResultTypes[selfGeneratedResultType.id] = true;
        });
    }

    function getCheckedSelfGeneratedResultTypes() {
        var checkedSelfGeneratedResultTypes = [];
        angular.forEach($scope.allSelfGeneratedResultTypes, function(someSelfGeneratedResultType) {
            if ($scope.checkedSelfGeneratedResultTypes[someSelfGeneratedResultType.id])
                checkedSelfGeneratedResultTypes.push(someSelfGeneratedResultType);
        });
        return checkedSelfGeneratedResultTypes;
    }

    var toggleSelfGeneratedResultType = function(selfGeneratedResultTypeId) {
        var selfGeneratedResultType = $.grep($scope.city.self_generated_result_types, function(someSelfGeneratedResultType) {
            return someSelfGeneratedResultType.id == selfGeneratedResultTypeId;
        })[0];

        if (selfGeneratedResultType) {
            var index = $scope.city.self_generated_result_types.indexOf(selfGeneratedResultType);
            $scope.city.self_generated_result_types.splice(index, 1);
        } else {
            selfGeneratedResultType = $.grep($scope.allSelfGeneratedResultTypes, function(someSelfGeneratedResultType) {
                return someSelfGeneratedResultType.id == selfGeneratedResultTypeId
            })[0];
            $scope.city.self_generated_result_types.push(selfGeneratedResultType);
        }

    };

    init();

    function init() {
        var cityId = parseInt($routeParams["cityId"]);

        $scope.affiliationIds = rolesService.affiliationIds;

        var cityPromise;
        if (cityId) {
            if (citiesService.isNewCityCreated) {
                citiesService.isNewCityCreated = false;

                cityPromise = citiesService.getCity(cityId, false).then(function(city) {
                    $scope.generalMessages = [{type: 'success', msg: "Successfully created '" + city.name + "'."}];
                    return city;
                });
            } else {
                cityPromise = citiesService.getCity(cityId, true);
            }
        } else {
            cityPromise = citiesService.getNewCity();
        }

        var allRolesPromise = rolesService.getAllRoles(false);
        var userMePromise = authService.userMe(false);

        var promises = [allRolesPromise, userMePromise, cityPromise];


        $q.all(promises).then(function(result) {
            var allRoles = result[0];
            $scope.allRoles = allRoles;

            var userMe = result[1];
            $scope.userMe = userMe;

            var city = result[2];
            if (cityId) {

            } else {
                var d = new Date()
                var timezone = -1 * d.getTimezoneOffset();
                city.timezone = timezone;
                d.setHours(Math.floor(Math.abs(timezone)/60));
                d.setMinutes(Math.abs(timezone) % 60);

                $scope.timezone = {
                    timeDate: d,
                    sign: timezone < 0 ? '-' : '+'
                };
            }


            initTime(city);
            initTimezone(city);
            initDayCycles(city);
            initRoles(city, allRoles);
            initGameEndConditions(city);
            initSelfGeneratedResultTypes(city);

            angular.copy(city, originalCity);

            $timeout(function () {
                $scope.city = city;
            });

        });

        var allGameEndConditionsPromise = gameEndConditionsService.getAllGameEndConditions(false);
        allGameEndConditionsPromise.then(function(allGameEndConditions) {
            $scope.allGameEndConditions = allGameEndConditions;
        });

        var allSelfGeneratedResultTypesPromise = selfGeneratedResultTypesService.getAllSelfGeneratedResultTypes(false);
        allSelfGeneratedResultTypesPromise.then(function(allSelfGeneratedResultTypes) {
            $scope.allSelfGeneratedResultTypes = allSelfGeneratedResultTypes;
        });




        $scope.generalMessages = [];
        $scope.closeGeneralMessage = closeGeneralMessage;

        $scope.back = back;
        $scope.deleteCity = deleteCity;
        $scope.openDeletionModel = openDeletionModal;

        $scope.amIOwner = amIOwner;
        $scope.isUserOwner = isUserOwner;
        $scope.isNew = isNew;
        $scope.showCreateButton = showCreateButton;
        $scope.create = create;
        $scope.showStartButton = showStartButton;
        $scope.start = start;
        $scope.showSaveButton = showSaveButton;
        $scope.saveCity = saveCity;
        $scope.showDeleteButton = showDeleteButton;
        $scope.showPauseButton = showPauseButton;
        $scope.pause = pause;
        $scope.showResumeButton = showResumeButton;
        $scope.resume = resume;
        $scope.isCityUnmodified = isCityUnmodified;

        $scope.showJoinCityPasswordField = showJoinCityPasswordField;
        $scope.joinCityPasswordDidChange = joinCityPasswordDidChange;

        $scope.showJoinButton = showJoinButton;
        $scope.join = join;

        $scope.showCancelJoinRequest = showCancelJoinRequest;
        $scope.cancelJoinRequest = cancelJoinRequest;

        $scope.showAcceptInvitation = showAcceptInvitation;
        $scope.acceptInvitation = acceptInvitation;

        $scope.showLeaveButton = showLeaveButton;
        $scope.leave = leave;

        $scope.showEnterButton = showEnterButton;
        $scope.enterCity = enterCity;

        $scope.closeBasicValidationAlert = closeBasicValidationAlert;


        $scope.basicValidationErrors = [];
        $scope.timezone = {};
        // $scope.timezoneChanged = timezoneChanged;


        $scope.cancelInvitation = cancelInvitation;
        $scope.acceptJoinRequest = acceptJoinRequest;
        $scope.rejectJoinRequest = rejectJoinRequest;
        $scope.kickResident = kickResident;
        $scope.openInviteModal = openInviteModal;

        $scope.newDayCycle = newDayCycle;

        $scope.showAddDayCycle = false;
        $scope.toggleShowAddDayCycle = toggleShowAddDayCycle;

        $scope.removeDayCycle = removeDayCycle;
        $scope.addDayCycle = addDayCycle;
        $scope.minutesToString = citiesService.minutesToString;
        $scope.dayCycleChanged = dayCycleChanged;
        $scope.dayCycleValidationErrors = [];
        $scope.closeDayCycleValidationAlert = closeDayCycleValidationAlert;

        $scope.remainingRoles = 0;
        $scope.changeNewRolePickRole = changeNewRolePickRole;
        $scope.submitRolePick = submitRolePick;
        $scope.deleteRolePick = deleteRolePick;

        $scope.checkedGameEndConditions = {};
        $scope.toggleGameEndCondition = toggleGameEndCondition;
        $scope.checkedSelfGeneratedResultTypes = {};
        $scope.toggleSelfGeneratedResultType = toggleSelfGeneratedResultType;
    }

}).filter('defaultActionTypeParamsPresentFilter', function() {
    return function(actionTypes) {
        var filteredActionTypes = [];

        angular.forEach(actionTypes, function(actionType) {
            "use strict";

            if (actionType.action_type_params) {
                if (Object.keys(actionType.action_type_params).length === 0) {
                } else {
                    filteredActionTypes.push(actionType);
                }
            }


        });

        return filteredActionTypes;
    };
}).filter('cityHasRolesWithActionTypesParamsFilter', function() {
    return function(cityHasRoles) {
        var filteredCityHasRoles = [];

        angular.forEach(cityHasRoles, function(cityHasRole) {
            var role = cityHasRole.role;
            "use strict";
            var roleProcessed = false;

            angular.forEach(role.action_types, function(someActionType) {
                if (!roleProcessed) {
                    if (someActionType.action_type_params) {
                        if (Object.keys(someActionType.action_type_params).length === 0) {
                        } else {
                            filteredCityHasRoles.push(cityHasRole);
                            roleProcessed = true;
                        }
                    }
                }
            });



        });

        return filteredCityHasRoles;
    };
});; 
 
// cityDiscussionController 
 
app.controller('CityDiscussionController', function ($scope, $routeParams, $location, citiesService) {
    "use strict";

    var backToCity = function () {
        $location.path('/cities/' + $scope.cityId);
    };

    init();

    function init() {
        var cityId = parseInt($routeParams["cityId"]);

        $scope.cityId = cityId;

        var cityPromise = citiesService.getCity(cityId);

        cityPromise.then(function(city) {
            $scope.city = city;
        }, function(reason) {
            console.log('Failed to retrieve city for city id: ' + cityId);
        });

        $scope.url = $location.absUrl();

        $scope.backToCity = backToCity;
    }

}); 
 
// registerController 
 
app.controller('RegisterController', function ($scope, $location, $timeout, usersService, serverService, authService) {
    "use strict";

    var newUser = {
        username: '',
        email: '',
        password: '',
        repeat_password: ''
    };

    var back = function() {
        $location.path('');
    };



    var registerUser = function() {
        var newUser = $scope.newUser;
        if (newUser.username.length == 0) {
            $scope.registerInfos.push({type: 'danger', msg: 'Username must not be empty'});
        }
        if (newUser.password.length == 0) {
            $scope.registerInfos.push({type: 'danger', msg: 'Password must not be empty'});
            return;
        }
        if (newUser.repeat_password != newUser.password) {
            $scope.registerInfos.push({type: 'danger', msg: 'Repeated password don\'t match the original one.'});
            return;
        }

        var createUserPromise = usersService.createUser(newUser);
        $scope.isLoading = true;
        createUserPromise.then(function(createdUser) {
            if (createdUser.auth_token) {
                serverService.setAuthToken(createdUser.auth_token.token_string, createdUser.auth_token.expiration_date);
                authService.notifications.shouldSignIn = true;
                back();
            } else {
                $timeout(function() {
                    $scope.registerInfos.push({type : 'success', msg: 'Successfully created user ' + createdUser.username + '. Check your email in order to confirm your email address.'});
                });
            }

            $scope.isLoading = false;
        }, function(reason) {
            $scope.isLoading = false;
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key))
                    $scope.registerInfos.push({type : 'danger', msg: key + " " + reason.httpObj.responseJSON[key] });
            }
            if (!reason.httpObj.responseJSON) {
                $scope.registerInfos.push({type : 'danger', msg: 'Server error' });
            }
        });
    };

    $scope.closeRegisterInfoAlert = function(index) {
        $scope.registerInfos.splice(index, 1);
    };

    init();

    function init() {
        $scope.newUser = newUser;
        $scope.back = back;
        $scope.registerUser = registerUser;
        $scope.registerInfos = [];
    }

}); 
 
// unsubscribeController 
 
/**
 * Created by Andro on 29.12.2014..
 */
app.controller('UnsubscribeController', function ($scope, usersService) {
    "use strict";

    $scope.alerts = [];

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.unsubscribe = function() {
        if (!$scope.email) {
            $scope.alerts.push({type: 'danger', msg: 'Enter email'});
            return;
        }

        var unsubscribePromise = usersService.unsubscribeEmail($scope.email);
        unsubscribePromise.then(function(result) {
            $scope.alerts.push({type: 'success', msg: "Successfully unsubscribed '" + $scope.email + "'." });
        }, function(reason) {
            var additionalText = reason.httpObj.responseText;
            if (!additionalText)
                additionalText = "We suggest you send an email to " + usersService.supportEmail + " with title 'unsubscribe' and you will no longer receive any emails from this site.";
            $scope.alerts.push({type: 'danger', msg: "Failed to unsubscribe. " + additionalText  });
        });
    };

}); 
 
// userProfileController 
 
app.controller('UserProfileController', function ($scope, $location, $modal, $timeout, usersService, authService, layoutService, rolePicksService) {
    "use strict";

    var user = {
        id: null,
        username: '',
        email: '',
        current_password: '',
        new_password: '',
        repeat_new_password: '',
        user_preference: {}
    };


    var back = function() {
        $location.path('/cities');
    };

    var save = function() {
        var user = $scope.user;
        if (user.username.length == 0) {
            $scope.userProfileInfos.push({type: 'danger', msg: 'Username must not be empty.'});
        }

        /*
        if (!user.new_password || user.new_password.length == 0) {
            $scope.userProfileInfos.push({type: 'danger', msg: 'New password must not be empty.'});
            return;
        }
        */

        if (user.repeat_new_password != user.new_password) {
            $scope.userProfileInfos.push({type: 'danger', msg: 'Repeated new password don\'t match the new password.'});
            return;
        }

        openSaveModal();
    };


    function openSaveModal() {

        var modalInstance = $modal.open({
            templateUrl: 'saveModalContent.html',
            controller: SaveUserModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function (password) {
            if (!password || password.length == 0) {
                $scope.userProfileInfos.push({type: 'danger', msg: 'Current password must not be empty.'});
                return;
            }

            var user = $scope.user;
            user['password'] = password;
            var updateUserPromise = usersService.updateUser(user);
            $scope.isLoading = true;
            updateUserPromise.then(function() {
                $timeout(function() {
                    $scope.userProfileInfos.push({type : 'success', msg: 'Successfully updated user ' + $scope.user.username + '.'});
                    $scope.isLoading = false;
                });

            }, function(reason) {
                $timeout(function() {
                    $scope.isLoading = false;
                    $scope.userProfileInfos.push({type : 'danger', msg: reason.httpObj.responseText });
                });
            });

        }, function () {
        });
    }

    var SaveUserModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.credentials = {
            password : ""
        };

        $scope.ok = function () {
            $modalInstance.close($scope.credentials.password);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    $scope.closeUserProfileInfoAlert = function(index) {
        $scope.userProfileInfos.splice(index, 1);
    };

    $scope.deleteUser = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteUserModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function (password) {
            if (!password)
                return;

            var deleteUserPromise = usersService.deleteUserById($scope.user.id, password);
            deleteUserPromise.then(function() {
                authService.notifications.shouldSignOut = true;
                usersService.userDeleted = $scope.user;
                $location.path('');
            }, function(reason) {
                $scope.userProfileInfos.push({type: 'danger', msg: "User is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteUserModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.credentials = {
            password: ''
        };

        $scope.ok = function () {
            $modalInstance.close($scope.credentials.password);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };


    var deleteRolePick = function(rolePick) {
        $scope.deletingRolePickId = rolePick.id;
        var index = $scope.user.role_picks.indexOf(rolePick);
        rolePicksService.deleteRolePickById(rolePick.id).then(function() {
            $scope.deletingRolePickId = null;
            $scope.user.role_picks.splice(index, 1);
        }, function(reason) {
            $scope.deletingRolePickId = null;
        });

    };


    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);


        authService.userMe(true).then(function(userMe) {
            user = angular.copy(userMe);
            $scope.user = user;
        }, function(reason) {
            $location.path('');
        });


        $scope.back = back;
        $scope.save = save;
        $scope.userProfileInfos = [];

        $scope.deleteRolePick = deleteRolePick;
    }

}); 
 
// adminCityController 
 
app.controller('AdminCityController',function ($scope, $routeParams, $location, $modal, $q, authService, layoutService, citiesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        var cityId = $routeParams['city_id'];
        var cityPromise = citiesService.getCity(cityId).then(function(cityResult) {
            setInspectedCity(cityResult);

            return cityResult;
        });


        var userMePromise = authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_READ];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];

            return userMeResult;
        });


        $q.all([cityPromise, userMePromise]).then(function (results) {
            var inspectedCity = results[0];
            var userMe = results[1];
            $scope.canTriggerPhases = inspectedCity.started_at && !inspectedCity.finished_at && userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_READ];
            $scope.canChangeAvailability = !inspectedCity.started_at && userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_READ];
        });

    }

    function setInspectedCity(city) {
        $scope.inspectedCity = city;
        initTimezone();
    }

    var initTimezone = function() {
        if (!$scope.inspectedCity || $scope.inspectedCity.timezone === undefined)
            return;

        $scope.timezoneString = ($scope.inspectedCity.timezone >= 0 ? '+' : '-') + $scope.minutesToString(Math.abs(parseInt($scope.inspectedCity.timezone)))
    };

    $scope.minutesToString = citiesService.minutesToString;

    $scope.saveCity = function() {
        $scope.isProcessing = true;

        return citiesService.updateCity($scope.inspectedCity).then(function(cityResult) {
            $scope.isProcessing = false;


            setInspectedCity(cityResult);
            $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
        }, function(reason) {
            $scope.isProcessing = false;
            $scope.alerts.push({type: 'danger', msg: 'Error updating city'});
        });
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.deleteCity = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteCityModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteCityPromise = citiesService.deleteCity($scope.inspectedCity.id);
            deleteCityPromise.then(function() {
                citiesService.cityDeleted = $scope.inspectedCity;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "City is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteCityModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };


    $scope.triggerDayStart = function() {
        openTriggerDayStartModal();

    };

    var openTriggerDayStartModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'triggerDayStartModal.html',
            controller: TriggerDayStartModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            $scope.isTriggeringGamePhase = true;
            citiesService.triggerDayStart($scope.inspectedCity.id).then(function(updatedCityResult) {
                $scope.isTriggeringGamePhase = false;

                setInspectedCity(updatedCityResult);
                $scope.alerts.push({type: 'success', msg: "Day start successfully triggered." });
            }, function(reason) {
                $scope.isTriggeringGamePhase = false;
                $scope.alerts.push({type: 'danger', msg: "Day start not triggered." });
            });

        }, function () {
        });
    };

    var TriggerDayStartModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };



    $scope.triggerNightStart = function() {
        openTriggerNightStartModal();
    };

    var openTriggerNightStartModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'triggerNightStartModal.html',
            controller: TriggerNightStartModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            $scope.isTriggeringGamePhase = true;
            citiesService.triggerNightStart($scope.inspectedCity.id).then(function(updatedCityResult) {
                $scope.isTriggeringGamePhase = false;

                setInspectedCity(updatedCityResult);
                $scope.alerts.push({type: 'success', msg: "Night start successfully triggered." });
            }, function(reason) {
                $scope.isTriggeringGamePhase = false;
                $scope.alerts.push({type: 'danger', msg: "Night start not triggered." });
            });

        }, function () {
        });
    };

    var TriggerNightStartModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
}); 
 
// adminController 
 
var kAdminSelectedTabIndexCookieKey = 'admin_active_tabs';

var kAdminQueryModelUsers = 'admin_query_model_users';
var kAdminQueryModelCities = 'admin_query_model_cities';
var kAdminQueryModelResidents = 'admin_query_model_residents';
var kAdminQueryModelActions = 'admin_query_model_actions';
var kAdminQueryModelActionResults = 'admin_query_model_action_results';
var kAdminQueryModelDays = 'admin_query_model_days';
var kAdminQueryModelInitialAppRoles = 'admin_query_model_initial_app_roles';
var kAdminQueryModelGrantedAppRoles = 'admin_query_model_granted_app_roles';
var kAdminQueryModelPayments = 'admin_query_model_payments';
var kAdminQueryModelSubscriptions = 'admin_query_model_subscriptions';
var kAdminQueryModelGamePurchases = 'admin_query_model_game_purchases';
var kAdminQueryModelRolePickPurchases = 'admin_query_model_role_pick_purchases';


app.controller('AdminController',function ($scope, $q, $location, usersService, layoutService, citiesService, authService, appRolesService, paymentsService, subscriptionsService, gamePurchasesService, rolePickPurchasesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(false);

        $scope.appPermissions = usersService.appPermissions;

        var userMePromise = authService.userMe(false);
        userMePromise.then(function(userMeResult) {
            $scope.userMe = userMeResult;
        }, function (reason) {
            // ignore
        });

        $scope.alerts = [];

        var tabActive = layoutService.adminTabsActive;
        if (!tabActive) {
            tabActive = {0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false};
        }
        $scope.tabActive = tabActive;

        var usersQueryModelJson = getCookie(kAdminQueryModelUsers);
        if (usersQueryModelJson) {
            $scope.usersQueryModel = JSON.parse(usersQueryModelJson);
            convertTimestampsToDates($scope.usersQueryModel);
        }

        var citiesQueryModelJson = getCookie(kAdminQueryModelCities);
        if (citiesQueryModelJson) {
            $scope.citiesQueryModel = JSON.parse(citiesQueryModelJson);
            convertTimestampsToDates($scope.citiesQueryModel);
            $scope.citiesQueryModel['timezoneDate'] = $scope.citiesQueryModel['timezoneDate'] ? new Date($scope.citiesQueryModel['startedAtMin']) : null;
            $scope.citiesQueryModel['startedAtMin'] = $scope.citiesQueryModel['startedAtMin'] ? new Date($scope.citiesQueryModel['startedAtMin']) : null;
            $scope.citiesQueryModel['startedAtMax'] = $scope.citiesQueryModel['startedAtMax'] ? new Date($scope.citiesQueryModel['startedAtMax']) : null;
            $scope.citiesQueryModel['lastPausedAtMin'] = $scope.citiesQueryModel['lastPausedAtMin'] ? new Date($scope.citiesQueryModel['lastPausedAtMin']) : null;
            $scope.citiesQueryModel['lastPausedAtMax'] = $scope.citiesQueryModel['lastPausedAtMax'] ? new Date($scope.citiesQueryModel['lastPausedAtMax']) : null;
            $scope.citiesQueryModel['finishedAtMin'] = $scope.citiesQueryModel['finishedAtMin'] ? new Date($scope.citiesQueryModel['finishedAtMin']) : null;
            $scope.citiesQueryModel['finishedAtMax'] = $scope.citiesQueryModel['finishedAtMax'] ? new Date($scope.citiesQueryModel['finishedAtMax']) : null;
        }

        var residentsQueryModelJson = getCookie(kAdminQueryModelResidents);
        if (residentsQueryModelJson) {
            $scope.residentsQueryModel = JSON.parse(residentsQueryModelJson);
            convertTimestampsToDates($scope.residentsQueryModel);
        }

        var actionsQueryModelJson = getCookie(kAdminQueryModelActions);
        if (actionsQueryModelJson) {
            $scope.actionsQueryModel = JSON.parse(actionsQueryModelJson);
            convertTimestampsToDates($scope.actionsQueryModel);
        }

        var actionResultsQueryModelJson = getCookie(kAdminQueryModelActionResults);
        if (actionResultsQueryModelJson) {
            $scope.actionResultsQueryModel = JSON.parse(actionResultsQueryModelJson);
            convertTimestampsToDates($scope.actionResultsQueryModel);
        }

        var daysQueryModelJson = getCookie(kAdminQueryModelDays);
        if (daysQueryModelJson) {
            $scope.daysQueryModel = JSON.parse(daysQueryModelJson);
            convertTimestampsToDates($scope.daysQueryModel);
        }

        var initialAppRolesQueryModelJson = getCookie(kAdminQueryModelInitialAppRoles);
        if (initialAppRolesQueryModelJson) {
            $scope.initialAppRolesQueryModel = JSON.parse(initialAppRolesQueryModelJson);
            convertTimestampsToDates($scope.initialAppRolesQueryModel);
        }

        var paymentsQueryModelJson = getCookie(kAdminQueryModelPayments);
        if (paymentsQueryModelJson) {
            $scope.paymentsQueryModel = JSON.parse(paymentsQueryModelJson);
            convertTimestampsToDates($scope.paymentsQueryModel);
        }

        var subscriptionsQueryModelJson = getCookie(kAdminQueryModelSubscriptions);
        if (subscriptionsQueryModelJson) {
            $scope.subscriptionsQueryModel = JSON.parse(subscriptionsQueryModelJson);
            convertTimestampsToDates($scope.subscriptionsQueryModel);
        }

        var gamePurchasesQueryModelJson = getCookie(kAdminQueryModelGamePurchases);
        if (gamePurchasesQueryModelJson) {
            $scope.gamePurchasesQueryModel = JSON.parse(gamePurchasesQueryModelJson);
            convertTimestampsToDates($scope.gamePurchasesQueryModel);
        }

        var rolePickPurchasesQueryModelJson = getCookie(kAdminQueryModelRolePickPurchases);
        if (rolePickPurchasesQueryModelJson) {
            $scope.rolePickPurchasesQueryModel = JSON.parse(rolePickPurchasesQueryModelJson);
            convertTimestampsToDates($scope.rolePickPurchasesQueryModel);
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };


        if (usersService.userDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted user '" + usersService.userDeleted.username + "'"});
            usersService.userDeleted = null;
        }
        if (citiesService.cityDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted city '" + citiesService.cityDeleted.name + "'"});
            citiesService.cityDeleted = null;
        }

        if (appRolesService.notifications.initialAppRoleDeleted) {
            if (appRolesService.notifications.initialAppRoleDeleted.email) {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role for user with email '" + appRolesService.notifications.initialAppRoleDeleted.email + "'"});
            } else if (appRolesService.notifications.initialAppRoleDeleted.email_pattern) {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role for users using emails that match '" + appRolesService.notifications.initialAppRoleDeleted.email_pattern + "'"});
            } else {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role."});
            }

            appRolesService.notifications.initialAppRoleDeleted = null;
        }

        if (paymentsService.notifications.paymentLogDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted payment log for user with email '" + paymentsService.notifications.paymentLogDeleted.user_email + "'"});
            paymentsService.notifications.paymentLogDeleted = null;
        }

        if (subscriptionsService.notifications.subscriptionPurchaseDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted subscription purchase for user with email '" + subscriptionsService.notifications.subscriptionPurchaseDeleted.user_email + "'"});
            subscriptionsService.notifications.subscriptionPurchaseDeleted = null;
        }

        if (gamePurchasesService.notifications.gamePurchaseDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted game purchase for user with email '" + gamePurchasesService.notifications.gamePurchaseDeleted.user_email + "'"});
            gamePurchasesService.notifications.gamePurchaseDeleted = null;
        }

        if (rolePickPurchasesService.notifications.rolePickPurchaseDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted role pick purchase for user with email '" + rolePickPurchasesService.notifications.rolePickPurchaseDeleted.user_email + "'"});
            rolePickPurchasesService.notifications.rolePickPurchaseDeleted = null;
        }

    }


    $scope.tabSelected = function() {
        layoutService.adminTabsActive = $scope.tabActive;
    };


    function convertTimestampsToDates(queryModel) {
        queryModel['createdAtMin'] = queryModel['createdAtMin'] ? new Date(queryModel['createdAtMin']) : null;
        queryModel['createdAtMax'] = queryModel['createdAtMax'] ? new Date(queryModel['createdAtMax']) : null;
        queryModel['updatedAtMin'] = queryModel['updatedAtMin'] ? new Date(queryModel['updatedAtMin']) : null;
        queryModel['updatedAtMax'] = queryModel['updatedAtMax'] ? new Date(queryModel['updatedAtMax']) : null;
    }

}); 
 
// adminGamePurchaseController 
 
app.controller('AdminGamePurchaseController',function ($scope, $routeParams, $location, $modal, authService, layoutService, gamePurchasesService, citiesService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (gamePurchasesService.notifications.gamePurchaseCreated) {
            if (gamePurchasesService.notifications.gamePurchaseCreated.user_email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created game purchase for user with email '" + gamePurchasesService.notifications.gamePurchaseCreated.user_email + "'"});
            }
            gamePurchasesService.notifications.gamePurchaseCreated = null;
        }



        var gamePurchaseId = $routeParams['game_purchase_id'];
        var gamePurchasePromise;
        if (gamePurchaseId) {
            gamePurchasePromise = gamePurchasesService.getGamePurchaseById(gamePurchaseId);
        } else {
            gamePurchasePromise = gamePurchasesService.getNewGamePurchase();
        }


        gamePurchasePromise.then(function(gamePurchaseResult) {
            $scope.inspectedGamePurchase = gamePurchaseResult;
            $scope.inspectedGamePurchase.existingPaymentLog = (gamePurchaseResult.payment_log || {}).id;
        });


        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }

    $scope.tempUser = {};

    $scope.getUsersByUsername = function(username) {
        $scope.loadingUsers = true;
        return usersService.getAllUsers({username: username}).then(function(users) {
            $scope.loadingUsers = false;
            return users;
        }, function(reason) {
            $scope.loadingUsers = false;
            return reason;
        });
    };

    $scope.selectUser = function (user) {
        $scope.tempUser = angular.copy(user);
        $scope.inspectedGamePurchase.user = user;
    };


    $scope.getCitiesByName = function(cityName) {
        return citiesService.getAllCitiesForSearch(cityName);
    };

    $scope.selectCity = function (city) {
        $scope.inspectedGamePurchase.city = city;
        $scope.tempCity = angular.copy(city);
    };

    $scope.createGamePurchase = function() {
        $scope.isProcessing = true;

        return gamePurchasesService.postCreateGamePurchase($scope.inspectedGamePurchase).then(function(gamePurchaseResult) {
            $scope.isProcessing = false;

            gamePurchasesService.notifications.gamePurchaseCreated = gamePurchaseResult;
            $location.path('admin/game_purchase/' + gamePurchaseResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var message = 'Error creating game purchase. ';
            for (var key in reason.httpObj.responseJSON) {
                angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                    message += error + '. ';
                });
            }

            $scope.alerts.push({type: 'danger', msg: message});
        });
    };


    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



    $scope.$watch('[inspectedGamePurchase, userMe]', function(newValues, oldValues) {
        var inspectedGamePurchase = newValues[0];
        var userMe = newValues[1];
        if (!inspectedGamePurchase || !userMe) {
            return;
        }


    }, true);


    $scope.saveGamePurchase = function () {
        $scope.isProcessing = true;

        if ($scope.inspectedGamePurchase.id) {
            gamePurchasesService.putUpdateGamePurchase($scope.inspectedGamePurchase.id, $scope.inspectedGamePurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedGamePurchase = result;
                $scope.inspectedGamePurchase.existingPaymentLog = (result.payment_log || {}).id;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error updating game purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        } else {
            gamePurchasesService.postCreateGamePurchase($scope.inspectedGamePurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedGamePurchase = result;
                $scope.inspectedGamePurchase.existingPaymentLog = (result.payment_log || {}).id;
                $scope.alerts.push({type: 'success', msg: 'Successfully created'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error creating game purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        }


    };

    $scope.deleteGamePurchase = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteGamePurchaseModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteGamePurchasePromise = gamePurchasesService.deleteGamePurchase($scope.inspectedGamePurchase.id);
            deleteGamePurchasePromise.then(function() {
                gamePurchasesService.notifications.gamePurchaseDeleted = $scope.inspectedGamePurchase;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Game Purchase is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteGamePurchaseModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

}); 
 
// adminGrantedAppRoleController 
 
app.controller('AdminGrantedAppRoleController',function ($scope, $routeParams, $location, $modal, authService, layoutService, appRolesService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (appRolesService.notifications.grantedAppRoleCreated) {
            $scope.alerts.push({type: 'success', msg: "Successfully created granted app role for user with email '" + appRolesService.notifications.grantedAppRoleCreated.email + "'"});
            appRolesService.notifications.grantedAppRoleCreated = null;
        }



        var grantedAppRoleId = $routeParams['granted_app_role_id'];
        var grantedAppRolePromise;
        if (grantedAppRoleId) {
            grantedAppRolePromise = appRolesService.getGrantedAppRoleById(grantedAppRoleId);
        } else {
            grantedAppRolePromise = appRolesService.getNewGrantedAppRole();
        }
        grantedAppRolePromise.then(function(grantedAppRoleResult) {
            $scope.inspectedGrantedAppRole = grantedAppRoleResult;
        });

        if (!$scope.allAppRoles) {
            var allAppRolesPromise = appRolesService.getAllAppRoles();
            allAppRolesPromise.then(function (allAppRolesResult) {
                var allAppRoles = [];
                angular.forEach(allAppRolesResult, function(someAppRole) {
                    if (someAppRole.id != APP_ROLE_SUPER_ADMIN) {
                        allAppRoles.push(someAppRole);
                    }
                });
                $scope.allAppRoles = allAppRoles;
            }, function (reason) {
                // ignore
            });
        }

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }


    $scope.saveGrantedAppRole = function() {
        $scope.isProcessing = true;

        if ($scope.inspectedGrantedAppRole.id) {
            return appRolesService.putUpdateGrantedAppRole($scope.inspectedGrantedAppRole).then(function(grantedAppRoleResult) {
                $scope.isProcessing = false;

                $scope.inspectedGrantedAppRole = grantedAppRoleResult;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function(reason) {
                $scope.isProcessing = false;
                $scope.alerts.push({type: 'danger', msg: 'Error updating granted app role.'});
            });
        } else {
            return appRolesService.postCreateGrantedAppRole($scope.inspectedGrantedAppRole).then(function(grantedAppRoleResult) {
                $scope.isProcessing = false;

                appRolesService.notifications.inspectedGrantedAppRole = grantedAppRoleResult;
                $location.path('admin/granted_app_role/' + grantedAppRoleResult.id);
            }, function(reason) {
                $scope.isProcessing = false;
                var msg = '';
                for (var key in reason.httpObj.responseJSON) {
                    if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                        msg += reason.httpObj.responseJSON[key];
                    }
                }

                $scope.alerts.push({type: 'danger', msg: 'Error creating granted app role. ' + msg});
            });
        }

    };

    $scope.tempUser = {};

    $scope.getUsersByUsername = function(username) {
        $scope.loadingUsers = true;
        return usersService.getAllUsers({username: username}).then(function(users) {
            $scope.loadingUsers = false;
            return users;
        }, function(reason) {
            $scope.loadingUsers = false;
            return reason;
        });
    };

    $scope.selectUser = function (user) {
        $scope.tempUser = angular.copy(user);
        $scope.inspectedGrantedAppRole.user = user;
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.deleteGrantedAppRole = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteGrantedAppRoleModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteGrantedAppRolePromise = appRolesService.deleteGrantedAppRole($scope.inspectedGrantedAppRole.id);
            deleteGrantedAppRolePromise.then(function() {
                appRolesService.notifications.grantedAppRoleDeleted = $scope.inspectedGrantedAppRole;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Granted App Role is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteGrantedAppRoleModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

}); 
 
// adminInitialAppRoleController 
 
app.controller('AdminInitialAppRoleController',function ($scope, $routeParams, $location, $modal, authService, layoutService, appRolesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (appRolesService.notifications.initialAppRoleCreated) {
            if (appRolesService.notifications.initialAppRoleCreated.email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created initial app role for user with email '" + appRolesService.notifications.initialAppRoleCreated.email + "'"});
            } else if (appRolesService.notifications.initialAppRoleCreated.email_pattern) {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role for users using emails that match '" + appRolesService.notifications.initialAppRoleCreated.email_pattern + "'"});
            } else {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role."});
            }
            appRolesService.notifications.initialAppRoleCreated = null;
        }



        var initialAppRoleId = $routeParams['initial_app_role_id'];
        var initialAppRolePromise;
        if (initialAppRoleId) {
            initialAppRolePromise = appRolesService.getInitialAppRoleById(initialAppRoleId);
        } else {
            initialAppRolePromise = appRolesService.getNewInitialAppRole();
        }
        initialAppRolePromise.then(function(initialAppRoleResult) {
            $scope.inspectedInitialAppRole = initialAppRoleResult;
        });

        appRolesService.getAllAppRoles(false).then(function(allAppRolesResult) {
            var appRoles = [];
            angular.forEach(allAppRolesResult, function(someAppRole) {
                if (someAppRole.id != APP_ROLE_SUPER_ADMIN) {
                    appRoles.push(someAppRole);
                }
            });
            $scope.appRoles = appRoles;
        });

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }

    $scope.createInitialAppRole = function() {
        $scope.isProcessing = true;

        return appRolesService.postCreateInitialAppRole($scope.inspectedInitialAppRole).then(function(initialAppRoleResult) {
            $scope.isProcessing = false;

            $scope.inspectedInitialAppRole = initialAppRoleResult;

            appRolesService.notifications.initialAppRoleCreated = initialAppRoleResult;
            $location.path('admin/initial_app_role/' + initialAppRoleResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var msg = '';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    msg += reason.httpObj.responseJSON[key];
                }
            }

            $scope.alerts.push({type: 'danger', msg: 'Error creating initial app role. ' + msg});
        });
    };


    $scope.saveInitialAppRole = function() {
        $scope.isProcessing = true;

        return appRolesService.putUpdateInitialAppRole($scope.inspectedInitialAppRole).then(function(initialAppRoleResult) {
            $scope.isProcessing = false;

            $scope.inspectedInitialAppRole = initialAppRoleResult;
            $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
        }, function(reason) {
            $scope.isProcessing = false;
            $scope.alerts.push({type: 'danger', msg: 'Error updating initial app role.'});
        });
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



    $scope.$watch('[inspectedInitialAppRole, userMe]', function(newValues, oldValues) {
        var inspectedInitialAppRole = newValues[0];
        var userMe = newValues[1];
        if (!inspectedInitialAppRole || !userMe) {
            return;
        }


    }, true);


    $scope.deleteInitialAppRole = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteInitialAppRoleModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteInitialAppRolePromise = appRolesService.deleteInitialAppRole($scope.inspectedInitialAppRole.id);
            deleteInitialAppRolePromise.then(function() {
                appRolesService.notifications.initialAppRoleDeleted = $scope.inspectedInitialAppRole;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Initial App Role is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteInitialAppRoleModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

}); 
 
// adminPaymentLogController 
 
app.controller('AdminPaymentLogController',function ($scope, $routeParams, $location, $modal, authService, layoutService, paymentsService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (paymentsService.notifications.paymentLogCreated) {
            if (paymentsService.notifications.paymentLogCreated.user_email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created payment log for user with email '" + paymentsService.notifications.paymentLogCreated.user_email + "'"});
            }
            paymentsService.notifications.paymentLogCreated = null;
        }



        var paymentLogId = $routeParams['payment_log_id'];
        var paymentLogPromise;
        if (paymentLogId) {
            paymentLogPromise = paymentsService.getPaymentLogById(paymentLogId);
        } else {
            paymentLogPromise = paymentsService.getNewPaymentLog();
        }
        paymentLogPromise.then(function(paymentLogResult) {
            $scope.inspectedPaymentLog = paymentLogResult;
            $scope.tempUser = angular.copy(paymentLogResult.user);
        });

        paymentsService.getAllPaymentTypes(false).then(function(allPaymentTypesResult) {
            $scope.allPaymentTypes = allPaymentTypesResult;
        });

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }

    $scope.createPaymentLog = function() {
        $scope.isProcessing = true;

        return paymentsService.postCreatePaymentLog($scope.inspectedPaymentLog).then(function(paymentLogResult) {
            $scope.isProcessing = false;

            paymentsService.notifications.paymentLogCreated = paymentLogResult;
            $location.path('admin/payment_log/' + paymentLogResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var msg = '';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    msg += reason.httpObj.responseJSON[key];
                }
            }

            $scope.alerts.push({type: 'danger', msg: 'Error creating payment log. ' + msg});
        });
    };



    $scope.tempUser = {};

    $scope.getUsersByUsername = function(username) {
        $scope.loadingUsers = true;
        return usersService.getAllUsers({username: username}).then(function(users) {
            $scope.loadingUsers = false;
            return users;
        }, function(reason) {
            $scope.loadingUsers = false;
            return reason;
        });
    };

    $scope.selectUser = function (user) {
        $scope.tempUser = angular.copy(user);
        $scope.inspectedPaymentLog.user = user;
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



    $scope.$watch('[inspectedPaymentLog, userMe]', function(newValues, oldValues) {
        var inspectedPaymentLog = newValues[0];
        var userMe = newValues[1];
        if (!inspectedPaymentLog || !userMe) {
            return;
        }


    }, true);


    $scope.savePaymentLog = function () {
        $scope.isProcessing = true;

        if ($scope.inspectedPaymentLog.id) {
            paymentsService.putUpdatePaymentLog($scope.inspectedPaymentLog.id, $scope.inspectedPaymentLog).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedPaymentLog = result;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error updating payment log. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        } else {
            paymentsService.postCreatePaymentLog($scope.inspectedPaymentLog).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedPaymentLog = result;
                $scope.alerts.push({type: 'success', msg: 'Successfully created'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error creating payment log. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        }

    };

    $scope.deletePaymentLog = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeletePaymentLogModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deletePaymentLogPromise = paymentsService.deletePaymentLog($scope.inspectedPaymentLog.id);
            deletePaymentLogPromise.then(function() {
                paymentsService.notifications.paymentLogDeleted = $scope.inspectedPaymentLog;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Payment Log is not deleted." });
            });

        }, function () {
        });
    };

    var DeletePaymentLogModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

}); 
 
// adminRolePickPurchaseController 
 
app.controller('AdminRolePickPurchaseController',function ($scope, $routeParams, $location, $modal, authService, layoutService, rolePickPurchasesService, citiesService, rolesService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (rolePickPurchasesService.notifications.rolePickPurchaseCreated) {
            if (rolePickPurchasesService.notifications.rolePickPurchaseCreated.user_email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created role pick purchase for user with email '" + rolePickPurchasesService.notifications.rolePickPurchaseCreated.user_email + "'"});
            }
            rolePickPurchasesService.notifications.rolePickPurchaseCreated = null;
        }


        rolesService.getAllRoles().then(function (allRolesResult) {
            $scope.allRoles = allRolesResult;
        }, function (reason) {
            // ignore
        });


        var rolePickPurchaseId = $routeParams['role_pick_purchase_id'];
        var rolePickPurchasePromise;
        if (rolePickPurchaseId) {
            rolePickPurchasePromise = rolePickPurchasesService.getRolePickPurchaseById(rolePickPurchaseId);
        } else {
            rolePickPurchasePromise = rolePickPurchasesService.getNewRolePickPurchase();
        }


        rolePickPurchasePromise.then(function(rolePickPurchaseResult) {
            $scope.inspectedRolePickPurchase = rolePickPurchaseResult;
            $scope.inspectedRolePickPurchase.existingPaymentLog = ($scope.inspectedRolePickPurchase.payment_log || {}).id;
        });


        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }


    $scope.getCitiesByName = function(cityName) {
        return citiesService.getAllCitiesForSearch(cityName);
    };

    $scope.selectCity = function (city) {
        $scope.inspectedRolePickPurchase.role_pick.city = city;
        $scope.tempCity = angular.copy(city);
    };

    $scope.tempUser = {};

    $scope.getUsersByUsername = function(username) {
        $scope.loadingUsers = true;
        return usersService.getAllUsers({username: username}).then(function(users) {
            $scope.loadingUsers = false;
            return users;
        }, function(reason) {
            $scope.loadingUsers = false;
            return reason;
        });
    };

    $scope.selectUser = function (user) {
        $scope.tempUser = angular.copy(user);
        $scope.inspectedRolePickPurchase.user = user;
    };

    $scope.createRolePickPurchase = function() {
        $scope.isProcessing = true;

        return rolePickPurchasesService.postCreateRolePickPurchase($scope.inspectedRolePickPurchase).then(function(rolePickPurchaseResult) {
            $scope.isProcessing = false;

            rolePickPurchasesService.notifications.rolePickPurchaseCreated = rolePickPurchaseResult;
            $location.path('admin/role_pick_purchase/' + rolePickPurchaseResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var msg = '';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    msg += reason.httpObj.responseJSON[key];
                }
            }

            $scope.alerts.push({type: 'danger', msg: 'Error creating role pick purchase. ' + msg});
        });
    };


    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



    $scope.$watch('[inspectedRolePickPurchase, userMe]', function(newValues, oldValues) {
        var inspectedRolePickPurchase = newValues[0];
        var userMe = newValues[1];
        if (!inspectedRolePickPurchase || !userMe) {
            return;
        }


    }, true);


    $scope.saveRolePickPurchase = function () {
        $scope.isProcessing = true;

        if ($scope.inspectedRolePickPurchase.id) {
            rolePickPurchasesService.putUpdateRolePickPurchase($scope.inspectedRolePickPurchase.id, $scope.inspectedRolePickPurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedRolePickPurchase = result;
                $scope.inspectedRolePickPurchase.existingPaymentLog = (result || {}).id;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error updating role pick purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }

                $scope.alerts.push({type: 'danger', msg: message});
            });
        } else {
            rolePickPurchasesService.postCreateRolePickPurchase($scope.inspectedRolePickPurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedRolePickPurchase = result;
                $scope.inspectedRolePickPurchase.existingPaymentLog = (result.payment_log || {}).id;
                $scope.alerts.push({type: 'success', msg: 'Successfully created'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error creating role pick purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        }


    };

    $scope.deleteRolePickPurchase = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteRolePickPurchaseModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteRolePickPurchasePromise = rolePickPurchasesService.deleteRolePickPurchase($scope.inspectedRolePickPurchase.id);
            deleteRolePickPurchasePromise.then(function() {
                rolePickPurchasesService.notifications.rolePickPurchaseDeleted = $scope.inspectedRolePickPurchase;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Role Pick Purchase is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteRolePickPurchaseModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

}); 
 
// adminSubscriptionPurchaseController 
 
app.controller('AdminSubscriptionPurchaseController',function ($scope, $routeParams, $location, $modal, authService, layoutService, subscriptionsService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (subscriptionsService.notifications.subscriptionPurchaseCreated) {
            if (subscriptionsService.notifications.subscriptionPurchaseCreated.user_email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created subscription purchase for user with email '" + subscriptionsService.notifications.subscriptionPurchaseCreated.user_email + "'"});
            }
            subscriptionsService.notifications.subscriptionPurchaseCreated = null;
        }



        var subscriptionPurchaseId = $routeParams['subscription_purchase_id'];
        var subscriptionPurchasePromise;
        if (subscriptionPurchaseId) {
            subscriptionPurchasePromise = subscriptionsService.getSubscriptionPurchaseById(subscriptionPurchaseId);
        } else {
            subscriptionPurchasePromise = subscriptionsService.getNewSubscriptionPurchase();
        }


        subscriptionPurchasePromise.then(function(subscriptionPurchaseResult) {
            $scope.inspectedSubscriptionPurchase = subscriptionPurchaseResult;
            $scope.inspectedSubscriptionPurchase.existingPaymentLog = (subscriptionPurchaseResult.payment_log || {}).id != null;
        });



        $scope.allSubscriptionTypes = subscriptionsService.subscriptionTypes;

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }

    $scope.createSubscriptionPurchase = function() {
        $scope.isProcessing = true;

        return subscriptionsService.postCreateSubscriptionPurchase($scope.inspectedSubscriptionPurchase).then(function(subscriptionPurchaseResult) {
            $scope.isProcessing = false;

            subscriptionsService.notifications.subscriptionPurchaseCreated = subscriptionPurchaseResult;
            $location.path('admin/subscription_purchase/' + subscriptionPurchaseResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var msg = '';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    msg += reason.httpObj.responseJSON[key];
                }
            }

            $scope.alerts.push({type: 'danger', msg: 'Error creating subscription purchase. ' + msg});
        });
    };


    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.tempUser = {};

    $scope.getUsersByUsername = function(username) {
        $scope.loadingUsers = true;
        return usersService.getAllUsers({username: username}).then(function(users) {
            $scope.loadingUsers = false;
            return users;
        }, function(reason) {
            $scope.loadingUsers = false;
            return reason;
        });
    };

    $scope.selectUser = function (user) {
        $scope.tempUser = angular.copy(user);
        $scope.inspectedSubscriptionPurchase.user = user;
    };



    $scope.$watch('[inspectedSubscriptionPurchase, userMe]', function(newValues, oldValues) {
        var inspectedSubscriptionPurchase = newValues[0];
        var userMe = newValues[1];
        if (!inspectedSubscriptionPurchase || !userMe) {
            return;
        }


    }, true);


    $scope.saveSubscriptionPurchase = function () {
        $scope.isProcessing = true;

        if ($scope.inspectedSubscriptionPurchase.id) {
            subscriptionsService.putUpdateSubscriptionPurchase($scope.inspectedSubscriptionPurchase.id, $scope.inspectedSubscriptionPurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedSubscriptionPurchase = result;
                $scope.inspectedSubscriptionPurchase.existingPaymentLog = (result.payment_log || {}).id != null;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error updating subscription purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        } else {
            subscriptionsService.postCreateSubscriptionPurchase($scope.inspectedSubscriptionPurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedSubscriptionPurchase = result;
                $scope.inspectedSubscriptionPurchase.existingPaymentLog = (result.payment_log || {}).id != null;
                $scope.alerts.push({type: 'success', msg: 'Successfully created'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error creating subscription purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        }


    };

    $scope.deleteSubscriptionPurchase = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteSubscriptionPurchaseModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteSubscriptionPurchasePromise = subscriptionsService.deleteSubscriptionPurchase($scope.inspectedSubscriptionPurchase.id);
            deleteSubscriptionPurchasePromise.then(function() {
                subscriptionsService.notifications.subscriptionPurchaseDeleted = $scope.inspectedSubscriptionPurchase;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Subscription Purchase is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteSubscriptionPurchaseModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

}); 
 
// adminUserController 
 
app.controller('AdminUserController',function ($scope, $routeParams, $location, $modal, $timeout, authService, layoutService, usersService, serverService, appRolesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        var userId = $routeParams['user_id'];
        if (userId) {
            usersService.getUserById(userId).then(function(userResult) {
                $scope.inspectedUser = userResult;
            });
        }

        appRolesService.getAllAppRoles(false).then(function(allAppRolesResult) {
            var appRoles = [];
            angular.forEach(allAppRolesResult, function(someAppRole) {
                if (someAppRole.id != APP_ROLE_SUPER_ADMIN) {
                    appRoles.push(someAppRole);
                }
            });
            $scope.appRoles = appRoles;
        });

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }

    $scope.$watch('[inspectedUser, userMe]', function(newValues, oldValues) {
        var inspectedUser = newValues[0];
        var userMe = newValues[1];
        if (!inspectedUser || !userMe) {
            $scope.roleEditable = false;
            $scope.userPreferenceEditable = false;
            return;
        }

        $scope.roleEditable = inspectedUser.app_role.id != APP_ROLE_SUPER_ADMIN && userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        $scope.userPreferenceEditable = (userMe.app_role.id == APP_ROLE_SUPER_ADMIN) || (inspectedUser.app_role.id != APP_ROLE_SUPER_ADMIN && userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_READ]);
        $scope.canAlterEmailConfirmed = inspectedUser.app_role.id != APP_ROLE_SUPER_ADMIN && userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
    }, true);

    $scope.saveUser = function() {
        $scope.isProcessing = true;

        return usersService.updateUser($scope.inspectedUser).then(function(userResult) {
            $scope.isProcessing = false;

            $scope.inspectedUser = userResult;
            $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
        }, function(reason) {
            $scope.isProcessing = false;
            $scope.alerts.push({type: 'danger', msg: 'Error updating user'});
        });
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.resendConfirmationEmail = function() {
        if ($scope.inspectedUser.id) {
            $scope.isSendingConfirmationEmail = true;
            serverService.get('users/' + $scope.inspectedUser.id + '/resend_confirmation_email').then(function(userResult) {
                $scope.inspectedUser = userResult;

                $timeout(function() {
                    $scope.alerts.push({type: 'success', msg: 'Successfully sent confirmation email.'});
                });

                $scope.isSendingConfirmationEmail = false;
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: 'Error sending confirmation email.'});
                $scope.isSendingConfirmationEmail = false;
            });
        }
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.impersonate = function() {
        openImpersonationModal();
    };


    $scope.deleteUser = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteUserModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteUserPromise = usersService.deleteUserById($scope.inspectedUser.id);
            deleteUserPromise.then(function() {
                usersService.userDeleted = $scope.inspectedUser;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "User is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteUserModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };




    var openImpersonationModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'impersonateModalContent.html',
            controller: ImpersonateUserModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            authService.impersonationAuthenticate($scope.inspectedUser.id).then(function(impersonatedUserResult) {
                authService.notifications.shouldSignIn = true;
                $location.path('');
            });
        }, function () {
        });
    };

    var ImpersonateUserModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

}); 
 
// authDirective 
 
app.directive('auth', function($routeParams, $location, $modal, $timeout, authService, layoutService, usersService) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            "use strict";

            scope.infos = [];

            scope.homeButtonVisible = layoutService.homeButtonVisible;

            scope.profileUrl = "#!/profile";

            scope.adminButtonVisible = function() {
                if (scope.user.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE] || scope.user.app_role.app_permissions[APP_PERMISSION_ADMIN_READ]) {
                    return layoutService.adminButtonVisible();
                } else {
                    return false;
                }
            };

            scope.setLocationHome = function () {
                $location.path('/cities');
            };

            scope.setLocationAdmin = function () {
                $location.path('/admin');
            };

            scope.user = {
                username : "",
                password : ""
            };

            scope.loader = {
                isLoading: false
            };

            scope.emailConfirmation = authService.emailConfirmation;

            scope.$watch('emailConfirmation', function(newEmailConfirmation) {
               if (newEmailConfirmation.code && !scope.user.id) {
                    signIn();
                }
            }, true);

            signIn();

            function signIn() {
                scope.loader.isLoading = true;
                var userMePromise;

                if (authService.emailConfirmation.code) {
                    var emailConfirmationCode = authService.emailConfirmation.code;
                    authService.emailConfirmation.code = null;
                    userMePromise = authService.exchangeEmailConfirmationCode(emailConfirmationCode);
                } else {
                    userMePromise = authService.authenticate(scope.user.username, scope.user.password);
                }

                userMePromise.then(function(userMe) {
                    scope.loader.isLoading = false;
                    if (!userMe)
                        return;

                    scope.user = userMe;
                    scope.user.password = "";
                }, function(reason) {
                    scope.user.id = null;
                    scope.loader.isLoading = false;

                    if (!reason.httpObj)
                        return;

                    if (reason.httpObj.status == 401) {
                        if (reason.httpObj.responseText) {
                            scope.infos.push({type: 'danger', msg:reason.httpObj.responseText});
                        } else {
                            scope.infos.push({type: 'danger', msg:'Server error'});
                        }


                    } else {
                        // do nothing
                        // no users stored in cookies, no username&password
                    }
                });
            }

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.signIn = signIn;

            scope.notifications = authService.notifications;

            scope.$watch('notifications.shouldSignOut', function(newValue, oldValue) {
                if (newValue && !oldValue) {
                    authService.notifications.shouldSignOut = false;
                    scope.signOut();
                }
            });

            scope.$watch('notifications.shouldSignIn', function(newValue, oldValue) {
                if (newValue && !oldValue) {
                    authService.notifications.shouldSignIn = false;
                    signIn();
                }
            });

            scope.signOut = function() {
                authService.signOut();
                scope.user = {};
                $location.path('/cities');
            };

            $(document).keypress(function(e) {
                if (e.which == 13 && $("#password").is(":focus")) {
                    scope.signIn();
                }
            });

            scope.register = function() {
                $location.path('/register');
            };


            scope.forgotPassword = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'forgotPasswordModalContent.html',
                    controller: ForgotPasswordModalInstanceCtrl,
                    resolve: {
                    }
                });

                modalInstance.result.then(function (email) {
                    if (!email || email.length == 0) {
                        scope.infos.push({type: 'danger', msg: 'Email must not be empty.'});
                        return;
                    }


                    var forgotPasswordPromise = usersService.postForgotPassword(email);
                    scope.loader.isLoading = true;
                    forgotPasswordPromise.then(function() {
                        $timeout(function() {
                            scope.infos.push({type : 'success', msg: 'Confirmation email sent to "' + email + '".'});
                            scope.loader.isLoading = false;
                        });

                    }, function(reason) {
                        $timeout(function() {
                            scope.loader.isLoading = false;
                            scope.infos.push({type : 'danger', msg: 'Failed to send confirmation email to "' + email +'".' });
                        });
                    });

                }, function () {
                });
            };





            var ForgotPasswordModalInstanceCtrl = function ($scope, $modalInstance) {
                $scope.form = {
                    email : ""
                };

                $scope.ok = function () {
                    $modalInstance.close($scope.form.email);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };


        },
        templateUrl: 'app/directiveTemplates/auth.html'
    };
}); 
 
// infoDirective 
 
app.directive('info', function($routeParams, $location, $route, rolesService) {
    return {
        restrict: 'E',
        scope: {
            index: '=',
            change: '&'
        },
        link: function(scope, element, attrs) {
            "use strict";

            var tabClasses;

            var pageNames = ['welcome', 'about', 'roles', 'advanced'];


            function initTabs() {
                tabClasses = ["","","",""];
            }

            scope.getTabClass = function (tabNum) {
                return tabClasses[tabNum];
            };

            scope.getTabPaneClass = function (tabNum) {
                return "tab-pane " + tabClasses[tabNum];
            };

            scope.setActiveTab = function (tabNum) {
                scope.index = tabNum;

                initTabs();
                tabClasses[tabNum] = "active";

                if (scope.change) {
                    scope.change({pageName : pageNames[tabNum]});
                }
            };

            //Initialize

            initTabs();

            var routePath = $route.current.$$route ? $route.current.$$route.originalPath : '';

            var index = 0;
            for (var i = 0; i < pageNames.length; i++) {
                if (routePath == '/' + pageNames[i]) {
                    index = i;
                    break;
                }
            }
            scope.index = index;
            scope.setActiveTab(index);

            rolesService.getAllRoles().then(function(allRolesResult) {
                scope.allRoles = allRolesResult;
            });
            scope.affiliationIds = rolesService.affiliationIds;
        },
        templateUrl: 'app/directiveTemplates/info.html'
    };
}); 
 
// actionResultDirective 
 
app.directive('actionResult', function($compile, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId : '=',
            resident : '=',
            actionResult: '=',
            actionResults: '=',
            editMode: '=',
            isNew: '=',
            hide: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResult.html',
        compile: function (element, attrs) {
            var actionResultDirectivesByActionResultTypeId = {};
            // var voteResultDirective = element.find( "vote-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_VOTE] = '<vote-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_VOTE" ></vote-result>';//voteResultDirective;
            // var voteMafiaResultDirective = element.find( "vote-mafia-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_VOTE_MAFIA] = '<vote-mafia-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_VOTE_MAFIA"></vote-mafia-result>';// voteMafiaResultDirective;
            // var sheriffIdentitiesResultDirective = element.find( "sheriff-identities-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES] = '<sheriff-identities-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES"></sheriff-identities-result>';
            // var terroristBombResultDirective = element.find( "terrorist-bomb-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_TERRORIST_BOMB] = '<terrorist-bomb-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_TERRORIST_BOMB"></terrorist-bomb-result>';
            // var residentBecameSheriffResultDirective = element.find( "resident-became-sheriff-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF] = '<resident-became-sheriff-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF"></resident-became-sheriff-result>';
            // var residentBecameDeputyResultDirective = element.find( "resident-became-deputy-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY] = '<resident-became-deputy-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY"></resident-became-deputy-result>';
            // var revivalOccuredResultDirective = element.find( "revival-occurred-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED] = '<revival-occurred-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED"></revival-occurred-result>';
            // var revivalRevealedResultDirective = element.find( "revival-revealed-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED] = '<revival-revealed-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED"></revival-revealed-result>';

            // var investigateResultDirective = element.find( "investigate-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_INVESTIGATE] = '<investigate-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_INVESTIGATE"></investigate-result>';
            // var protectResultDirective = element.find( "protect-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_PROTECT] = '<protect-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_PROTECT"></protect-result>';
            // var tellerVotesResultDirective = element.find( "teller-votes-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_TELLER_VOTES] = '<teller-votes-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_TELLER_VOTES"></teller-votes-result>';
            // var mafiaMembersResultDirective = element.find( "mafia-members-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS] = '<mafia-members-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS"></mafia-members-result>';
            // var journalistInvestigateResultDirective = element.find( "journalist-investigate-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE] = '<journalist-investigate-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE"></journalist-investigate-result>';
            // var deputyIdentitiesResultDirective = element.find( "deputy-identities-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES] = '<deputy-identities-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES"></deputy-identities-result>';



            return {
                pre: function (scope, element, attrs) {

                },
                post: function (scope, element, attrs) {
                    "use strict";

                    scope.actionResultTypeIds = actionResultsService.actionResultTypeIds;

                    var actionResultTypeId = scope.actionResult.action_result_type.id;
                    var actionResultDiv = element.find('.action-result');

                    if (actionResultDirectivesByActionResultTypeId[actionResultTypeId]) {
                        var actionResultDirective = actionResultDirectivesByActionResultTypeId[actionResultTypeId];
                        var transcludeActionResultDirective = $compile( actionResultDirective );
                        transcludeActionResultDirective(scope, function( actionResultDirectiveClone ) {
                            actionResultDiv.append( actionResultDirectiveClone );
                        });
                    }


                }
            };
        }
    };
}); 
 
// actionTypeParamsDirective 
 
app.directive('actionTypeParams', function(actionsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeId: '=',
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionTypeParams.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeIds = actionsService.actionTypeIds;

        }
    };
}); 
 
// cityTimerDirective 
 
app.directive('cityTimer', function($timeout) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            nextMoment: '=',
            onDayStart: '=',
            onNightStart: '='
        },
        controller: function($scope) {
            var lastMoment = null;

            var timeOffset = 0;

            $scope.editMode = false;
            $scope.lastMidnight = new Date().getTime();



            $scope.$on('timer-tick', timerTick);

            $scope.$on('timer-stopped', function() {
                // $scope.$broadcast('timer-start')
            });

            $scope.$watch('city', function(city) {
                if (!city)
                    return;

                initClock(city);
                // initEarliestMoment(city);

            });

            function currentCityTime(city) {
                var date = new Date();
                var timezoneDifference = date.getTimezoneOffset()*60*1000 + city.timezone*60*1000;

                var timestampWithTimezone = date.getTime() + timezoneDifference;
                date.setTime(timestampWithTimezone);
                return date;
            }

            function initClock(city, offsetMillis) {
                var date = currentCityTime(city);
                if (!offsetMillis) {
                    offsetMillis = 0;
                }
                var timezoneDifference = date.getTimezoneOffset()*60*1000 + city.timezone*60*1000;

                var lastMidnight = date.getTime() - date.getHours()*60*60*1000 - date.getMinutes()*60*1000 - date.getSeconds()*1000 - date.getMilliseconds();
                lastMidnight -= timezoneDifference;

                lastMidnight -= offsetMillis; // for setting arbitrary time

                $scope.lastMidnight = lastMidnight;
            }

            /*
            var earliestMoment = {
                time : 24*60,
                isDayStart : true
            };
            */
            var previousTickNextMoment = {};

            /*
            function initEarliestMoment(city) {
                for (var index in city.day_cycles) {
                    var dayCycle = city.day_cycles[index];
                    if (dayCycle.day_start - earliestMoment.time < 0) {
                        earliestMoment.time = dayCycle.day_start;
                        earliestMoment.isDayStart = true;
                    }
                    if (dayCycle.night_start - earliestMoment.time < 0) {
                        earliestMoment.time = dayCycle.night_start;
                        earliestMoment.isDayStart = false;
                    }
                }
            }
            */

            function timeBetween(start, end) {
                while (end < start)
                    end += 24*60;

                return end - start;
            }


            // var previousTickTime = 0;

            function timerTick(evt) {
                var time = evt.targetScope.millis;

                if (!$scope.city) return;

                var timeInMinutes = time / (1000 * 60);

                if (timeInMinutes >= 24*60) {
                    initClock($scope.city);
                    timeInMinutes = timeInMinutes % (24*60);
                }

                var dayCycles = $scope.city.day_cycles;

                var nextMoment = {
                    time : 60*24,
                    isDayStart : false
                };
                var minimumDiff = 60*24;

                for (var index = 0; index < dayCycles.length; index++) {
                    var dayCycle = dayCycles[index];
                    var diff = timeBetween(timeInMinutes, dayCycle.day_start);
                    if (diff < minimumDiff) {
                        minimumDiff = diff;
                        nextMoment.time = dayCycle.day_start;
                        nextMoment.isDayStart = true;
                    }

                    diff = timeBetween(timeInMinutes, dayCycle.night_start);
                    if (diff < minimumDiff) {
                        minimumDiff = diff;
                        nextMoment.time = dayCycle.night_start;
                        nextMoment.isDayStart = false;
                    }
                }

                if (previousTickNextMoment.time && previousTickNextMoment.time != nextMoment.time) {
                    // day start or night start happened while page was showing
                    $scope.refreshCountdownTicks = 10 + Math.floor(Math.random()*20);
                    lastMoment = previousTickNextMoment;
                    previousTickNextMoment = nextMoment;
                }


                if ($scope.refreshCountdownTicks == 1) {
                    if (lastMoment.isDayStart) {
                        $scope.onDayStart();
                    } else {
                        $scope.onNightStart();
                    }
                }

                $scope.refreshCountdownTicks = Math.max(0, $scope.refreshCountdownTicks-1);
                $timeout(function () {
                    $scope.nextMoment.time = nextMoment.time;
                    $scope.nextMoment.isDayStart = nextMoment.isDayStart;
                });



            }

            $scope.toggleMode = function() {
                if ($scope.city.finished_at)
                    return;

                $scope.editMode = !$scope.editMode;

                if ($scope.editMode) {
                    var currentDate = new Date(new Date().getTime() + timeOffset);
                    $scope.time = {
                        hours : currentDate.getHours(),
                        minutes : currentDate.getMinutes(),
                        seconds : currentDate.getSeconds()
                    };
                }
            };

            $scope.setTime = function() {
                if ($scope.time.hours < 0 || $scope.time.hours > 23)
                    return;
                if ($scope.time.minutes < 0 || $scope.time.minutes > 59)
                    return;
                if ($scope.time.seconds < 0 || $scope.time.seconds > 59)
                    return;

                timeOffset = 0;
                var date = new Date();
                timeOffset += ($scope.time.hours - date.getHours()) * 60*60*1000;
                timeOffset += ($scope.time.minutes - date.getMinutes()) * 60 * 1000;
                timeOffset += ($scope.time.seconds - date.getSeconds()) * 1000;

                initClock($scope.city, timeOffset);
                $scope.editMode = false;
            };
        },
        templateUrl: 'app/directiveTemplates/domain/cityTimer.html',
        link: function(scope, element, attrs) {
            "use strict";
        }
    };
}); 
 
// createPrivateNewsFeedResultDirective 
 
app.directive('createPrivateNewsFeedResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/createPrivateNewsFeedResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeLabel = "Fake a notification";
            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIds) {
                scope.actionResultTypes = actionResultTypesByIds;
            });
            scope.actionTypes = [];

            scope.newActionResult = null;


            scope.$watch('[city.rolesById, roleId]', function(values) {
                var rolesById = values[0];
                if (!rolesById)
                    return;

                var roleId = values[1];
                if (!roleId)
                    return;

                var role = rolesById[roleId].role;

                scope.supportedActionResultTypes = actionResultsService.privateActionResultTypesForRole(role);
            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.hide = function() {
                scope.newActionResult = null;
                scope.editMode = false;
            };

            scope.actionResultTypeSelected = function(selectedActionResultType) {
                scope.newActionResult = {
                    action_result_type : selectedActionResultType,
                    result : {}
                };
            };
        }
    };
}); 
 
// createPublicNewsFeedResultDirective 
 
app.directive('createPublicNewsFeedResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/createPublicNewsFeedResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeLabel = "Fake news";
            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIds) {
                 scope.actionResultTypes = actionResultTypesByIds;

                scope.newActionResult = {
                    action_result_type : {},
                    result : {}
                };
            });
            scope.actionTypes = [];

            scope.newActionResult = null;

            scope.supportedActionResultTypeIds = actionResultsService.publicActionResultTypeIds(scope.city);



            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.hide = function() {
                scope.newActionResult = null;
                scope.editMode = false;
            };

            scope.actionResultTypeSelected = function(selectedActionResultType) {
                scope.newActionResult = {
                    action_result_type : selectedActionResultType,
                    result : {}
                };
            };
        }
    };
}); 
 
// currentDayDirective 
 
app.directive('currentDay', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/currentDay.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.editMode = false;

            scope.$watch('city', function(city) {
                if (!city)
                    return;


            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

        }
    };
}); 
 
// privateNewsFeedDirective 
 
app.directive('privateNewsFeed', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId : '=',
            resident : '=',
            actionResults: '=',
            isLoadingActionResults: '=',
            dayNumberMin: '=',
            dayNumberMax: '=',
            hasEarlierActionResults: '=',
            loadEarlierActionResults: '=',
            hasMoreRecentActionResults: '=',
            loadMoreRecentActionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/privateNewsFeed.html',
        link: function(scope, element, attrs) {
            "use strict";

            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIdsResult) {
                scope.actionResultTypes = actionResultTypesByIdsResult;
            });

            scope.$watchCollection('actionResults', function(actionResults) {
                if (!actionResults)
                    return null;

                var privateActionResults = actionResultsService.privateActionResults(actionResults);

                var rolesById = scope.city.rolesById;
                var role = rolesById[scope.roleId].role;
                var showingActionResults = {};
                angular.forEach(role.action_types, function(someActionType) {
                    if (someActionType.action_result_type) {
                        showingActionResults[someActionType.action_result_type.id] = true;
                    }
                });

                var filteredActionResults = $.grep(privateActionResults, function(someActionResult) {
                    return showingActionResults[someActionResult.action_result_type.id];
                });

                scope.filteredActionResults = filteredActionResults;
            }, true);


        }
    };
}); 
 
// publicNewsFeedDirective 
 
app.directive('publicNewsFeed', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId : '=',
            resident : '=',
            actionResults: '=',
            dayNumberMin: '=',
            dayNumberMax: '=',
            hasEarlierActionResults: '=',
            loadEarlierActionResults: '=',
            hasMoreRecentActionResults: '=',
            loadMoreRecentActionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/publicNewsFeed.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.$watchCollection('actionResults', function(actionResults) {
                if (!actionResults)
                    return null;

                scope.publicActionResults = actionResultsService.publicActionResults(actionResults);
            });

        }
    };
}); 
 
// publicTabDirective 
 
app.directive('publicTab', function(rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            roleId: '=',
            resident: '=',
            actionResults: '=',
            actionResultsByType: '=',
            isLoadingActionResults: '=',
            dayNumberMin: '=',
            dayNumberMax: '=',
            hasEarlierActionResults: '=',
            loadEarlierActionResults: '=',
            hasMoreRecentActionResults: '=',
            loadMoreRecentActionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/publicTab.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleIds = rolesService.roleIds;
        }
    };
}); 
 
// residentsDirective 
 
app.directive('residents', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            actionResults : '=',
            actionResultsByType: '='
        },
        templateUrl: 'app/directiveTemplates/domain/residents.html',
        link: function(scope, element, attrs) {
            "use strict";


            function init() {
                var residentsActionResults = scope.actionResultsByType[ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS];
                if (!residentsActionResults)
                    return;

                var residentsActionResult = residentsActionResults[0];
                if (!residentsActionResult)
                    return;

                if (!scope.actionResult || residentsActionResult.day_id > scope.actionResult.day_id) {
                    scope.actionResult = residentsActionResult;

                    var result = residentsActionResult.result;
                    var residents = $.map(result.residents, function (someResident) {
                        scope.city.residentsById[someResident.id].alive = someResident.alive;
                        return angular.copy(scope.city.residentsById[someResident.id]);
                    });

                    scope.residentsCopied = residents;
                }
            }

            init();


            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.city.is_member)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.submitActionResult = function() {
                var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                    return someActionResult.id == scope.actionResult.id;
                });

                if (index < 0)
                    return;

                var actionResult = scope.actionResult;

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    actionResult.action_result_type,
                    actionResult.action_id,
                    actionResult.day_id,
                    {
                        residents : $.map(scope.residentsCopied, function(someResident) {
                            return {
                            id : someResident.id,
                            alive : someResident.alive
                        }})
                    }
                );
                submitActionResultPromise.then(function(createdActionResult) {

                    $timeout(function() {
                        scope.actionResult = createdActionResult;
                        scope.actionResults.splice(index, 1, createdActionResult);
                        scope.editMode = false;
                    });

                }, function(reason) {
                    $timeout(function() {
                        scope.infos.push({type: 'danger', msg:'Failed to save.'})
                    });
                });
            };



            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

        }
    };
}); 
 
// roleChooser 
 
app.directive('roleChooser', function(residentsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            roleId: '=',
            roleSelected: '=',
            lockToEditMode: '=',
            editMode: '=',
            enableRoleSaving: '=',
            // disableWarning: '=',
            handleAlert: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/roleChooser.html',
        link: function(scope, element, attrs) {
            "use strict";

            if (scope.lockToEditMode)
                scope.editMode = true;


            scope.cityRoles = [];


            scope.$watch('[city.rolesById, roleId]', function(values) {
                var rolesById = values[0];
                if (!rolesById)
                    return;

                var cityRoles = [];
                for (var roleId in rolesById) {
                    if (rolesById.hasOwnProperty(roleId)) {
                        cityRoles.push(rolesById[roleId].role);
                    }
                }
                scope.cityRoles = cityRoles;

                initRoleLabel(rolesById);
            }, true);

            function initRoleLabel(rolesById) {
                scope.roleLabel = (scope.roleId ? rolesById[scope.roleId].role : {}).name || "Select a role";
            }

            scope.toggleMode = function() {
                if (!scope.lockToEditMode)
                    scope.editMode = !scope.editMode;
            };

            scope.optionSelected = function(selectedOption) {
                scope.roleId = selectedOption;
                if (!scope.disableWarning) {
                    if (scope.handleAlert) {
                        scope.handleAlert({alert : {msg: 'Only actions conducted while your true role is selected will be deemed valid.'}})
                    }
                }
                if (scope.roleSelected)
                    scope.roleSelected(selectedOption);
            };

            scope.saveRole = function() {
                if (!scope.roleId) {
                    if (scope.handleAlert) {
                        scope.handleAlert({alert: {msg: 'Select a role first'}});
                    }
                    return;
                }

                var saveRolePromise = residentsService.saveRoleForCityId(scope.city.id, scope.roleId);
                saveRolePromise.then(function(updatedResident) {
                    scope.editMode = false;

                    if (scope.handleAlert) {
                        scope.handleAlert({alert: {type: 'success', msg: 'You will be presented with this role the next time you log in to this game.'}});
                    }

                }, function(reason) {
                    if (scope.handleAlert) {
                        scope.handleAlert({alert: {type: 'danger', msg: 'Server error. Failed to save role.'}});
                    }

                });
            };

            /*
            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };
            */

        }
    };
}); 
 
// roleDirective 
 
app.directive('role', function($compile, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            resident : '=',
            actionResults: '=',
            actionResultsByType: '=',
            isLoading: '=',
            isLoadingActionResults: '=',
            tabActive: '=',
            dayNumberMin: '=',
            dayNumberMax: '=',
            hasEarlierActionResults: '=',
            loadEarlierActionResults: '=',
            hasMoreRecentActionResults: '=',
            loadMoreRecentActionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/role.html',
        compile: function ( element, attrs ) {

            var roleDirectivesByRoleId = {};
            var citizenDirective = element.find( "citizen" );
            roleDirectivesByRoleId[ROLE_ID_CITIZEN] = citizenDirective;
            var doctorDirective = element.find( "doctor" );
            roleDirectivesByRoleId[ROLE_ID_DOCTOR] = doctorDirective;
            var detectiveDirective = element.find( "detective" );
            roleDirectivesByRoleId[ROLE_ID_DETECTIVE] = detectiveDirective;
            var mobDirective = element.find( "mob" );
            roleDirectivesByRoleId[ROLE_ID_MOB] = mobDirective;
            var tellerDirective = element.find( "teller" );
            roleDirectivesByRoleId[ROLE_ID_TELLER] = tellerDirective;
            var sheriffDirective = element.find( "sheriff" );
            roleDirectivesByRoleId[ROLE_ID_SHERIFF] = sheriffDirective;
            var terroristDirective = element.find( "terrorist" );
            roleDirectivesByRoleId[ROLE_ID_TERRORIST] = terroristDirective;
            var journalistDirective = element.find( "journalist" );
            roleDirectivesByRoleId[ROLE_ID_JOURNALIST] = journalistDirective;
            var fugitiveDirective = element.find( "fugitive" );
            roleDirectivesByRoleId[ROLE_ID_FUGITIVE] = fugitiveDirective;
            var elderDirective = element.find( "elder" );
            roleDirectivesByRoleId[ROLE_ID_ELDER] = elderDirective;
            var necromancerDirective = element.find( "necromancer" );
            roleDirectivesByRoleId[ROLE_ID_NECROMANCER] = necromancerDirective;
            var zombieDirective = element.find( "zombie" );
            roleDirectivesByRoleId[ROLE_ID_ZOMBIE] = zombieDirective;


            for (var roleId in roleDirectivesByRoleId) {
                if (!roleId || !roleDirectivesByRoleId.hasOwnProperty(roleId))
                    continue;

                var roleDirective = roleDirectivesByRoleId[roleId];
                roleDirective.remove();
            }



            return {
                pre: function (scope, element, attrs) {
                },
                post: function (scope, element, attrs) {

                    scope.roleIds = rolesService.roleIds;

                    var roleDiv = element.find('#role');


                    if (!scope.resident || !scope.resident.role) {
                        var citizenDirective = roleDirectivesByRoleId[ROLE_ID_CITIZEN];
                        var transcludeCitizenDirective = $compile( citizenDirective );
                        transcludeCitizenDirective(scope, function( citizenDirectiveClone ) {
                            roleDiv.append( citizenDirectiveClone );
                            roleDirectivesByRoleId[ROLE_ID_CITIZEN] = null;
                        });

                    }

                    scope.$watch('resident.role', function (role) {
                        var roleId;
                        if (role && role.id) {
                            roleId = role.id;
                        } else {
                            roleId = ROLE_ID_CITIZEN;
                        }

                        if (roleDirectivesByRoleId[roleId]) {
                            var roleDirective = roleDirectivesByRoleId[roleId];
                            var transcludeRoleDirective = $compile( roleDirective );
                            transcludeRoleDirective(scope, function( roleDirectiveClone ) {
                                roleDiv.append( roleDirectiveClone );
                                roleDirectivesByRoleId[roleId] = null;
                            });
                        }

                    });

                }
            };

        }
    };
}); 
 
// specialActionsDirective 
 
app.directive('specialActions', function($compile, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId: '=',
            resident : '=',
            actionResults: '=',
            actionResultsByType: '='
        },
        templateUrl: 'app/directiveTemplates/domain/specialActions.html',
        compile: function (element, attrs) {
            "use strict";

            var actionDirectiveForActionTypeId = {};
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_INVESTIGATE] = '<investigate ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_INVESTIGATE]"></investigate>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_PROTECT] = '<protect ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_PROTECT]"></protect>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_TELLER_VOTES] = '<teller-votes ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_TELLER_VOTES]"> </teller-votes>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_VOTE_MAFIA] = '<vote-mafia ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_VOTE_MAFIA]"></vote-mafia>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_SHERIFF_IDENTITIES] = '<sheriff-identities ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_SHERIFF_IDENTITIES]"></sheriff-identities>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_TERRORIST_BOMB] = '<terrorist-bomb ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_TERRORIST_BOMB]"></terrorist-bomb>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_JOURNALIST_INVESTIGATE] = '<journalist-investigate ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_JOURNALIST_INVESTIGATE]"></journalist-investigate>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_DEPUTY_IDENTITIES] = '<deputy-identities ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_DEPUTY_IDENTITIES]"></deputy-identities>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_INITIATE_REVIVAL] = '<initiate-revival ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_INITIATE_REVIVAL]"></initiate-revival>';



            return {
                pre: function (scope, element, attrs) {

                },
                post: function (scope, element, attrs) {
                    scope.actionTypeIds = actionsService.actionTypeIds;

                    // scope.selectedActionType = null;
                    // scope.actionTypeLabel = "Select action type";
                    scope.actionTypes = [];

                    function init() {
                        var role = scope.city.rolesById[scope.roleId].role;

                        var showingActionTypes = {};

                        if (role.action_types.length > 0) {
                            scope.actionTypes = $.grep(role.action_types, function (someActionType) {
                                return !someActionType.is_single_required && // eliminates ActionType::SingleRequired::MafiaMembers, ActionType::SingleRequired::Residents
                                    someActionType.id != ACTION_TYPE_ID_VOTE &&
                                    someActionType.id != ACTION_TYPE_ID_ELDER_VOTE
                            });
                            if (scope.actionTypes.length > 0) {


                                angular.forEach(scope.actionTypes, function(someActionType) {
                                    showingActionTypes[someActionType.id] = true;
                                });
                                scope.showingActionTypes = showingActionTypes;
                            } else {
                                scope.actionTypeLabel = "No special abilities";
                            }
                        }

                        var actionTypeParamsResult = scope.actionResultsByType[ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS][0];
                        if (!actionTypeParamsResult) {
                            return;
                        }

                        scope.actionTypeParamsResult = actionTypeParamsResult;


                        var specialActionDiv = element.find('.special-action');
                        for (var actionTypeId in showingActionTypes) {
                            if (!actionTypeId || !showingActionTypes.hasOwnProperty(actionTypeId))
                                continue;

                            if (showingActionTypes[actionTypeId]) {
                                if (actionDirectiveForActionTypeId[actionTypeId]) {
                                    var actionDirective = actionDirectiveForActionTypeId[actionTypeId];
                                    var transcludeActionDirective = $compile( actionDirective );
                                    transcludeActionDirective(scope, function( actionDirectiveClone ) {
                                        specialActionDiv.append( actionDirectiveClone );
                                    });
                                }

                            }
                        }




                    }

                    init();
                }
            };
        }
    };
}); 
 
// timezoneDirective 
 
app.directive('timezone', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            minutes: '='
        },
        template: '{{timezone}}',
        link: function(scope, element, attrs) {
            "use strict";

            function timezoneFromMinutes(minutes) {
                var sign = minutes < 0 ? -1 : 1;

                var hours = Math.floor(Math.abs(minutes) / 60);
                var sign = sign >= 0 ? '' : '-';
                hours = '0' + hours;
                var minutes = (Math.abs(minutes)) % 60;
                minutes = '0' + minutes;

                var timezoneString = sign + hours.substr(hours.length-2) + ":" + minutes.substr(minutes.length-2);
                return timezoneString;
            }

            scope.timezone = timezoneFromMinutes(scope.minutes);

            scope.$watch('minutes', function(value) {
                if (value === undefined)
                    return;

                scope.timezone = timezoneFromMinutes(value);
            });



        }
    };
}); 
 
// actionTypeParamsResultDirective 
 
app.directive('actionTypeParamsResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            resident: '=',
            actionResult: '=',
            actionResults: '=',
            actionTypeId: '=',
            roleId: '=',
            isNew: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeParams = {};
            scope.editMode = false;

            function init() {
                if (!scope.actionResult || !scope.actionResult.result)
                    return;

                var actionTypeParamsPerRolePerActionType = scope.actionResult.result.action_types_params;

                if (!actionTypeParamsPerRolePerActionType[scope.roleId.toString()])
                    return;

                var actionTypeParams = actionTypeParamsPerRolePerActionType[scope.roleId.toString()][scope.actionTypeId.toString()];


                scope.actionTypeParams = actionTypeParams;

            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.deleteActionResult = function() {
                var modifiedActionResult = {};
                angular.copy(scope.actionResult, modifiedActionResult);

                modifiedActionResult.result.action_types_params[scope.roleId.toString()][scope.actionTypeId.toString()] = null;

                postActionResult(modifiedActionResult);
            };


            function postActionResult(actionResult) {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null, // role id
                    actionResult.action_result_type,
                    null, // action id
                    actionResult.day_id,
                    actionResult.result
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });


                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        scope.actionResults.splice(index, 1, createdActionResult);
                        scope.editMode = false;
                    });

                }, function(reason) {
                    $timeout(function() {
                        scope.infos = [{type:'danger', msg:'Failed to save.'}];
                        scope.editMode = false;
                    });
                });
            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.submitActionResult = function() {
                postActionResult(scope.actionResult);
            };

        }
    };
}); 
 
// deputyIdentitiesResultDirective 
 
app.directive('deputyIdentitiesResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/deputyIdentitiesResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.deadResidentRolesCopied = [];
            scope.selectedResident = {};

            scope.actionResultCopied = {};

            function init() {

                var actionResult = scope.actionResult;
                if (!actionResult)
                    return;
                var result = actionResult.result;

                if (result.success === undefined) {
                    result.success = true;
                }

                // city_has_roles, interpret roles in deadResidentRoles
                var city = scope.city;
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                scope.outcome = {
                    success : true
                };

                scope.outcome.success = result.success.toString() == 'true';

                if (result.success.toString() == 'false' && !scope.isNew) {
                    scope.interpretation = "You spent all available actions of this type.";
                    return;
                }

                if ((!result.dead_residents_roles || result.dead_residents_roles.length == 0) && !scope.isNew) {
                    scope.interpretation = "No dead residents.";
                    return;
                }



                var deadResidentRoles = [];
                angular.forEach(result.dead_residents_roles, function(deadResidentRole) {
                    deadResidentRoles.push( {
                        residentId : deadResidentRole.resident_id,
                        residentName : city.residentsById[deadResidentRole.resident_id].name,
                        residentUsername : city.residentsById[deadResidentRole.resident_id].username,
                        residentRoleName : city.rolesById[deadResidentRole.role_id].role.name,
                        residentRoleId : deadResidentRole.role_id
                    });
                });
                scope.deadResidentRoles = deadResidentRoles;
                var deadResidentRolesCopied = [];
                angular.copy(scope.deadResidentRoles, deadResidentRolesCopied);
                scope.deadResidentRolesCopied = deadResidentRolesCopied;

                var cityResidents = [];
                angular.copy(city.residents, cityResidents);
                scope.cityResidents = cityResidents;



                scope.interpretation = "Info on deceased residents.";
            }

            init();


            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };



            scope.removeFromDeadResidents = function(index) {
                scope.deadResidentRolesCopied.splice(index, 1);
            };

            scope.addToDeadResidents = function() {
                if (!scope.selectedResident || !scope.selectedResident.residentId)
                    return;

                scope.deadResidentRolesCopied.push(scope.selectedResident);
                scope.selectedResident = {};
            };

            scope.selectedToAddDeadResident = function(resident) {
                var roleId = scope.selectedResident.residentRoleId;

                var selectedResident = {
                    residentId : resident.id,
                    residentName : resident.name,
                    residentUsername : resident.username,
                    residentRoleName : roleId ? scope.city.rolesById[roleId].role.name : null,
                    residentRoleId : roleId
                };

                scope.selectedResident = selectedResident;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var actionResult = {};

                angular.copy(scope.actionResult, actionResult);

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        dead_residents_roles : $.map(scope.deadResidentRolesCopied, function(deadResidentRole) {
                            return {
                                resident_id : deadResidentRole.residentId,
                                role_id : deadResidentRole.residentRoleId
                            };
                        }),
                        success : scope.outcome.success
                    }
                );

                submitActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }
                    scope.actionResult = createdActionResult;
                    init();


                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else {
                            scope.editMode = false;
                        }
                    });


                });
            };
        }
    };
}); 
 
// gameOverResultDirective 
 
app.directive('gameOverResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            actionResultsByType: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/gameOverResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            function init() {

                var actionResultsByType = scope.actionResultsByType;
                if (!actionResultsByType)
                    return;

                var gameOverResults = actionResultsByType[ACTION_RESULT_TYPE_ID_GAME_OVER];
                if (!gameOverResults)
                    return;
                var gameOverResult = gameOverResults[0];
                if (!gameOverResult)
                    return;

                var result = gameOverResult.result;

                if (!result)
                    return;


                scope.winnerAffiliations = result['winner_affiliations'];
                scope.losersAffiliations = result['loser_affiliations'];
                var residents = result['residents_with_roles'];

                var residentsById = scope.city.residentsById;
                if (!residentsById)
                    residentsById = {};

                angular.forEach(residents, function(someResident) {
                    var affiliationId = someResident.role.affiliation.id;
                    var winningAffiliation = $.grep(scope.winnerAffiliations, function(someAffiliation) {
                        return someAffiliation.id == affiliationId;
                    })[0];

                    someResident.alive = residentsById[someResident.id] ? residentsById[someResident.id].alive : null;
                    if (winningAffiliation) {
                        someResident.won = true;
                    } else {
                        someResident.won = false;
                    }
                });

                scope.residentsWithRoles = residents;

            }

            init();


            scope.classNameForResidentRow = function(resident) {
                if (resident.won)
                    return "resident-row-won";
                else
                    return "resident-row-lost";
            };

        }
    };
}); 
 
// investigateResultDirective 
 
app.directive('investigateResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/investigateResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.outcome = {
                success : false
            };

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;

                var city = scope.city;

                if (!actionResult || !actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_INVESTIGATE
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                if (!result)
                    return;

                var investigatedResident = angular.copy(scope.city.residentsById[result.target_id]);
                if (investigatedResident) {
                    if (result.success) {
                        scope.interpretation = "Resident " + investigatedResident.name + " is a mafia member.";
                    } else {
                        scope.interpretation = "Resident " + investigatedResident.name + " is not a mafia member.";
                    }
                } else {
                    scope.interpretation = "Error: ActionResult::Investigate -> result missing target_id.";
                }

                scope.investigatedResident = investigatedResident;
            }

            init();


            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectInvestigatedResident = function(resident) {
                scope.investigatedResident = resident;
            };

            scope.blankActionResult = function() {
                scope.investigatedResident = null;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    scope.roleId,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        target_id : scope.investigatedResident == null ? -1 : scope.investigatedResident.id,
                        success : scope.outcome.success
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }
                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else {
                            scope.editMode = false;
                        }
                    });

                });
            };


        }
    };
}); 
 
// journalistInvestigateResultDirective 
 
app.directive('journalistInvestigateResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/journalistInvestigateResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.outcome = {
                success : false
            };

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;

                var city = scope.city;

                if (!actionResult || !actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                if (!result)
                    return;

                var investigatedResident = angular.copy(scope.city.residentsById[result.target_id]);
                if (investigatedResident) {
                    if (result.success) {
                        scope.interpretation = "Resident " + investigatedResident.name + " is a mafia member.";
                    } else {
                        scope.interpretation = "Resident " + investigatedResident.name + " is not a mafia member.";
                    }
                } else {
                    scope.interpretation = "Error: ActionResult::JournalistInvestigate -> result missing target_id.";
                }

                scope.investigatedResident = investigatedResident;
            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectInvestigatedResident = function(resident) {
                scope.investigatedResident = resident;
            };

            scope.blankActionResult = function() {
                scope.investigatedResident = null;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function(){
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    scope.roleId,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        target_id : scope.investigatedResident == null ? -1 : scope.investigatedResident.id,
                        success : scope.outcome.success
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }
                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function(){
                        if (scope.isNew)
                            scope.hide();
                        else {
                            scope.editMode = false;
                        }
                    });

                });
            };


        }
    };
}); 
 
// mafiaMembersResultDirective 
 
app.directive('mafiaMembersResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/mafiaMembersResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.mafiaMembers = [];

            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;

                if (!result) {
                    return;
                }

                var city = scope.city;

                scope.interpretation = "Mafia members";

                if (!result.mafia_members) {
                    return;
                }

                scope.mafiaMembers = $.map(result.mafia_members, function(someMafiaMemberResidentId) {
                    return angular.copy(city.residentsById[someMafiaMemberResidentId]);
                });




            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectResidentForIndex = function(index, resident) {
                scope.mafiaMembers.splice(index, 1, angular.copy(resident));
            };

            scope.removeMafiaMemberAtIndex = function(index) {
                scope.mafiaMembers.splice(index, 1);
            };

            scope.selectResidentToAdd = function(resident) {
                scope.mafiaMembers.push(angular.copy(resident));
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                    });

                });
            };

            scope.submitActionResult = function () {


                var actionResult = {};

                angular.copy(scope.actionResult, actionResult);

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    actionResult.action_result_type,
                    actionResult.action_id,
                    null,
                    {
                        mafia_members: $.map(scope.mafiaMembers, function(someResident) {
                            return someResident.id
                        })
                    }
                );
                submitActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    $timeout(function() {
                        if (index < 0) {
                            scope.actionResults.splice(0, 0, createdActionResult);
                        } else {
                            scope.actionResults.splice(index, 1, createdActionResult);
                        }

                        scope.actionResult = createdActionResult;
                        init();

                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };


        }
    };
}); 
 
// protectResultDirective 
 
app.directive('protectResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/protectResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.outcome = {
                success : false
            };

            scope.actionResultCopied = {};

            var city = scope.city;

            function init() {
                var actionResult = scope.actionResult;
                if (!actionResult || !actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_PROTECT
                        },
                        day: city.current_day
                    };
                    return;
                }
                var result = actionResult.result;


                angular.copy(scope.actionResult, scope.actionResultCopied);
                scope.actionResultCopied.day = $.grep(city.days, function (someDay) {
                    return someDay.id == scope.actionResultCopied.day_id;
                })[0];

                var protectedResident = scope.city.residentsById[result.target_id];
                if (protectedResident) {
                    if (result.success) {
                        scope.interpretation = "You saved the day! Resident " + protectedResident.name + " was targeted by mafia last night. Luckily, you saved them.";
                    } else {
                        scope.interpretation = "Mafia did not target " + protectedResident.name + " last night.";
                    }
                } else {
                    scope.interpretation = "Error: ActionResult::Protect -> result missing target_id.";
                }

                scope.protectedResident = protectedResident;
            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectProtectedResident = function(resident) {
                scope.protectedResident = resident;
            };

            scope.blankActionResult = function() {
                scope.protectedResident = null;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                    });
                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    scope.roleId,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        target_id : scope.protectedResident == null ? -1 : scope.protectedResident.id,
                        success : scope.outcome.success
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }
                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };


        }
    };
}); 
 
// residentBecameDeputyResultDirective 
 
app.directive('residentBecameDeputyResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/residentBecameDeputyResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;

                // city_has_roles, interpret roles in deadResidentRoles
                var city = scope.city;
                if (!city)
                    return;

                scope.interpretation = "Deputy has died and you became the new Deputy. Congratulations! You should change your acting role to 'Deputy' if you want your future actions to take effect.";

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY
                        },
                        day: city.current_day
                    };
                    return;
                }

                angular.copy(scope.actionResult, scope.actionResultCopied);
                scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                    return someDay.id == scope.actionResultCopied.day_id;
                })[0];
            }

            init();


            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.editMode = false;
                        scope.actionResults.splice(index, 1);
                    });


                });
            };

            scope.submitActionResult = function() {
                var actionResult = {};
                angular.copy(scope.actionResultCopied, actionResult);

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    actionResult.action_result_type,
                    actionResult.action_id,
                    actionResult.day.id,
                    null
                );

                submitActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }
                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };
        }
    };
}); 
 
// residentBecameSheriffResultDirective 
 
app.directive('residentBecameSheriffResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/residentBecameSheriffResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionResultCopied = {};

            function init() {

                var actionResult = scope.actionResult;

                // city_has_roles, interpret roles in deadResidentRoles
                var city = scope.city;
                if (!city)
                    return;

                scope.interpretation = "Sheriff has died and you became the new Sheriff. Congratulations! You should change your acting role to 'Sheriff' if you want your future actions to take effect.";

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF
                        },
                        day: city.current_day
                    };
                    return;
                }

                angular.copy(scope.actionResult, scope.actionResultCopied);
                scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                    return someDay.id == scope.actionResultCopied.day_id;
                })[0];
            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.editMode = false;
                        scope.actionResults.splice(index, 1);
                    });


                });
            };

            scope.submitActionResult = function() {
                var actionResult = {};
                angular.copy(scope.actionResultCopied, actionResult);

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    actionResult.action_result_type,
                    actionResult.action_id,
                    actionResult.day.id,
                    null
                );

                submitActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }
                    scope.actionResult = createdActionResult;
                    init();



                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };
        }
    };
}); 
 
// revivalOccurredResultDirective 
 
app.directive('revivalOccurredResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/revivalOccurredResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionResultCopied = {};

            function init() {

                var actionResult = scope.actionResult;
                var result = actionResult.result;
                if (!result)
                    return;

                var actionResults = scope.actionResults;
                if (!actionResults)
                    return;
                var actionTypeParamsResultIndex = actionResults.indexOfMatchFunction(function (someActionResult) {
                    return someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS;
                });
                if (actionTypeParamsResultIndex < 0) {
                    return;
                }
                scope.actionTypeParamsResult = actionResults[actionTypeParamsResultIndex];
                scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[ROLE_ID_NECROMANCER][ACTION_TYPE_ID_REVIVE.toString()];
                var daysUntilReveal = scope.actionTypeParamsDictionary['days_until_reveal'];

                var city = scope.city;
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED
                        },
                        day: city.current_day,
                        result: {
                            days_until_reveal : daysUntilReveal
                        }
                    };
                    return;
                }

                angular.copy(scope.actionResult, scope.actionResultCopied);
                scope.actionResultCopied.day = city.daysById[scope.actionResultCopied.day_id];

                if (result.days_until_reveal === undefined) {
                    return;
                }


                var revelation_string = scope.daysUntilReveal == 1 ? "On the next morning it will be revealed who was revived." : "In " + result.days_until_reveal + " days it will be revealed who was revived.";

                scope.interpretation = "Necromancer raised someone from the dead. " + revelation_string;

            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };


            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    scope.actionResultCopied.result
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        index = 0;
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }

                    scope.actionResult = createdActionResult;
                    init();


                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };

        }
    };
}); 
 
// revivalRevealedResultDirective 
 
app.directive('revivalRevealedResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/revivalRevealedResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.targetResident = {};

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;
                if (!result)
                    return;

                var actionResults = scope.actionResults;
                if (!actionResults)
                    return;


                var city = scope.city;
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                if (result.target_id === undefined) {
                    return;
                }



                var revivedResident = angular.copy(scope.city.residentsById[result.target_id]);
                if (revivedResident) {
                    scope.interpretation = "It has been discovered who was raised from the dead. It is " + revivedResident.name + ".";
                } else {
                    scope.interpretation = "Error: ActionResult::ReviveRevealed -> result missing target_id.";
                }
                scope.revivedResident = revivedResident;

            }

            init();




            scope.selectRevivedResident = function (resident) {
                scope.revivedResident = resident;
            };




            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };


            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        target_id : scope.revivedResident.id
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        index = 0;
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }

                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };

        }
    };
}); 
 
// sheriffIdentitiesResultDirective 
 
app.directive('sheriffIdentitiesResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/sheriffIdentitiesResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.deadResidentRolesCopied = [];
            scope.selectedResident = {};

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;
                if (!actionResult)
                    return;
                var result = actionResult.result;

                if (result.success === undefined) {
                    result.success = true;
                }

                // city_has_roles, interpret roles in deadResidentRoles
                var city = scope.city;
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                scope.outcome = {
                    success : true
                };

                scope.outcome.success = result.success.toString() == 'true';

                if (result.success.toString() == 'false' && !scope.isNew) {
                    scope.interpretation = "You spent all available actions of this type.";
                    return;
                }

                if ((!result.dead_residents_roles || result.dead_residents_roles.length == 0) && !scope.isNew) {
                    scope.interpretation = "No dead residents.";
                    return;
                }



                var deadResidentRoles = [];
                angular.forEach(result.dead_residents_roles, function(deadResidentRole) {
                    deadResidentRoles.push( {
                        residentId : deadResidentRole.resident_id,
                        residentName : city.residentsById[deadResidentRole.resident_id].name,
                        residentUsername : city.residentsById[deadResidentRole.resident_id].username,
                        residentRoleName : city.rolesById[deadResidentRole.role_id].role.name,
                        residentRoleId : deadResidentRole.role_id
                    });
                });
                scope.deadResidentRoles = deadResidentRoles;
                var deadResidentRolesCopied = [];
                angular.copy(scope.deadResidentRoles, deadResidentRolesCopied);
                scope.deadResidentRolesCopied = deadResidentRolesCopied;

                var cityResidents = [];
                angular.copy(city.residents, cityResidents);
                scope.cityResidents = cityResidents;



                scope.interpretation = "Sheriff revealed info on deceased residents.";
            }

            init();



            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };



            scope.removeFromDeadResidents = function(index) {
                scope.deadResidentRolesCopied.splice(index, 1);
            };

            scope.addToDeadResidents = function() {
                if (!scope.selectedResident || !scope.selectedResident.residentId)
                    return;

                scope.deadResidentRolesCopied.push(scope.selectedResident);
                scope.selectedResident = {};
            };

            scope.selectedToAddDeadResident = function(resident) {
                var roleId = scope.selectedResident.residentRoleId;

                var selectedResident = {
                    residentId : resident.id,
                    residentName : resident.name,
                    residentUsername : resident.username,
                    residentRoleName : roleId ? scope.city.rolesById[roleId].role.name : null,
                    residentRoleId : roleId
                };

                scope.selectedResident = selectedResident;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var actionResult = {};

                angular.copy(scope.actionResult, actionResult);

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        dead_residents_roles : $.map(scope.deadResidentRolesCopied, function(deadResidentRole) {
                            return {
                                resident_id : deadResidentRole.residentId,
                                role_id : deadResidentRole.residentRoleId
                            };
                        }),
                        success : scope.outcome.success
                    }
                );

                submitActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }

                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else {
                            scope.editMode = false;
                        }
                    });


                });
            };
        }
    };
}); 
 
// tellerVotesResultDirective 
 
app.directive('tellerVotesResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/tellerVotesResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.outcome = {
                success : false
            };

            scope.actionResultCopied = {};

            scope.addedResidentVoteCount = {};



            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;
                if (!actionResult)
                    return;

                var votesCountPerResidentId = result.votes_count;

                var city = scope.city;

                if (!city)
                    return;
                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_TELLER_VOTES
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }



                var votesCountPerResident = [];
                for (var residentId in votesCountPerResidentId) {
                    var resident = city.residentsById[residentId];
                    var voteCount = votesCountPerResidentId[residentId];
                    votesCountPerResident.push({
                        resident : resident,
                        voteCount : voteCount
                    });
                };

                scope.interpretation = "Yesterday's public voting results:";
                scope.votesCountPerResident = votesCountPerResident;
                var votesCountPerResidentCopied = [];
                angular.copy(votesCountPerResident, votesCountPerResidentCopied);
                scope.votesCountPerResidentCopied = votesCountPerResidentCopied;
            }

            init();



            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectResident = function(selectedOption) {
                scope.addedResidentVoteCount.resident = selectedOption;
            };


            scope.addVoteCountForResident = function() {
                if (!scope.addedResidentVoteCount.resident || !scope.addedResidentVoteCount.voteCount || !scope.addedResidentVoteCount.resident.id)
                    return;

                var addedResidentVoteCount = {};
                angular.copy(scope.addedResidentVoteCount, addedResidentVoteCount);
                scope.addedResidentVoteCount = {};

                var indexOfResident = scope.votesCountPerResidentCopied.indexOfMatchFunction(function(someResidentVoteCount) {
                    return someResidentVoteCount.resident.id == addedResidentVoteCount.resident.id;
                });
                if (indexOfResident < 0) {
                    for (var i = 0; i<scope.votesCountPerResidentCopied.length; i++) {
                        if (scope.votesCountPerResidentCopied[i].resident.id > addedResidentVoteCount.resident.id)
                            break;
                    }
                    scope.votesCountPerResidentCopied.splice(i, 0, addedResidentVoteCount);

                } else {
                    scope.votesCountPerResidentCopied[indexOfResident].voteCount = addedResidentVoteCount.voteCount;
                }

            };

            scope.removeVoteCount = function (index) {
                scope.votesCountPerResidentCopied.splice(index, 1);
            };

            scope.blankActionResult = function() {
                scope.investigatedResident = null;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var residentVoteCounts = {};
                angular.forEach(scope.votesCountPerResidentCopied, function(someResidentVoteCount) {
                    residentVoteCounts[someResidentVoteCount.resident.id] = someResidentVoteCount.voteCount;
                });


                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    scope.roleId,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        success : true,
                        votes_count : residentVoteCounts
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        index = 0;
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }

                    scope.actionResult = createdActionResult;
                    init();


                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };


        }
    };
}); 
 
// terroristBombResultDirective 
 
app.directive('terroristBombResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/terroristBombResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.targetResident = {};
            scope.collaterals = [];

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;
                if (!result)
                    return;

                var actionResults = scope.actionResults;
                if (!actionResults)
                    return;
                var actionTypeParamsResultIndex = actionResults.indexOfMatchFunction(function (someActionResult) {
                    return someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS;
                });
                if (actionTypeParamsResultIndex < 0) {
                    return;
                }

                var city = scope.city;
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_TERRORIST_BOMB
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                scope.actionTypeParamsResult = actionResults[actionTypeParamsResultIndex];
                // when creating new terrorist bomb result, offer to the user the right number of collaterals
                scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[ROLE_ID_TERRORIST][ACTION_TYPE_ID_TERRORIST_BOMB.toString()];


                if (!result.success || !result.target_ids.length) {
                    return;
                }

                var killedResidents = "";
                var collaterals = [];
                angular.forEach(result.target_ids, function(residentId) {
                    killedResidents += scope.city.residentsById[residentId].name + ", ";
                    collaterals.push(angular.copy(scope.city.residentsById[residentId]));
                });
                scope.collaterals = collaterals;
                killedResidents = killedResidents.substring(0, killedResidents.length - 2);
                scope.interpretation = "There was a terrorist bombing. Residents " + killedResidents + " were killed in the explosion.";

            }

            init();


            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.addCollateralResident = function() {
                var randomResident = angular.copy(scope.city.residents[Math.floor(Math.random()*scope.city.residents.length)]);
                scope.collaterals.push(randomResident);
            };

            scope.selectCollateralResident = function(index, resident) {
                scope.collaterals.splice(index, 1, resident);
            };

            scope.deleteCollateralResidentAtIndex = function(index) {
                scope.collaterals.splice(index, 1);
            };


            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        target_ids : $.map(scope.collaterals, function(someResident) {
                            return someResident.id;
                        }),
                        success : true
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        index = 0;
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }
                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };

        }
    };
}); 
 
// voteMafiaResultDirective 
 
app.directive('voteMafiaResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/voteMafiaResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.killedResident = {};
            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;;

                var city = scope.city;

                if (!actionResult || !actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_VOTE_MAFIA
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                var result = actionResult.result;

                if (!result) {
                    return;
                }
                var success = result.success;
                var killedResidentId = result.target_id;

                if (!killedResidentId)
                    return;

                scope.killedResident = angular.copy(city.residentsById[killedResidentId]);
                if (success)
                    scope.interpretation = scope.killedResident.name + " was killed by mafia.";
                else
                    scope.interpretation = "Mafia did not manage to kill a citizen last night. Hurray!";


            }
            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.removeFromKilledResidents = function(index) {
                scope.killedResident = {};
            };

            scope.addToKilledResidents = function(resident) {
                scope.killedResident = resident;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function () {
                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        target_id : scope.killedResident.id,
                        success : scope.killedResident.id > 0
                    }
                );
                submitActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }
                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });

                });
            };


        }
    };
}); 
 
// voteResultDirective 
 
app.directive('voteResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/voteResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;


                var city = scope.city;

                if (!actionResult || !actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_VOTE
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function (someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                var result = actionResult.result;

                var votedResident = scope.city.residentsById[result.target_id];
                if (votedResident) {
                    scope.interpretation = votedResident.name + " was executed via public voting.";
                } else {
                    scope.interpretation = "Public voting ended with no decision.";
                }

                scope.votedResident = votedResident;
            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectVotedResident = function(resident) {
                scope.votedResident = resident;
            };

            scope.blankActionResult = function() {
                scope.votedResident = null;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                    });

                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    scope.roleId,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        target_id : scope.votedResident == null ? -1 : scope.votedResident.id
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });


                    if (index < 0) {
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }

                    scope.actionResult = createdActionResult;
                    init();


                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };


        }
    };
}); 
 
// deputyIdentitiesActionTypeParamsResultDirective 
 
app.directive('deputyIdentitiesActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/deputyIdentitiesActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            if (scope.actionTypeParams.number_of_actions_available === undefined)
                return;

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;




            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };




        }
    };
}); 
 
// initiateRevivalActionTypeParamsResultDirective 
 
app.directive('initiateRevivalActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/initiateRevivalActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            var revivalDelayNumber;
            var revivalDelayTimeInterval;
            if (scope.actionTypeParams && scope.actionTypeParams.revival_delay) {
                revivalDelayNumber = parseInt(scope.actionTypeParams.revival_delay.slice(0,-1));
                revivalDelayTimeInterval = scope.actionTypeParams.revival_delay.slice(-1);
            }


            scope.initiateRevivalProps = {
                revivalDelayNumber : revivalDelayNumber || 5,
                revivalDelayTimeInterval : revivalDelayTimeInterval || 'm'
            };


            var correctedRevivalDelayNumber = function(revivalDelayNumber) {
                if (revivalDelayNumber < 1)
                    return 1;
                if (revivalDelayNumber > 59)
                    return 59;
                return revivalDelayNumber;
            };

            scope.revivalDelayNumberDidChange = function () {
                scope.initiateRevivalProps.revivalDelayNumber = correctedRevivalDelayNumber(scope.initiateRevivalProps.revivalDelayNumber);

                var lastChar = scope.actionTypeParams.revival_delay.slice(-1);
                scope.actionTypeParams.revival_delay = '' + scope.initiateRevivalProps.revivalDelayNumber + lastChar;
            };

            var isInitiateRevivalTimeIntervalValid = function(revivalDelayTimeInterval) {
                return revivalDelayTimeInterval == 'h' || revivalDelayTimeInterval == 'm' || revivalDelayTimeInterval == 's';
            };

            scope.revivalDelayTimeIntervalDidChange = function () {
                if (!isInitiateRevivalTimeIntervalValid(scope.initiateRevivalProps.revivalDelayTimeInterval)) {
                    scope.initiateRevivalProps.revivalDelayTimeInterval = 'm';
                }
                var revivalDelayNumber = scope.initiateRevivalProps.revivalDelayNumber;
                if (scope.actionTypeParams)
                    scope.actionTypeParams.revival_delay = '' + revivalDelayNumber + scope.initiateRevivalProps.revivalDelayTimeInterval;

            };

            scope.$watch('actionTypeParams.revival_delay', function(newValue, oldValue) {
                if (newValue === undefined)
                    return;

                var revivalDelayNumber = newValue.slice(0,-1);
                if (!scope.initiateRevivalProps.revivalDelayNumber || revivalDelayNumber != scope.initiateRevivalProps.revivalDelayNumber.toString()) {
                    scope.initiateRevivalProps.revivalDelayNumber = parseInt(revivalDelayNumber);
                }
                var revivalDelayTimeInterval = newValue.slice(-1);
                if (revivalDelayTimeInterval != scope.initiateRevivalProps.revivalDelayTimeInterval) {
                    scope.initiateRevivalProps.revivalDelayTimeInterval = revivalDelayTimeInterval;
                }

            }, true);

        }
    };
}); 
 
// investigateActionTypeParamsResultDirective 
 
app.directive('investigateActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/investigateActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            if (scope.actionTypeParams.number_of_actions_available === undefined)
                return;

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;



            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };
        }
    };
}); 
 
// journalistInvestigateActionTypeParamsResultDirective 
 
app.directive('journalistInvestigateActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/journalistInvestigateActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            if (scope.actionTypeParams.number_of_actions_available === undefined)
                    return;

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;



            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };
        }
    };
}); 
 
// protectActionTypeParamsResultDirective 
 
app.directive('protectActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/protectActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            if (scope.actionTypeParams.number_of_actions_available === undefined)
                return;

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;


            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };
        }
    };
}); 
 
// reviveActionTypeParamsResultDirective 
 
 app.directive('reviveActionTypeParamsResult', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/reviveActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            var daysUntilReveal;
            if (scope.actionTypeParams && scope.actionTypeParams.days_until_reveal) {
                daysUntilReveal = parseInt(scope.actionTypeParams.days_until_reveal);
            }


            scope.reviveProps = {
                daysUntilReveal : daysUntilReveal || 1
            };



            var daysUntilReveal = scope.actionTypeParams.days_until_reveal;
            if (!scope.reviveProps.daysUntilReveal || daysUntilReveal != scope.reviveProps.daysUntilReveal.toString()) {
                scope.reviveProps.daysUntilReveal = parseInt(daysUntilReveal);
            }

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;





            var correctedDaysUntilReveal = function(daysUntilReveal) {
                if (daysUntilReveal < 0)
                    return 0;
                if (daysUntilReveal > 5)
                    return 5;

                return daysUntilReveal;
            };


            scope.daysUntilRevealDidChange = function () {
                scope.reviveProps.daysUntilReveal = correctedDaysUntilReveal(scope.reviveProps.daysUntilReveal);

                scope.actionTypeParams.days_until_reveal = scope.reviveProps.daysUntilReveal;

            };



            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };

        }
    };
}); 
 
// sheriffIdentitiesActionTypeParamsResultDirective 
 
app.directive('sheriffIdentitiesActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/sheriffIdentitiesActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            if (scope.actionTypeParams.number_of_actions_available === undefined)
                    return;

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;



            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };

        }
    };
}); 
 
// tellerVotesActionTypeParamsResultDirective 
 
app.directive('tellerVotesActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/tellerVotesActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            if (scope.actionTypeParams.number_of_actions_available === undefined)
                return;

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;



            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };



        }
    };
}); 
 
// terroristBombActionTypeParamsResultDirective 
 
app.directive('terroristBombActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/terroristBombActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            var detonationNumber;
            var detonationTimeInterval;
            if (scope.actionTypeParams && scope.actionTypeParams.detonation_delay && scope.actionTypeParams.number_of_collaterals !== undefined) {
                detonationNumber = parseInt(scope.actionTypeParams.detonation_delay.slice(0,-1));
                detonationTimeInterval = scope.actionTypeParams.detonation_delay.slice(-1);
            }


            scope.detonationProps = {
                detonationNumber : detonationNumber || 5,
                detonationTimeInterval : detonationTimeInterval || 'm'
            };


            var detonationNumber = scope.actionTypeParams.detonation_delay.slice(0,-1);
            if (!scope.detonationProps.detonationNumber || detonationNumber != scope.detonationProps.detonationNumber.toString()) {
                scope.detonationProps.detonationNumber = parseInt(detonationNumber);
            }
            var detonationTimeInterval = scope.actionTypeParams.detonation_delay.slice(-1);
            if (detonationTimeInterval != scope.detonationProps.detonationTimeInterval) {
                scope.detonationProps.detonationTimeInterval = detonationTimeInterval;
            }


            var correctedNumberOfCollaterals = function(numberOfCollaterals) {
                if (numberOfCollaterals < 0)
                    return 0;
                if (numberOfCollaterals > 2)
                    return 2;
                return numberOfCollaterals;
            };

            scope.numberOfCollateralsDidChange = function() {
                scope.actionTypeParams.number_of_collaterals = correctedNumberOfCollaterals(scope.actionTypeParams.number_of_collaterals);


            };


            var correctedDetonationNumber = function(detonationNumber) {
                if (detonationNumber < 1)
                    return 1;
                if (detonationNumber > 59)
                    return 59;
                return detonationNumber;
            };


            scope.detonationNumberDidChange = function () {
                scope.detonationProps.detonationNumber = correctedDetonationNumber(scope.detonationProps.detonationNumber);

                var lastChar = scope.actionTypeParams.detonation_delay.slice(-1);
                scope.actionTypeParams.detonation_delay = '' + scope.detonationProps.detonationNumber + lastChar;
            };


            var isDetonationTimeIntervalValid = function(detonationTimeInterval) {
                return detonationTimeInterval == 'h' || detonationTimeInterval == 'm' || detonationTimeInterval == 's';
            };

            scope.detonationTimeIntervalDidChange = function () {
                if (!isDetonationTimeIntervalValid(scope.detonationProps.detonationTimeInterval)) {
                    scope.detonationProps.detonationTimeInterval = 'm';
                }
                var detonationNumber = scope.detonationProps.detonationNumber;
                if (scope.actionTypeParams)
                    scope.actionTypeParams.detonation_delay = '' + detonationNumber + scope.detonationProps.detonationTimeInterval;
            };




        }
    };
}); 
 
// deputyIdentitiesDirective 
 
app.directive('deputyIdentities', function($timeout, actionsService, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/deputyIdentities.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeIds = actionsService.actionTypeIds;

            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIdsResult) {
                scope.actionResultTypes = actionResultTypesByIdsResult;
            });


            scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_DEPUTY_IDENTITIES.toString()];
            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.actionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_DEPUTY_IDENTITIES.toString()];
            }, true);


            scope.revealIdentities = function() {

                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_DEPUTY_IDENTITIES,
                    scope.city.current_day.id,
                    { });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "On the next morning, you will see the true roles of all residents that died since you became the Sheriff."}];
                    });

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_DEPUTY_IDENTITIES);

                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };

        }
    };
}); 
 
// elderDirective 
 
app.directive('elderVote', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/elderVote.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.voteOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;


                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.resident.role.id,
                    ACTION_TYPE_ID_ELDER_VOTE,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Voted for " + selectedResident.name + "."}];
                    });
                }, function(reason, ee) {
                    scope.infos = [{type:"danger", msg: reason}];
                })

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.resident.role.id, ACTION_TYPE_ID_ELDER_VOTE);


                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    if (reason.httpObj.responseJSON) {
                        angular.forEach(reason.httpObj.responseJSON, function(error) {
                            scope.infos.push({type : 'danger', msg: error });
                        });
                    } else {
                        scope.infos.push({type : 'danger', msg: "Failed to cancel actions." });
                    }
                });
            };

        }
    };
}); 
 
// initiateRevivalDirective 
 
app.directive('initiateRevival', function($timeout, $q, actionsService,actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/initiateRevival.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.selectedResident = {};

            scope.initiateRevivalActionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_INITIATE_REVIVAL.toString()];
            scope.reviveActionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_REVIVE.toString()];

            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.initiateRevivalActionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_INITIATE_REVIVAL.toString()];
                scope.reviveActionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_REVIVE.toString()];
            }, true);

            scope.infos = [];

            scope.initiateRevivalOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;


                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_INITIATE_REVIVAL,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Initiating revival of " + selectedResident.name + ". After " + scope.initiateRevivalActionTypeParamsDictionary.revival_delay + " revival will be initiated and the user will be revived on the first following morning."}];
                    }, 0, false);

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                })

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedInitiateRevivalActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_INITIATE_REVIVAL);
                var cancelUnprocessedReviveActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_REVIVE);

                $q.all(cancelUnprocessedInitiateRevivalActionsPromise, cancelUnprocessedReviveActionsPromise).then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                        $timeout(function () {
                            scope.infos = [];
                        }, 2000);
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos = [{type : 'danger', msg: error }];
                    });
                });
            };

        }
    };
}); 
 
// investigateDirective 
 
app.directive('investigate', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/investigate.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_INVESTIGATE.toString()];

            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.actionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_INVESTIGATE.toString()];
            });


            scope.investigateOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;

                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_INVESTIGATE,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Investigating " + selectedResident.name + ". Results of investigation available on the next morning."}];
                    });

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_INVESTIGATE);
                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };
        }
    };
}); 
 
// journalistInvestigateDirective 
 
app.directive('journalistInvestigate', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/journalistInvestigate.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_JOURNALIST_INVESTIGATE.toString()];
            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.actionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_JOURNALIST_INVESTIGATE.toString()];
            });

            scope.investigateOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;

                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_JOURNALIST_INVESTIGATE,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Investigating " + selectedResident.name + ". Results of investigation available on the next morning."}];
                    });

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_JOURNALIST_INVESTIGATE);
                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };
        }
    };
}); 
 
// protectDirective 
 
app.directive('protect', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/protect.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_PROTECT.toString()];
            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.actionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_PROTECT.toString()];
            }, true);

            scope.protectOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;

                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_PROTECT,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Protecting " + selectedResident.name + ". Mafia will not be able to kill this resident this night."}];
                    });

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_PROTECT);

                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };
        }
    };
}); 
 
// sheriffIdentitiesDirective 
 
app.directive('sheriffIdentities', function($timeout, actionsService, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/sheriffIdentities.html',
        link: function(scope, element, attrs) {
            "use strict";

            // scope.actionTypeIds = actionsService.actionTypeIds; // scope.actionTypeIds is inherited from specialActionsDirective

            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIdsResult) {
                scope.actionResultTypes = actionResultTypesByIdsResult;
            });

            scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_SHERIFF_IDENTITIES.toString()];
            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.actionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_SHERIFF_IDENTITIES.toString()];
            });


            scope.revealIdentities = function() {

                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_SHERIFF_IDENTITIES,
                    scope.city.current_day.id,
                    { });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "On the next morning, the true identities of all deceased residents will be revealed."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_SHERIFF_IDENTITIES);

                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };

        }
    };
}); 
 
// tellerVotesDirective 
 
app.directive('tellerVotes', function($timeout, actionsService, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/tellerVotes.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeIds = actionsService.actionTypeIds;

            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIdsResult) {
                scope.actionResultTypes = actionResultTypesByIdsResult;
            });


            scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_TELLER_VOTES.toString()];
            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.actionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_TELLER_VOTES.toString()];
            }, true);


            scope.requestVoteCount = function() {

                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_TELLER_VOTES,
                    scope.city.current_day.id,
                    { });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "You will be informed of the vote count after the following public voting."}];
                    });

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_TELLER_VOTES);

                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };

        }
    };
}); 
 
// terroristBombDirective 
 
app.directive('terroristBomb', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/terroristBomb.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.selectedResident = {};

            scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_TERRORIST_BOMB.toString()];
            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.actionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_TERRORIST_BOMB.toString()];

            }, true);

            scope.infos = [];

            scope.bombOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;


                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_TERRORIST_BOMB,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Bombing " + selectedResident.name + " in " + scope.actionTypeParamsDictionary.detonation_delay + "."}];
                    });

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                })

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_TERRORIST_BOMB);
                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };

        }
    };
}); 
 
// voteDirective 
 
app.directive('vote', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/vote.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.voteOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;


                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.resident.role.id,
                    ACTION_TYPE_ID_VOTE,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() { // without $timeout, alert sometimes don't appear at all until some action is made with mouse
                        scope.infos = [{type:"success", msg: "Voted for " + selectedResident.name + "."}];
                    });
                }, function(reason, ee) {
                    scope.infos = [{type:"danger", msg: reason}];
                })

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.resident.role.id, ACTION_TYPE_ID_VOTE);


                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    if (reason.httpObj.responseJSON) {
                        angular.forEach(reason.httpObj.responseJSON, function(error) {
                            scope.infos.push({type : 'danger', msg: error });
                        });
                    } else {
                        scope.infos.push({type : 'danger', msg: "Failed to cancel actions." });
                    }
                });
            };

        }
    };
}); 
 
// voteMafiaDirective 
 
app.directive('voteMafia', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/voteMafia.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.voteOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;


                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_VOTE_MAFIA,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Voted for " + selectedResident.name + "."}];
                    });

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                })

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_VOTE_MAFIA);
                cancelUnprocessedActionsPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };

        }
    };
}); 
 
// actionResultsListDirective 
 
app.directive('actionResultsList', function($q, actionResultsService, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/actionResultsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.actionResults = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {

                };
            }

            scope.toggleRoleSelection = function(role) {
                if (!scope.queryModel.roleIds)
                    return;

                var index = scope.queryModel.roleIds.indexOf(role.id);
                if (index == -1) {
                    scope.queryModel.roleIds.push(role.id);
                } else {
                    scope.queryModel.roleIds.splice(index, 1);
                }
            };

            scope.toggleActionResultTypeSelection = function(actionResultType) {
                if (!scope.queryModel.actionResultTypeIds)
                    return;

                var index = scope.queryModel.actionResultTypeIds.indexOf(actionResultType.id);
                if (index == -1) {
                    scope.queryModel.actionResultTypeIds.push(actionResultType.id);
                } else {
                    scope.queryModel.actionResultTypeIds.splice(index, 1);
                }
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.actionResults = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelActionResults, queryModelJson, expirationDate);
                        }

                    }
                }

                var actionResultsPromise = actionResultsService.getAllActionResults(scope.queryModel, pageIndex, pageSize);
                var promises = [actionResultsPromise];

                if (!scope.actionResultTypesByIds || !scope.actionResultTypes || !scope.roles) {
                    promises.push(actionResultsService.getAllActionResultTypesByIds(false));
                    promises.push(actionResultsService.getAllActionResultTypes(false));
                    promises.push(rolesService.getAllRoles(false));
                }


                $q.all(promises).then(function(results) {
                    if (results[1]) {
                        scope.actionResultTypesByIds = results[1];
                    }
                    if (results[2]) {
                        scope.actionResultTypes = results[2];
                        if (!scope.queryModel.actionResultTypeIds) {
                            scope.queryModel.actionResultTypeIds = $.map(results[2], function(actionResultType) {
                                return actionResultType.id;
                            });
                        }
                    }
                    if (results[3]) {
                        scope.roles = results[3];
                        if (!scope.queryModel.roleIds) {
                            scope.queryModel.roleIds = $.map(results[3], function(role) {
                                return role.id;
                            });
                        }
                    }

                    var actionResultsResult = results[0];

                    scope.isLoadingContent = false;
                    if (actionResultsResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.actionResults.push.apply(scope.actionResults, actionResultsResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.actionResults.length == 0) {
                    reloadData();
                }
            });


        }
    };
}); 
 
// actionsListDirective 
 
app.directive('actionsList', function($q, actionsService, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/actionsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.actions = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.toggleRoleSelection = function(role) {
                if (!scope.queryModel.roleIds)
                    return;

                var index = scope.queryModel.roleIds.indexOf(role.id);
                if (index == -1) {
                    scope.queryModel.roleIds.push(role.id);
                } else {
                    scope.queryModel.roleIds.splice(index, 1);
                }
            };

            scope.toggleActionTypeSelection = function(actionType) {
                if (!scope.queryModel.actionTypeIds)
                    return;

                var index = scope.queryModel.actionTypeIds.indexOf(actionType.id);
                if (index == -1) {
                    scope.queryModel.actionTypeIds.push(actionType.id);
                } else {
                    scope.queryModel.actionTypeIds.splice(index, 1);
                }
            };


            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.actions = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelActions, queryModelJson, expirationDate);
                        }

                    }

                }


                var actionsPromise = actionsService.getAllActions(scope.queryModel, pageIndex, pageSize);
                var promises = [actionsPromise];

                if (!scope.actionTypes || !scope.roles) {
                    promises.push(actionsService.getAllActionTypesByIds(false));
                    promises.push(actionsService.getAllActionTypes(false));

                    promises.push(rolesService.getAllRoles(false));
                }



                $q.all(promises).then(function(results) {
                    if (results[1]) {
                        scope.actionTypesByIds = results[1];
                    }
                    if (results[2]) {
                        scope.actionTypes = results[2];
                        if (!scope.queryModel.actionTypeIds) {
                            scope.queryModel.actionTypeIds = $.map(results[2], function(actionType) {
                                return actionType.id;
                            });
                        }

                    }

                    if (results[3]) {
                        scope.roles = results[3];
                        if (!scope.queryModel.roleIds) {
                            scope.queryModel.roleIds = $.map(results[3], function(role) {
                                return role.id;
                            });
                        }
                    }


                    var usersResult = results[0];

                    scope.isLoadingContent = false;
                    if (usersResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.actions.push.apply(scope.actions, usersResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.actions.length == 0) {
                    reloadData();
                }
            });

        }
    };
}); 
 
// citiesListDirective 
 
app.directive('citiesList', function($location, citiesService, authService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/citiesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 20;


            scope.cities = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                    timezoneDate: new Date(0, 0, 0, 0, 0, 0, 0),
                    timezoneSign: 1,
                    anyTimezone: true
                };
            }

            scope.$watch("queryModel.timezoneDate", function(newDate, oldDate) {
                if (newDate) {
                    if (newDate.getHours() > 12) {
                        scope.queryModel.timezoneDate = 12;
                    }
                }
            });

            scope.showDetails = function(city) {
                $location.path('admin/city/'+city.id);
            };



            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.cities = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['timezoneDate'] = queryModelForStorage['timezoneDate'] ? queryModelForStorage['timezoneDate'].getTime() : null;
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        queryModelForStorage['startedAtMin'] = queryModelForStorage['startedAtMin'] ? queryModelForStorage['startedAtMin'].getTime() : null;
                        queryModelForStorage['startedAtMax'] = queryModelForStorage['startedAtMax'] ? queryModelForStorage['startedAtMax'].getTime() : null;
                        queryModelForStorage['lastPausedAtMin'] = queryModelForStorage['lastPausedAtMin'] ? queryModelForStorage['lastPausedAtMin'].getTime() : null;
                        queryModelForStorage['lastPausedAtMax'] = queryModelForStorage['lastPausedAtMax'] ? queryModelForStorage['lastPausedAtMax'].getTime() : null;
                        queryModelForStorage['finishedAtMin'] = queryModelForStorage['finishedAtMin'] ? queryModelForStorage['finishedAtMin'].getTime() : null;
                        queryModelForStorage['finishedAtMax'] = queryModelForStorage['finishedAtMax'] ? queryModelForStorage['finishedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelCities, queryModelJson, expirationDate);
                        }

                    }
                }

                var citiesPromise = citiesService.getAllCities(scope.queryModel, pageIndex, pageSize);


                citiesPromise.then(function(citiesResult) {
                    scope.isLoadingContent = false;
                    if (citiesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.cities.push.apply(scope.cities, citiesResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.cities.length == 0) {
                    reloadData();
                }
            });

//            init();
//
//            function init() {
//                authService.userMe(false).then(function(userMeResult) {
//                    scope.userMe = userMeResult;
//                });
//            }


        }
    };
}); 
 
// daysListDirective 
 
app.directive('daysList', function(daysService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/daysList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.days = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.days = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelDays, queryModelJson, expirationDate);
                        }

                    }
                }

                var usersPromise = daysService.getAllDays(scope.queryModel, pageIndex, pageSize);


                usersPromise.then(function(usersResult) {
                    scope.isLoadingContent = false;
                    if (usersResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.days.push.apply(scope.days, usersResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.days.length == 0) {
                    reloadData();
                }
            });

        }
    };
}); 
 
// gamePurchasesListDirective 
 
app.directive('gamePurchasesList', function($location, $q, gamePurchasesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/gamePurchasesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;



            scope.gamePurchases = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }


            scope.newGamePurchase = function () {
                $location.path('/admin/game_purchase/new');
            };

            scope.showDetails = function(gamePurchase) {
                $location.path('admin/game_purchase/' + gamePurchase.id);
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.gamePurchases = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['cityStartedAtMin'] = queryModelForStorage['cityStartedAtMin'] ? queryModelForStorage['cityStartedAtMin'].getTime() : null;
                        queryModelForStorage['cityStartedAtMax'] = queryModelForStorage['cityStartedAtMax'] ? queryModelForStorage['cityStartedAtMax'].getTime() : null;
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelGamePurchases, queryModelJson, expirationDate);
                        }

                    }

                }


                var gamePurchasesPromise = gamePurchasesService.getAllGamePurchases(scope.queryModel, pageIndex, pageSize);


                gamePurchasesPromise.then(function(gamePurchasesResult) {

                    scope.isLoadingContent = false;
                    if (gamePurchasesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.gamePurchases.push.apply(scope.gamePurchases, gamePurchasesResult);

                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
}); 
 
// grantedAppRolesListDirective 
 
app.directive('grantedAppRolesList', function($q, $location, appRolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/grantedAppRolesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.grantedAppRoles = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.showDetails = function(grantedAppRole) {
                $location.path('admin/granted_app_role/' + grantedAppRole.id);
            };

            scope.newGrantedAppRole = function() {
                $location.path('admin/granted_app_role/new');
            };

            scope.toggleAppRoleSelection = function (appRole) {
                if (!scope.queryModel.appRoleIds)
                    return;

                var index = scope.queryModel.appRoleIds.indexOf(appRole.id);
                if (index == -1) {
                    scope.queryModel.appRoleIds.push(appRole.id);
                } else {
                    scope.queryModel.appRoleIds.splice(index, 1);
                }
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.grantedAppRoles = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelGrantedAppRoles, queryModelJson, expirationDate);
                        }

                    }
                }

                if (!scope.allAppRoles) {
                    var allAppRolesPromise = appRolesService.getAllAppRoles();
                    allAppRolesPromise.then(function (allAppRolesResult) {
                        var allAppRoles = [];
                        angular.forEach(allAppRolesResult, function(someAppRole) {
                            if (someAppRole.id != APP_ROLE_SUPER_ADMIN) {
                                allAppRoles.push(someAppRole);
                            }
                        });
                        scope.allAppRoles = allAppRoles;
                        if (!scope.queryModel.appRoleIds) {
                            scope.queryModel.appRoleIds = $.map(allAppRoles, function (appRole) {
                                return appRole.id;
                            });
                        }
                        /*
                        var appRolesByIds = {};
                        angular.forEach(allAppRolesResult, function (someAppRole) {
                            appRolesByIds[someAppRole.id] = someAppRole;
                        });

                        scope.appRolesByIds = appRolesByIds;
                        */
                    }, function (reason) {
                        // ignore
                    });
                }

                var grantedAppRolesPromise = appRolesService.getAllGrantedAppRoles(scope.queryModel, pageIndex, pageSize);



                grantedAppRolesPromise.then(function(grantedAppRolesResult) {

                    scope.isLoadingContent = false;
                    if (grantedAppRolesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.grantedAppRoles.push.apply(scope.grantedAppRoles, grantedAppRolesResult);


                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.grantedAppRoles.length == 0) {
                    reloadData();
                }
            });

        }
    };
}); 
 
// initialAppRolesListDirective 
 
app.directive('initialAppRolesList', function($q, $location, appRolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/initialAppRolesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.initialAppRoles = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.showDetails = function(initialAppRole) {
                $location.path('admin/initial_app_role/' + initialAppRole.id);
            };

            scope.newInitialAppRole = function() {
                $location.path('admin/initial_app_role/new');
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.initialAppRoles = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelInitialAppRoles, queryModelJson, expirationDate);
                        }

                    }
                }

                var initialAppRolesPromise = appRolesService.getAllInitialAppRoles(scope.queryModel, pageIndex, pageSize);

                var promises = [initialAppRolesPromise];

                if (!scope.appRolesByIds) {
                    var allAppRolesPromise = appRolesService.getAllAppRoles();
                    promises.push(allAppRolesPromise);
                }

                $q.all(promises).then(function(results) {
                    if (results[1]) {
                        var allAppRolesResult = results[1];
                        var appRolesByIds = {};
                        angular.forEach(allAppRolesResult, function(someAppRole) {
                            appRolesByIds[someAppRole.id] = someAppRole;
                        });

                        scope.appRolesByIds = appRolesByIds;
                    }

                    var initialAppRolesResult = results[0];
                    scope.isLoadingContent = false;
                    if (initialAppRolesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.initialAppRoles.push.apply(scope.initialAppRoles, initialAppRolesResult);


                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.initialAppRoles.length == 0) {
                    reloadData();
                }
            });

        }
    };
}); 
 
// paymentsListDirective 
 
app.directive('paymentsList', function($location, $q, paymentsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/paymentsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;

            scope.allPaymentTypes = [];
            var allPaymentTypesPromise = paymentsService.getAllPaymentTypes();
            allPaymentTypesPromise.then(function (paymentTypes) {
                scope.queryModel.paymentTypeIds = $.map(paymentTypes, function(paymentType) {
                    return paymentType.id;
                });
                scope.allPaymentTypes = paymentTypes;
            }, function(reason) {
                console.log('Failed to load payment types. Ignoring...');
            });

            scope.togglePaymentTypeSelection = function(paymentType) {
                if (!scope.queryModel.paymentTypeIds)
                    return;

                var index = scope.queryModel.paymentTypeIds.indexOf(paymentType.id);
                if (index == -1) {
                    scope.queryModel.paymentTypeIds.push(paymentType.id);
                } else {
                    scope.queryModel.paymentTypeIds.splice(index, 1);
                }
            };


            scope.paymentLogs = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.showDetails = function(paymentLog) {
                $location.path('admin/payment_log/' + paymentLog.id);
            };


            scope.newPaymentLog = function () {
                $location.path('admin/payment_log/new');
            };


            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.paymentLogs = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelPayments, queryModelJson, expirationDate);
                        }

                    }

                }


                var paymentsPromise = paymentsService.getAllPayments(scope.queryModel, pageIndex, pageSize);


                paymentsPromise.then(function(paymentsResult) {

                    scope.isLoadingContent = false;
                    if (paymentsResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.paymentLogs.push.apply(scope.paymentLogs, paymentsResult);

                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.paymentLogs.length == 0) {
                    reloadData();
                }
            });

        }
    };
}); 
 
// residentsListDirective 
 
app.directive('residentsList', function($q, residentsService, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/residentsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.residents = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.toggleRoleSelection = function(role) {
                if (!scope.queryModel.roleIds)
                    return;

                var index = scope.queryModel.roleIds.indexOf(role.id);
                if (index == -1) {
                    scope.queryModel.roleIds.push(role.id);
                } else {
                    scope.queryModel.roleIds.splice(index, 1);
                }
            };

            scope.toggleSavedRoleSelection = function(role) {
                if (!scope.queryModel.savedRoleIds)
                    return;

                var index = scope.queryModel.savedRoleIds.indexOf(role.id);
                if (index == -1) {
                    scope.queryModel.savedRoleIds.push(role.id);
                } else {
                    scope.queryModel.savedRoleIds.splice(index, 1);
                }
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.residents = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelResidents, queryModelJson, expirationDate);
                        }

                    }
                }


                var residentsPromise = residentsService.getAllResidents(scope.queryModel, pageIndex, pageSize);

                var promises = [residentsPromise];
                if (!scope.allRolesByIds) {
                    var allRolesByIdsPromise = rolesService.getAllRolesByIds(false);
                    promises.push(allRolesByIdsPromise);
                    var allRolesPromise = rolesService.getAllRoles(false);
                    promises.push(allRolesPromise);
                }

                $q.all(promises).then(function(results) {

                    if (results[1]) {
                        scope.allRolesByIds = results[1];

                    }
                    if (results[2]) {
                        scope.roles = results[2];
                        var allRoleIds = $.map(scope.roles, function(role) {
                            return role.id;
                        });
                        scope.queryModel.roleIds = allRoleIds;
                        scope.queryModel.savedRoleIds = angular.copy(allRoleIds);
                    }

                    var residentsResult = results[0];
                    scope.isLoadingContent = false;
                    if (residentsResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.residents.push.apply(scope.residents, residentsResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.residents.length == 0) {
                    reloadData();
                }
            });

        }
    };
}); 
 
// rolePickPurchasesListDirective 
 
app.directive('rolePickPurchasesList', function($location, $q, rolePickPurchasesService, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/rolePickPurchasesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;




            scope.toggleRoleSelection = function(role) {
                if (!scope.queryModel.roleIds)
                    return;

                var index = scope.queryModel.roleIds.indexOf(role.id);
                if (index == -1) {
                    scope.queryModel.roleIds.push(role.id);
                } else {
                    scope.queryModel.roleIds.splice(index, 1);
                }
            };


            scope.rolePickPurchases = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.newRolePickPurchase = function () {
                $location.path('/admin/role_pick_purchase/new');
            };

            scope.showDetails = function(rolePickPurchase) {
                $location.path('admin/role_pick_purchase/' + rolePickPurchase.id);
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.rolePickPurchases = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['cityStartedAtMin'] = queryModelForStorage['cityStartedAtMin'] ? queryModelForStorage['cityStartedAtMin'].getTime() : null;
                        queryModelForStorage['cityStartedAtMax'] = queryModelForStorage['cityStartedAtMax'] ? queryModelForStorage['cityStartedAtMax'].getTime() : null;
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelRolePickPurchases, queryModelJson, expirationDate);
                        }

                    }

                }

                var allRolesPromise = rolesService.getAllRoles();

                allRolesPromise.then(function (allRolesResult) {
                    scope.allRoles = allRolesResult;
                    if (!scope.queryModel.roleIds) {
                        scope.queryModel.roleIds = $.map(allRolesResult, function(role) {
                            return role.id;
                        });
                    }
                }, function(reason) {
                    // ignore
                });


                var rolePicksPurchasesPromise = rolePickPurchasesService.getAllRolePickPurchases(scope.queryModel, pageIndex, pageSize);



                rolePicksPurchasesPromise.then(function(rolePickPurchasesResult) {

                    scope.isLoadingContent = false;
                    if (rolePickPurchasesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.rolePickPurchases.push.apply(scope.rolePickPurchases, rolePickPurchasesResult);

                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.rolePickPurchases.length == 0) {
                    reloadData();
                }
            });

        }
    };
}); 
 
// subscriptionsListDirective 
 
app.directive('subscriptionsList', function($location, $q, subscriptionsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/subscriptionsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;

            scope.allSubscriptionTypes = subscriptionsService.subscriptionTypes;
            if (!scope.queryModel) {

                scope.queryModel = {
                    subscriptionTypes : [SUBSCRIPTION_TYPE_1_MONTH, SUBSCRIPTION_TYPE_1_YEAR]
                };
            }


            scope.togglePaymentTypeSelection = function(subscriptionType) {
                if (!scope.queryModel.subscriptionTypes)
                    return;

                var index = scope.queryModel.subscriptionTypes.indexOf(subscriptionType.id);
                if (index == -1) {
                    scope.queryModel.subscriptionTypes.push(subscriptionType.id);
                } else {
                    scope.queryModel.subscriptionTypes.splice(index, 1);
                }
            };



            scope.newSubscriptionPurchase = function () {
                $location.path('admin/subscription_purchase/new');
            };
            scope.showDetails = function (subscriptionPurchase) {
                $location.path('admin/subscription_purchase/' + subscriptionPurchase.id);
            };


            scope.subscriptionPurchases = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.subscriptionPurchases = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['expirationDateMin'] = queryModelForStorage['expirationDateMin'] ? queryModelForStorage['expirationDateMin'].getTime() : null;
                        queryModelForStorage['expirationDateMax'] = queryModelForStorage['expirationDateMax'] ? queryModelForStorage['expirationDateMax'].getTime() : null;
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelSubscriptions, queryModelJson, expirationDate);
                        }

                    }

                }


                var subscriptionsPromise = subscriptionsService.getAllSubscriptions(scope.queryModel, pageIndex, pageSize);


                subscriptionsPromise.then(function(subscriptionsResult) {

                    scope.isLoadingContent = false;
                    if (subscriptionsResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.subscriptionPurchases.push.apply(scope.subscriptionPurchases, subscriptionsResult);

                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.subscriptionPurchases.length == 0) {
                    reloadData();
                }
            });

        }

    };
}); 
 
// usersListDirective 
 
app.directive('usersList', function($q, $location, usersService, appRolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/usersList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;




            scope.users = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.toggleAppRoleSelection = function(appRole) {
                if (!scope.queryModel.appRoleIds)
                    return;

                var index = scope.queryModel.appRoleIds.indexOf(appRole.id);
                if (index == -1) {
                    scope.queryModel.appRoleIds.push(appRole.id);
                } else {
                    scope.queryModel.appRoleIds.splice(index, 1);
                }
            };

            scope.showDetails = function(user) {
                $location.path('admin/user/'+user.id);
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.users = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelUsers, queryModelJson, expirationDate);
                        }

                    }
                }

                var usersPromise = usersService.getAllUsers(scope.queryModel, pageIndex, pageSize);
                var promises = [usersPromise];

                if (!scope.appRolesByIds) {
                    var appRolesPromise = appRolesService.getAllAppRoles(false);
                    promises.push(appRolesPromise);
                }


                $q.all(promises).then(function(results) {
                    if (results[1]) {
                        scope.appRoles = results[1];
                        if (!scope.queryModel.appRoleIds) {
                            var appRoleIds = [];
                            angular.forEach(scope.appRoles, function(someAppRole) {
                                appRoleIds.push(someAppRole.id);
                            });
                            scope.queryModel.appRoleIds = appRoleIds;
                        }
                    }

                    var usersResult = results[0];

                    scope.isLoadingContent = false;
                    if (usersResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.users.push.apply(scope.users, usersResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.users.length == 0) {
                    reloadData();
                }
            });


        }
    };
}); 
 
// citizenDirective 
 
app.directive('citizen', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/citizen.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_CITIZEN;



        }
    };
}); 
 
// deputyDirective 
 
app.directive('deputy', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/deputy.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.$watch('actionResults', function(actionResults) {
                if (!actionResults)
                    return;

                var index = actionResults.indexOfMatchFunction(function(actionResult) {
                    return actionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS;
                });

                if (index >= 0) {
                    var actionTypeParamsPerRolePerActionType = actionResults[index].result['action_types_params'];

                    if (actionTypeParamsPerRolePerActionType[ROLE_ID_DEPUTY]) {
                        if (actionTypeParamsPerRolePerActionType[ROLE_ID_DEPUTY][ACTION_TYPE_ID_DEPUTY_IDENTITIES]) {
                            var deputyIdentitiesActionTypeParams = actionTypeParamsPerRolePerActionType[ROLE_ID_DEPUTY][ACTION_TYPE_ID_DEPUTY_IDENTITIES];

                            var numOfActionsAvailable = deputyIdentitiesActionTypeParams['number_of_actions_available'];
                            scope.numOfActionsAvailable = numOfActionsAvailable;
                        }
                    }

                }


            }, true);


            scope.roleId = ROLE_ID_DEPUTY;

        }
    };
}); 
 
// detectiveDirective 
 
app.directive('detective', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/detective.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_DETECTIVE;

        }
    };
}); 
 
// doctorDirective 
 
app.directive('doctor', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/doctor.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_DOCTOR;

        }
    };
}); 
 
// elderDirective 
 
app.directive('elder', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/elder.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_ELDER;

        }
    };
}); 
 
// fugitiveDirective 
 
app.directive('fugitive', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/fugitive.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_FUGITIVE;
        }
    };
}); 
 
// journalistDirective 
 
app.directive('journalist', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/journalist.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_JOURNALIST;

        }
    };
}); 
 
// mobDirective 
 
app.directive('mob', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/mob.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_MOB;

        }
    };
}); 
 
// necromancerDirective 
 
app.directive('necromancer', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/necromancer.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_NECROMANCER;

        }
    };
}); 
 
// roleDescriptionDirective 
 
app.directive('roleDescription', function(rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            roleId: '='
        },
        templateUrl: 'app/directiveTemplates/domain/roles/roleDescription.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleIds = rolesService.roleIds;

        }
    };
}); 
 
// sheriffDirective 
 
app.directive('sheriff', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/sheriff.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.$watch('actionResults', function(actionResults) {
                if (!actionResults)
                    return;

                var index = actionResults.indexOfMatchFunction(function(actionResult) {
                    return actionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS;
                });

                if (index >= 0) {
                    var actionTypeParamsPerRolePerActionType = actionResults[index].result['action_types_params'];

                    if (actionTypeParamsPerRolePerActionType[ROLE_ID_SHERIFF]) {
                        if (actionTypeParamsPerRolePerActionType[ROLE_ID_SHERIFF][ACTION_TYPE_ID_SHERIFF_IDENTITIES]) {
                            var sheriffIdentitiesActionTypeParams = actionTypeParamsPerRolePerActionType[ROLE_ID_SHERIFF][ACTION_TYPE_ID_SHERIFF_IDENTITIES];

                            var numOfActionsAvailable = sheriffIdentitiesActionTypeParams['number_of_actions_available'];
                            scope.numOfActionsAvailable = numOfActionsAvailable;
                        }
                    }

                }


            }, true);


            scope.roleId = ROLE_ID_SHERIFF;

        }
    };
}); 
 
// tellerDirective 
 
app.directive('teller', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/teller.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.$watch('actionResults', function(actionResults) {
                if (!actionResults)
                    return;

                var index = actionResults.indexOfMatchFunction(function(actionResult) {
                    return actionResult.action_result_type.id ==ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS;
                });

                if (index >= 0) {
                    var actionTypeParamsPerRolePerActionType = actionResults[index].result['action_types_params'];

                    if (actionTypeParamsPerRolePerActionType[ROLE_ID_TELLER]) {
                        if (actionTypeParamsPerRolePerActionType[ROLE_ID_TELLER][ACTION_TYPE_ID_TELLER_VOTES]) {
                            var tellerVotesActionTypeParams = actionTypeParamsPerRolePerActionType[ROLE_ID_TELLER][ACTION_TYPE_ID_TELLER_VOTES];

                            var numOfActionsAvailable = tellerVotesActionTypeParams['number_of_actions_available'];
                            scope.numOfActionsAvailable = numOfActionsAvailable;
                        }
                    }

                }


            }, true);


            scope.roleId = ROLE_ID_TELLER;

        }
    };
}); 
 
// terroristDirective 
 
app.directive('terrorist', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/terrorist.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_TERRORIST;

        }
    };
}); 
 
// zombieDirective 
 
app.directive('zombie', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/zombie.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_ZOMBIE;

        }
    };
}); 
 
// citizenDescriptionDirective 
 
app.directive('citizenDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/citizen.html',
        link: function(scope, element, attrs) {
            "use strict";


        }
    };
}); 
 
// deputyDescriptionDirective 
 
app.directive('deputyDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/deputy.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// detectiveDescriptionDirective 
 
app.directive('detectiveDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/detective.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// doctorDescriptionDirective 
 
app.directive('doctorDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/doctor.html',
        link: function(scope, element, attrs) {
            "use strict";


        }
    };
}); 
 
// elderDescriptionDirective 
 
app.directive('elderDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/elder.html',
        link: function(scope, element, attrs) {
            "use strict";



        }
    };
}); 
 
// fugitiveDescriptionDirective 
 
app.directive('fugitiveDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/fugitive.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// journalistDescriptionDirective 
 
app.directive('journalistDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/journalist.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// mobDescriptionDirective 
 
app.directive('mobDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/mob.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// necromancerDescriptionDirective 
 
app.directive('necromancerDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/necromancer.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// sheriffDescriptionDirective 
 
app.directive('sheriffDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/sheriff.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// tellerDescriptionDirective 
 
app.directive('tellerDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/teller.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// terroristDescriptionDirective 
 
app.directive('terroristDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/terrorist.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// zombieDescriptionDirective 
 
app.directive('zombieDescription', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/descriptions/zombie.html',
        link: function(scope, element, attrs) {
            "use strict";

            
        }
    };
}); 
 
// imgAliveDirective 
 
app.directive('imgAlive', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            booleanValue: '='
        },
        templateUrl: 'app/directiveTemplates/images/imgAlive.html'
    };
}); 
 
// imgBoolDirective 
 
app.directive('imgBool', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            booleanValue: '='
        },
        templateUrl: 'app/directiveTemplates/images/imgBool.html'
    };
}); 
 
// imgCityStatusDirective 
 
app.directive('imgCityStatus', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '='
        },
        templateUrl: 'app/directiveTemplates/images/imgCityStatus.html',
        link: function(scope, element, attrs) {

            var city = scope.city;

            scope.created = !city.started_at;
            scope.started = city.started_at && !city.paused && !city.finished_at;
            scope.paused = city.started_at && city.paused && !city.finished_at;
            scope.finished = city.finished_at;


        }
    };
}); 
 
// acCheckbox 
 
app.directive('acCheckbox', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/utility/acCheckbox.html',
        scope: {
            ngModel: '=',
            ngChange: '='
        },
        transclude: true,
        link: function(scope, element, attrs) {
            "use strict";

            scope.acCheckboxId = attrs.id;

            var checked = element.find('.checked');
            checked.hide();
            var unchecked = element.find('.unchecked');
            unchecked.hide();

            scope.$watch('ngModel', function(newNgModel, oldNgModel) {
                var checked = element.find('.checked');
                var unchecked = element.find('.unchecked');

                if (newNgModel === true) {
                    checked.show();
                    unchecked.hide();
                } else {
                    checked.hide();
                    unchecked.show();
                }

                if (scope.onChange) {
                    scope.onChange(newNgModel, oldNgModel);
                }
            });

            scope.checkboxValueWillChange = function() {
                if (scope.ngChange) {
                    scope.ngChange();
                }
            };
        }
    };
}); 
 
// interactiveTableDirective 
 
app.directive('interactiveTable', function() {
    "use strict";
    return {
        restrict : 'A',
        scope: {
            selectedRowId: '='
        },
        link: function(scope, element, attrs) {
            $(element).on("click", "tbody tr", function() {
                var rowId = $(this).find("[name='id']").val();
                scope.$apply(function() {
                    scope.selectedRowId = rowId;
                });
            });


            scope.$watch("selectedRowId", function(newValue) {
                $(element).find("tr").removeClass("selected");
                var row = $(element).find("[name='id'][value='" + newValue + "']").parent();
                row.addClass("selected");
            });

        }
    };
}) 
 
// loaderDirective 
 
app.directive('loader', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/utility/loader.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.size = attrs.size;

        }
    };
}); 
 
// actionResultsService 
 
var ACTION_RESULT_TYPE_ID_VOTE = 1;
var ACTION_RESULT_TYPE_ID_PROTECT = 2;
var ACTION_RESULT_TYPE_ID_INVESTIGATE = 3;
var ACTION_RESULT_TYPE_ID_VOTE_MAFIA = 4;
var ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES = 5;
var ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF = 6;


var ACTION_RESULT_TYPE_ID_TELLER_VOTES = 7;
var ACTION_RESULT_TYPE_ID_TERRORIST_BOMB = 8;
var ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS = 9;

var ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS = 10;
var ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE = 11;
var ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES = 12;
var ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY = 13;

var ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS = 14;
var ACTION_RESULT_TYPE_ID_GAME_OVER = 15;

var ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED = 17;
var ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED = 18;



var ACTION_RESULTS_DAYS_PER_PAGE = 7;

app.factory('actionResultsService', function($q, serverService) {
    "use strict";

    var actionResultTypeIds = {
        ACTION_RESULT_TYPE_ID_VOTE : ACTION_RESULT_TYPE_ID_VOTE,
        ACTION_RESULT_TYPE_ID_PROTECT : ACTION_RESULT_TYPE_ID_PROTECT,
        ACTION_RESULT_TYPE_ID_INVESTIGATE : ACTION_RESULT_TYPE_ID_INVESTIGATE,
        ACTION_RESULT_TYPE_ID_VOTE_MAFIA : ACTION_RESULT_TYPE_ID_VOTE_MAFIA,
        ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES : ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES,
        ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF : ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF,
        ACTION_RESULT_TYPE_ID_TELLER_VOTES : ACTION_RESULT_TYPE_ID_TELLER_VOTES,
        ACTION_RESULT_TYPE_ID_TERRORIST_BOMB : ACTION_RESULT_TYPE_ID_TERRORIST_BOMB,
        ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS : ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS,
        ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS : ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS,
        ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE : ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE,
        ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES : ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES,
        ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY : ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY,
        ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS : ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS,
        ACTION_RESULT_TYPE_ID_GAME_OVER : ACTION_RESULT_TYPE_ID_GAME_OVER,
        ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED : ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED,
        ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED : ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED
    };

    var privateActionResultTypesForRole = function(role) {
        var supportedActionResultTypes = $.map(role.action_types, function(someActionType) {
            if (!someActionType.action_result_type)
                return null;

            if (someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_TERRORIST_BOMB ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE_MAFIA ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED
                ) {
                return null;
            }
            return someActionType.action_result_type;
        });
        return supportedActionResultTypes;
    };

    var publicActionResultTypeIds = function(city) {
        // for create public news feed result
        if (!city)
            return [];


        var publicActionResultTypeIds = [
            ACTION_RESULT_TYPE_ID_VOTE,
            ACTION_RESULT_TYPE_ID_VOTE_MAFIA];

        if (city.rolesById[ROLE_ID_SHERIFF]/* && city.rolesById[ROLE_ID_SHERIFF].quantity > 0*/)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES);

        if (city.rolesById[ROLE_ID_TERRORIST]/* && city.rolesById[ROLE_ID_TERRORIST].quantity > 0*/)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_TERRORIST_BOMB);

        if (city.rolesById[ROLE_ID_SHERIFF]/* && city.rolesById[ROLE_ID_SHERIFF].quantity > 0*/)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF);

        if (city.rolesById[ROLE_ID_DEPUTY]/* && city.rolesById[ROLE_ID_DEPUTY].quantity > 0*/)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY);

        if (city.rolesById[ROLE_ID_NECROMANCER]/* && city.rolesById[ROLE_ID_NECROMANCER].quantity > 0*/) {
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED);
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED);
        }




        return publicActionResultTypeIds;
    };

    var actionResultTypes;
    var allActionResultTypesPromise;

    var getAllActionResultTypes = function(refresh) {
        if (refresh || !allActionResultTypesPromise) {
            allActionResultTypesPromise = serverService.get('action_result_types', {});
            allActionResultTypesPromise = allActionResultTypesPromise.then(function(allActionResultTypesResult) {
                actionResultTypes = allActionResultTypesResult;
                return actionResultTypes;
            });
        } else {

        }
        return allActionResultTypesPromise;
    };

    var getAllActionResultTypesByIds = function(refresh) {
          return getAllActionResultTypes(refresh).then(function(allActionResultTypesResult) {
              var actionResultTypesByIds = {};
              angular.forEach(allActionResultTypesResult, function(someActionResultType) {
                  actionResultTypesByIds[someActionResultType.id] = someActionResultType;
              });
              return actionResultTypesByIds;
          });
    };

    var getAllActionResults = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('action_results', {
            page_index: pageIndex,
            page_size: pageSize,
            action_ids: queryModel.actionIds,
            action_result_type_ids: queryModel.actionResultTypeIds,
            result_json: queryModel.resultJson,
            is_automatically_generated: queryModel.isAutomaticallyGenerated,
            city_ids: queryModel.cityIds,
            city_name: queryModel.cityName,
            day_number_min: queryModel.dayNumberMin,
            day_number_max: queryModel.dayNumberMax,
            resident_ids: queryModel.residentIds,
            resident_username: queryModel.residentUsername,
            for_all_residents: queryModel.forAllResidents,
            role_ids: queryModel.roleIds,
            deleted: queryModel.deleted,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });
    };



    var getActionResults = function(cityId, roleId, dayNumberMin, dayNumberMax) {
        return serverService.get('action_results/city/'+ cityId + '/role/' + roleId, {
            day_number_min: dayNumberMin,
            day_number_max: dayNumberMax
        });
    };

    var postActionResult = function(cityId, roleId, action_result_type, action_id, day_id, result) {
        return serverService.post('action_results', {
            action_result : {
                city_id : cityId,
                role_id : roleId,
                action_result_type : action_result_type,
                action_id : action_id,
                day_id : day_id,
                result : result
            }
        });
    };

    var deleteActionResult = function(actionResultId) {
        return serverService.delete('action_results/' + actionResultId);
    };

    var publicActionResults = function(actionResults) {

        function shouldShowSheriffIdentitiesResult(actionResult) {
            var result = actionResult.result;
            if (!result.success)
                return false;

            return result.success.toString() == 'true';
        }

        return $.grep(actionResults, function(someActionResult) {
            return (
                someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE_MAFIA ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_TERRORIST_BOMB ||
                    (someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES && shouldShowSheriffIdentitiesResult(someActionResult)) ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED
                );
        });
    };

    var privateActionResults = function(actionResults) {
        return $.grep(actionResults, function(someActionResult) {
            return (
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_PROTECT ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_INVESTIGATE ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_TELLER_VOTES ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES
                );
        });
    };

    var actionResultTypes = {};

    function isEmpty(ob){
        if (!ob)
            return false;

        for(var i in ob){ return false;}
        return true;
    }

    var getActionResultTypes = function(refresh) {
        if (!isEmpty(actionResultTypes) && !refresh) {
            var deferred = $q.defer();
            deferred.resolve(actionResultTypes);
            return deferred.promise;
        } else {
            var actionResultTypesPromise = serverService.get('action_result_types');

            return actionResultTypesPromise.then(function(actionResultTypesResult) {
                for (var i = 0; i < actionResultTypesResult.length; i++) {
                    var actionResultType = actionResultTypesResult[i];
                    actionResultTypes[actionResultType.id] = actionResultType;
                }

                return actionResultTypes;
            })
        }
    };



    var patchedActionResultsByType = function(actionResultsByTypeNew, actionResultsByTypeOld) {
        var patchedActionResultsByType = angular.copy(actionResultsByTypeNew);
        if (!actionResultsByTypeOld)
            return patchedActionResultsByType;

        var actionResultTypeIds = [ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS, ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS, ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS, ACTION_RESULT_TYPE_ID_GAME_OVER];

        for (var i = 0; i <actionResultTypeIds.length; i++) {
            var actionResultTypeId = actionResultTypeIds[i];
            var actionResultNew = actionResultsByTypeNew[actionResultTypeId] ? actionResultsByTypeNew[actionResultTypeId][0] : null;
            var actionResultOld = actionResultsByTypeOld[actionResultTypeId] ? actionResultsByTypeOld[actionResultTypeId][0] : null;

            if (!actionResultOld && !actionResultNew) {
                continue;
            }

            if (!actionResultOld && actionResultNew) {
                patchedActionResultsByType[actionResultTypeId] = [actionResultNew];
                continue;
            }
            if (actionResultOld && !actionResultNew) {
                patchedActionResultsByType[actionResultTypeId] = [actionResultOld];
                continue;
            }

            if (actionResultNew.day_id > actionResultOld.day_id) {
                patchedActionResultsByType[actionResultTypeId] = [actionResultNew];
            } else {
                patchedActionResultsByType[actionResultTypeId] = [actionResultOld];
            }
        }

        return patchedActionResultsByType;
    };



    return {
        actionResultTypeIds : actionResultTypeIds,
        privateActionResultTypesForRole : privateActionResultTypesForRole,
        publicActionResultTypeIds : publicActionResultTypeIds,
        actionResultTypes : actionResultTypes,
        getAllActionResultTypes : getAllActionResultTypes,
        getAllActionResultTypesByIds : getAllActionResultTypesByIds,
        getAllActionResults : getAllActionResults,
        getActionResults : getActionResults,
        postActionResult : postActionResult,
        deleteActionResult : deleteActionResult,
        publicActionResults : publicActionResults,
        privateActionResults : privateActionResults,
        patchedActionResultsByType : patchedActionResultsByType
    };
});
 
 
// actionsService 
 
var ACTION_TYPE_ID_VOTE = 1;
var ACTION_TYPE_ID_PROTECT = 2;
var ACTION_TYPE_ID_INVESTIGATE = 3;
var ACTION_TYPE_ID_VOTE_MAFIA = 4;
var ACTION_TYPE_ID_SHERIFF_IDENTITIES = 5;
var ACTION_TYPE_ID_TELLER_VOTES = 6;
var ACTION_TYPE_ID_TERRORIST_BOMB = 7;
var ACTION_TYPE_ID_JOURNALIST_INVESTIGATE = 10;
var ACTION_TYPE_ID_DEPUTY_IDENTITIES = 11;
var ACTION_TYPE_ID_ELDER_VOTE = 12;
var ACTION_TYPE_ID_INITIATE_REVIVAL = 13;
var ACTION_TYPE_ID_REVIVE = 14;



app.factory('actionsService', function($q, serverService) {
    "use strict";

    var actionTypeIds = {
        ACTION_TYPE_ID_VOTE : ACTION_TYPE_ID_VOTE,
        ACTION_TYPE_ID_PROTECT : ACTION_TYPE_ID_PROTECT,
        ACTION_TYPE_ID_INVESTIGATE : ACTION_TYPE_ID_INVESTIGATE,
        ACTION_TYPE_ID_VOTE_MAFIA : ACTION_TYPE_ID_VOTE_MAFIA,
        ACTION_TYPE_ID_SHERIFF_IDENTITIES : ACTION_TYPE_ID_SHERIFF_IDENTITIES,
        ACTION_TYPE_ID_TELLER_VOTES : ACTION_TYPE_ID_TELLER_VOTES,
        ACTION_TYPE_ID_TERRORIST_BOMB : ACTION_TYPE_ID_TERRORIST_BOMB,
        ACTION_TYPE_ID_JOURNALIST_INVESTIGATE : ACTION_TYPE_ID_JOURNALIST_INVESTIGATE,
        ACTION_TYPE_ID_DEPUTY_IDENTITIES : ACTION_TYPE_ID_DEPUTY_IDENTITIES,
        ACTION_TYPE_ID_ELDER_VOTE : ACTION_TYPE_ID_ELDER_VOTE,
        ACTION_TYPE_ID_INITIATE_REVIVAL : ACTION_TYPE_ID_INITIATE_REVIVAL,
        ACTION_TYPE_ID_REVIVE : ACTION_TYPE_ID_REVIVE
    };


    var actionTypes;
    var allActionTypesPromise;
    var getAllActionTypes = function(refresh) {
        if (refresh || !allActionTypesPromise) {
            allActionTypesPromise = serverService.get('action_type', {});
            allActionTypesPromise = allActionTypesPromise.then(function(allActionTypesResult) {
                actionTypes = allActionTypesResult;
                return actionTypes;
            });
        } else {

        }
        return allActionTypesPromise;
    };

    var getAllActionTypesByIds = function(refresh) {
        return getAllActionTypes(refresh).then(function(actionTypesResult) {
            var actionTypesByIds = {};
            angular.forEach(actionTypesResult, function(someActionType) {
                actionTypesByIds[someActionType.id] = someActionType;
            });
            return actionTypesByIds;
        });
    };

    var getAllActions = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('actions', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            city_name: queryModel.cityName,
            input_json: queryModel.inputJson,
            role_ids: queryModel.roleIds,
            role_authentic: queryModel.roleAuthentic,
            action_type_ids: queryModel.actionTypeIds,
            day_min: queryModel.dayMin,
            day_max: queryModel.dayMax,
            resident_alive: queryModel.residentAlive,
            is_processed: queryModel.isProcessed,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };

    var postAction = function(cityId, roleId, actionTypeId, dayId, input) {
        return serverService.post('actions', {
            action_instance : {
                city_id : cityId,
                role_id : roleId,
                action_type_id : actionTypeId,
                day_id : dayId,
                input : input
            }
        });
    };

    var cancelUnprocessedActions = function(cityId, roleId, actionTypeId) {
        return serverService.delete('actions/cancel_unprocessed_actions', {
            city_id : cityId,
            role_id : roleId,
            action_type_id : actionTypeId
        });
    };

    return {
        actionTypes: actionTypes,
        getAllActionTypes: getAllActionTypes,
        getAllActionTypesByIds: getAllActionTypesByIds,
        actionTypeIds: actionTypeIds,
        getAllActions: getAllActions,
        postAction: postAction,
        cancelUnprocessedActions: cancelUnprocessedActions
    };
});
 
 
// appRolesService 
 
var APP_ROLE_SUPER_ADMIN = 1;
var APP_ROLE_ADMIN = 2;
var APP_ROLE_GAME_CREATOR = 3;
var APP_ROLE_USER = 4;

app.factory('appRolesService', function($q, serverService) {
    "use strict";


    var allAppRolesPromise;

    var getAllAppRoles = function(refresh) {
        var deferred = $q.defer();

        if (!allAppRolesPromise) {
            allAppRolesPromise = serverService.get('app_roles');
        }

        return allAppRolesPromise.then(function(appRolesResult) {
            return appRolesResult;
        }, function(reason) {
            return reason;
        });

    };

    var getAllAppRolesByIds = function(refresh) {
        var allAppRolesPromise = getAllAppRoles(refresh);
        return allAppRolesPromise.then(function(allAppRolesResult) {
            var allAppRolesByIds = {};
            angular.forEach(allAppRolesResult, function(someAppRole) {
                allAppRolesByIds[someAppRole.id] = someAppRole;
            });
            return allAppRolesByIds;
        });
    };


    var getAllInitialAppRoles = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var initialAppRolesPromise = serverService.get('initial_app_roles', {
            page_index: pageIndex,
            page_size: pageSize,
            description: queryModel.description,
            email: queryModel.email,
            email_pattern: queryModel.emailPattern,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });


        return initialAppRolesPromise.then(function(initialAppRolesResult) {
            return initialAppRolesResult;
        }, function(reason) {
            return reason;
        });

    };

    var getAllGrantedAppRoles = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var grantedAppRolesPromise = serverService.get('granted_app_roles', {
            page_index: pageIndex,
            page_size: pageSize,
            subscription_purchase_id: queryModel.subscriptionPurchaseId,
            description: queryModel.description,
            username: queryModel.username,
            email: queryModel.email,
            appRoleIds: queryModel.appRoleIds,
            expiration_date_min: queryModel.expirationDateMin,
            expiration_date_max: queryModel.expirationDateMax,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });


        return grantedAppRolesPromise;
    };

    var getInitialAppRoleByIdPromisesByIds = {};
    var getInitialAppRoleById = function(initialAppRoleId, refresh) {
        if (!refresh && getInitialAppRoleByIdPromisesByIds[initialAppRoleId]) {
            return getInitialAppRoleByIdPromisesByIds[initialAppRoleId];
        }

        var initialAppRolePromise = serverService.get('initial_app_roles/' + initialAppRoleId);
        getInitialAppRoleByIdPromisesByIds[initialAppRoleId] = initialAppRolePromise;
        return initialAppRolePromise.then(function(initialAppRoleResult) {
            return initialAppRoleResult;
        });
    };

    var getGrantedAppRoleByIdPromisesByIds = {};
    var getGrantedAppRoleById = function(grantedAppRoleId, refresh) {
        if (!refresh && getGrantedAppRoleByIdPromisesByIds[grantedAppRoleId]) {
            return getInitialAppRoleByIdPromisesByIds[grantedAppRoleId];
        }

        var grantedAppRolePromise = serverService.get('granted_app_roles/' + grantedAppRoleId);
        getGrantedAppRoleByIdPromisesByIds[grantedAppRoleId] = grantedAppRolePromise;
        return grantedAppRolePromise;
    };

    var getNewInitialAppRole = function() {
        return serverService.get('initial_app_roles/new');
    };
    var getNewGrantedAppRole = function() {
        return serverService.get('granted_app_roles/new');
    };

    var postCreateInitialAppRole = function(initialAppRole) {
        return serverService.post('initial_app_roles', {initial_app_role : initialAppRole});
    };
    var postCreateGrantedAppRole = function(grantedAppRole) {
        return serverService.post('granted_app_roles', {granted_app_role : grantedAppRole});
    };

    var putUpdateInitialAppRole = function(initialAppRole) {
        return serverService.put('initial_app_roles/' + initialAppRole.id, {
            initial_app_role: initialAppRole
        });
    };
    var putUpdateGrantedAppRole = function(grantedAppRole) {
        return serverService.put('granted_app_roles/' + grantedAppRole.id, {
            granted_app_role: grantedAppRole
        });
    };

    var deleteInitialAppRole = function(initialAppRoleId) {
        return serverService.delete('initial_app_roles/' + initialAppRoleId);
    };
    var deleteGrantedAppRole = function(grantedAppRoleId) {
        return serverService.delete('granted_app_roles/' + grantedAppRoleId);
    };

    var notifications = {
        initialAppRoleCreated : null,
        initialAppRoleDeleted : null,
        grantedAppRoleCreated : null,
        grantedAppRoleDeleted : null
    };

    return {
        getAllAppRoles : getAllAppRoles,
        getAllAppRolesByIds: getAllAppRolesByIds,
        getAllInitialAppRoles : getAllInitialAppRoles,
        getAllGrantedAppRoles: getAllGrantedAppRoles,
        getInitialAppRoleById : getInitialAppRoleById,
        getGrantedAppRoleById: getGrantedAppRoleById,
        getNewInitialAppRole : getNewInitialAppRole,
        getNewGrantedAppRole: getNewGrantedAppRole,
        postCreateInitialAppRole : postCreateInitialAppRole,
        postCreateGrantedAppRole: postCreateGrantedAppRole,
        putUpdateInitialAppRole : putUpdateInitialAppRole,
        putUpdateGrantedAppRole: putUpdateGrantedAppRole,
        deleteInitialAppRole: deleteInitialAppRole,
        deleteGrantedAppRole: deleteGrantedAppRole,
        notifications: notifications
    };
}); 
 
// authService 
 
var URL_USERS_ME = 'users/me';
var URL_LOGIN = 'login';

app.factory('authService', function(serverService, $q, citiesService) {
    "use strict";

    var user = {};



    var authenticate = function(username, password) {
        var deferred = $q.defer();

        if (username && password) {
            var userMePromise = serverService.post(URL_LOGIN, {username:username,password:password});

            userMePromise = userMePromise.then(function(userMe) {
                angular.copy(userMe, user);
                serverService.setAuthToken(userMe.auth_token.token_string, userMe.auth_token.expiration_date);
                return user;
            });

            return userMePromise;


        } else {

            if (serverService.getAuthToken()) {
                return this.userMe(false);
            } else {

                // user will have to enter credentials if they want access
                deferred.reject('Method "authService.authenticate": Neither credentials provided nor cookie present.');

            }

            return deferred.promise;
        }
    };

    var impersonationAuthenticate = function(userId) {
        return serverService.get('impersonate_login/'+userId).then(function(impersonatedUser) {
            angular.copy(impersonatedUser, user);
            serverService.setAuthToken(impersonatedUser.auth_token.token_string, impersonatedUser.auth_token.expiration_date);
            return user;
        });;
    };

    var emailConfirmation = {
        code: null
    };

    var exchangeEmailConfirmationCode = function(emailConfirmationCode) {
        var userMePromise = serverService.post('exchange_email_confirmation_code', {email_confirmation_code : emailConfirmationCode});

        userMePromise = userMePromise.then(function(userMe) {
            angular.copy(userMe, user);
            serverService.setAuthToken(userMe.auth_token.token_string, userMe.auth_token.expiration_date);
            return user;
        });

        return userMePromise;
    };


    var userMe = function(refresh) {
        var deferred = $q.defer();

        if (serverService.getAuthToken()) {
            if (refresh || !user.id) {
                var userMePromise = serverService.get(URL_USERS_ME,null);

                userMePromise.then(function(userMe) {
                    angular.copy(userMe, user);
                    deferred.resolve(user);
                }, function(reason) {
                    angular.copy({}, user);
                    deferred.resolve(null);
                });

            } else {
                deferred.resolve(user);
            }
        } else {
            angular.copy({}, user);
            deferred.resolve(null);
        }

        return deferred.promise;
    };

    var notifications = {
        shouldSignOut: false,
        shouldSignIn: false
    };

    var signOut = function() {
        angular.copy({}, user);

        var signOutPromise = serverService.delete("logout");
        serverService.setAuthToken("", null);
        citiesService.deleteAllCachedCities();
        return signOutPromise;
    };



    return {
        user: user,
        authenticate: authenticate,
        impersonationAuthenticate: impersonationAuthenticate,
        emailConfirmation: emailConfirmation,
        exchangeEmailConfirmationCode: exchangeEmailConfirmationCode,
        userMe: userMe,
        notifications: notifications,
        signOut: signOut
    };
}); 
 
// citiesService 
 
app.factory('citiesService', function($q, serverService) {
    "use strict";

    var cities = [];
    var newCity = {};

    var getAllCities = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var citiesPromise = serverService.get('cities', {
            page_index: pageIndex,
            page_size: pageSize,
            name: queryModel.name,
            description: queryModel.description,
            public: queryModel.public,
            resident_user_ids: queryModel.residentUserIds,
            user_creator: queryModel.userCreator, // this is userCreator username, not working atm
            timezone: queryModel.timezoneDate ? (queryModel.timezoneSign *(queryModel.timezoneDate.getHours() * 60 + queryModel.timezoneDate.getMinutes())) : null,
            active: queryModel.active,
            paused: queryModel.paused,
            paused_during_day: queryModel.pausedDuringDay,
            last_paused_at_min: queryModel.lastPausedAtMin ? queryModel.lastPausedAtMin.getTime()/1000 : null,
            last_paused_at_max: queryModel.lastPausedAtMax ? queryModel.lastPausedAtMax.getTime()/1000 : null,
            started_at_min: queryModel.startedAtMin ? queryModel.startedAtMin.getTime()/1000 : null,
            started_at_max: queryModel.startedAtMax ? queryModel.startedAtMax.getTime()/1000 : null,
            finished_at_min: queryModel.finishedAtMin ? queryModel.finishedAtMin.getTime()/1000 : null,
            finished_at_max: queryModel.finishedAtMax ? queryModel.finishedAtMax.getTime()/1000 : null,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });


        return citiesPromise.then(function(citiesResult) {
            return citiesResult;
        }, function(reason) {
            return reason;
        });

    };

    var getAllCitiesForSearch = function(searchText) {
        return serverService.get('cities/search/' + searchText, null);
    };

    var getMyCities = function(pageIndex, pageSize) {
        return serverService.get('cities/me', {
            page_index: pageIndex,
            page_size: pageSize
        });
    };

    var getMyCitiesForSearch = function(searchText) {
        return serverService.get('cities/me/search/' + searchText, null);
    };

    var getCities = function(refresh, pageIndex, pageSize) {
        if (refresh || this.cities == null || this.cities.length == 0 || (pageIndex*pageSize !== NaN && (pageIndex+1)*pageSize > this.cities.length ) ) {
            var citiesPromise = serverService.get('cities', {
                page_index: pageIndex,
                page_size: pageSize
            });

            return citiesPromise.then(function(citiesResult) {
                // refresh value of cities variable
                if (pageIndex !== undefined && pageSize) {
                    if (cities.length > pageIndex*pageSize) {
                        cities.splice(pageIndex*pageSize, Math.min(pageSize, cities.length - pageIndex*pageSize), citiesResult);
                    } else {
                        cities.push.apply(cities, citiesResult);
                    }
                } else {
                    angular.copy(citiesResult, cities);
                }
                return citiesResult;
            }, function(reason) {
                return reason;
            });
        } else {
            var deferred = $q.defer();
            if (pageIndex !== undefined && pageSize) {
                deferred.resolve(cities.slice(pageIndex*pageSize, (pageIndex+1)*pageSize));
            } else {
                deferred.resolve(cities);
            }
            return deferred.promise;
        }
    };





    var getCityPromisesByCityIds = {};

    var getCity = function(cityId, refresh) {
        if (!refresh && getCityPromisesByCityIds[cityId]) {
            return getCityPromisesByCityIds[cityId];
        }

        var cityPromise = serverService.get('cities/' + cityId);
        return cityPromise.then(function(cityResult) {
            cacheCity(cityResult);
            return cityResult;
        });
    };

    function cacheCity(cityUpdated) {
        var deferred = $q.defer();
        getCityPromisesByCityIds[cityUpdated.id] = deferred.promise;
        deferred.resolve(cityUpdated);

        var city = $.grep(cities, function(someCity) {
            return someCity.id == cityUpdated.id;
        });
        if (city) {
            var index = cities.indexOf(city);
            if (index >= 0)
                cities.splice(index, 1, cityUpdated);
            else
                cities.push(cityUpdated);
        }
    }

    function deleteAllCachedCities() {
        getCityPromisesByCityIds = {};
    }

    var getNewCity = function() {
        if (newCity.user_creator_id) {
            var deferred = $q.defer();
            deferred.resolve(newCity);
            return deferred.promise;
        } else {
            var newCityPromise = serverService.get('cities/new');
            return newCityPromise.then(function(newCityResult) {
                angular.copy(newCityResult, newCity);
                return newCityResult;
            }, function(reason) {
                return reason;
            });
        }
    };

    var createCity = function(city) {
        return serverService.post('cities', {
            city : city
        }).then(function(createdCity) {
            cacheCity(createdCity);
            return createdCity;
        });
    };

    var inviteUsers = function(cityId, invitedUsers) {
        return serverService.post('cities/' + cityId + '/invite', {
            invited_users: invitedUsers
        });
    };

    var cancelInvitation = function(cityId, userId) {
        return serverService.delete('cities/' + cityId + '/invitation/' + userId);
    };

    var acceptInvitation = function(cityId) {
        return serverService.post('cities/' + cityId + '/accept_invitation');
    };

    var acceptJoinRequest = function(cityId, userId) {
        return serverService.post('cities/' + cityId + '/join_request/' + userId);
    };

    var rejectJoinRequest = function(cityId, userId) {
        return serverService.delete('cities/' + cityId + '/join_request/' + userId);
    };

    var kickUser = function(cityId, userId) {
        return serverService.delete('cities/' + cityId + '/user/' + userId);
    };


    var deleteCity = function (cityId, password) {
        return serverService.delete('cities/'+cityId, {
            password: password
        });
    };

    var updateCity = function (city) {
        return serverService.put('cities/' + city.id, {city : city}).then(function(updatedCity) {

            return updatedCity;
        });
    };

    var joinCity = function(cityId, joinCityPassword) {
        var joinCityPromise = serverService.post('cities/' + cityId + '/join', {password : joinCityPassword});

        joinCityPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });

        return joinCityPromise;
    };

    var leaveCity = function(cityId) {
        var leaveCityPromise = serverService.post('cities/' + cityId + '/leave');
        leaveCityPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
        });

        return leaveCityPromise;
    };

    var cancelJoinRequest = function(cityId) {
        var cancelJoinRequestPromise = serverService.delete('cities/' + cityId + '/join_request');
        cancelJoinRequestPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
        });

        return cancelJoinRequestPromise;
    };

    var startCity = function(cityId) {
        var startCityPromise = serverService.post('cities/' + cityId + '/start');
        return startCityPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });
    };

    var pauseCity = function(cityId) {
        var pauseCityPromise = serverService.post('cities/' + cityId + '/pause');
        return pauseCityPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });
    };

    var resumeCity = function(cityId) {
        return serverService.post('cities/' + cityId + "/resume").then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });
    };

    var triggerDayStart = function(cityId) {
        return serverService.post('cities/' + cityId + '/trigger_day_start').then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });;
    };

    var triggerNightStart = function(cityId) {
        return serverService.post('cities/' + cityId + '/trigger_night_start').then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });;
    };


    var minutesToString = function(minutes) {
        return pad(Math.floor(minutes / 60.0), 2) + ":" + pad(minutes%60, 2);
    };

    var pad = function(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    };

    var isNewCityCreated = false;
    var cityDeleted = null;

    return {
        getAllCities : getAllCities,
        getAllCitiesForSearch : getAllCitiesForSearch,
        getMyCities : getMyCities,
        getMyCitiesForSearch : getMyCitiesForSearch,
        cities : cities,
        getCity : getCity,
        cacheCity: cacheCity,
        deleteAllCachedCities: deleteAllCachedCities,
        getCities : getCities,
        newCity : newCity,
        getNewCity : getNewCity,
        createCity : createCity,
        inviteUsers : inviteUsers,
        cancelInvitation : cancelInvitation,
        acceptInvitation : acceptInvitation,
        acceptJoinRequest : acceptJoinRequest,
        rejectJoinRequest : rejectJoinRequest,
        kickUser : kickUser,
        deleteCity : deleteCity,
        updateCity : updateCity,
        joinCity : joinCity,
        leaveCity : leaveCity,
        cancelJoinRequest : cancelJoinRequest,
        startCity : startCity,
        pauseCity : pauseCity,
        resumeCity : resumeCity,
        triggerDayStart : triggerDayStart,
        triggerNightStart : triggerNightStart,
        minutesToString : minutesToString,
        isNewCityCreated : isNewCityCreated,
        cityDeleted : cityDeleted
    };
}); 
 
// daysService 
 
app.factory('daysService', function($q, serverService) {
    "use strict";



    var getAllDays = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var daysPromise = serverService.get('days', {
            page_index: pageIndex,
            page_size: pageSize,
            city_ids: queryModel.cityIds,
            city_name: queryModel.cityName,
            number_min: queryModel.numberMin,
            number_max: queryModel.numberMax,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });


        return daysPromise.then(function(daysResult) {
            return daysResult;
        }, function(reason) {
            return reason;
        });

    };

    return {
        getAllDays : getAllDays
    };
}); 
 
// gameEndConditionsService 
 
app.service('gameEndConditionsService', function(serverService, $q) {
    "use strict";

    var allGameEndConditions;

    this.getAllGameEndConditions = function(refresh) {
        var deferred = $q.defer();

        if (!allGameEndConditions || refresh) {
            var gameEndConditionsPromise = serverService.get('game_end_conditions',{});
            gameEndConditionsPromise.then(function(result) {
                allGameEndConditions = result;
            });

            return gameEndConditionsPromise;
        } else {
            deferred.resolve(allGameEndConditions);
        }

        return deferred.promise;
    };
});
 
 
// gamePurchasesService 
 
app.factory('gamePurchasesService', function($q, serverService) {
    "use strict";


    var getAllGamePurchases = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('purchases/game_purchases', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            user_email: queryModel.userEmail,
            used: queryModel.used,
            city_name: queryModel.cityName,
            city_started_at_min: queryModel.cityStartedAtMin ? queryModel.cityStartedAtMin.getTime()/1000 : null,
            city_started_at_max: queryModel.cityStartedAtMax ? queryModel.cityStartedAtMax.getTime()/1000 : null,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };

    var getGamePurchaseById = function (gamePurchaseId) {
        return serverService.get('purchases/game_purchases/' + gamePurchaseId);
    };

    var getNewGamePurchase = function () {
        return serverService.get('purchases/game_purchases/new');
    };


    var postCreateGamePurchase = function(gamePurchase) {
        return serverService.post('purchases/game_purchases', {
            game_purchase : gamePurchase
        });
    };


    var putUpdateGamePurchase = function(gamePurchaseId, gamePurchase) {
        return serverService.put('purchases/game_purchases/' + gamePurchaseId, {
            game_purchase: gamePurchase
        });
    };

    var deleteGamePurchase = function (gamePurchaseId) {
        return serverService.delete('purchases/game_purchases/' + gamePurchaseId);
    };

    var notifications = {
        gamePurchaseCreated : null,
        gamePurchaseDeleted : null
    };

    return {
        getAllGamePurchases: getAllGamePurchases,
        getGamePurchaseById: getGamePurchaseById,
        getNewGamePurchase: getNewGamePurchase,
        postCreateGamePurchase: postCreateGamePurchase,
        putUpdateGamePurchase: putUpdateGamePurchase,
        deleteGamePurchase: deleteGamePurchase,
        notifications: notifications
    };
});
 
 
// layoutService 
 
app.factory('layoutService', function() {
    "use strict";

    var homeButton = {
        visible: false
    };

    var homeButtonVisible = function() {
        return homeButton.visible;
    };

    var setHomeButtonVisible = function(visible) {
        homeButton.visible = visible;
    };

    var adminButton = {
        visible: true
    };

    var adminButtonVisible = function() {
        return adminButton.visible;
    };

    var setAdminButtonVisible = function(visible) {
        adminButton.visible = visible;
    };

    return {
        homeButtonVisible: homeButtonVisible,
        setHomeButtonVisible: setHomeButtonVisible,
        adminButtonVisible: adminButtonVisible,
        setAdminButtonVisible: setAdminButtonVisible
    }
}); 
 
// modalService 
 
app.factory('modalService', function($modal) {
    "use strict";

    var controller = function ($scope, $modalInstance, message) {
        $scope.message = message;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var successModal = function(message) {
        $modal.open({
            templateUrl: 'app/partials/modal/success.html',
            controller: controller,
            resolve: {
                message: function () {
                    return message;
                }
            }
        });
    };

    var errorModal = function(message) {
        $modal.open({
            templateUrl: 'app/partials/modal/error.html',
            controller: controller,
            resolve: {
                message: function () {
                    return message;
                }
            }
        });
    };

    return {
        successModal : successModal,
        errorModal : errorModal
    };
}); 
 
// paymentsService 
 
var PAYMENT_TYPE_UNKNOWN = 1;
var PAYMENT_TYPE_SUBSCRIPTION_1_MONTH = 2;
var PAYMENT_TYPE_SUBSCRIPTION_1_YEAR = 3;
var PAYMENT_TYPE_BUY_1_GAME = 4;
var PAYMENT_TYPE_BUY_5_GAMES = 5;
var PAYMENT_TYPE_BUY_1_ROLE_PICK = 6;
var PAYMENT_TYPE_BUY_5_ROLE_PICKS = 7;

app.factory('paymentsService', function($q, serverService) {
    "use strict";

    var paymentTypes = {
        PAYMENT_TYPE_UNKNOWN : PAYMENT_TYPE_UNKNOWN,
        PAYMENT_TYPE_SUBSCRIPTION_1_MONTH : PAYMENT_TYPE_SUBSCRIPTION_1_MONTH,
        PAYMENT_TYPE_SUBSCRIPTION_1_YEAR : PAYMENT_TYPE_SUBSCRIPTION_1_YEAR,
        PAYMENT_TYPE_BUY_1_GAME : PAYMENT_TYPE_BUY_1_GAME,
        PAYMENT_TYPE_BUY_5_GAMES : PAYMENT_TYPE_BUY_5_GAMES,
        PAYMENT_TYPE_BUY_1_ROLE_PICK : PAYMENT_TYPE_BUY_1_ROLE_PICK,
        PAYMENT_TYPE_BUY_5_ROLE_PICKS : PAYMENT_TYPE_BUY_5_ROLE_PICKS
    };

    var getAllPayments = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('payments/payments', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            user_email: queryModel.userEmail,
            city_name: queryModel.cityName,
            payment_type_ids: queryModel.paymentTypeIds,
            unit_price_min: queryModel.unitPriceMin,
            unit_price_max: queryModel.unitPriceMax,
            quantity_min: queryModel.quantityMin,
            quantity_max: queryModel.quantityMax,
            total_price_min: queryModel.totalPriceMin,
            total_price_max: queryModel.totalPriceMax,
            is_payment_valid: queryModel.isPaymentValid,
            info_json: queryModel.infoJson,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };

    var getAllPaymentTypes = function () {
        return serverService.get('payments/payment_types');
    };

    var getPaymentLogById = function (paymentLogId) {
        return serverService.get('payments/payments/' + paymentLogId);
    };

    var getNewPaymentLog = function () {
        return serverService.get('payments/payments/new');
    };

    var postCreatePaymentLog = function(paymentLog) {
        return serverService.post('payments/payments', {
            payment_log: paymentLog
        });
    };

    var putUpdatePaymentLog = function(paymentLogId, paymentLog) {
        return serverService.put('payments/payments/' + paymentLogId, {
            payment_log: paymentLog
        });
    };

    var deletePaymentLog = function (paymentLogId) {
        return serverService.delete('payments/payments/' + paymentLogId);
    };

    var notifications = {
        paymentLogCreated : null,
        paymentLogDeleted : null
    };

    return {
        paymentTypes: paymentTypes,
        getAllPayments: getAllPayments,
        getAllPaymentTypes: getAllPaymentTypes,
        getPaymentLogById: getPaymentLogById,
        getNewPaymentLog: getNewPaymentLog,
        postCreatePaymentLog: postCreatePaymentLog,
        putUpdatePaymentLog: putUpdatePaymentLog,
        deletePaymentLog: deletePaymentLog,
        notifications: notifications
    };
});
 
 
// residentsService 
 
app.factory('residentsService', function($q, serverService) {
    "use strict";

    var getAllResidents = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('residents/', {
            page_index: pageIndex,
            page_size: pageSize,
            user_ids: queryModel.userIds,
            username: queryModel.username,
            name: queryModel.name,
            city_ids: queryModel.cityIds,
            city_name: queryModel.cityName,
            role_ids: queryModel.roleIds,
            saved_role_ids: queryModel.savedRoleIds,
            role_seen: queryModel.roleSeen,
            alive: queryModel.alive,
            died_at_min: queryModel.diedAtMin,
            died_at_max: queryModel.diedAtMax,
            updated_at_min: queryModel.updatedAtMin,
            updated_at_max: queryModel.updatedAtMax
        });
    };

    /*
    var getResidentMeForCityId = function(cityId) {
        return serverService.get('residents/me', {city_id : cityId});
    };
    */

    var saveRoleForCityId = function(cityId, roleId) {
        return serverService.post('residents/save_role', {
            city_id : cityId,
            saved_role_id : roleId
        });
    };

    return {
        getAllResidents : getAllResidents,
        // getResidentMeForCityId : getResidentMeForCityId,
        saveRoleForCityId : saveRoleForCityId
    };
}); 
 
// rolePickPurchasesService 
 
app.factory('rolePickPurchasesService', function($q, serverService) {
    "use strict";


    var getAllRolePickPurchases = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('purchases/role_pick_purchases', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            user_email: queryModel.userEmail,
            role_ids: queryModel.roleIds,
            is_fulfilled: queryModel.isFulfilled,
            city_name: queryModel.cityName,
            city_started_at_min: queryModel.cityStartedAtMin,
            city_started_at_max: queryModel.cityStartedAtMax,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };


    var getRolePickPurchaseById = function (rolePickPurchaseId) {
        return serverService.get('purchases/role_pick_purchases/' + rolePickPurchaseId);
    };

    var getNewRolePickPurchase = function () {
        return serverService.get('purchases/role_pick_purchases/new');
    };

    var postCreateRolePickPurchase = function(rolePickPurchase) {
        return serverService.post('purchases/role_pick_purchases', {
            role_pick_purchase : rolePickPurchase
        });
    };


    var putUpdateRolePickPurchase = function(rolePickPurchaseId, rolePickPurchase) {
        return serverService.put('purchases/role_pick_purchases/' + rolePickPurchaseId, {
            role_pick_purchase: rolePickPurchase
        });
    };

    var deleteRolePickPurchase = function (rolePickPurchaseId) {
        return serverService.delete('purchases/role_pick_purchases/' + rolePickPurchaseId);
    };

    var notifications = {
        rolePickPurchaseCreated : null,
        rolePickPurchaseDeleted : null
    };

    return {
        getAllRolePickPurchases: getAllRolePickPurchases,
        getRolePickPurchaseById: getRolePickPurchaseById,
        getNewRolePickPurchase: getNewRolePickPurchase,
        postCreateRolePickPurchase: postCreateRolePickPurchase,
        putUpdateRolePickPurchase: putUpdateRolePickPurchase,
        deleteRolePickPurchase: deleteRolePickPurchase,
        notifications: notifications
    };
});
 
 
// rolePicksService 
 
app.factory('rolePicksService', function(serverService) {
    "use strict";

    var getMyRolePicks = function(pageIndex, pageSize) {
        return serverService.get('role_picks/me', {
            pageIndex: pageIndex,
            pageSize: pageSize
        });
    };

    var createMyRolePick = function(city, role) {
        return serverService.post('role_picks/me', {
            role_pick: {
                city_id : city.id,
                role_id : role.id
            }
        });
    };

    var deleteRolePickById = function(rolePickId) {
        return serverService.delete('role_picks/' + rolePickId, {});
    };

    return {
        getMyRolePicks: getMyRolePicks,
        createMyRolePick: createMyRolePick,
        deleteRolePickById: deleteRolePickById
    };
}); 
 
// rolesService 
 
var AFFILIATION_ID_CITIZENS = 1;
var AFFILIATION_ID_MAFIA = 2;

var ROLE_ID_CITIZEN = 1;
var ROLE_ID_DOCTOR = 2;
var ROLE_ID_DETECTIVE = 3;
var ROLE_ID_MOB = 4;
var ROLE_ID_SHERIFF = 5;
var ROLE_ID_TELLER = 6;
var ROLE_ID_TERRORIST = 7;
var ROLE_ID_JOURNALIST = 8;
var ROLE_ID_FUGITIVE = 9;
var ROLE_ID_DEPUTY = 10;
var ROLE_ID_ELDER = 11;
var ROLE_ID_NECROMANCER = 12;
var ROLE_ID_ZOMBIE = 13;


app.factory('rolesService', function(serverService, $q) {
    "use strict";

    var affiliationIds = {
        AFFILIATION_ID_CITIZENS : AFFILIATION_ID_CITIZENS,
        AFFILIATION_ID_MAFIA : AFFILIATION_ID_MAFIA
    };

    var roleIds = {
         ROLE_ID_CITIZEN : ROLE_ID_CITIZEN,
         ROLE_ID_DOCTOR : ROLE_ID_DOCTOR,
         ROLE_ID_DETECTIVE : ROLE_ID_DETECTIVE,
         ROLE_ID_MOB : ROLE_ID_MOB,
         ROLE_ID_SHERIFF : ROLE_ID_SHERIFF,
         ROLE_ID_TELLER : ROLE_ID_TELLER,
         ROLE_ID_TERRORIST : ROLE_ID_TERRORIST,
        ROLE_ID_JOURNALIST : ROLE_ID_JOURNALIST,
        ROLE_ID_FUGITIVE : ROLE_ID_FUGITIVE,
        ROLE_ID_DEPUTY : ROLE_ID_DEPUTY,
        ROLE_ID_ELDER : ROLE_ID_ELDER,
        ROLE_ID_NECROMANCER : ROLE_ID_NECROMANCER,
        ROLE_ID_ZOMBIE : ROLE_ID_ZOMBIE
    };

    var allRoles;
    var allRolesPromise;

    var getAllRoles = function(refresh) {
        var deferred = $q.defer();

        if (!allRoles || refresh) {
            if (!allRolesPromise) {
                allRolesPromise = serverService.get('roles',{});
                allRolesPromise = allRolesPromise.then(function(allRolesResult) {
                    allRoles = allRolesResult;
                    return allRolesResult;
                });
            }
            return allRolesPromise;
        } else {
            deferred.resolve(allRoles);
        }
        return deferred.promise;
    };

    var getAllRolesByIds = function(refresh) {
        var allRolesPromise = getAllRoles(refresh);
        return allRolesPromise.then(function(allRolesResult) {
            var allRolesByIds = {};
            angular.forEach(allRolesResult, function(someRole) {
                allRolesByIds[someRole.id] = someRole;
            });
            return allRolesByIds;
        });
    };

    return {
        affiliationIds : affiliationIds,
        roleIds : roleIds,
        allRoles : allRoles,
        getAllRoles : getAllRoles,
        getAllRolesByIds : getAllRolesByIds
    };
}); 
 
// selfGeneratedResultTypesService 
 
app.factory('selfGeneratedResultTypesService', function(serverService, $q) {
    "use strict";

    var allSelfGeneratedResultTypes;

    var getAllSelfGeneratedResultTypes = function(refresh) {
        var deferred = $q.defer();

        if (!allSelfGeneratedResultTypes || refresh) {
            var selfGeneratedResultTypesPromise = serverService.get('self_generated_result_types', {});

            selfGeneratedResultTypesPromise.then(function(result) {
                allSelfGeneratedResultTypes = result;
            });
            return selfGeneratedResultTypesPromise;
        } else {
            deferred.resolve(allSelfGeneratedResultTypes);
        }

        return deferred.promise;
    };

    return {
        allSelfGeneratedResultTypes : allSelfGeneratedResultTypes,
        getAllSelfGeneratedResultTypes : getAllSelfGeneratedResultTypes
    };
});
 
 
// serverService 
 
app.service('serverService', function ($q) {
    "use strict";

    var productionServer = 'http://188.226.245.205:3000';
    var developmentServer = 'http://localhost:3000';

    this.serverHost = productionServer;



    var authTokenParamKey = 'auth_token';
    this.getAuthToken = function () {
        return getCookie(authTokenCookieKey);
    };
    this.setAuthToken = function (authToken, expirationDate) {
        setCookie(authTokenCookieKey, authToken, expirationDate);
    };

    this.get = function (url, params) {
        params = params || {};
        params[authTokenParamKey] = this.getAuthToken();

        var deferred = $q.defer();

        $.ajax({
            url: this.serverHost + '/' + url,
            type: 'GET',
            data: params,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (httpObj, textStatus) {
                deferred.reject({httpObj : httpObj, textStatus : textStatus});
            }
        });

        return deferred.promise;
    };

    this.post = function (url, params) {
        params = params || {};
        params[authTokenParamKey] = this.getAuthToken();

        var deferred = $q.defer();

        $.ajax({
            url: this.serverHost + '/' + url,
            type: 'POST',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (httpObj, textStatus) {
                deferred.reject({httpObj : httpObj, textStatus : textStatus});
            }
        });

        return deferred.promise;
    };

    this.put = function (url, params) {
        params = params || {};
        params[authTokenParamKey] = this.getAuthToken();

        var deferred = $q.defer();

        $.ajax({
            url: this.serverHost + '/' + url,
            type: 'PUT',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (httpObj, textStatus) {
                deferred.reject({httpObj : httpObj, textStatus : textStatus});
            }
        });

        return deferred.promise;
    };

    this.delete = function (url, params) {
        params = params || {};
        params[authTokenParamKey] = this.getAuthToken();

        var deferred = $q.defer();

        $.ajax({
            url: this.serverHost + '/' + url,
            type: 'DELETE',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (httpObj, textStatus) {
                deferred.reject({httpObj : httpObj, textStatus : textStatus});
            }
        });

        return deferred.promise;
    };


    function handleUnauthorized(httpObj) {
        if (httpObj.status == 401) {
            this.setAuthToken("", null);
        }
    }


});

var authTokenCookieKey = "auth_token";

function setCookie(cname, cvalue, expirationDate) {
    var d;
    if (expirationDate && expirationDate.getMonth)
        d = expirationDate;
    else {
        d = new Date();
        d.setFullYear(d.getFullYear()+1);
    }


    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
} 
 
// subscriptionsService 
 
var SUBSCRIPTION_TYPE_1_MONTH = 1;
var SUBSCRIPTION_TYPE_1_YEAR = 2;

app.factory('subscriptionsService', function($q, serverService) {
    "use strict";

    var subscriptionTypes = [{
        id: SUBSCRIPTION_TYPE_1_MONTH,
        name: '1 Month Subscription'
    },
    {
        id: SUBSCRIPTION_TYPE_1_YEAR,
        name: '1 Year Subscription'
    }];


    var getAllSubscriptions = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('purchases/subscription_purchases', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            user_email: queryModel.userEmail,
            subscription_types: queryModel.subscriptionTypes,
            expiration_date_min: queryModel.expirationDateMin ? queryModel.expirationDateMin.getTime()/1000 : null,
            expiration_date_max: queryModel.expirationDateMax ? queryModel.expirationDateMax.getTime()/1000 : null,
            active: queryModel.active,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };


    var getSubscriptionPurchaseById = function (subscriptionPurchaseId) {
        return serverService.get('purchases/subscription_purchases/' + subscriptionPurchaseId);
    };

    var getNewSubscriptionPurchase = function () {
        return serverService.get('purchases/subscription_purchases/new');
    };

    var postCreateSubscriptionPurchase = function(subscriptionPurchase) {
        return serverService.post('purchases/subscription_purchases', {
            subscription_purchase : subscriptionPurchase
        });
    };

    var putUpdateSubscriptionPurchase = function(subscriptionPurchaseId, subscriptionPurchase) {
        return serverService.put('purchases/subscription_purchases/' + subscriptionPurchaseId, {
            subscription_purchase: subscriptionPurchase
        });
    };

    var deleteSubscriptionPurchase = function (subscriptionPurchaseId) {
        return serverService.delete('purchases/subscription_purchases/' + subscriptionPurchaseId);
    };

    var notifications = {
        subscriptionPurchaseCreated : null,
        subscriptionPurchaseDeleted : null
    };

    return {
        subscriptionTypes: subscriptionTypes,
        getAllSubscriptions: getAllSubscriptions,
        getSubscriptionPurchaseById: getSubscriptionPurchaseById,
        getNewSubscriptionPurchase: getNewSubscriptionPurchase,
        postCreateSubscriptionPurchase: postCreateSubscriptionPurchase,
        putUpdateSubscriptionPurchase: putUpdateSubscriptionPurchase,
        deleteSubscriptionPurchase: deleteSubscriptionPurchase,
        notifications: notifications

    };
});
 
 
// usersService 
 
var APP_PERMISSION_PARTICIPATE = 1;
var APP_PERMISSION_CREATE_GAMES = 2;
var APP_PERMISSION_ADMIN_READ = 3;
var APP_PERMISSION_ADMIN_WRITE = 4;

app.factory('usersService', function($q, serverService) {
    "use strict";

    var appPermissions = {
        APP_PERMISSION_PARTICIPATE: APP_PERMISSION_PARTICIPATE,
        APP_PERMISSION_CREATE_GAMES: APP_PERMISSION_CREATE_GAMES,
        APP_PERMISSION_ADMIN_READ: APP_PERMISSION_ADMIN_READ,
        APP_PERMISSION_ADMIN_WRITE: APP_PERMISSION_ADMIN_WRITE
    };


    // var allUsersByIds = {};

    var getAllUsers = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var allUsersPromise = serverService.get('users', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            email: queryModel.email,
            app_role_ids : queryModel.appRoleIds,
            email_confirmed: queryModel.emailConfirmed,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });
        /*
        allUsersPromise.then(function(allUsersResult) {
            angular.forEach(allUsersResult, function(someUser) {
                allUsersByIds[someUser.id] = someUser;
            });
            return allUsersResult;
        });
        */
        return allUsersPromise;
    };

    var getUserById = function(userId) {
        return serverService.get('users/'+userId, {});
    };

    var createUser = function(user) {
        return serverService.post('users', {user: user});
    };

    var updateUser = function(user) {
        return serverService.put('users/'+user.id, {
            user: user
        });
    };

    var deleteUserById = function(userId, password) {
        return serverService.delete('users/'+userId, {password: password});
    };

    var allowedEmailPatterns = [];

    var getAllowedEmailPatterns = function(refresh) {
        if (!allowedEmailPatterns || allowedEmailPatterns.length == 0 || refresh) {
            var allowedEmailPatternsPromise = serverService.get('users/allowed_email_patterns');
            allowedEmailPatternsPromise.then(function(allowedEmailPatternsResult) {
                allowedEmailPatterns = allowedEmailPatternsResult;
            });
            return allowedEmailPatternsPromise;
        } else {
            var deferred = $q.defer();

            deferred.resolve(allowedEmailPatterns);

            return deferred.promise;
        }
    };

    var postForgotPassword = function(email) {
        return serverService.post('users/forgot_password', {email : email});
    };

    var unsubscribeEmail = function(email) {
        return serverService.post('user_preference/unsubscribe', {email: email});
    };

    var userDeleted, userPreferenceChangedHashedPassword;

    return {
        appPermissions: appPermissions,
        // allUsersByIds: allUsersByIds,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        createUser : createUser,
        updateUser : updateUser,
        deleteUserById : deleteUserById,
        userDeleted : userDeleted,
        userPreferenceChangedHashedPassword : userPreferenceChangedHashedPassword,
        allowedEmailPatterns: allowedEmailPatterns,
        getAllowedEmailPatterns : getAllowedEmailPatterns,
        postForgotPassword : postForgotPassword,
        unsubscribeEmail : unsubscribeEmail,
        supportEmail : 'ancajic@gmail.com'
    };
});