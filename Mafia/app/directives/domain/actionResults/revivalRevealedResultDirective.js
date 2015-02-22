app.directive('revivalRevealedResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/revivalRevealedResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.targetResident = {};

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;
                if (!result)
                    return;

                var actionResults = scope.actionResults;
                if (!actionResults)
                    return;


                var city = scope.city;
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                if (result.target_id === undefined) {
                    return;
                }



                var revivedResident = angular.copy(scope.city.residentsById[result.target_id]);
                if (revivedResident) {
                    scope.interpretation = "It has been discovered who was raised from the dead. It is " + revivedResident.name + ".";
                } else {
                    scope.interpretation = "Error: ActionResult::ReviveRevealed -> result missing target_id.";
                }
                scope.revivedResident = revivedResident;

            }

            init();




            scope.selectRevivedResident = function (resident) {
                scope.revivedResident = resident;
            };




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
                        target_id : scope.revivedResident.id
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