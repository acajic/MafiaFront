app.controller('AdminSubscriptionPurchaseController',function ($scope, $routeParams, $location, $modal, authService, layoutService, subscriptionsService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (subscriptionsService.notifications.subscriptionPurchaseCreated) {
            if (subscriptionsService.notifications.subscriptionPurchaseCreated.user_email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created subscription purchase for user with email '" + subscriptionsService.notifications.subscriptionPurchaseCreated.user_email + "'"});
            }
            subscriptionsService.notifications.subscriptionPurchaseCreated = null;
        }



        var subscriptionPurchaseId = $routeParams['subscription_purchase_id'];
        var subscriptionPurchasePromise;
        if (subscriptionPurchaseId) {
            subscriptionPurchasePromise = subscriptionsService.getSubscriptionPurchaseById(subscriptionPurchaseId);
        } else {
            subscriptionPurchasePromise = subscriptionsService.getNewSubscriptionPurchase();
        }


        subscriptionPurchasePromise.then(function(subscriptionPurchaseResult) {
            $scope.inspectedSubscriptionPurchase = subscriptionPurchaseResult;
            $scope.inspectedSubscriptionPurchase.existingPaymentLog = (subscriptionPurchaseResult.payment_log || {}).id != null;
        });



        $scope.allSubscriptionTypes = subscriptionsService.subscriptionTypes;

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }

    $scope.createSubscriptionPurchase = function() {
        $scope.isProcessing = true;

        return subscriptionsService.postCreateSubscriptionPurchase($scope.inspectedSubscriptionPurchase).then(function(subscriptionPurchaseResult) {
            $scope.isProcessing = false;

            subscriptionsService.notifications.subscriptionPurchaseCreated = subscriptionPurchaseResult;
            $location.path('admin/subscription_purchase/' + subscriptionPurchaseResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var msg = '';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    msg += reason.httpObj.responseJSON[key];
                }
            }

            $scope.alerts.push({type: 'danger', msg: 'Error creating subscription purchase. ' + msg});
        });
    };


    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
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
        $scope.inspectedSubscriptionPurchase.user = user;
    };



    $scope.$watch('[inspectedSubscriptionPurchase, userMe]', function(newValues, oldValues) {
        var inspectedSubscriptionPurchase = newValues[0];
        var userMe = newValues[1];
        if (!inspectedSubscriptionPurchase || !userMe) {
            return;
        }


    }, true);


    $scope.saveSubscriptionPurchase = function () {
        $scope.isProcessing = true;

        if ($scope.inspectedSubscriptionPurchase.id) {
            subscriptionsService.putUpdateSubscriptionPurchase($scope.inspectedSubscriptionPurchase.id, $scope.inspectedSubscriptionPurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedSubscriptionPurchase = result;
                $scope.inspectedSubscriptionPurchase.existingPaymentLog = (result.payment_log || {}).id != null;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error updating subscription purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        } else {
            subscriptionsService.postCreateSubscriptionPurchase($scope.inspectedSubscriptionPurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedSubscriptionPurchase = result;
                $scope.inspectedSubscriptionPurchase.existingPaymentLog = (result.payment_log || {}).id != null;
                $scope.alerts.push({type: 'success', msg: 'Successfully created'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error creating subscription purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        }


    };

    $scope.deleteSubscriptionPurchase = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteSubscriptionPurchaseModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteSubscriptionPurchasePromise = subscriptionsService.deleteSubscriptionPurchase($scope.inspectedSubscriptionPurchase.id);
            deleteSubscriptionPurchasePromise.then(function() {
                subscriptionsService.notifications.subscriptionPurchaseDeleted = $scope.inspectedSubscriptionPurchase;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Subscription Purchase is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteSubscriptionPurchaseModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});