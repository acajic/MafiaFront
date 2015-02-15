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

            scope.$watch('[actionResult, city]', function(values) {
                var actionResult = values[0];
                var result = actionResult.result;

                var city = values[1];
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_PROTECT
                        },
                        day: city.current_day
                    };
                    return;
                }

                angular.copy(scope.actionResult, scope.actionResultCopied);
                scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
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
            }, true);

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