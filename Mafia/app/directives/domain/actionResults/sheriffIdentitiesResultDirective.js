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

            scope.$watch('[actionResult, city]', function(values) {
                var actionResult = values[0];
                if (!actionResult)
                    return;
                var result = actionResult.result;

                if (result.success === undefined) {
                    result.success = true;
                }

                // city_has_roles, interpret roles in deadResidentRoles
                var city = values[1];
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES
                        },
                        day: $.grep(city.days, function(someDay) {
                            return someDay.id == city.current_day_id;
                        })[0]
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }



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
            }, true);


            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.outcome = {
                success : true
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