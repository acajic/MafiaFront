app.controller('CitiesController',function ($scope, $route, $routeParams, $timeout, $location, $sce, citiesService, authService, modalService, layoutService, rolesService, usersService) {
    "use strict";


    var pageIndexAllCities = 0;
    var pageSizeAllCities = 10;

    $scope.url = $location.absUrl();

    $scope.reloadAllCities = function(refresh) {

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
        $scope.selectedAllCities.rowId = null;
        if (!$scope.allCitiesFilterModel.isSearchActive) { // about to become TRUE
            $timeout(function() {
                $("#search-all-cities-ac-input input[type=text]").focus();
            }, 100);

        }
    };



    var pageIndexMyCities = 0;
    var pageSizeMyCities = 10;

    $scope.reloadMyCities = function(refresh) {

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
        $scope.selectedMyCities.rowId = null;
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
        if (selectedCity)
            $scope.joinCityPasswordMatch = (selectedCity.hashed_password || '').length == 0;
    };

    $scope.tabSelected = function (tabIndex) {
        $scope.selectedAllCities.rowId = 0;
        $scope.selectedMyCities.rowId = 0;
    };

    /*
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
    */

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

        if (city.id == $scope.selectedMyCities.rowId)
            classes += " selected";

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

        if (city.id == $scope.selectedAllCities.rowId)
            classes += " selected";

        return classes;
    }

    function showEditButtonForCity(city) {
        return city.is_owner;
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

    $scope.$watch("user", function (newUser, oldUser) {
        $scope.selectedCity = null;
        $scope.selectedAllCities = {};
        $scope.selectedMyCities = {};

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


    function renderHtml(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };




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


        var routePath = $route.current.$$route.originalPath;
        if (routePath.indexOf('email_confirmation') >= 0) {
            var emailConfirmationCode = $routeParams["emailConfirmationCode"];
            if (emailConfirmationCode) {
                authService.emailConfirmation.code = emailConfirmationCode;
                // $location.path('/cities');
            }
        }


        $scope.isReturningUser = getCookie('isReturningUser');
        if (!$scope.isReturningUser) {
            setCookie('isReturningUser', true);
        }


        $scope.selectedAllCities = {rowId: 0};
        $scope.selectedMyCities = {rowId: 0};
        $scope.reloadAllCities();
        $scope.reloadMyCities();

        $scope.classNameForMyCitiesRow = classNameForMyCitiesRow;
        $scope.classNameForAllCitiesRow = classNameForAllCitiesRow;
        $scope.showEditButtonForCity = showEditButtonForCity;
        $scope.showEnterButtonForCity = showEnterButtonForCity;

        $scope.showPasswordFieldForCity = showPasswordFieldForCity;

        $scope.joinCityPasswordDidChange = joinCityPasswordDidChange;
        $scope.showJoinButtonForCity = showJoinButtonForCity;
        $scope.showAcceptInvitationButtonForCity = showAcceptInvitationButtonForCity;
        $scope.showLeaveButtonForCity = showLeaveButtonForCity;
        $scope.showCancelJoinRequestForCity = showCancelJoinRequestForCity;


        rolesService.getAllRoles().then(function(allRolesResult) {
            $scope.allRoles = allRolesResult;
        });

        $scope.affiliationIds = rolesService.affiliationIds;


        $scope.renderHtml = renderHtml;

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