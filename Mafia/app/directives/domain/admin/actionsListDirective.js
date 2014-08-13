app.directive('actionsList', function(actionsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/actionsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 10;


            scope.actions = [];
            scope.noMoreContent = false;

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.actions = [];
                }

                var actionsPromise = actionsService.getAllActions(scope.queryModel, pageIndex, pageSize);


                actionsPromise.then(function(usersResult) {
                    scope.isLoadingContent = false;
                    if (usersResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.actions.push.apply(scope.actions, usersResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});