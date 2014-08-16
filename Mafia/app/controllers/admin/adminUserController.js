app.controller('AdminUserController',function ($scope, $routeParams, $location, $modal, layoutService, usersService, serverService, appRolesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        var userId = $routeParams['user_id'];
        if (userId) {
            usersService.getUserById(userId).then(function(userResult) {
                $scope.user = userResult;
            });
        }

        appRolesService.getAllAppRoles(false).then(function(allAppRolesResult) {
            $scope.appRoles = allAppRolesResult;
        });

    }

    $scope.save = function() {
        return usersService.updateUser($scope.user);
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.resendConfirmationEmail = function() {
        if ($scope.user.id) {
            $scope.isSendingConfirmationEmail = true;
            serverService.get('users/' + $scope.user.id + '/resend_confirmation_email').then(function() {
                $scope.alerts.push({type: 'success', msg: 'Successfully sent confirmation email.'});

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
            var deleteUserPromise = usersService.deleteUserById($scope.user.id);
            deleteUserPromise.then(function() {
                usersService.userDeleted = $scope.user;
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

});