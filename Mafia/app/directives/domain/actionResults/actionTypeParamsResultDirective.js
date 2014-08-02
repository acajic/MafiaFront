app.directive('actionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            resident: '=',
            actionResult: '=',
            actionResults: '=',
            actionTypeId: '=',
            roleId: '=',
            isNew: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeParams = {};
            scope.editMode = false;

            scope.$watch('[actionResult]', function(values) {
                var actionResult = values[0];
                if (!actionResult)
                    return;

                if (!actionResult.result)
                    return;

                var actionTypeParamsPerRolePerActionType = actionResult.result.action_types_params;

                if (!actionTypeParamsPerRolePerActionType[scope.roleId.toString()])
                    return;

                var actionTypeParams = {};
                actionTypeParams = actionTypeParamsPerRolePerActionType[scope.roleId.toString()][scope.actionTypeId.toString()];


                scope.actionTypeParams = actionTypeParams;

            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.deleteActionResult = function() {
                var modifiedActionResult = {};
                angular.copy(scope.actionResult, modifiedActionResult);

                modifiedActionResult.result.action_types_params[scope.roleId.toString()][scope.actionTypeId.toString()] = null;

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
            };

            scope.submitActionResult = function() {
                postActionResult(scope.actionResult);
            };

        }
    };
});