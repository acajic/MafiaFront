app.controller('AdminGrantedAppRoleController',function ($scope, $routeParams, $location, $modal, authService, layoutService, appRolesService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (appRolesService.notifications.grantedAppRoleCreated) {
            $scope.alerts.push({type: 'success', msg: "Successfully created granted app role for user with email '" + appRolesService.notifications.grantedAppRoleCreated.email + "'"});
            appRolesService.notifications.grantedAppRoleCreated = null;
        }



        var grantedAppRoleId = $routeParams['granted_app_role_id'];
        var grantedAppRolePromise;
        if (grantedAppRoleId) {
            grantedAppRolePromise = appRolesService.getGrantedAppRoleById(grantedAppRoleId);
        } else {
            grantedAppRolePromise = appRolesService.getNewGrantedAppRole();
        }
        grantedAppRolePromise.then(function(grantedAppRoleResult) {
            $scope.inspectedGrantedAppRole = grantedAppRoleResult;
        });

        if (!$scope.allAppRoles) {
            var allAppRolesPromise = appRolesService.getAllAppRoles();
            allAppRolesPromise.then(function (allAppRolesResult) {
                var allAppRoles = [];
                angular.forEach(allAppRolesResult, function(someAppRole) {
                    if (someAppRole.id != APP_ROLE_SUPER_ADMIN) {
                        allAppRoles.push(someAppRole);
                    }
                });
                $scope.allAppRoles = allAppRoles;
            }, function (reason) {
                // ignore
            });
        }

        authService.userMe(false).then(function(userMeResult) {
            $scope.userMe = userMeResult;
            $scope.canSave = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canEdit = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
            $scope.canDelete = userMeResult.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE];
        });

    }


    $scope.saveGrantedAppRole = function() {
        $scope.isProcessing = true;

        if ($scope.inspectedGrantedAppRole.id) {
            return appRolesService.putUpdateGrantedAppRole($scope.inspectedGrantedAppRole).then(function(grantedAppRoleResult) {
                $scope.isProcessing = false;

                $scope.inspectedGrantedAppRole = grantedAppRoleResult;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function(reason) {
                $scope.isProcessing = false;
                $scope.alerts.push({type: 'danger', msg: 'Error updating granted app role.'});
            });
        } else {
            return appRolesService.postCreateGrantedAppRole($scope.inspectedGrantedAppRole).then(function(grantedAppRoleResult) {
                $scope.isProcessing = false;

                appRolesService.notifications.inspectedGrantedAppRole = grantedAppRoleResult;
                $location.path('admin/granted_app_role/' + grantedAppRoleResult.id);
            }, function(reason) {
                $scope.isProcessing = false;
                var msg = '';
                for (var key in reason.httpObj.responseJSON) {
                    if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                        msg += reason.httpObj.responseJSON[key];
                    }
                }

                $scope.alerts.push({type: 'danger', msg: 'Error creating granted app role. ' + msg});
            });
        }

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
        $scope.inspectedGrantedAppRole.user = user;
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.deleteGrantedAppRole = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteGrantedAppRoleModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteGrantedAppRolePromise = appRolesService.deleteGrantedAppRole($scope.inspectedGrantedAppRole.id);
            deleteGrantedAppRolePromise.then(function() {
                appRolesService.notifications.grantedAppRoleDeleted = $scope.inspectedGrantedAppRole;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Granted App Role is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteGrantedAppRoleModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});