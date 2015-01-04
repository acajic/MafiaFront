app.controller('AdminPaymentLogController',function ($scope, $routeParams, $location, $modal, authService, layoutService, paymentsService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (paymentsService.notifications.paymentLogCreated) {
            if (paymentsService.notifications.paymentLogCreated.user_email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created payment log for user with email '" + paymentsService.notifications.paymentLogCreated.user_email + "'"});
            }
            paymentsService.notifications.paymentLogCreated = null;
        }



        var paymentLogId = $routeParams['payment_log_id'];
        var paymentLogPromise;
        if (paymentLogId) {
            paymentLogPromise = paymentsService.getPaymentLogById(paymentLogId);
        } else {
            paymentLogPromise = paymentsService.getNewPaymentLog();
        }
        paymentLogPromise.then(function(paymentLogResult) {
            $scope.inspectedPaymentLog = paymentLogResult;
            $scope.tempUser = angular.copy(paymentLogResult.user);
        });

        paymentsService.getAllPaymentTypes(false).then(function(allPaymentTypesResult) {
            $scope.allPaymentTypes = allPaymentTypesResult;
        });

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }

    $scope.createPaymentLog = function() {
        $scope.isProcessing = true;

        return paymentsService.postCreatePaymentLog($scope.inspectedPaymentLog).then(function(paymentLogResult) {
            $scope.isProcessing = false;

            paymentsService.notifications.paymentLogCreated = paymentLogResult;
            $location.path('admin/payment_log/' + paymentLogResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var msg = '';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    msg += reason.httpObj.responseJSON[key];
                }
            }

            $scope.alerts.push({type: 'danger', msg: 'Error creating payment log. ' + msg});
        });
    };



    $scope.tempUser = {};

    $scope.getUsersByUsername = function(username) {
        $scope.loadingUsers = true;
        return usersService.getAllUsers({username: username}).then(function(users) {
            $scope.loadingUsers = false;
            return users;
        }, function(reason) {
            $scope.loadingUsers = false;
            return reason;
        });
    };

    $scope.selectUser = function (user) {
        $scope.tempUser = angular.copy(user);
        $scope.inspectedPaymentLog.user = user;
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



    $scope.$watch('[inspectedPaymentLog, userMe]', function(newValues, oldValues) {
        var inspectedPaymentLog = newValues[0];
        var userMe = newValues[1];
        if (!inspectedPaymentLog || !userMe) {
            return;
        }


    }, true);


    $scope.savePaymentLog = function () {
        $scope.isProcessing = true;

        if ($scope.inspectedPaymentLog.id) {
            paymentsService.putUpdatePaymentLog($scope.inspectedPaymentLog.id, $scope.inspectedPaymentLog).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedPaymentLog = result;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function (reason) {
                $scope.isProcessing = false;
                $scope.alerts.push({type: 'danger', msg: 'Error updating payment log.'});
            });
        } else {
            paymentsService.postCreatePaymentLog($scope.inspectedPaymentLog).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedPaymentLog = result;
                $scope.alerts.push({type: 'success', msg: 'Successfully created'});
            }, function (reason) {
                $scope.isProcessing = false;
                $scope.alerts.push({type: 'danger', msg: 'Error creating payment log.'});
            });
        }

    };

    $scope.deletePaymentLog = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeletePaymentLogModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deletePaymentLogPromise = paymentsService.deletePaymentLog($scope.inspectedPaymentLog.id);
            deletePaymentLogPromise.then(function() {
                paymentsService.notifications.paymentLogDeleted = $scope.inspectedPaymentLog;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Payment Log is not deleted." });
            });

        }, function () {
        });
    };

    var DeletePaymentLogModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});