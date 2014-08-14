app.directive('daysList', function(daysService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/daysList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 10;


            scope.days = [];
            scope.noMoreContent = false;

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.days = [];
                }

                var usersPromise = daysService.getAllDays(scope.queryModel, pageIndex, pageSize);


                usersPromise.then(function(usersResult) {
                    scope.isLoadingContent = false;
                    if (usersResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.days.push.apply(scope.days, usersResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});