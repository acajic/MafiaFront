app.directive('actionResultsList', function($q, actionResultsService, rolesService) {
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

            scope.toggleActionResultTypeSelection = function(actionResultType) {
                if (!scope.queryModel.actionResultTypeIds)
                    return;

                var index = scope.queryModel.actionResultTypeIds.indexOf(actionResultType.id);
                if (index == -1) {
                    scope.queryModel.actionResultTypeIds.push(actionResultType.id);
                } else {
                    scope.queryModel.actionResultTypeIds.splice(index, 1);
                }
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.actionResults = [];
                }

                var actionResultsPromise = actionResultsService.getAllActionResults(scope.queryModel, pageIndex, pageSize);
                var promises = [actionResultsPromise];

                if (!scope.actionResultTypesByIds || !scope.actionResultTypes || !scope.roles) {
                    promises.push(actionResultsService.getAllActionResultTypesByIds(false));
                    promises.push(actionResultsService.getAllActionResultTypes(false));
                    promises.push(rolesService.getAllRoles(false));
                }


                $q.all(promises).then(function(results) {
                    if (results[1]) {
                        scope.actionResultTypesByIds = results[1];
                    }
                    if (results[2]) {
                        scope.actionResultTypes = results[2];
                        if (!scope.queryModel.actionResultTypeIds) {
                            scope.queryModel.actionResultTypeIds = $.map(results[2], function(actionResultType) {
                                return actionResultType.id;
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

                    var actionResultsResult = results[0];

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