app.directive('privateNewsFeed', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId : '=',
            resident : '=',
            actionResults: '=',
            isLoadingActionResults: '=',
            dayNumberMin: '=',
            dayNumberMax: '=',
            hasEarlierActionResults: '=',
            loadEarlierActionResults: '=',
            hasMoreRecentActionResults: '=',
            loadMoreRecentActionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/privateNewsFeed.html',
        link: function(scope, element, attrs) {
            "use strict";

            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIdsResult) {
                scope.actionResultTypes = actionResultTypesByIdsResult;
            });

            scope.$watchCollection('actionResults', function(actionResults) {
                if (!actionResults)
                    return null;

                var privateActionResults = actionResultsService.privateActionResults(actionResults);

                var rolesById = scope.city.rolesById;
                var role = rolesById[scope.roleId].role;
                var showingActionResults = {};
                angular.forEach(role.action_types, function(someActionType) {
                    if (someActionType.action_result_type) {
                        showingActionResults[someActionType.action_result_type.id] = true;
                    }
                });

                var filteredActionResults = $.grep(privateActionResults, function(someActionResult) {
                    return showingActionResults[someActionResult.action_result_type.id];
                });

                scope.filteredActionResults = filteredActionResults;
            }, true);


        }
    };
});