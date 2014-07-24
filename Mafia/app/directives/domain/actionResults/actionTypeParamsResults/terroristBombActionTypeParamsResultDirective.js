app.directive('terroristBombActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/terroristBombActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.$watch('[actionResult, roleId]', function(values) {
                var actionResult = values[0];
                if (!actionResult)
                    return;
                var result = actionResult.result;

                var roleId = values[1];
                if (!roleId)
                    return;

                scope.actionTypeParams = actionResult.result.action_types_params[roleId.toString()][ACTION_TYPE_ID_TERRORIST_BOMB.toString()];

            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
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

                    scope.actionResults.splice(index, 1);
                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    scope.roleId,
                    scope.actionResult.action_result_type,
                    scope.actionResult.action_id,
                    scope.actionResult.day_id,
                    {
                        detonation_delay : actionTypeParams.detonation_delay.toString() + "s",
                        number_of_collaterals : actionTypeParams.number_of_collaterals
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    scope.actionResults.splice(index, 1, createdActionResult);

                    scope.editMode = false;
                });
            };


        }
    };
});