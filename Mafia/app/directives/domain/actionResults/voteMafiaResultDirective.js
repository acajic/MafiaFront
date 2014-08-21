app.directive('voteMafiaResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/voteMafiaResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.killedResident = {};
            scope.actionResultCopied = {};

            scope.$watch('[actionResult, city]', function(values) {
                var actionResult = values[0];
                if (!actionResult)
                    return;


                var city = values[1];
                if (!city)
                    return;

                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_VOTE_MAFIA
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

                var result = actionResult.result;

                if (!result) {
                    return;
                }
                var success = result.success;
                var killedResidentId = result.target_id;

                if (!killedResidentId)
                    return;

                scope.killedResident = angular.copy(city.residentsById[killedResidentId]);
                if (success)
                    scope.interpretation = scope.killedResident.name + " was killed by mafia.";
                else
                    scope.interpretation = "Mafia did not manage to kill a citizen last night. Hurray!";


            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.removeFromKilledResidents = function(index) {
                scope.killedResident = {};
            };

            scope.addToKilledResidents = function(resident) {
                scope.killedResident = resident;
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

            scope.submitActionResult = function () {
                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        target_id : scope.killedResident.id,
                        success : scope.killedResident.id > 0
                    }
                );
                submitActionResultPromise.then(function(createdActionResult) {
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