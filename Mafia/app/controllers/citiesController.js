app.controller('CitiesController',function ($scope, $routeParams, $timeout, $location, citiesService, authService, modalService, layoutService, rolesService) {
    "use strict";


    var pageIndexAllCities = 0;
    var pageSizeAllCities = 10;

    $scope.url = $location.absUrl();

    $scope.reloadAllCities = function(refresh) {

        $scope.isLoadingContentAllCities = true;

        if (refresh) {
            pageIndexAllCities = 0;
            $scope.allCities = [];
        }

        var citiesPromise = citiesService.getAllCities({}, pageIndexAllCities, pageSizeAllCities);


        citiesPromise.then(function(citiesResult) {
            $scope.isLoadingContentAllCities = false;
            if (citiesResult.length < pageSizeAllCities) {
                $scope.noMoreContentAllCities = true;
            } else {
                $scope.noMoreContentAllCities = false;
            }

            pageIndexAllCities++;
            $scope.allCities.push.apply($scope.allCities, citiesResult);
        }, function(reason) {
            $scope.isLoadingContentAllCities = false;
        });


    };

    var pageIndexMyCities = 0;
    var pageSizeMyCities = 10;

    $scope.reloadMyCities = function(refresh) {

        $scope.isLoadingContentMyCities = true;

        if (refresh) {
            pageIndexMyCities = 0;
            $scope.myCities = [];
        }

        authService.userMe().then(function(userMe) {
            var citiesPromise = citiesService.getAllCities({residentUserIds : [userMe.id]}, pageIndexMyCities, pageSizeMyCities);


            citiesPromise.then(function(citiesResult) {
                $scope.isLoadingContentMyCities = false;
                if (citiesResult.length < pageSizeMyCities) {
                    $scope.noMoreContentMyCities = true;
                } else {
                    $scope.noMoreContentMyCities = false;
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




    $scope.newCity = function () {
        $location.path('/cities/create');
    };

    $scope.editCity = function (city) {
        $timeout(function() {
            $scope.isPerformingCityOperation = true;
        });


        $location.path('/cities/' + city.id + '/update');


    };

    $scope.showCity = function(city) {
        $timeout(function() {
            $scope.isPerformingCityOperation = true;
        });

        $location.path('/cities/' + city.id + "/details");

    };

    $scope.enterCity = function(city) {

        $timeout(function() {
            $scope.isPerformingCityOperation = true;
        });

        $location.path('/cities/' + city.id);

    };

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.joinCity = function(city) {
        $timeout(function() {
            $scope.isPerformingCityOperation = true;
        });


        var joinCityPromise = citiesService.joinCity(city.id);
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

            var city = $.grep($scope.cities, function(someCity) {
                return someCity.id == updatedCity.id;
            });

            refreshCity(city, updatedCity);

        }, function(reason) {
            $timeout(function() {
                $scope.alerts.push({type: "danger", msg: "Failed to join '" + city.name + "'."});
                $scope.isPerformingCityOperation = false;
            });

        });
    };

    $scope.leaveCity = function(city) {
        $timeout(function() {
            $scope.isPerformingCityOperation = true;
        });


        var leaveCityPromise = citiesService.leaveCity(city.id);
        leaveCityPromise.then(function(updatedCity) {
            $timeout(function() {
                $scope.alerts.push({type: "success", msg: "Successfully left '" + updatedCity.name + "'."});
                $scope.isPerformingCityOperation = false;
            });

            var city = $.grep($scope.cities, function(someCity) {
                return someCity.id == updatedCity.id;
            });

            refreshCity(city, updatedCity);
        }, function(reason) {
            $timeout(function() {
                $scope.alerts.push({type: "danger", msg: "Failed to leave '" + city.name + "'."});
                $scope.isPerformingCityOperation = false;
            });

        });
    };

    var refreshCity = function(oldCity, newCity) {
        var indexMyCities = $scope.myCities.indexOf(oldCity);

        if (indexMyCities < 0) {
            $scope.reloadMyCities(true);
        } else {
            $scope.myCities.splice(indexMyCities, 1, newCity);
        }

        var indexAllCities = $scope.allCities.indexOf(oldCity);

        if (indexAllCities < 0) {
            $scope.reloadAllCities(true);
        } else {
            $scope.allCities.splice(indexAllCities, 1, newCity);
        }
    };

    $scope.$watch("selectedMyCities.rowId", function (newValue) {
        if (!$scope.myCities)
            return;

        var selectedCity = $.grep($scope.myCities, function (city) {
            return city.id == newValue;
        })[0];
        $scope.citySelected(selectedCity);
    });

    $scope.$watch("selectedAllCities.rowId", function (newValue) {
        if (!$scope.allCities)
            return;

        var selectedCity = $.grep($scope.allCities, function (city) {
            return city.id == newValue;
        })[0];
        $scope.citySelected(selectedCity);
    });

    $scope.citySelected = function (selectedCity) {
        $scope.selectedCity = selectedCity;
    };

    $scope.tabSelected = function (tabIndex) {
        $scope.selectedAllCities.rowId = 0;
        $scope.selectedMyCities.rowId = 0;
    };

    function amICreatorOfCity(city) {
        if (city) {
            return city.user_creator_id == authService.user.id;
        } else
            return false;
    }

    function amIMemberOfCity(city) {
        if (!city)
            return false;

        var residentMe = $.grep(city.residents, function(someResident) {
            return someResident.user_id == authService.user.id;
        })[0];

        return residentMe;
    }

    function classNameForCityRow(city) {
        if (!city)
            return {};

        if (!city.started_at)
            return "city-row-created";
        if (city.finished_at)
            return "city-row-finished";
        if (city.paused)
            return "city-row-paused";
        return "city-row-active";
    }

    function showEditButtonForCity(city) {
        if (city)
            return amICreatorOfCity(city);
        else
            return false;
    }

    function showEnterButtonForCity(city) {
        if (city && city.started_at)
            return amIMemberOfCity(city);
        else
            return false;
    }

    function showJoinButtonForCity(city) {
        if (city && !city.started_at)
            return !amIMemberOfCity(city);
        else
            return false;
    }

    function showLeaveButtonForCity(city) {
        if (city && !city.started_at)
            return amIMemberOfCity(city) && !amICreatorOfCity(city);
        else
            return false;
    }

    $scope.$watch("user", function (newUser, oldUser) {
        if (!newUser || !newUser.id) {
            $scope.myCities = [];
            return;
        }

        if (newUser.id != (oldUser ? oldUser.id : 0) && !$scope.isLoadingContentMyCities) {
            $scope.reloadMyCities(true);
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

        $scope.allCities = [];
        $scope.myCities = [];

        var emailConfirmationCode = $routeParams["emailConfirmationCode"];
        if (emailConfirmationCode) {
            if ($scope.user) {
                $scope.user['emailConfirmationCode'] = emailConfirmationCode;
            } else {
                $scope.user = {emailConfirmationCode : emailConfirmationCode};
            }
            $location.path('/cities');
        }

        $scope.selectedAllCities = {rowId: 0};
        $scope.selectedMyCities = {rowId: 0};
        $scope.reloadAllCities();
        $scope.reloadMyCities();

        $scope.classNameForCityRow = classNameForCityRow;
        $scope.showEditButtonForCity = showEditButtonForCity;
        $scope.showEnterButtonForCity = showEnterButtonForCity;
        $scope.showJoinButtonForCity = showJoinButtonForCity;
        $scope.showLeaveButtonForCity = showLeaveButtonForCity;


        rolesService.getAllRoles().then(function(allRolesResult) {
            $scope.allRoles = allRolesResult;
        });

        $scope.affiliationIds = rolesService.affiliationIds;
    }

}).filter('myCityFilter', function (authService) {
        return function (cities) {
            var myCities = [];

            var userMe = authService.user;
            angular.forEach(cities, function (city) {
                "use strict";
                var isMine = false;
                if (!city.residents)
                    return false;

                for (var residentIndex = 0; residentIndex<city.residents.length; residentIndex++) {
                    var resident = city.residents[residentIndex];
                    if (resident.user_id == userMe.id) {
                        isMine = true;
                        break;
                    }
                }
                if (isMine) {
                    myCities.push(city);
                }
            });

            return myCities;
        }
    });