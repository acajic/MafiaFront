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
        $scope.disableCityControls = true;
        var pauseCityPromise = citiesService.pauseCity($scope.city.id);
        pauseCityPromise.then(function(cityUpdated) {
            $timeout(function() {
                $scope.disableCityControls = false;
                $scope.generalMessages = [{type: 'success', msg: 'City paused.' }];
            });

            initDayCycles(cityUpdated);
            $scope.city = cityUpdated;
            originalCity = cityUpdated;


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
            originalCity = cityUpdated;
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

    function isCityUnmodified(city) {
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
                originalCity = result.city;


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
        var createRolePickPromise = rolePicksService.createRolePick($scope.city, $scope.newRolePickRole);

        createRolePickPromise.then(function(createdRolePick) {
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
            $scope.city.role_picks.splice(index, 1)
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

        $scope.closeBasicValidationAlert = closeBasicValidationAlert;


        $scope.basicValidationErrors = [];
        $scope.timezone = {};
        $scope.timezoneChanged = timezoneChanged;


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
                        }
                    }
                }
            });



        });

        return filteredCityHasRoles;
    };
});;