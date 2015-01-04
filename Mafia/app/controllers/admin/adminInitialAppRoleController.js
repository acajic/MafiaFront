app.controller('AdminInitialAppRoleController',function ($scope, $routeParams, $location, $modal, authService, layoutService, appRolesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (appRolesService.notifications.initialAppRoleCreated) {
            if (appRolesService.notifications.initialAppRoleCreated.email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created initial app role for user with email '" + appRolesService.notifications.initialAppRoleCreated.email + "'"});
            } else if (appRolesService.notifications.initialAppRoleCreated.email_pattern) {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role for users using emails that match '" + appRolesService.notifications.initialAppRoleCreated.email_pattern + "'"});
            } else {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role."});
            }
            appRolesService.notifications.initialAppRoleCreated = null;
        }



        var initialAppRoleId = $routeParams['initial_app_role_id'];
        var initialAppRolePromise;
        if (initialAppRoleId) {
            initialAppRolePromise = appRolesService.getInitialAppRoleById(initialAppRoleId);
        } else {
            initialAppRolePromise = appRolesService.getNewInitialAppRole();
        }
        initialAppRolePromise.then(function(initialAppRoleResult) {
            $scope.inspectedInitialAppRole = initialAppRoleResult;
        });

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

    $scope.createInitialAppRole = function() {
        $scope.isProcessing = true;

        return appRolesService.postCreateInitialAppRole($scope.inspectedInitialAppRole).then(function(initialAppRoleResult) {
            $scope.isProcessing = false;

            appRolesService.notifications.initialAppRoleCreated = initialAppRoleResult;
            $location.path('admin/initial_app_role/' + initialAppRoleResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var msg = '';
            for (var key in reason.httpObj.responseJSON) {
                if (reason.httpObj.responseJSON.hasOwnProperty(key)) {
                    msg += reason.httpObj.responseJSON[key];
                }
            }

            $scope.alerts.push({type: 'danger', msg: 'Error creating initial app role. ' + msg});
        });
    };


    $scope.saveInitialAppRole = function() {
        $scope.isProcessing = true;

        return appRolesService.putUpdateInitialAppRole($scope.inspectedInitialAppRole).then(function(initialAppRoleResult) {
            $scope.isProcessing = false;

            $scope.inspectedInitialAppRole = initialAppRoleResult;
            $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
        }, function(reason) {
            $scope.isProcessing = false;
            $scope.alerts.push({type: 'danger', msg: 'Error updating initial app role.'});
        });
    };

    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



    $scope.$watch('[inspectedInitialAppRole, userMe]', function(newValues, oldValues) {
        var inspectedInitialAppRole = newValues[0];
        var userMe = newValues[1];
        if (!inspectedInitialAppRole || !userMe) {
            return;
        }


    }, true);


    $scope.deleteInitialAppRole = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteInitialAppRoleModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteInitialAppRolePromise = appRolesService.deleteInitialAppRole($scope.inspectedInitialAppRole.id);
            deleteInitialAppRolePromise.then(function() {
                appRolesService.notifications.initialAppRoleDeleted = $scope.inspectedInitialAppRole;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Initial App Role is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteInitialAppRoleModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});