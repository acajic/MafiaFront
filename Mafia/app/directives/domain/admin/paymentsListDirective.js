app.directive('paymentsList', function($location, $q, paymentsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            enableCreating: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/paymentsList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 50;

            scope.allPaymentTypes = [];
            var allPaymentTypesPromise = paymentsService.getAllPaymentTypes();
            allPaymentTypesPromise.then(function (paymentTypes) {
                scope.queryModel.paymentTypeIds = $.map(paymentTypes, function(paymentType) {
                    return paymentType.id;
                });
                scope.allPaymentTypes = paymentTypes;
            }, function(reason) {
                console.log('Failed to load payment types. Ignoring...');
            });

            scope.togglePaymentTypeSelection = function(paymentType) {
                if (!scope.queryModel.paymentTypeIds)
                    return;

                var index = scope.queryModel.paymentTypeIds.indexOf(paymentType.id);
                if (index == -1) {
                    scope.queryModel.paymentTypeIds.push(paymentType.id);
                } else {
                    scope.queryModel.paymentTypeIds.splice(index, 1);
                }
            };


            scope.paymentLogs = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                };
            }

            scope.showDetails = function(paymentLog) {
                $location.path('admin/payment_log/' + paymentLog.id);
            };


            scope.newPaymentLog = function () {
                $location.path('admin/payment_log/new');
            };


            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.paymentLogs = [];
                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelPayments, queryModelJson, expirationDate);
                        }

                    }

                }


                var paymentsPromise = paymentsService.getAllPayments(scope.queryModel, pageIndex, pageSize);


                paymentsPromise.then(function(paymentsResult) {

                    scope.isLoadingContent = false;
                    if (paymentsResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.paymentLogs.push.apply(scope.paymentLogs, paymentsResult);

                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});