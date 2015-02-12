app.directive('revivalOccurredResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/revivalOccurredResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.targetResident = {};

            scope.actionResultCopied = {};

            scope.$watch('[actionResult, actionResults, city]', function(values) {
                var actionResult = values[0];
                var result = actionResult.result;
                if (!result)
                    return;

                var actionResults = values[1];
                if (!actionResults)
                    return;
                var actionTypeParamsResultIndex = actionResults.indexOfMatchFunction(function (someActionResult) {
                    return someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS;
                });
                if (actionTypeParamsResultIndex < 0) {
                    return;
                }

                var city = values[2];
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_REVIVAL_OCCURED
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

                scope.actionTypeParamsResult = actionResults[actionTypeParamsResultIndex];

                if (!result.success || result.days_until_reveal === undefined) {
                    return;
                }



                scope.days_until_reveal = result.days_until_reveal;
                var revelation_string = scope.days_until_reveal == 1 ? "On the next morning it will be revealed who was revived." : "In " + scope.days_until_reveal + " days it will be revealed who was revived.";

                scope.interpretation = "Necromancer raised someone from the dead. " + revelation_string;

            }, true);

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
                    {
                        target_ids : $.map(scope.collaterals, function(someResident) {
                            return someResident.id;
                        }),
                        success : true
                    }
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