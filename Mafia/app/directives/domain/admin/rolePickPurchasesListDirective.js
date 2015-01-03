app.directive('rolePickPurchasesList', function($q, rolePickPurchasesService, rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/rolePickPurchasesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;




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


            scope.rolePickPurchases = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.rolePickPurchases = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['cityStartedAtMin'] = queryModelForStorage['cityStartedAtMin'] ? queryModelForStorage['cityStartedAtMin'].getTime() : null;
                        queryModelForStorage['cityStartedAtMax'] = queryModelForStorage['cityStartedAtMax'] ? queryModelForStorage['cityStartedAtMax'].getTime() : null;
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelRolePickPurchases, queryModelJson, expirationDate);
                        }

                    }

                }

                var allRolesPromise = rolesService.getAllRoles();

                allRolesPromise.then(function (allRolesResult) {
                    scope.allRoles = allRolesResult;
                    if (!scope.queryModel.roleIds) {
                        scope.queryModel.roleIds = $.map(allRolesResult, function(role) {
                            return role.id;
                        });
                    }
                }, function(reason) {
                    // ignore
                });


                var rolePicksPurchasesPromise = rolePickPurchasesService.getAllRolePickPurchases(scope.queryModel, pageIndex, pageSize);



                rolePicksPurchasesPromise.then(function(rolePickPurchasesResult) {

                    scope.isLoadingContent = false;
                    if (rolePickPurchasesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.rolePickPurchases.push.apply(scope.rolePickPurchases, rolePickPurchasesResult);

                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});