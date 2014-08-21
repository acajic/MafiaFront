app.directive('terroristBombResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/terroristBombResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.targetResident = {};
            scope.collaterals = [];

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
                    return

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_TERRORIST_BOMB
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
                // when creating new terrorist bomb result, offer to the user the right number of collaterals
                scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[ROLE_ID_TERRORIST][ACTION_TYPE_ID_TERRORIST_BOMB.toString()];


                if (!result.success || !result.target_ids.length) {
                    return;
                }

                var killedResidents = "";
                var collaterals = [];
                angular.forEach(result.target_ids, function(residentId) {
                    killedResidents += scope.city.residentsById[residentId].name + ", ";
                    collaterals.push(angular.copy(scope.city.residentsById[residentId]));
                });
                scope.collaterals = collaterals;
                killedResidents = killedResidents.substring(0, killedResidents.length - 2);
                scope.interpretation = "There was a terrorist bombing. Residents " + killedResidents + " were killed in the explosion.";

            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.addCollateralResident = function() {
                var randomResident = angular.copy(scope.city.residents[Math.floor(Math.random()*scope.city.residents.length)]);
                scope.collaterals.push(randomResident);
            };

            scope.selectCollateralResident = function(index, resident) {
                scope.collaterals.splice(index, 1, resident);
            };

            scope.deleteCollateralResidentAtIndex = function(index) {
                scope.collaterals.splice(index, 1);
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