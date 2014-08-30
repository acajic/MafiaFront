app.directive('usersList', function($q, $location, usersService, appRolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/usersList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;




            scope.users = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.toggleAppRoleSelection = function(appRole) {
                if (!scope.queryModel.appRoleIds)
                    return;

                var index = scope.queryModel.appRoleIds.indexOf(appRole.id);
                if (index == -1) {
                    scope.queryModel.appRoleIds.push(appRole.id);
                } else {
                    scope.queryModel.appRoleIds.splice(index, 1);
                }
            };

            scope.showDetails = function(user) {
                $location.path('admin/user/'+user.id);
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.users = [];

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
                            setCookie(kAdminQueryModelUsers, queryModelJson, expirationDate);
                        }

                    }
                }

                var usersPromise = usersService.getAllUsers(scope.queryModel, pageIndex, pageSize);
                var promises = [usersPromise];

                if (!scope.appRolesByIds) {
                    var appRolesPromise = appRolesService.getAllAppRoles(false);
                    promises.push(appRolesPromise);
                }


                $q.all(promises).then(function(results) {
                    if (results[1]) {
                        scope.appRoles = results[1];
                        if (!scope.queryModel.appRoleIds) {
                            var appRoleIds = [];
                            angular.forEach(scope.appRoles, function(someAppRole) {
                                appRoleIds.push(someAppRole.id);
                            });
                            scope.queryModel.appRoleIds = appRoleIds;
                        }
                    }

                    var usersResult = results[0];

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