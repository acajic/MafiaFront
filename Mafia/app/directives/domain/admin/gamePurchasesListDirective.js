app.directive('gamePurchasesList', function($location, $q, gamePurchasesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/gamePurchasesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;



            scope.gamePurchases = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }


            scope.newGamePurchase = function () {
                $location.path('/admin/game_purchase/new');
            };

            scope.showDetails = function(gamePurchase) {
                $location.path('admin/game_purchase/' + gamePurchase.id);
            };

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.gamePurchases = [];
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
                            setCookie(kAdminQueryModelGamePurchases, queryModelJson, expirationDate);
                        }

                    }

                }


                var gamePurchasesPromise = gamePurchasesService.getAllGamePurchases(scope.queryModel, pageIndex, pageSize);


                gamePurchasesPromise.then(function(gamePurchasesResult) {

                    scope.isLoadingContent = false;
                    if (gamePurchasesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.gamePurchases.push.apply(scope.gamePurchases, gamePurchasesResult);

                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});