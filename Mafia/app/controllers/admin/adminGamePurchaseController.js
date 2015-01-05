app.controller('AdminGamePurchaseController',function ($scope, $routeParams, $location, $modal, authService, layoutService, gamePurchasesService, citiesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        $scope.alerts = [];

        if (gamePurchasesService.notifications.gamePurchaseCreated) {
            if (gamePurchasesService.notifications.gamePurchaseCreated.user_email) {
                $scope.alerts.push({type: 'success', msg: "Successfully created game purchase for user with email '" + gamePurchasesService.notifications.gamePurchaseCreated.user_email + "'"});
            }
            gamePurchasesService.notifications.gamePurchaseCreated = null;
        }



        var gamePurchaseId = $routeParams['game_purchase_id'];
        var gamePurchasePromise;
        if (gamePurchaseId) {
            gamePurchasePromise = gamePurchasesService.getGamePurchaseById(gamePurchaseId);
        } else {
            gamePurchasePromise = gamePurchasesService.getNewGamePurchase();
        }
        gamePurchasePromise.then(function(gamePurchaseResult) {
            $scope.inspectedGamePurchase = gamePurchaseResult;
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
        $scope.inspectedGamePurchase.city = city;
        $scope.tempCity = angular.copy(city);
    };

    $scope.createGamePurchase = function() {
        $scope.isProcessing = true;

        return gamePurchasesService.postCreateGamePurchase($scope.inspectedGamePurchase).then(function(gamePurchaseResult) {
            $scope.isProcessing = false;

            gamePurchasesService.notifications.gamePurchaseCreated = gamePurchaseResult;
            $location.path('admin/game_purchase/' + gamePurchaseResult.id);
        }, function(reason) {
            $scope.isProcessing = false;
            var message = 'Error creating game purchase. ';
            for (var key in reason.httpObj.responseJSON) {
                angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                    message += error + '. ';
                });
            }

            $scope.alerts.push({type: 'danger', msg: message});
        });
    };


    $scope.cancel = function() {
        $location.path('admin');
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



    $scope.$watch('[inspectedGamePurchase, userMe]', function(newValues, oldValues) {
        var inspectedGamePurchase = newValues[0];
        var userMe = newValues[1];
        if (!inspectedGamePurchase || !userMe) {
            return;
        }


    }, true);


    $scope.saveGamePurchase = function () {
        $scope.isProcessing = true;

        if ($scope.inspectedGamePurchase.id) {
            gamePurchasesService.putUpdateGamePurchase($scope.inspectedGamePurchase.id, $scope.inspectedGamePurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedGamePurchase = result;
                $scope.alerts.push({type: 'success', msg: 'Successfully updated'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error updating game purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        } else {
            gamePurchasesService.postCreateGamePurchase($scope.inspectedGamePurchase).then(function(result) {
                $scope.isProcessing = false;
                $scope.inspectedGamePurchase = result;
                $scope.alerts.push({type: 'success', msg: 'Successfully created'});
            }, function (reason) {
                $scope.isProcessing = false;
                var message = 'Error creating game purchase. ';
                for (var key in reason.httpObj.responseJSON) {
                    angular.forEach(reason.httpObj.responseJSON[key], function (error) {
                        message += error + '. ';
                    });
                }
                $scope.alerts.push({type: 'danger', msg: message});
            });
        }


    };

    $scope.deleteGamePurchase = function() {
        openDeletionModal();
    };

    var openDeletionModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'deleteModalContent.html',
            controller: DeleteGamePurchaseModalInstanceCtrl,
            resolve: {
            }
        });

        modalInstance.result.then(function () {
            var deleteGamePurchasePromise = gamePurchasesService.deleteGamePurchase($scope.inspectedGamePurchase.id);
            deleteGamePurchasePromise.then(function() {
                gamePurchasesService.notifications.gamePurchaseDeleted = $scope.inspectedGamePurchase;
                $location.path('admin');
            }, function(reason) {
                $scope.alerts.push({type: 'danger', msg: "Game Purchase is not deleted." });
            });

        }, function () {
        });
    };

    var DeleteGamePurchaseModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});