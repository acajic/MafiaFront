app.controller('CityCreateOrUpdateController', function ($scope, $routeParams, citiesService, rolesService,
                                                         gameEndConditionsService, selfGeneratedResultTypesService,
                                                         authService, usersService, $location, $q, $modal) {
    "use strict";

    var MIN_DAY_DURATION = 4;

    var originalCity = {};

    function back() {
        $location.path('/cities');
    }

    function refreshCity() {
        var cityPromise = citiesService.getCity($scope.city.id, true);
        cityPromise.then(function(city) {
            init(city);
        });
        return cityPromise;
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
        createCityPromise.then(function(createdCity) {
            init(createdCity);


            $scope.generalMessages = [{type: 'success', msg: "Successfullty created '" + createdCity.name + "'."}];
        }, function(reason) {
            var message = 'Failed to start city. ';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    message += key + " " + reason.httpObj.responseJSON[key] + ". ";
                }
            }

            $scope.generalMessages = [{type: 'danger', msg: message }];
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

        var startCityPromise = citiesService.startCity($scope.city.id);
        startCityPromise.then(function(city) {
            initDayCycles(city);
            $scope.city = city;

            $location.path('/cities');
        }, function(reason) {
            $scope.generalMessages = [{type: 'danger', msg: 'Failed to start city.' }];
        });
    }

    function showSaveButton(city) {
        return !isNew(city) && amIOwner(city);
    }

    function saveCity() {
        $scope.generalMessages = [];
        var updateCityPromise = citiesService.updateCity($scope.city);
        updateCityPromise.then(function(updateResult) {
            $scope.generalMessages.push({type: 'success', msg: 'City successfully updated.' });
            angular.copy($scope.city, originalCity);
        }, function(reason) {
            $scope.generalMessages.push({type: 'danger', msg: JSON.stringify(reason) });
        });
    }

    function closeGeneralMessage(index) {
        $scope.generalMessages.splice(index, 1);
    }

    function showDeleteButton(city) {
        return !isNew(city) && amIOwner(city) && !isStartedAndOngoing(city) && !isStartedAndPaused(city);
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
                $location.path('');
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
        var pauseCityPromise = citiesService.pauseCity($scope.city.id);
        pauseCityPromise.then(function(cityUpdated) {
            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;

            $scope.generalMessages = [{type: 'success', msg: 'City paused.' }];
        }, function(reason) {
            $scope.generalMessages = [{type: 'danger', msg: 'Failed to pause city.' }];
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
        var resumeCityPromise = citiesService.resumeCity($scope.city.id);
        resumeCityPromise.then(function(cityUpdated) {
            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;

            $scope.generalMessages = [{type: 'success', msg: 'City resumed.' }];
        }, function(reason) {
            angular.forEach(reason.httpObj.responseJSON, function(errorArray) {
                angular.forEach(errorArray, function(error) {
                    $scope.generalMessages = [{type: 'danger', msg: 'Failed to resume city. ' + error }];
                });

            });

        });
    }

    function showJoinButton(city) {
        if (!city)
            return false;

        var resident = $.grep(city.residents, function(someResident) {
            return $scope.userMe.id == someResident.user_id;
        })[0];

        return !isNew(city) && !amIOwner(city) && !isStartedAndOngoing(city) && !isStartedAndPaused(city) && !resident && !city.finished_at;
    }

    function join() {
        var joinPromise = citiesService.joinCity($scope.city.id);
        joinPromise.then(function(cityUpdated) {
            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;

        }, function(reason) {
            $scope.generalMessages = [{type: 'danger', msg: 'Failed to join city.' }];
        });
    }

    function showLeaveButton(city) {
        if (!city)
            return false;

        var resident = $.grep(city.residents, function(someResident) {
            return $scope.userMe.id == someResident.user_id;
        })[0];

        return !isNew(city) && !amIOwner(city) && !isStartedAndOngoing(city) && !isStartedAndPaused(city) && resident && !city.finished_at;
    }

    function leave() {
        var leavePromise = citiesService.leaveCity($scope.city.id);
        leavePromise.then(function(cityUpdated) {
            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;

        }, function(reason) {
            $scope.generalMessages = [{type: 'danger', msg: 'Failed to leave city.' }];
        });

    }

    function isCityModified(city) {
        return angular.equals(city, originalCity);
    }

    function initTimezone(city) {
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
    }

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

    function closeBasicValidationAlert(index) {
        $scope.basicValidationErrors.splice(index, 1);
    }

    function kickResident(index) {
        $scope.city.residents.splice(index, 1);
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

            var invitePromise = citiesService.inviteUsers($scope.city.id, invitedUsers);
            invitePromise.then(function(result) {
                var updatedCityResidents = result.updated_city_residents;
                originalCity.residents = updatedCityResidents;
                $scope.city.residents = updatedCityResidents;

                if (result.existing_users_invited && result.existing_users_invited.length > 0) {
                    var existingUsersInvited = result.existing_users_invited;
                    var plural = existingUsersInvited.length == 1 ? '' : 's';
                    var existingUsersInvitedMessage = 'Existing user'+plural+' ';
                    angular.forEach(existingUsersInvited, function(someUser) {
                        existingUsersInvitedMessage += someUser.username + ', ';
                    });
                    existingUsersInvitedMessage = existingUsersInvitedMessage.substring(0, existingUsersInvitedMessage.length - 2) + ' added to the game.';
                    $scope.generalMessages.push({type: 'success', msg: existingUsersInvitedMessage });
                }

                if (result.new_users_invited && result.new_users_invited.length > 0) {
                    var newUsersInvited = result.new_users_invited;
                    var plural = newUsersInvited.length == 1 ? '' : 's';
                    var newUsersInvitedMessage = 'New user' + plural + ' ';
                    angular.forEach(newUsersInvited, function(someUser) {
                        newUsersInvitedMessage += someUser.username + ', ';
                    });
                    newUsersInvitedMessage = newUsersInvitedMessage.substring(0, newUsersInvitedMessage.length - 2) + ' created and added to the game.';
                    $scope.generalMessages.push({type: 'success', msg: newUsersInvitedMessage });
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
                $scope.generalMessages.push({type: 'danger', msg: "Server error, users not invited." });
            });

        }, function () {
        });
    }



    var InviteModalInstanceCtrl = function ($scope, $modalInstance, usersService, residents) {

        if (usersService.allUsers.length > 0) {

            $scope.allUsers = usersNotJoined(usersService.allUsers, residents);
        } else {
            usersService.getAllUsers().then(function(allUsersResult) {
                $scope.allUsers = usersNotJoined(allUsersResult, residents);
            });
        }

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

    var usersNotJoined = function(users, residents) {
        var usersNotJoined = angular.copy(users);
        angular.forEach(residents, function(someResident) {
            var index = usersNotJoined.indexOfMatchFunction(function(someUser) {
                return someUser.id == someResident.user_id;
            });
            if (index >= 0)
                usersNotJoined.splice(index, 1);
        });
        return usersNotJoined;
    };

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
            return Math.min(rangeStart - moment, moment - rangeEnd);
            // return moment < rangeStart || rangeEnd < moment;
        } else {
            return Math.min(moment - rangeStart, rangeEnd - moment)
            // return rangeStart < moment && moment < rangeEnd;
        }
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

    function minutesToString(minutes) {
        return pad(Math.floor(minutes / 60.0), 2) + ":" + pad(minutes%60, 2);
    }

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
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

        var isValid = true;
        var newIndex;
        var previousNightEndedMinutesAgo = 24*60;

        isValid = validateDayCycle(newDayCycle, $scope.city.day_cycles);
        if (!isValid) {
            return;
        }

        for (var index in $scope.city.day_cycles) {
            var dayCycle = $scope.city.day_cycles[index];
            // new day cycle should entirely fit into one night of already existing day cycle
            var endedMinutesAgo = minutesDifference(dayCycle.night_start, newDayCycle.day_start);
            if (endedMinutesAgo < previousNightEndedMinutesAgo) {
                previousNightEndedMinutesAgo = endedMinutesAgo;
                if (newDayCycle.day_start < dayCycle.day_start) {
                    newIndex = (index+1)%$scope.city.day_cycles.length;
                } else {
                    newIndex = index+1;
                }

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
            var roleQuantity = {
                role: role,
                quantity: 0
            };

            roleQuantitiesPerRoleId[role.id] = roleQuantity;
        });

        if (city) {
            angular.forEach(city.city_has_roles, function(cityHasRole) {
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

    $scope.$watch('roleQuantities', function(newRoleQuantities) {
        if (!$scope.city)
            return;

        var city_has_roles = angular.copy($scope.city.city_has_roles);

        angular.forEach(newRoleQuantities, function(someRoleQuantity) {

            var city_has_roles_of_type = $.grep(city_has_roles, function(someCityHasRole) {
                return someCityHasRole.role.id == someRoleQuantity.role.id;
            });
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
    }, true);

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

    function init(city) {
        var cityId = $routeParams["cityId"];

        var citiesPromise = citiesService.getCities(true);
        var allRolesPromise = rolesService.getAllRoles(false);
        var userMePromise = authService.userMe(false);

        var promises = [allRolesPromise, userMePromise];
        if (!city)
            promises.push(citiesPromise);

        if (!cityId) {
            promises.push(citiesService.getNewCity());
        }

        $q.all(promises).then(function(result) {
            var allRoles = result[0];
            $scope.allRoles = allRoles;

            var userMe = result[1];
            $scope.userMe = userMe;

            if (city) {

            } else {
                var cities = result[2];
                if (cityId) {
                    city = $.grep(cities, function(c){ return c.id == cityId; })[0];
                } else {
                    city = result[3];
                }
            }

            initTime(city);
            initTimezone(city);
            initDayCycles(city);
            initRoles(city, allRoles);
            initGameEndConditions(city);
            initSelfGeneratedResultTypes(city);

            angular.copy(city, originalCity);
            $scope.city = city;
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
        $scope.isCityModified = isCityModified;

        $scope.showJoinButton = showJoinButton;
        $scope.join = join;
        $scope.showLeaveButton = showLeaveButton;
        $scope.leave = leave;


        $scope.basicValidationErrors = [];
        $scope.timezone = {};
        $scope.timezoneChanged = timezoneChanged;


        $scope.kickResident = kickResident;
        $scope.openInviteModal = openInviteModal;

        $scope.newDayCycle = newDayCycle;

        $scope.showAddDayCycle = false;
        $scope.toggleShowAddDayCycle = toggleShowAddDayCycle;

        $scope.removeDayCycle = removeDayCycle;
        $scope.addDayCycle = addDayCycle;
        $scope.minutesToString = minutesToString;
        $scope.dayCycleChanged = dayCycleChanged;
        $scope.dayCycleValidationErrors = [];
        $scope.closeDayCycleValidationAlert = closeDayCycleValidationAlert;

        $scope.remainingRoles = 0;

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
                        }
                    }
                }
            });



        });

        return filteredCityHasRoles;
    };
});;