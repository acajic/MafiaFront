app.directive('voteResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/voteResult.html',
        link: function(scope, element, attrs) {
            "use strict";

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
                            id: ACTION_RESULT_TYPE_ID_VOTE
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }

                var result = actionResult.result;

                var votedResident = scope.city.residentsById[result.target_id];
                if (votedResident) {
                    scope.interpretation = votedResident.name + " was executed via public voting.";
                } else {
                    scope.interpretation = "Public voting ended with no decision.";
                }

                scope.votedResident = votedResident;
            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectVotedResident = function(resident) {
                scope.votedResident = resident;
            };

            scope.blankActionResult = function() {
                scope.votedResident = null;
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
                        target_id : scope.votedResident == null ? -1 : scope.votedResident.id
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        index = 0;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1, createdActionResult);
                        if (scope.isNew)
                            scope.hide();
                    });


                });
            };


        }
    };
});