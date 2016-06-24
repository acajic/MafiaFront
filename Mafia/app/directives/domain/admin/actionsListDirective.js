app.directive('actionsList', function($q, actionsService, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/actionsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 100;


            scope.actions = [];
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

            scope.toggleActionTypeSelection = function(actionType) {
                if (!scope.queryModel.actionTypeIds)
                    return;

                var index = scope.queryModel.actionTypeIds.indexOf(actionType.id);
                if (index == -1) {
                    scope.queryModel.actionTypeIds.push(actionType.id);
                } else {
                    scope.queryModel.actionTypeIds.splice(index, 1);
                }
            };


            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.actions = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelActions, queryModelJson, expirationDate);
                        }

                    }

                }


                var actionsPromise = actionsService.getAllActions(scope.queryModel, pageIndex, pageSize);
                var promises = [actionsPromise];

                if (!scope.actionTypes || !scope.roles) {
                    promises.push(actionsService.getAllActionTypesByIds(false));
                    promises.push(actionsService.getAllActionTypes(false));

                    promises.push(rolesService.getAllRoles(false));
                }



                $q.all(promises).then(function(results) {
                    if (results[1]) {
                        scope.actionTypesByIds = results[1];
                    }
                    if (results[2]) {
                        scope.actionTypes = results[2];
                        if (!scope.queryModel.actionTypeIds) {
                            scope.queryModel.actionTypeIds = $.map(results[2], function(actionType) {
                                return actionType.id;
                            });
                        }

                    }

                    if (results[3]) {
                        scope.roles = results[3];
                        if (!scope.queryModel.roleIds) {
                            scope.queryModel.roleIds = $.map(results[3], function(role) {
                                return role.id;
                            });
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
                    scope.actions.push.apply(scope.actions, usersResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.actions.length == 0) {
                    reloadData();
                }
            });

        }
    };
});