app.controller('UserProfileController', function ($scope, $location, $modal, $timeout, usersService, authService, layoutService, rolePicksService) {
    "use strict";

    var user = {
        id: null,
        username: '',
        email: '',
        current_password: '',
        new_password: '',
        repeat_new_password: '',
        user_preference: {}
    };


    var back = function() {
        $location.path('/cities');
    };

    var save = function() {
        var user = $scope.user;
        if (user.username.length == 0) {
            $scope.userProfileInfos.push({type: 'danger', msg: 'Username must not be empty.'});
        }

        /*
        if (!user.new_password || user.new_password.length == 0) {
            $scope.userProfileInfos.push({type: 'danger', msg: 'New password must not be empty.'});
            return;
        }
        */

        if (user.repeat_new_password != user.new_password) {
            $scope.userProfileInfos.push({type: 'danger', msg: 'Repeated new password don\'t match the new password.'});
            return;
        }

        openSaveModal();
    };


    function openSaveModal() {

        var modalInstance = $modal.open({
            templateUrl: 'saveModalContent.html',
            controller: SaveUserModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function (password) {
            if (!password || password.length == 0) {
                $scope.userProfileInfos.push({type: 'danger', msg: 'Current password must not be empty.'});
                return;
            }

            var user = $scope.user;
            user['password'] = password;
            var updateUserPromise = usersService.updateUser(user);
            $scope.isLoading = true;
            updateUserPromise.then(function() {
                $timeout(function() {
                    $scope.userProfileInfos.push({type : 'success', msg: 'Successfully updated user ' + $scope.user.username + '.'});
                    $scope.isLoading = false;
                });

            }, function(reason) {
                $timeout(function() {
                    $scope.isLoading = false;
                    $scope.userProfileInfos.push({type : 'danger', msg: reason.httpObj.responseText });
                });
            });

        }, function () {
        });
    }

    var SaveUserModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.credentials = {
            password : ""
        };

        $scope.ok = function () {
            $modalInstance.close($scope.credentials.password);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    $scope.closeUserProfileInfoAlert = function(index) {
        $scope.userProfileInfos.splice(index, 1);
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

        modalInstance.result.then(function (password) {
            if (!password)
                return;

            var deleteUserPromise = usersService.deleteUserById($scope.user.id, password);
            deleteUserPromise.then(function() {
                authService.notifications.shouldSignOut = true;
                usersService.userDeleted = $scope.user;
                $location.path('');
            }, function(reason) {
                $scope.userProfileInfos.push({type: 'danger', msg: "User is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteUserModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.credentials = {
            password: ''
        };

        $scope.ok = function () {
            $modalInstance.close($scope.credentials.password);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };


    var deleteRolePick = function(rolePick) {
        $scope.deletingRolePickId = rolePick.id;
        var index = $scope.user.role_picks.indexOf(rolePick);
        rolePicksService.deleteRolePickById(rolePick.id).then(function() {
            $scope.deletingRolePickId = null;
            $scope.user.role_picks.splice(index, 1);
        }, function(reason) {
            $scope.deletingRolePickId = null;
        });

    };


    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);


        authService.userMe(true).then(function(userMe) {
            user = angular.copy(userMe);
            $scope.user = user;
        }, function(reason) {
            $location.path('');
        });


        $scope.back = back;
        $scope.save = save;
        $scope.userProfileInfos = [];

        $scope.deleteRolePick = deleteRolePick;
    }

});