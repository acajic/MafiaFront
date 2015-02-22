app.directive('residentBecameSheriffResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/residentBecameSheriffResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionResultCopied = {};

            function init() {

                var actionResult = scope.actionResult;

                // city_has_roles, interpret roles in deadResidentRoles
                var city = scope.city;
                if (!city)
                    return;

                scope.interpretation = "Sheriff has died and you became the new Sheriff. Congratulations! You should change your acting role to 'Sheriff' if you want your future actions to take effect.";

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF
                        },
                        day: city.current_day
                    };
                    return;
                }

                angular.copy(scope.actionResult, scope.actionResultCopied);
                scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                    return someDay.id == scope.actionResultCopied.day_id;
                })[0];
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
                        scope.editMode = false;
                        scope.actionResults.splice(index, 1);
                    });


                });
            };

            scope.submitActionResult = function() {
                var actionResult = {};
                angular.copy(scope.actionResultCopied, actionResult);

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    actionResult.action_result_type,
                    actionResult.action_id,
                    actionResult.day.id,
                    null
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