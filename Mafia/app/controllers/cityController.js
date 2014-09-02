app.controller('CityController', function ($scope, $routeParams, $q, $timeout, citiesService, actionResultsService, residentsService, authService, layoutService) {
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
        var roleIdPromise = getRoleId(cityId);

        $scope.isLoading = true;
        $q.all([cityPromise, userMePromise, roleIdPromise]).then(function(result) {


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

            var rolesById = {};
            angular.forEach(city.city_has_roles, function(cityHasRole) {
                if (!rolesById[cityHasRole.role.id]) {
                    rolesById[cityHasRole.role.id] = {
                        role: cityHasRole.role,
                        quantity: 0
                    };
                }
                rolesById[cityHasRole.role.id].quantity += 1;
            });
            city.rolesById = rolesById;

            $scope.city = city;

            var userMe = result[1];
            $scope.resident = $.grep(city.residents, function(someResident) {
                return someResident.user_id == userMe.id;
            })[0];

            var roleId = result[2];

            if (roleId) {
                $scope.resident.role = city.rolesById[roleId].role;
                initActionResults(cityId, roleId);
            } else {
                // user has probably manually deleted the cookie containing their role id
                $scope.basicValidationErrors.push({msg: 'Select your role.' })
                $scope.roleChooserEditMode = true;
                $scope.isLoading = false;
            }
        }, function(reason) {
            $scope.isLoading = false;
        });
    }

    $scope.$watch('[actionResults, resident.id]', function(values) {
        var actionResults = values[0];
        if (!actionResults)
            return;

        var resident_id = values[1];
        if (!resident_id)
            return;

        var actionResultsByType = {};
        angular.forEach(actionResults, function(someActionResult) {
            if (!actionResultsByType[someActionResult.action_result_type.id])
                actionResultsByType[someActionResult.action_result_type.id] = [];

            actionResultsByType[someActionResult.action_result_type.id].push(someActionResult);
        });

        $scope.actionResultsByType = actionResultsByType;
        if (actionResultsByType[ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS]) {

            var residentsResult = actionResultsByType[ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS][0];
            if (residentsResult) {
                var residentStatus = residentsResult.result.residents.elementMatchingFunction(function(someResidentAliveStatus) {
                    return someResidentAliveStatus.id == resident_id;
                });
                $scope.resident.alive = residentStatus.alive;

                $scope.residentsResult = residentsResult;
            }
        } else {
            console.error("Entered game, but not SelfGenerated Result Residents is present.");
        }

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

    }, true);

    function initActionResults(cityId, roleId) {

        actionResultsService.getActionResults(cityId, roleId, true).then(function(result) {
            $scope.actionResults = result;
            $timeout(function() {
                $scope.isLoading = false;
            });

        }, function(reason) {
            $scope.isLoading = false;
            angular.forEach(reason.httpObj.responseJSON, function(error) {
                $scope.basicValidationErrors.push({type : 'danger', msg: error });
            });
        });
    }

    function getRoleId(cityId) {
        var deferred = $q.defer();

        residentsService.getResidentMeForCityId(cityId).then(function(residentMeResult) {
            var roleId = residentMeResult.saved_role_id;
            deferred.resolve(roleId);
        }, function(reason) {
            deferred.reject(reason);
        });

        return deferred.promise;
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
            initActionResults($scope.city.id, roleId);
        setCookieRoleId($scope.city.id, authService.user.id, roleId);
    }

    function closeBasicValidationAlert(index) {
        $scope.basicValidationErrors.splice(index, 1);
    }

    function cityRoleIdCookieKey(cityId, userId) {
        if (!cityId)
            return null;

        if (!userId)
            return null;

        return 'city' + cityId + 'UserId' + userId + 'RoleId';
    }

    var kCitySelectedTabIndexCookieKey;

    init();

    function init() {
        var cityId = $routeParams["cityId"];

        kCitySelectedTabIndexCookieKey = 'city_' + cityId + '_active_tabs';

        initCity(cityId);

        $scope.refreshCountdownTicks = 0;

        $scope.basicValidationErrors = [];
        $scope.closeBasicValidationAlert = closeBasicValidationAlert;
        $scope.roleSelected = roleSelected;


    }

});
