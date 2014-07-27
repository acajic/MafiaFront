app.controller('CitiesController',function ($scope, $routeParams, citiesService, authService, modalService, $location, layoutService) {
    "use strict";

    layoutService.setHomeButtonVisible(false);


    $scope.refreshCities = function () {
        var citiesPromise = citiesService.getCities(true);

        citiesPromise.then(function(cities) {
            $scope.cities = cities;
        });
    };


    $scope.newCity = function () {
        $location.path('/cities/create');
    };

    $scope.editCity = function (city) {
        $location.path('/cities/' + city.id + '/update');
    };

    $scope.showCity = function(city) {
        $location.path('/cities/' + city.id + "/details");
    };

    $scope.enterCity = function(city) {
        $location.path('/cities/' + city.id);
    };

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.joinCity = function(city) {
        var joinCityPromise = citiesService.joinCity(city.id);
        joinCityPromise.then(function(updatedCity) {
            $scope.alerts.push({type: "success", msg: "Successfully joined '" + updatedCity.name + "'."});
            var city = $.grep($scope.cities, function(someCity) {
                return someCity.id == updatedCity.id;
            });
            var index = $scope.cities.indexOf(city);

            if (index < 0) {
                $scope.refreshCities();
            } else {
                $scope.cities.splice(index, 1, updatedCity);
            }

        }, function(reason) {
            $scope.alerts.push({type: "danger", msg: "Failed to join '" + city.name + "'."});
        });
    };

    $scope.leaveCity = function(city) {
        var leaveCityPromise = citiesService.leaveCity(city.id);
        leaveCityPromise.then(function(updatedCity) {
            $scope.alerts.push({type: "success", msg: "Successfully left '" + updatedCity.name + "'."});

            var city = $.grep($scope.cities, function(someCity) {
                return someCity.id == updatedCity.id;
            });
            var index = $scope.cities.indexOf(city);

            if (index < 0) {
                $scope.refreshCities();
            } else {
                $scope.cities.splice(index, 1, updatedCity);
            }
        }, function(reason) {
            $scope.alerts.push({type: "danger", msg: "Failed to leave '" + city.name + "'."});
        });
    };

    $scope.$watch("selected.rowId", function (newValue) {
        $scope.citySelected(newValue);
    });

    $scope.citySelected = function (id) {
        if (id === undefined) {
            return;
        }

        if (!$scope.cities) {
            return;
        }

        var selectedCity = $.grep($scope.cities, function (city) {
            return city.id == id;
        })[0];
        $scope.selectedCity = selectedCity;
    };

    $scope.tabSelected = function (tabIndex) {
        $scope.selected.rowId = 0;
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

      /*  return {
            cityRowCreated: !city.started_at,
            cityRowFinished: city.finished_at,
            cityRowPaused: city.paused,
            cityRowActive: city.started_at && !city.paused && !city.finished_at
        }*/
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

    $scope.$watch("user", function (newUser) {
        if (newUser.app_permissions) {
            $scope.appPermissionCreateGamesGranted = newUser.app_permissions[APP_PERMISSION_CREATE_GAMES];
        } else {
            $scope.appPermissionCreateGamesGranted = null;
        }


    });

    init();

    function init() {
        var emailConfirmationCode = $routeParams["emailConfirmationCode"];
        if (emailConfirmationCode) {
            if ($scope.user) {
                $scope.user['emailConfirmationCode'] = emailConfirmationCode;
            } else {
                $scope.user = {emailConfirmationCode : emailConfirmationCode};
            }
            $location.path('/cities');
        }

        $scope.selected = {rowId: 0};
        $scope.refreshCities();

        $scope.classNameForCityRow = classNameForCityRow;
        $scope.showEditButtonForCity = showEditButtonForCity;
        $scope.showEnterButtonForCity = showEnterButtonForCity;
        $scope.showJoinButtonForCity = showJoinButtonForCity;
        $scope.showLeaveButtonForCity = showLeaveButtonForCity;

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