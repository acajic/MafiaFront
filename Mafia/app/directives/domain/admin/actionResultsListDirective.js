app.directive('actionResultsList', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/actionResultsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 10;


            scope.actionResults = [];
            scope.noMoreContent = false;

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.actionResults = [];
                }

                var actionResultsPromise = actionResultsService.getAllActionResults(scope.queryModel, pageIndex, pageSize);


                actionResultsPromise.then(function(actionResultsResult) {
                    scope.isLoadingContent = false;
                    if (actionResultsResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.actionResults.push.apply(scope.actionResults, actionResultsResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});