app.directive('grantedAppRolesList', function($q, $location, appRolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/grantedAppRolesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.grantedAppRoles = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.showDetails = function(grantedAppRole) {
                $location.path('admin/granted_app_role/' + grantedAppRole.id);
            };

            scope.newGrantedAppRole = function() {
                $location.path('admin/granted_app_role/new');
            };

            scope.toggleAppRoleSelection = function (appRole) {
                if (!scope.queryModel.appRoleIds)
                    return;

                var index = scope.queryModel.appRoleIds.indexOf(appRole.id);
                if (index == -1) {
                    scope.queryModel.appRoleIds.push(appRole.id);
                } else {
                    scope.queryModel.appRoleIds.splice(index, 1);
                }
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.grantedAppRoles = [];

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
                            setCookie(kAdminQueryModelGrantedAppRoles, queryModelJson, expirationDate);
                        }

                    }
                }

                if (!scope.allAppRoles) {
                    var allAppRolesPromise = appRolesService.getAllAppRoles();
                    allAppRolesPromise.then(function (allAppRolesResult) {
                        var allAppRoles = [];
                        angular.forEach(allAppRolesResult, function(someAppRole) {
                            if (someAppRole.id != APP_ROLE_SUPER_ADMIN) {
                                allAppRoles.push(someAppRole);
                            }
                        });
                        scope.allAppRoles = allAppRoles;
                        if (!scope.queryModel.appRoleIds) {
                            scope.queryModel.appRoleIds = $.map(allAppRoles, function (appRole) {
                                return appRole.id;
                            });
                        }
                        /*
                        var appRolesByIds = {};
                        angular.forEach(allAppRolesResult, function (someAppRole) {
                            appRolesByIds[someAppRole.id] = someAppRole;
                        });

                        scope.appRolesByIds = appRolesByIds;
                        */
                    }, function (reason) {
                        // ignore
                    });
                }

                var grantedAppRolesPromise = appRolesService.getAllGrantedAppRoles(scope.queryModel, pageIndex, pageSize);



                grantedAppRolesPromise.then(function(grantedAppRolesResult) {

                    scope.isLoadingContent = false;
                    if (grantedAppRolesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.grantedAppRoles.push.apply(scope.grantedAppRoles, grantedAppRolesResult);


                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});