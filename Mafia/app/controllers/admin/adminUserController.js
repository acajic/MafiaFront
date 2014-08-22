app.controller('AdminUserController',function ($scope, $routeParams, $location, $modal, $timeout, authService, layoutService, usersService, serverService, appRolesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        var userId = $routeParams['user_id'];
        if (userId) {
            usersService.getUserById(userId).then(function(userResult) {
                $scope.inspectedUser = userResult;
            });
        }

        appRolesService.getAllAppRoles(false).then(function(allAppRolesResult) {
            var appRoles = [];
            angular.forEach(allAppRolesResult, function(someAppRole) {
                if (someAppRole.id != APP_ROLE_SUPER_ADMIN) {
                    appRoles.push(someAppRole);
                }
            });
            $scope.appRoles = appRoles;
        });

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }

    $scope.$watch('[inspectedUser, userMe]', function(newValues, oldValues) {
        var inspectedUser = newValues[0];
        var userMe = newValues[1];
        if (!inspectedUser || !userMe) {
            $scope.roleEditable = false;
            return;
        }

        $scope.roleEditable = inspectedUser.app_role.id != APP_ROLE_SUPER_ADMIN && userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        $scope.canAlterEmailConfirmed = inspectedUser.app_role.id != APP_ROLE_SUPER_ADMIN && userMe.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
    }, true);

    $scope.saveUser = function() {
        $scope.isProcessing = true;

        return usersService.updateUser($scope.inspectedUser).then(function(userResult) {
            $scope.isProcessing = false;

            $scope.inspectedUser = userResult;
            $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
        }, function(reason) {
            $scope.isProcessing = false;
            $scope.alerts.push({type: 'danger', msg: 'Error updating user'});
        });
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.resendConfirmationEmail = function() {
        if ($scope.inspectedUser.id) {
            $scope.isSendingConfirmationEmail = true;
            serverService.get('users/' + $scope.inspectedUser.id + '/resend_confirmation_email').then(function(userResult) {
                $scope.inspectedUser = userResult;

                $timeout(function() {
                    $scope.alerts.push({type: 'success', msg: 'Successfully sent confirmation email.'});
                });

                $scope.isSendingConfirmationEmail = false;
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: 'Error sending confirmation email.'});
                $scope.isSendingConfirmationEmail = false;
            });
        }
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.impersonate = function() {
        openImpersonationModal();
    };


    $scope.deleteUser = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteUserModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteUserPromise = usersService.deleteUserById($scope.inspectedUser.id);
            deleteUserPromise.then(function() {
                usersService.userDeleted = $scope.inspectedUser;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "User is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteUserModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };




    var openImpersonationModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'impersonateModalContent.html',
            controller: ImpersonateUserModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            authService.impersonationAuthenticate($scope.inspectedUser.id).then(function(impersonatedUserResult) {
                authService.notifications.shouldSignIn = true;
                $location.path('');
            });
        }, function () {
        });
    };

    var ImpersonateUserModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});