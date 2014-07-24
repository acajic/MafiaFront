app.directive('actionTypeParamsResult', function(actionsService, actionResultsService) {
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
            editMode: '=',
            isNew: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeIds = actionsService.actionTypeIds;

            scope.actionTypeParams = {};

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
                    scope.resident.role.id,
                    scope.actionResult.action_result_type,
                    scope.actionResult.action_id,
                    scope.actionResult.day_id,
                    {
                        target_id : scope.investigatedResident == null ? -1 : scope.investigatedResident.id,
                        success : scope.outcome.success
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    scope.actionResults.splice(index, 1, createdActionResult);
                });
            };


        }
    };
});