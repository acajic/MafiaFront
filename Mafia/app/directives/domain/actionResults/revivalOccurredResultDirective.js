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