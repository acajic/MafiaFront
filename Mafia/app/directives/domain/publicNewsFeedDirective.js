app.directive('publicNewsFeed', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId : '=',
            resident : '=',
            actionResults: '=',
            dayNumberMin: '=',
            dayNumberMax: '=',
            hasEarlierActionResults: '=',
            loadEarlierActionResults: '=',
            hasMoreRecentActionResults: '=',
            loadMoreRecentActionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/publicNewsFeed.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.$watch('actionResults', function(actionResults) {
                if (!actionResults)
                    return null;

                scope.publicActionResults = actionResultsService.publicActionResults(actionResults);
            }, true);

        }
    };
});