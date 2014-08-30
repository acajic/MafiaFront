app.directive('residentsList', function($q, residentsService, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/residentsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;


            scope.residents = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.toggleRoleSelection = function(role) {
                if (!scope.queryModel.roleIds)
                    return;

                var index = scope.queryModel.roleIds.indexOf(role.id);
                if (index == -1) {
                    scope.queryModel.roleIds.push(role.id);
                } else {
                    scope.queryModel.roleIds.splice(index, 1);
                }
            };

            scope.toggleSavedRoleSelection = function(role) {
                if (!scope.queryModel.savedRoleIds)
                    return;

                var index = scope.queryModel.savedRoleIds.indexOf(role.id);
                if (index == -1) {
                    scope.queryModel.savedRoleIds.push(role.id);
                } else {
                    scope.queryModel.savedRoleIds.splice(index, 1);
                }
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.residents = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelResidents, queryModelJson, expirationDate);
                        }

                    }
                }


                var residentsPromise = residentsService.getAllResidents(scope.queryModel, pageIndex, pageSize);

                var promises = [residentsPromise];
                if (!scope.allRolesByIds) {
                    var allRolesByIdsPromise = rolesService.getAllRolesByIds(false);
                    promises.push(allRolesByIdsPromise);
                    var allRolesPromise = rolesService.getAllRoles(false);
                    promises.push(allRolesPromise);
                }

                $q.all(promises).then(function(results) {

                    if (results[1]) {
                        scope.allRolesByIds = results[1];

                    }
                    if (results[2]) {
                        scope.roles = results[2];
                        var allRoleIds = $.map(scope.roles, function(role) {
                            return role.id;
                        });
                        scope.queryModel.roleIds = allRoleIds;
                        scope.queryModel.savedRoleIds = angular.copy(allRoleIds);
                    }

                    var residentsResult = results[0];
                    scope.isLoadingContent = false;
                    if (residentsResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.residents.push.apply(scope.residents, residentsResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});