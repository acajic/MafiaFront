app.directive('specialActions', function(actionsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId: '=',
            resident : '=',
            actionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/specialActions.html',
        link: function(scope, element, attrs) {
            "use strict";

            // scope.selectedActionType = null;
            // scope.actionTypeLabel = "Select action type";
            scope.actionTypes = [];

            scope.$watch('city.rolesById', function(rolesById) {
                var role = rolesById[scope.roleId].role;

                if (role.action_types.length > 0) {
                    scope.actionTypes = $.grep(role.action_types, function (someActionType) {
                        return !someActionType.is_single_required && // eliminates ActionType::SingleRequired::MafiaMembers, ActionType::SingleRequired::Residents
                        someActionType.id != ACTION_TYPE_ID_VOTE
                    });
                    if (scope.actionTypes.length > 0) {

                        var showingActionTypes = {};
                        angular.forEach(scope.actionTypes, function(someActionType) {
                            showingActionTypes[someActionType.id] = true;
                        });
                        scope.showingActionTypes = showingActionTypes;
                    } else {
                       	scope.actionTypeLabel = "No special abilities";
                    }
                }

            });

            scope.actionTypeIds = actionsService.actionTypeIds;



            scope.$watch('actionResults', function(actionResults) {
                if (!actionResults)
                    return;

                // var actionResults = values[0];
                var actionTypeParamsResultIndex = actionResults.indexOfMatchFunction(function (someActionResult) {
                    return someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS;
                });
                if (actionTypeParamsResultIndex < 0) {
                    return;
                }

                scope.actionTypeParamsResult = actionResults[actionTypeParamsResultIndex];

            }, true);

        }
    };
});