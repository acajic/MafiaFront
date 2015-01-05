app.controller('AdminRolePickPurchaseController',function ($scope, $routeParams, $location, $modal, authService, layoutService, rolePickPurchasesService, citiesService, rolesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (rolePickPurchasesService.notifications.rolePickPurchaseCreated) {
            if (rolePickPurchasesService.notifications.rolePickPurchaseCreated.user_email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created role pick purchase for user with email '" + rolePickPurchasesService.notifications.rolePickPurchaseCreated.user_email + "'"});
            }
            rolePickPurchasesService.notifications.rolePickPurchaseCreated = null;
        }


        rolesService.getAllRoles().then(function (allRolesResult) {
            $scope.allRoles = allRolesResult;
        }, function (reason) {
            // ignore
        });


        var rolePickPurchaseId = $routeParams['role_pick_purchase_id'];
        var rolePickPurchasePromise;
        if (rolePickPurchaseId) {
            rolePickPurchasePromise = rolePickPurchasesService.getRolePickPurchaseById(rolePickPurchaseId);
        } else {
            rolePickPurchasePromise = rolePickPurchasesService.getNewRolePickPurchase();
        }
        rolePickPurchasePromise.then(function(rolePickPurchaseResult) {
            $scope.inspectedRolePickPurchase = rolePickPurchaseResult;
        });


        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }


    $scope.getCitiesByName = function(cityName) {
        return citiesService.getAllCitiesForSearch(cityName);
    };

    $scope.selectCity = function (city) {
        $scope.inspectedRolePickPurchase.role_pick.city = city;
        $scope.tempCity = angular.copy(city);
    };

    $scope.createRolePickPurchase = function() {
        $scope.isProcessing = true;

        return rolePickPurchasesService.postCreateRolePickPurchase($scope.inspectedRolePickPurchase).then(function(rolePickPurchaseResult) {
            $scope.isProcessing = false;

            rolePickPurchasesService.notifications.rolePickPurchaseCreated = rolePickPurchaseResult;
            $location.path('admin/role_pick_purchase/' + rolePickPurchaseResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var msg = '';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    msg += reason.httpObj.responseJSON[key];
                }
            }

            $scope.alerts.push({type: 'danger', msg: 'Error creating role pick purchase. ' + msg});
        });
    };


    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



    $scope.$watch('[inspectedRolePickPurchase, userMe]', function(newValues, oldValues) {
        var inspectedRolePickPurchase = newValues[0];
        var userMe = newValues[1];
        if (!inspectedRolePickPurchase || !userMe) {
            return;
        }


    }, true);


    $scope.saveRolePickPurchase = function () {
        $scope.isProcessing = true;

        if ($scope.inspectedRolePickPurchase.id) {
            rolePickPurchasesService.putUpdateRolePickPurchase($scope.inspectedRolePickPurchase.id, $scope.inspectedRolePickPurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedRolePickPurchase = result;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error updating role pick purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }

                $scope.alerts.push({type: 'danger', msg: message});
            });
        } else {
            rolePickPurchasesService.postCreateRolePickPurchase($scope.inspectedRolePickPurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedRolePickPurchase = result;
                $scope.alerts.push({type: 'success', msg: 'Successfully created'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error creating role pick purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        }


    };

    $scope.deleteRolePickPurchase = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteRolePickPurchaseModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteRolePickPurchasePromise = rolePickPurchasesService.deleteRolePickPurchase($scope.inspectedRolePickPurchase.id);
            deleteRolePickPurchasePromise.then(function() {
                rolePickPurchasesService.notifications.rolePickPurchaseDeleted = $scope.inspectedRolePickPurchase;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Role Pick Purchase is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteRolePickPurchaseModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});