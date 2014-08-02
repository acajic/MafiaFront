app.directive('silentSheriffIdentitiesActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/silentSheriffIdentitiesActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;

            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };

            /*

            scope.$watch('[actionResult, roleId]', function(values) {
                var actionResult = values[0];
                if (!actionResult)
                    return;
                var result = actionResult.result;
                if (!result)
                    return;

                var roleId = values[1];
                if (!roleId)
                    return;

                scope.actionTypeParams = actionResult.result.action_types_params[roleId.toString()][ACTION_TYPE_ID_SILENT_SHERIFF_IDENTITIES.toString()];

                scope.modifiedActionTypeParamsDictionary = {};

            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };



            scope.deleteActionResult = function() {
                var modifiedActionResult = {};
                angular.copy(scope.actionResult, modifiedActionResult);

                modifiedActionResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_SILENT_SHERIFF_IDENTITIES.toString()] = null;

                postActionResult(modifiedActionResult);
            };

            scope.submitActionResult = function() {
                var modifiedActionResult = {};
                angular.copy(scope.actionResult, modifiedActionResult);

                var actionTypeParamsDictionary = modifiedActionResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_SILENT_SHERIFF_IDENTITIES.toString()];
                actionTypeParamsDictionary['number_of_actions_available'] = scope.modifiedActionTypeParamsDictionary.numberOfActionsAvailable;

                postActionResult(modifiedActionResult);
            };

            function postActionResult(actionResult) {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null, // role id
                    actionResult.action_result_type,
                    null, // action id
                    actionResult.day_id,
                    actionResult.result
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    scope.actionResults.splice(index, 1, createdActionResult);
                    scope.editMode = false;
                });
            };*/


        }
    };
});