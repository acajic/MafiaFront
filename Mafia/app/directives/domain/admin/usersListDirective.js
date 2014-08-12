app.directive('usersList', function(usersService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/usersList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 10;


            scope.users = [];
            scope.noMoreContent = false;

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.users = [];
                }

                var usersPromise = usersService.getAllUsers(scope.queryModel, pageIndex, pageSize);


                usersPromise.then(function(usersResult) {
                    scope.isLoadingContent = false;
                    if (usersResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.users.push.apply(scope.users, usersResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});