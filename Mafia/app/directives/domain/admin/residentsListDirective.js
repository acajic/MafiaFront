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
            var pageSize = 10;


            scope.residents = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.residents = [];
                }


                var residentsPromise = residentsService.getAllResidents(scope.queryModel, pageIndex, pageSize);

                var promises = [residentsPromise];
                if (!scope.allRolesByIds) {
                    var allRolesByIdsPromise = rolesService.getAllRolesByIds(false);
                    promises.push(allRolesByIdsPromise);
                }

                $q.all(promises).then(function(results) {
                    var residentsResult = results[0];

                    if (results[1]) {
                        scope.allRolesByIds = results[1];
                    }

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