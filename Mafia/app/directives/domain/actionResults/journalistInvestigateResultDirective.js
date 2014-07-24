app.directive('journalistInvestigateResult', function(actionResultsService) {
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

            scope.$watch('[actionResult, city]', function(values) {
                var actionResult = values[0];
                var result = actionResult.result;

                var city = values[1];
                if (!city)
                    return;
                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE
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

                if (!result)
                    return;

                var investigatedResident = angular.copy(scope.city.residentsById[result.target_id]);
                if (investigatedResident) {
                    if (result.success) {
                        scope.interpretation = "Resident " + investigatedResident.username + " is a mafia member.";
                    } else {
                        scope.interpretation = "Resident " + investigatedResident.username + " is not a mafia member.";
                    }
                } else {
                    scope.interpretation = "Error: ActionResult::JournalistInvestigate -> result missing target_id.";
                }

                scope.investigatedResident = investigatedResident;
            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
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

                    scope.actionResults.splice(index, 1);
                    scope.editMode = false;
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

                    if (scope.isNew)
                        scope.hide();
                    else {
                        scope.editMode = false;
                    }
                });
            };


        }
    };
});