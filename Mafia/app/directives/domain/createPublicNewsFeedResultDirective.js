app.directive('createPublicNewsFeedResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/createPublicNewsFeedResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeLabel = "Fake news";
            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIds) {
                 scope.actionResultTypes = actionResultTypesByIds;

                scope.newActionResult = {
                    action_result_type : {},
                    result : {}
                };
            });
            scope.actionTypes = [];

            scope.newActionResult = null;

            scope.supportedActionResultTypeIds = actionResultsService.publicActionResultTypeIds(scope.city);



            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
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