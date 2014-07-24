app.directive('createPrivateNewsFeedResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/createPrivateNewsFeedResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeLabel = "Fake a notification";
            scope.actionResultTypes = actionResultsService.actionResultTypes;
            actionResultsService.getActionResultTypes(false).then(function(actionResultTypes) {
                scope.actionResultTypes = actionResultTypes;
            });
            scope.actionTypes = [];

            scope.newActionResult = null;


            scope.$watch('[city.rolesById, roleId]', function(values) {
                var rolesById = values[0];
                if (!rolesById)
                    return;

                var roleId = values[1];
                if (!roleId)
                    return;

                var role = rolesById[roleId].role;

                scope.supportedActionResultTypes = actionResultsService.privateActionResultTypesForRole(role);
            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.hide = function() {
                scope.newActionResult = null;
                scope.editMode = false;
            };

            scope.actionResultTypeSelected = function(selectedActionResultType) {
                scope.newActionResult = {
                    action_result_type : selectedActionResultType,
                    result : {}
                };
            };
        }
    };
});