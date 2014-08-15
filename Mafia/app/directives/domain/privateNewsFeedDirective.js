app.directive('privateNewsFeed', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId : '=',
            resident : '=',
            actionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/privateNewsFeed.html',
        link: function(scope, element, attrs) {
            "use strict";

            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIdsResult) {
                scope.actionResultTypes = actionResultTypesByIdsResult;
            });

            scope.$watch('[actionResults, city.rolesById]', function(values) {
                var actionResults = values[0];
                if (!actionResults)
                    return null;

                var privateActionResults = actionResultsService.privateActionResults(actionResults);

                var rolesById = values[1];
                var role = rolesById[scope.roleId].role;
                var showingActionResults = {};
                angular.forEach(role.action_types, function(someActionType) {
                    showingActionResults[someActionType.action_result_type.id] = true;
                });

                var filteredActionResults = $.grep(privateActionResults, function(someActionResult) {
                    return showingActionResults[someActionResult.action_result_type.id];
                });

                scope.filteredActionResults = filteredActionResults;
            }, true);


        }
    };
});