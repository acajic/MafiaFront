app.directive('subscriptionsList', function($location, $q, subscriptionsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/subscriptionsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;

            scope.allSubscriptionTypes = subscriptionsService.subscriptionTypes;
            if (!scope.queryModel) {

                scope.queryModel = {
                    subscriptionTypes : [SUBSCRIPTION_TYPE_1_MONTH, SUBSCRIPTION_TYPE_1_YEAR]
                };
            }


            scope.togglePaymentTypeSelection = function(subscriptionType) {
                if (!scope.queryModel.subscriptionTypes)
                    return;

                var index = scope.queryModel.subscriptionTypes.indexOf(subscriptionType.id);
                if (index == -1) {
                    scope.queryModel.subscriptionTypes.push(subscriptionType.id);
                } else {
                    scope.queryModel.subscriptionTypes.splice(index, 1);
                }
            };



            scope.newSubscriptionPurchase = function () {
                $location.path('admin/subscription_purchase/new');
            };
            scope.showDetails = function (subscriptionPurchase) {
                $location.path('admin/subscription_purchase/' + subscriptionPurchase.id);
            };


            scope.subscriptionPurchases = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.subscriptionPurchases = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['expirationDateMin'] = queryModelForStorage['expirationDateMin'] ? queryModelForStorage['expirationDateMin'].getTime() : null;
                        queryModelForStorage['expirationDateMax'] = queryModelForStorage['expirationDateMax'] ? queryModelForStorage['expirationDateMax'].getTime() : null;
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelSubscriptions, queryModelJson, expirationDate);
                        }

                    }

                }


                var subscriptionsPromise = subscriptionsService.getAllSubscriptions(scope.queryModel, pageIndex, pageSize);


                subscriptionsPromise.then(function(subscriptionsResult) {

                    scope.isLoadingContent = false;
                    if (subscriptionsResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.subscriptionPurchases.push.apply(scope.subscriptionPurchases, subscriptionsResult);

                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            scope.$watch('visible', function (visible) {
                if (visible && scope.subscriptionPurchases.length == 0) {
                    reloadData();
                }
            });

        }

    };
});