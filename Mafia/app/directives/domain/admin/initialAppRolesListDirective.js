app.directive('initialAppRolesList', function($q, $location, appRolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/initialAppRolesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.initialAppRoles = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.showDetails = function(initialAppRole) {
                $location.path('admin/initial_app_role/' + initialAppRole.id);
            };

            scope.newInitialAppRole = function() {
                $location.path('admin/initial_app_role/new');
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.initialAppRoles = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelInitialAppRoles, queryModelJson, expirationDate);
                        }

                    }
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

            scope.$watch('visible', function (visible) {
                if (visible && scope.initialAppRoles.length == 0) {
                    reloadData();
                }
            });

        }
    };
});