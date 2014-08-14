app.directive('initialAppRolesList', function($q, appRolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/initialAppRolesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 10;


            scope.initialAppRoles = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }


            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.initialAppRoles = [];
                }

                var initialAppRolesPromise = appRolesService.getAllInitialAppRoles(scope.queryModel, pageIndex, pageSize);

                var promises = [initialAppRolesPromise];

                if (!scope.appRolesByIds) {
                    var allAppRolesPromise = appRolesService.getAllAppRoles();
                    promises.push(allAppRolesPromise);
                }

                $q.all(promises).then(function(results) {
                    if (results[1]) {
                        var allAppRolesResult = results[1];
                        var appRolesByIds = {};
                        angular.forEach(allAppRolesResult, function(someAppRole) {
                            appRolesByIds[someAppRole.id] = someAppRole;
                        });

                        scope.appRolesByIds = appRolesByIds;
                    }

                    var initialAppRolesResult = results[0];
                    scope.isLoadingContent = false;
                    if (initialAppRolesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.initialAppRoles.push.apply(scope.initialAppRoles, initialAppRolesResult);


                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});