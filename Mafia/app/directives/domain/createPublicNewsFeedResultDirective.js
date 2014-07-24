app.directive('createPublicNewsFeedResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/createPublicNewsFeedResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeLabel = "Fake news";
            scope.actionResultTypes = actionResultsService.actionResultTypes;
            actionResultsService.getActionResultTypes(false).then(function(actionResultTypes) {
                 scope.actionResultTypes = actionResultTypes;

                scope.newActionResult = {
                    action_result_type : actionResultTypes[0],
                    result : {}
                };
            });
            scope.actionTypes = [];

            scope.newActionResult = null;

            scope.supportedActionResultTypeIds = actionResultsService.publicActionResultTypeIds(scope.city);


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